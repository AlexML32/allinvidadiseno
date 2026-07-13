import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Enum, text
from sqlalchemy.dialects.postgresql import UUID
from app.infrastructure.database.session import Base
from app.domain.value_objects.order_status import UserRole

class UserModel(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(30), nullable=True)
    address = Column(String(255), nullable=True)
    role = Column(Enum(UserRole, name="user_role"), nullable=False, default=UserRole.CLIENT)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=text("NOW()"))
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=text("NOW()"))
