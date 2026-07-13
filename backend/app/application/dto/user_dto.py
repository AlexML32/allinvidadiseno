from dataclasses import dataclass
from datetime import datetime
from uuid import UUID
from typing import Optional
from app.domain.value_objects.order_status import UserRole

@dataclass
class UserDTO:
    id: UUID
    full_name: str
    email: str
    phone: Optional[str]
    address: Optional[str]
    role: UserRole
    is_active: bool
    created_at: datetime

@dataclass
class UserRegistrationDTO:
    full_name: str
    email: str
    password: str
    phone: Optional[str]
    address: Optional[str]

@dataclass
class UserLoginDTO:
    email: str
    password: str

@dataclass
class TokenDTO:
    access_token: str
    token_type: str
    role: str
    email: str
    full_name: str
