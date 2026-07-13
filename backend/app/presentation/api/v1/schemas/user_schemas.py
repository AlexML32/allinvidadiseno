from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from datetime import datetime
from app.domain.value_objects.order_status import UserRole

class UserCreateRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    phone: str = Field(None, max_length=30)
    address: str = Field(None, max_length=255)
    role: UserRole = UserRole.CLIENT

class UserUpdateRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    phone: str | None = Field(None, max_length=30)
    address: str | None = Field(None, max_length=255)
    role: UserRole
    is_active: bool
    password: str | None = Field(None, min_length=6, max_length=100)

class UserResponse(BaseModel):
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
