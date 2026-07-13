from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from typing import Literal

class ProductCreateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    description: str | None = None
    price: Decimal = Field(..., ge=0)
    stock: int = Field(..., ge=0)
    category: str | None = Field(None, max_length=80)
    image_url: str | None = Field(None, max_length=255)

class ProductUpdateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    description: str | None = None
    price: Decimal = Field(..., ge=0)
    category: str | None = Field(None, max_length=80)
    image_url: str | None = Field(None, max_length=255)

class StockAdjustmentRequest(BaseModel):
    amount: int = Field(..., gt=0)
    type: Literal["increase", "decrease"]
    reason: str = Field(..., min_length=3, max_length=255)

class ProductResponse(BaseModel):
    id: UUID
    name: str
    description: str | None = None
    price: Decimal
    stock: int
    category: str | None = None
    image_url: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            Decimal: lambda v: float(v)
        }
