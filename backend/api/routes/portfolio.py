from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from core.database import profiles_collection, users_collection
from api.deps import get_current_user
from pydantic import BaseModel

router = APIRouter()

class EducationItem(BaseModel):
    institution: str
    degree: str
    start_year: int
    end_year: int

class ProfileUpdate(BaseModel):
    bio: str = None
    skills: List[str] = None
    hourly_rate: float = None
    availability_status: str = None
    avatar: str = None
    education: List[EducationItem] = None

@router.get("/my-profile")
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    profile = await profiles_collection.find_one({"user_id": current_user["id"]})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    profile["_id"] = str(profile["_id"]) # convert ObjectId to string
    if "_id" in current_user:
        current_user["_id"] = str(current_user["_id"])
    return {"user": current_user, "profile": profile}

@router.put("/my-profile")
async def update_my_profile(update_data: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if not update_dict:
        return {"message": "No data provided to update"}
        
    await profiles_collection.update_one(
        {"user_id": current_user["id"]},
        {"$set": update_dict}
    )
    return {"message": "Profile updated successfully"}

@router.get("/freelancers")
async def list_freelancers():
    users = await users_collection.find({"role": "Freelancer"}).to_list(100)
    result = []
    for user in users:
        profile = await profiles_collection.find_one({"user_id": user["id"]})
        result.append({
            "id": user["id"],
            "full_name": user["full_name"],
            "skills": profile.get("skills", []) if profile else [],
            "hourly_rate": profile.get("hourly_rate", 0) if profile else 0
        })
    return result
