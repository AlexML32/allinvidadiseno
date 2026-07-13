from decimal import Decimal
from uuid import UUID
from typing import Optional

class OrderItem:
    def __init__(
        self,
        id: Optional[UUID],
        order_id: Optional[UUID],
        product_id: UUID,
        product_name: str,
        unit_price: Decimal,
        quantity: int,
        subtotal: Optional[Decimal] = None
    ):
        self.id = id
        self.order_id = order_id
        self.product_id = product_id
        self.product_name = product_name
        self.unit_price = unit_price
        self.quantity = quantity
        self.subtotal = subtotal or (unit_price * quantity)
