from datetime import datetime
from uuid import UUID
from typing import Optional
from app.domain.value_objects.order_status import UserRole

class User:
    def __init__(
        self,
        id: Optional[UUID],
        full_name: str,
        email: str,
        password_hash: str,
        phone: Optional[str],
        address: Optional[str],
        role: UserRole = UserRole.CLIENT,
        is_active: bool = True,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None
    ):
        self.id = id
        self.full_name = full_name
        self.email = email
        self.password_hash = password_hash
        self.phone = phone
        self.address = address
        self.role = role
        self.is_active = is_active
        self.created_at = created_at or datetime.now()
        self.updated_at = updated_at or datetime.now()
