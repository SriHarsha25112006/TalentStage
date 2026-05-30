from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
import uuid
from datetime import datetime

from core.database import users_collection, profiles_collection
from core.security import get_password_hash, verify_password, create_access_token
from models.schemas import UserCreate, UserResponse, Token
from api.deps import get_current_user
from pymongo.errors import DuplicateKeyError

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
async def signup(user_in: UserCreate):
    user_id = str(uuid.uuid4())
    new_user = {
        "id": user_id,
        "email": user_in.email,
        "full_name": user_in.full_name,
        "role": user_in.role.value if hasattr(user_in.role, 'value') else user_in.role,
        "hashed_password": get_password_hash(user_in.password),
        "profile_completeness": 0,
        "is_verified": False,
        "is_pro": False,
        "student_id": user_in.student_id,
        "linkedin_url": user_in.linkedin_url,
        "created_at": datetime.utcnow()
    }
    
    existing_user = await users_collection.find_one({"email": user_in.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    try:
        await users_collection.insert_one(new_user)
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # Create empty profile
    await profiles_collection.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "bio": "",
        "skills": [],
        "badges": [],
        "hourly_rate": 0.0,
        "availability_status": "Available",
        "education": [],
        "work_experience": [],
        "projects": []
    })

    return new_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(subject=user["id"])
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user
