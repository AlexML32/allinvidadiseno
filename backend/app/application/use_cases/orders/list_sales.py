from datetime import datetime
from typing import List, Optional
from uuid import UUID
from app.domain.repositories.order_repository import OrderRepository
from app.domain.repositories.user_repository import UserRepository
from app.application.dto.order_dto import OrderDTO, OrderItemDetailDTO

class ListSales:
    def __init__(self, order_repo: OrderRepository, user_repo: UserRepository):
        self.order_repo = order_repo
        self.user_repo = user_repo

    def execute(
        self,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None,
        client_id: Optional[UUID] = None
    ) -> List[OrderDTO]:
        orders = self.order_repo.list_sales(from_date, to_date)
        
        # Filtrar por cliente si se especifica
        if client_id:
            orders = [o for o in orders if o.client_id == client_id]
            
        result = []
        for order in orders:
            client = self.user_repo.get_by_id(order.client_id)
            client_name = client.full_name if client else "Cliente Desconocido"

            delivery_name = None
            if order.delivery_user_id:
                delivery_user = self.user_repo.get_by_id(order.delivery_user_id)
                if delivery_user:
                    delivery_name = delivery_user.full_name

            items_dto = [
                OrderItemDetailDTO(
                    id=item.id,
                    product_id=item.product_id,
                    product_name=item.product_name,
                    unit_price=item.unit_price,
                    quantity=item.quantity,
                    subtotal=item.subtotal
                )
                for item in order.items
            ]

            result.append(
                OrderDTO(
                    id=order.id,
                    client_id=order.client_id,
                    client_name=client_name,
                    delivery_address=order.delivery_address,
                    status=order.status,
                    total=order.total,
                    created_at=order.created_at,
                    confirmed_at=order.confirmed_at,
                    delivery_user_id=order.delivery_user_id,
                    delivery_user_name=delivery_name,
                    items=items_dto
                )
            )
        return result
