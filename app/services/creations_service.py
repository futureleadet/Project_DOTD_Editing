from app.repositories.creations_repository import CreationsRepository
from fastapi import Depends, UploadFile, HTTPException, status
import asyncpg
from typing import List, Dict, Any, Optional
import os
import uuid

class CreationsService:
    def __init__(self, creations_repo: CreationsRepository = Depends()):
        self.creations_repo = creations_repo

    async def save_creation(
        self, 
        conn: asyncpg.Connection, 
        user_id: int, 
        prompt: str,
        file: UploadFile,
        gender: Optional[str] = None,
        age_group: Optional[str] = None,
        is_public: bool = True
    ) -> Dict[str, Any]:
        """
        Saves the uploaded file to the static directory, creates a public URL,
        and saves the creation metadata to the database.
        """
        # 1. Define upload directory and ensure it exists
        upload_dir = "app/static/uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        # 2. Generate a unique filename
        file_ext = os.path.splitext(file.filename)[1] if file.filename else ''
        if not file_ext and file.content_type: # Fallback for blobs without filename
            mime_to_ext = {'image/png': '.png', 'image/jpeg': '.jpg', 'video/mp4': '.mp4'}
            file_ext = mime_to_ext.get(file.content_type, '')

        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # 3. Save the file
        content = await file.read()
        with open(file_path, "wb") as buffer:
            buffer.write(content)
            
        # 4. Create public URL
        media_url = f"/static/uploads/{unique_filename}"
        
        # 5. Determine media type
        media_type = 'video' if file.content_type and file.content_type.startswith('video') else 'image'
        
        # 6. Save metadata to DB
        new_creation = await self.creations_repo.create_creation(
            conn, user_id, media_url, media_type, prompt, gender, age_group, is_public
        )
        
        return new_creation

    async def get_user_creations(self, conn: asyncpg.Connection, user_id: int, limit: int = 10, offset: int = 0) -> List[Dict[str, Any]]:
        """Retrieves creations for a specific user."""
        return await self.creations_repo.get_user_creations(conn, user_id, limit, offset)

    async def get_feed_creations(self, conn: asyncpg.Connection, sort_by: str = "latest", limit: int = 10, offset: int = 0) -> List[Dict[str, Any]]:
        """Retrieves public creations for the feed, with sorting and pagination."""
        return await self.creations_repo.get_feed_creations(conn, sort_by, limit, offset)

    async def get_picked_creations(self, conn: asyncpg.Connection, limit: int = 9) -> List[Dict[str, Any]]:
        """Retrieves creations picked by admin for the home screen."""
        return await self.creations_repo.get_picked_creations(conn, limit)

    async def toggle_admin_pick(self, conn: asyncpg.Connection, creation_id: int, current_user_id: int) -> Dict[str, Any]:
        """
        Toggles the is_picked_by_admin flag for a creation.
        Requires admin role.
        """
        # First, check if the current user is an admin (assuming user_id lookup returns role)
        # For simplicity, we'll assume a direct way to get role or admin status from current_user_id
        # In a real app, this would involve a user service or a lookup
        # For now, this service method will implicitly be called by an admin-protected route.
        
        # Get current status
        creation = await self.creations_repo.get_creation_by_id(conn, creation_id)
        if not creation:
            raise HTTPException(status_code=404, detail="Creation not found")
        
        new_picked_status = not creation["is_picked_by_admin"]
        updated_creation = await self.creations_repo.toggle_admin_pick(conn, creation_id, new_picked_status)
        return {"id": creation_id, "is_picked_by_admin": updated_creation["is_picked_by_admin"]}

    async def like_creation(self, conn: asyncpg.Connection, creation_id: int, user_id: int) -> bool:
        """User likes a creation."""
        return await self.creations_repo.add_like(conn, user_id, creation_id)
    
    async def unlike_creation(self, conn: asyncpg.Connection, creation_id: int, user_id: int) -> bool:
        """User unlikes a creation."""
        return await self.creations_repo.remove_like(conn, user_id, creation_id)
    
    async def check_if_liked(self, conn: asyncpg.Connection, creation_id: int, user_id: int) -> bool:
        """Checks if a user has liked a specific creation."""
        return await self.creations_repo.check_if_liked(conn, user_id, creation_id)

    async def delete_creation(self, conn: asyncpg.Connection, creation_id: int, user_id: int) -> Optional[Dict[str, Any]]:
        """
        Deletes a creation after verifying ownership and removing the associated file if it's local.
        """
        # 1. Get the creation details
        creation_to_delete = await self.creations_repo.get_creation_by_id(conn, creation_id)
        if not creation_to_delete:
            raise HTTPException(status_code=404, detail="Creation not found")

        # 2. Verify ownership
        if creation_to_delete["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this creation")

        # 3. Delete the physical file only if it is a local file
        media_url = creation_to_delete["media_url"]
        if media_url.startswith('/static/uploads/'):
            # Convert URL path to system file path: /static/uploads/file.png -> app/static/uploads/file.png
            file_path = "app" + media_url
            if os.path.exists(file_path):
                os.remove(file_path)

        # 4. Delete the record from the database
        deleted_creation = await self.creations_repo.delete_creation_by_id(conn, creation_id)
        return deleted_creation