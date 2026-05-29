from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime
import uuid
from core.database import contracts_collection, proposals_collection, projects_collection
from api.deps import get_current_user
from pydantic import BaseModel

router = APIRouter()

class ContractCreate(BaseModel):
    proposal_id: str

@router.post("/")
async def create_contract(contract_in: ContractCreate, current_user: dict = Depends(get_current_user)):
    proposal = await proposals_collection.find_one({"id": contract_in.proposal_id})
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
        
    project = await projects_collection.find_one({"id": proposal["project_id"]})
    if not project or project["client_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to hire for this project")
        
    new_contract = {
        "id": str(uuid.uuid4()),
        "project_id": project["id"],
        "client_id": current_user["id"],
        "freelancer_id": proposal["freelancer_id"],
        "amount": proposal["bid_amount"],
        "status": "Active",
        "created_at": datetime.utcnow()
    }
    
    await contracts_collection.insert_one(new_contract)
    
    # Update proposal and project status
    await proposals_collection.update_one({"id": proposal["id"]}, {"$set": {"status": "Accepted"}})
    await projects_collection.update_one({"id": project["id"]}, {"$set": {"status": "In Progress"}})
    
    new_contract["_id"] = str(new_contract["_id"])
    return new_contract

@router.get("/my-contracts")
async def get_my_contracts(current_user: dict = Depends(get_current_user)):
    contracts = await contracts_collection.find({
        "$or": [
            {"client_id": current_user["id"]},
            {"freelancer_id": current_user["id"]}
        ]
    }).to_list(100)
    
    for c in contracts:
        c["_id"] = str(c["_id"])
    return contracts
