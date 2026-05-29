from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime
import uuid
from core.database import proposals_collection, projects_collection
from api.deps import get_current_user
from pydantic import BaseModel

router = APIRouter()

class ProposalCreate(BaseModel):
    project_id: str
    cover_letter: str
    bid_amount: float
    estimated_days: int

@router.post("/")
async def submit_proposal(proposal: ProposalCreate, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "Freelancer" and current_user.get("role") != "Both":
        raise HTTPException(status_code=403, detail="Only freelancers can submit proposals")
        
    project = await projects_collection.find_one({"id": proposal.project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    if project.get("client_id") == current_user["id"]:
        raise HTTPException(status_code=403, detail="You cannot apply to your own project.")

    new_proposal = {
        "id": str(uuid.uuid4()),
        "project_id": proposal.project_id,
        "freelancer_id": current_user["id"],
        "freelancer_name": current_user["full_name"],
        "cover_letter": proposal.cover_letter,
        "bid_amount": proposal.bid_amount,
        "estimated_days": proposal.estimated_days,
        "status": "Pending",
        "submitted_at": datetime.utcnow()
    }
    
    await proposals_collection.insert_one(new_proposal)
    new_proposal["_id"] = str(new_proposal["_id"])
    return new_proposal

@router.get("/my-proposals")
async def get_my_proposals(current_user: dict = Depends(get_current_user)):
    proposals = await proposals_collection.find({"freelancer_id": current_user["id"]}).to_list(100)
    for p in proposals:
        p["_id"] = str(p["_id"])
    return proposals

@router.get("/project/{project_id}")
async def get_project_proposals(project_id: str, current_user: dict = Depends(get_current_user)):
    # Check if the current user owns the project
    project = await projects_collection.find_one({"id": project_id})
    if not project or project["client_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to view these proposals")
        
    proposals = await proposals_collection.find({"project_id": project_id}).to_list(100)
    for p in proposals:
        p["_id"] = str(p["_id"])
    return proposals
