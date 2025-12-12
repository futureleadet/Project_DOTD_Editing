from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.config.settings import settings
from app.middlewares.logging_middleware import LoggingMiddleware
from app.routers import auth_router, analysis_router, admin_router, user_router, creation_router
import os

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

# Middleware
app.add_middleware(LoggingMiddleware)

# Routers
app.include_router(auth_router.router)
app.include_router(analysis_router.router)
app.include_router(admin_router.router)
app.include_router(user_router.router)
app.include_router(creation_router.router)

# Static Files and Catch-all for SPA
app.mount("/assets", StaticFiles(directory="react/dist/assets"), name="assets")

@app.get("/{full_path:path}")
async def serve_react_app(request: Request, full_path: str):
    return FileResponse("react/dist/index.html")

@app.on_event("startup")
async def startup_event():
    print("Application started")

@app.on_event("shutdown")
async def shutdown_event():
    print("Application shutdown")
