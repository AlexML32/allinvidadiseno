from datetime import datetime
from decimal import Decimal
from uuid import UUID
from typing import Optional

class Product:
    def __init__(
        self,
        id: Optional[UUID],
        name: str,
        description: Optional[str],
        price: Decimal,
        stock: int,
        category: Optional[str],
        image_url: Optional[str] = "/placeholder-product.png",
        is_active: bool = True,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None
    ):
        self.id = id
        self.name = name
        self.description = description
        self.price = price
        self.stock = stock
        self.category = category
        self.image_url = image_url or "/placeholder-product.png"
        self.is_active = is_active
        self.created_at = created_at or datetime.now()
        self.updated_at = updated_at or datetime.now()

    def check_stock(self, quantity: int) -> bool:
        return self.stock >= quantity

    def deduct_stock(self, quantity: int):
        from app.domain.exceptions.domain_exceptions import InsufficientStockError
        if not self.check_stock(quantity):
            raise InsufficientStockError(self.name, quantity, self.stock)
        self.stock -= quantity

    def increase_stock(self, quantity: int):
        self.stock += quantity
