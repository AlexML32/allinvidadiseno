from datetime import datetime
from uuid import UUID
from typing import Optional
from app.domain.value_objects.order_status import MovementType

class InventoryMovement:
    def __init__(
        self,
        id: Optional[UUID],
        product_id: UUID,
        movement_type: MovementType,
        quantity: int,
        previous_stock: int,
        new_stock: int,
        reason: Optional[str],
        created_by: Optional[UUID],
        created_at: Optional[datetime] = None
    ):
        self.id = id
        self.product_id = product_id
        self.movement_type = movement_type
        self.quantity = quantity
        self.previous_stock = previous_stock
        self.new_stock = new_stock
        self.reason = reason
        self.created_by = created_by
        self.created_at = created_at or datetime.now()
