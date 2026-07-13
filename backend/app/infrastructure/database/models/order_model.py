import uuid
from sqlalchemy import Column, String, Numeric, DateTime, Enum, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.infrastructure.database.session import Base
from app.domain.value_objects.order_status import OrderStatus

class OrderModel(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    client_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True)
    delivery_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    status = Column(Enum(OrderStatus, name="order_status"), nullable=False, default=OrderStatus.PENDING, index=True)
    delivery_address = Column(String(255), nullable=False)
    total = Column(Numeric(10, 2), nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=text("NOW()"))
    confirmed_at = Column(DateTime(timezone=True), nullable=True)

    # Relaciones
    client = relationship("UserModel", foreign_keys=[client_id])
    delivery_user = relationship("UserModel", foreign_keys=[delivery_user_id])
    items = relationship("OrderItemModel", back_populates="order", cascade="all, delete-orphan", lazy="selectin")
