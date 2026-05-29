from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
import uuid
from core.database import projects_collection
from api.deps import get_current_user
from pydantic import BaseModel

router = APIRouter()

class ProjectCreate(BaseModel):
    title: str
    description: str
    budget: float
    skills_required: List[str]
    timeline_days: int

@router.post("/")
async def create_project(project: ProjectCreate, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "Client" and current_user.get("role") != "Both":
        raise HTTPException(status_code=403, detail="Only clients can post projects")
        
    new_project = {
        "id": str(uuid.uuid4()),
        "client_id": current_user["id"],
        "client_name": current_user["full_name"],
        "title": project.title,
        "description": project.description,
        "budget": project.budget,
        "skills_required": project.skills_required,
        "timeline_days": project.timeline_days,
        "status": "Open",
        "created_at": datetime.utcnow()
    }
    
    await projects_collection.insert_one(new_project)
    new_project["_id"] = str(new_project["_id"])
    return new_project

@router.get("/")
async def list_projects():
    projects = await projects_collection.find({"status": "Open"}).to_list(100)
    for p in projects:
        p["_id"] = str(p["_id"])
    return projects

@router.get("/my-postings")
async def get_my_postings(current_user: dict = Depends(get_current_user)):
    projects = await projects_collection.find({"client_id": current_user["id"]}).to_list(100)
    for p in projects:
        p["_id"] = str(p["_id"])
    return projects
