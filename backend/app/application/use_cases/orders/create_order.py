from uuid import UUID
from decimal import Decimal
from datetime import datetime
from app.domain.entities.order import Order
from app.domain.entities.order_item import OrderItem
from app.domain.entities.inventory_movement import InventoryMovement
from app.domain.value_objects.order_status import OrderStatus, MovementType
from app.domain.exceptions.domain_exceptions import ProductNotFoundError, InsufficientStockError
from app.domain.repositories.product_repository import ProductRepository
from app.domain.repositories.order_repository import OrderRepository
from app.domain.repositories.user_repository import UserRepository
from app.application.dto.order_dto import OrderCreateDTO, OrderDTO, OrderItemDetailDTO

class CreateOrder:
    def __init__(
        self,
        order_repo: OrderRepository,
        product_repo: ProductRepository,
        user_repo: UserRepository
    ):
        self.order_repo = order_repo
        self.product_repo = product_repo
        self.user_repo = user_repo

    def execute(self, client_id: UUID, dto: OrderCreateDTO) -> OrderDTO:
        # Validar usuario cliente
        client = self.user_repo.get_by_id(client_id)
        if not client:
            from app.domain.exceptions.domain_exceptions import UserNotFoundError
            raise UserNotFoundError(str(client_id))

        # 1. Validar existencias de todos los productos primero
        products_to_update = []
        order_items_to_create = []

        for item_dto in dto.items:
            product = self.product_repo.get_by_id(item_dto.product_id)
            if not product or not product.is_active:
                raise ProductNotFoundError(str(item_dto.product_id))

            if not product.check_stock(item_dto.quantity):
                raise InsufficientStockError(product.name, item_dto.quantity, product.stock)

            products_to_update.append((product, item_dto.quantity))

        # 2. Si todo está correcto, proceder a crear el pedido y descontar el stock
        order = Order(
            id=None,
            client_id=client_id,
            delivery_address=dto.delivery_address,
            status=OrderStatus.PENDING,
            total=Decimal("0.00")
        )

        for product, quantity in products_to_update:
            previous_stock = product.stock
            # Descontar stock del producto
            product.deduct_stock(quantity)
            self.product_repo.save(product)

            # Crear item de pedido
            unit_price = product.price
            subtotal = unit_price * quantity
            order_item = OrderItem(
                id=None,
                order_id=None, # Se asociará al guardar el pedido
                product_id=product.id,
                product_name=product.name,
                unit_price=unit_price,
                quantity=quantity,
                subtotal=subtotal
            )
            order.add_item(order_item)

            # Registrar el movimiento de inventario
            # Usamos una referencia temporal para la razón del movimiento
            movement = InventoryMovement(
                id=None,
                product_id=product.id,
                movement_type=MovementType.DECREASE,
                quantity=quantity,
                previous_stock=previous_stock,
                new_stock=product.stock,
                reason="Pedido de Cliente (Pendiente de Entrega)",
                created_by=client_id
            )
            self.product_repo.save_movement(movement)

        # Guardar el pedido en el repositorio
        saved_order = self.order_repo.save(order)

        # Mapear a DTO
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
            client_name=client.full_name,
            delivery_address=saved_order.delivery_address,
            status=saved_order.status,
            total=saved_order.total,
            created_at=saved_order.created_at,
            confirmed_at=saved_order.confirmed_at,
            delivery_user_id=saved_order.delivery_user_id,
            delivery_user_name=None,
            items=items_dto
        )
