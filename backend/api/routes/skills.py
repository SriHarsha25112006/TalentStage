from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import uuid

from core.database import profiles_collection
from api.deps import get_current_user
from ai.generate_skill_test import SkillTestGenerator

router = APIRouter()
ai_generator = SkillTestGenerator()

class GenerateTestRequest(BaseModel):
    skill: str

class SubmitAnswer(BaseModel):
    question_index: int
    selected_answer: str
    
class SubmitTestRequest(BaseModel):
    skill: str
    answers: List[SubmitAnswer]
    correct_answers: List[str] # Usually, you'd hide this in DB, but for hackathon we can pass it back

@router.post("/generate")
async def generate_skill_test(request: GenerateTestRequest, current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["Freelancer", "Both"]:
        raise HTTPException(status_code=403, detail="Only freelancers and dual-role users can take skill tests")
        
    profile = await profiles_collection.find_one({"user_id": current_user["id"]})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    # Check 1-minute retry rule
    last_attempts = profile.get("test_attempts", {})
    last_attempt_time_str = last_attempts.get(request.skill)
    if last_attempt_time_str:
        last_attempt_time = datetime.fromisoformat(last_attempt_time_str)
        time_since = datetime.utcnow() - last_attempt_time
        if time_since < timedelta(minutes=1):
            seconds_left = int(60 - time_since.total_seconds())
            raise HTTPException(status_code=400, detail=f"You can try this test again in {seconds_left} seconds.")
            
    # Record attempt time
    last_attempts[request.skill] = datetime.utcnow().isoformat()
    await profiles_collection.update_one(
        {"user_id": current_user["id"]},
        {"$set": {"test_attempts": last_attempts}}
    )
        
    try:
        test_data = await ai_generator.generate_test(request.skill)
        return test_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/submit")
async def submit_skill_test(request: SubmitTestRequest, current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["Freelancer", "Both"]:
        raise HTTPException(status_code=403, detail="Only freelancers and dual-role users can take skill tests")
        
    correct_count = 0
    total = len(request.correct_answers)
    
    # Calculate score
    for ans in request.answers:
        if ans.question_index < len(request.correct_answers):
            if ans.selected_answer == request.correct_answers[ans.question_index]:
                correct_count += 1
                
    score_percentage = (correct_count / total) * 100 if total > 0 else 0
    
    passed = score_percentage >= 80.0
    
    if passed:
        # Award badge
        badge_name = f"{request.skill} Verified"
        await profiles_collection.update_one(
            {"user_id": current_user["id"]},
            {"$addToSet": {"badges": badge_name}}
        )
    else:
        # Record fail/retry attempt time from now
        profile = await profiles_collection.find_one({"user_id": current_user["id"]})
        if profile:
            last_attempts = profile.get("test_attempts", {})
            last_attempts[request.skill] = datetime.utcnow().isoformat()
            await profiles_collection.update_one(
                {"user_id": current_user["id"]},
                {"$set": {"test_attempts": last_attempts}}
            )
        
    return {
        "score": score_percentage,
        "passed": passed,
        "correct_count": correct_count,
        "total": total,
        "message": f"You scored {score_percentage}%. {'Badge Awarded!' if passed else 'Keep practicing!'}"
    }
