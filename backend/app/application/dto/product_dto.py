from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from uuid import UUID
from typing import Optional

@dataclass
class ProductDTO:
    id: UUID
    name: str
    description: Optional[str]
    price: Decimal
    stock: int
    category: Optional[str]
    image_url: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

@dataclass
class ProductCreateDTO:
    name: str
    description: Optional[str]
    price: Decimal
    stock: int
    category: Optional[str]
    image_url: Optional[str] = "/placeholder-product.png"

@dataclass
class ProductUpdateDTO:
    name: str
    description: Optional[str]
    price: Decimal
    category: Optional[str]
    image_url: Optional[str] = None
