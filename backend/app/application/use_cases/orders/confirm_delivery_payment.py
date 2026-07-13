from uuid import UUID
from app.domain.exceptions.domain_exceptions import DomainException
from app.domain.repositories.order_repository import OrderRepository
from app.domain.repositories.user_repository import UserRepository
from app.application.dto.order_dto import OrderDTO, OrderItemDetailDTO

class ConfirmDeliveryPayment:
    def __init__(self, order_repo: OrderRepository, user_repo: UserRepository):
        self.order_repo = order_repo
        self.user_repo = user_repo

    def execute(self, order_id: UUID, delivery_user_id: UUID) -> OrderDTO:
        order = self.order_repo.get_by_id(order_id)
        if not order:
            raise DomainException("El pedido solicitado no existe.", code="ORDER_NOT_FOUND")

        # Confirmar en la entidad de dominio
        order.confirm_delivery(delivery_user_id)

        # Guardar en repositorio
        saved_order = self.order_repo.save(order)

        # Retornar DTO mapeado
        client = self.user_repo.get_by_id(saved_order.client_id)
        client_name = client.full_name if client else "Cliente Desconocido"

        delivery_user = self.user_repo.get_by_id(delivery_user_id)
        delivery_name = delivery_user.full_name if delivery_user else "Repartidor Desconocido"

        items_dto = [
            OrderItemDetailDTO(
                id=item.id,
                product_id=item.product_id,
                product_name=item.product_name,
                unit_price=item.unit_price,
                quantity=item.quantity,
                subtotal=item.subtotal
            )
            for item in saved_order.items
        ]

        return OrderDTO(
            id=saved_order.id,
            client_id=saved_order.client_id,
            client_name=client_name,
            delivery_address=saved_order.delivery_address,
            status=saved_order.status,
            total=saved_order.total,
            created_at=saved_order.created_at,
            confirmed_at=saved_order.confirmed_at,
            delivery_user_id=saved_order.delivery_user_id,
            delivery_user_name=delivery_name,
            items=items_dto
        )
