from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Optional
from datetime import datetime
from enum import Enum
import re

class RoleEnum(str, Enum):
    Freelancer = "Freelancer"
    Client = "Client"
    Both = "Both"

class ProjectStatus(str, Enum):
    Open = "Open"
    InProgress = "In Progress"
    Completed = "Completed"
    Cancelled = "Cancelled"

class ProposalStatus(str, Enum):
    Pending = "Pending"
    Accepted = "Accepted"
    Rejected = "Rejected"
    Withdrawn = "Withdrawn"

class ProjectType(str, Enum):
    Fixed = "Fixed"
    Hourly = "Hourly"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: RoleEnum
    student_id: Optional[str] = None
    linkedin_url: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(min_length=6)

    @field_validator('email')
    @classmethod
    def validate_email_custom(cls, v: str) -> str:
        if not re.match(r"[^@]+@[^@]+\.[^@]+", v):
            raise ValueError("Invalid email address format")
        return v.lower()

    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if not any(char.isupper() for char in v):
            raise ValueError("Password must contain at least one capital letter")
        if not any(char.isdigit() for char in v):
            raise ValueError("Password must contain at least one number")
        return v

class UserResponse(UserBase):
    id: str
    profile_completeness: int
    is_verified: bool
    is_pro: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
