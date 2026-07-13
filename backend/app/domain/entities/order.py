from datetime import datetime
from decimal import Decimal
from uuid import UUID
from typing import List, Optional
from app.domain.value_objects.order_status import OrderStatus
from app.domain.entities.order_item import OrderItem

class Order:
    def __init__(
        self,
        id: Optional[UUID],
        client_id: UUID,
        delivery_address: str,
        status: OrderStatus = OrderStatus.PENDING,
        delivery_user_id: Optional[UUID] = None,
        total: Decimal = Decimal("0.00"),
        created_at: Optional[datetime] = None,
        confirmed_at: Optional[datetime] = None,
        items: Optional[List[OrderItem]] = None
    ):
        self.id = id
        self.client_id = client_id
        self.delivery_address = delivery_address
        self.status = status
        self.delivery_user_id = delivery_user_id
        self.total = total
        self.created_at = created_at or datetime.now()
        self.confirmed_at = confirmed_at
        self.items = items or []

    def calculate_total(self):
        self.total = sum((item.subtotal for item in self.items), Decimal("0.00"))

    def add_item(self, item: OrderItem):
        self.items.append(item)
        self.calculate_total()

    def confirm_delivery(self, delivery_user_id: UUID):
        from app.domain.exceptions.domain_exceptions import OrderImmutableError
        if self.status != OrderStatus.PENDING:
            raise OrderImmutableError(str(self.id or ""))
        self.status = OrderStatus.DELIVERED_PAID
        self.delivery_user_id = delivery_user_id
        self.confirmed_at = datetime.now()
