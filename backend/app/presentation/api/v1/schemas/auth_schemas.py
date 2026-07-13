from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from datetime import datetime
from app.domain.value_objects.order_status import UserRole

class UserRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    phone: str = Field(None, max_length=30)
    address: str = Field(None, max_length=255)

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    email: str
    full_name: str

class UserMeResponse(BaseModel):
    id: UUID
    full_name: str
    email: str
    phone: str | None = None
    address: str | None = None
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
