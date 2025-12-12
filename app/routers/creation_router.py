from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, BackgroundTasks, Request
from fastapi.responses import RedirectResponse
from app.services.creations_service import CreationsService
from app.dependencies.auth import get_current_user
from app.dependencies.db_connection import get_db_connection
from app.services import task_manager
import asyncpg
import httpx
import io
import base64
from typing import List, Dict, Any, Optional

router = APIRouter(prefix="/api", tags=["creations"])

# --- Helper function to convert base64 to a Blob-like object ---
def b64_to_blob(b64_data: str, content_type: str = ''):
    byte_characters = base64.b64decode(b64_data)
    return io.BytesIO(byte_characters)

# --- Background Task Logic ---
async def process_creation_task(
    task_id: str,
    form_data: dict,
    user_id: int,
    service: CreationsService,
    db_conn_str: str  # Pass connection string instead of connection object
):
    task_manager.update_task_status(task_id, status="processing")
    
    # Recreate a connection for the background task
    conn = None
    try:
        conn = await asyncpg.connect(db_conn_str)
        
        # Initialize data and files dictionaries for httpx
        httpx_data = {}
        httpx_files = {}

        for key, value in form_data.items():
            if key == 'image' and value:
                # For image, prepare it for 'files' parameter
                httpx_files['image'] = (value['filename'], io.BytesIO(value['content']), value['content_type'])
            elif value:
                # For other fields, add to 'data' parameter
                httpx_data[key] = str(value)

        # Call n8n webhook
        webhook_url = 'http://192.168.0.19:5678/webhook/c6ebe062-d352-491d-8da3-a5fe2d3f6949'
        async with httpx.AsyncClient(timeout=300.0) as client:
            n8n_response = await client.post(webhook_url, data=httpx_data, files=httpx_files)
            n8n_response.raise_for_status()
            result = n8n_response.json()
            print("--- N8N DEBUG START ---")
            print(f"Type of result: {type(result)}")
            print(f"Full result: {result}")
            print("--- N8N DEBUG END ---")

        # Process result from n8n (assuming base64 format)
        inline_data_part = result.get("candidates", [{}])[0].get("content", {}).get("parts", [])
        inline_data_found = None
        for part in inline_data_part:
            if "inlineData" in part:
                inline_data_found = part.get("inlineData")
                break
        
        if not inline_data_found:
            raise ValueError("Invalid response structure from n8n webhook")

        mime_type = inline_data_found["mimeType"]
        media_data_b64 = inline_data_found["data"]
        
        # Convert base64 to file-like object
        media_blob = b64_to_blob(media_data_b64, mime_type)
        file_extension = mime_type.split('/')[-1]
        
        # Save the creation to our database
        new_creation = await service.save_creation(
            conn, 
            user_id, 
            form_data.get("prompt", "N/A"), 
            UploadFile(filename=f"upload.{file_extension}", file=media_blob)
        )
        
        task_manager.update_task_status(task_id, status="completed", result=new_creation)

    except Exception as e:
        print(f"Task {task_id} failed: {e}")
        task_manager.update_task_status(task_id, status="failed", result={"error": str(e)})
    finally:
        if conn:
            await conn.close()


@router.post("/create_task")
async def create_task(
    background_tasks: BackgroundTasks,
    request: Request,
    current_user: dict = Depends(get_current_user),
    service: CreationsService = Depends(),
    # Form fields
    text: str = Form(...),
    gender: str = Form(""),
    age_group: str = Form(""),
    image: Optional[UploadFile] = File(None)
):
    task_id = task_manager.create_task()
    user_id = int(current_user["sub"])
    
    # Prepare form data for background task
    form_data = {
        "prompt": text,
        "gender": gender,
        "age_group": age_group,
    }
    if image:
        form_data["image"] = {
            "content": await image.read(),
            "filename": image.filename,
            "content_type": image.content_type
        }

    # We need to pass the database connection string, not the connection itself
    from app.config.settings import settings
    db_connection_string = settings.DATABASE_URL
    
    background_tasks.add_task(
        process_creation_task, task_id, form_data, user_id, service, db_connection_string
    )
    
    # Redirect to the result page
    return RedirectResponse(url=f"/result/{task_id}", status_code=303)


@router.get("/task_status/{task_id}")
async def get_task_status(task_id: str):
    """
    Endpoint for the frontend to poll for the status of a task.
    """
    task = task_manager.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.post("/creations/upload")
async def upload_creation(
    prompt: str = Form(...),
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    service: CreationsService = Depends(),
    conn: asyncpg.Connection = Depends(get_db_connection)
) -> Dict[str, Any]:
    """
    Handles the upload of a media file and its prompt,
    saves it, and returns the new creation's data.
    """
    try:
        user_id = int(current_user["sub"])
        new_creation = await service.save_creation(conn, user_id, prompt, file)
        return new_creation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload creation: {str(e)}")


@router.get("/creations/feed", response_model=List[Dict[str, Any]])
async def get_feed(
    service: CreationsService = Depends(),
    conn: asyncpg.Connection = Depends(get_db_connection)
):
    """
    Returns a list of all creations for the public feed.
    """
    return await service.get_feed_creations(conn)

@router.delete("/creations/{creation_id}", response_model=Optional[Dict[str, Any]])
async def delete_creation(
    creation_id: int,
    current_user: dict = Depends(get_current_user),
    service: CreationsService = Depends(),
    conn: asyncpg.Connection = Depends(get_db_connection)
):
    """
    Deletes a creation by its ID, ensuring the user is the owner.
    """
    user_id = int(current_user["sub"])
    deleted_creation = await service.delete_creation(conn, creation_id, user_id)
    return deleted_creation
