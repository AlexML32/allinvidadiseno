import uuid
from sqlalchemy import Column, String, Numeric, Integer, Boolean, DateTime, Text, text
from sqlalchemy.dialects.postgresql import UUID
from app.infrastructure.database.session import Base

class ProductModel(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    category = Column(String(80), nullable=True, index=True)
    image_url = Column(String(255), nullable=True, default="/placeholder-product.png")
    is_active = Column(Boolean, nullable=False, default=True, index=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=text("NOW()"))
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=text("NOW()"))
