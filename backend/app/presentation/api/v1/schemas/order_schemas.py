from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from typing import List
from app.domain.value_objects.order_status import OrderStatus

class OrderItemRequest(BaseModel):
    product_id: UUID
    quantity: int = Field(..., gt=0)

class OrderCreateRequest(BaseModel):
    delivery_address: str = Field(..., min_length=5, max_length=255)
    items: List[OrderItemRequest] = Field(..., min_items=1)

class OrderItemResponse(BaseModel):
    id: UUID
    product_id: UUID
    product_name: str
    unit_price: Decimal
    quantity: int
    subtotal: Decimal

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: UUID
    client_id: UUID
    client_name: str
    delivery_address: str
    status: OrderStatus
    total: Decimal
    created_at: datetime
    confirmed_at: datetime | None = None
    delivery_user_id: UUID | None = None
    delivery_user_name: str | None = None
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True
