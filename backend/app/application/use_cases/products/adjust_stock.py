from uuid import UUID
from app.domain.entities.inventory_movement import InventoryMovement
from app.domain.value_objects.order_status import MovementType
from app.domain.exceptions.domain_exceptions import ProductNotFoundError, InsufficientStockError
from app.domain.repositories.product_repository import ProductRepository
from app.application.dto.product_dto import ProductDTO

class AdjustStock:
    def __init__(self, product_repo: ProductRepository):
        self.product_repo = product_repo

    def execute(
        self,
        product_id: UUID,
        amount: int,
        action_type: str, # "increase" or "decrease"
        reason: str,
        creator_id: UUID
    ) -> ProductDTO:
        product = self.product_repo.get_by_id(product_id)
        if not product:
            raise ProductNotFoundError(str(product_id))

        previous_stock = product.stock

        if action_type == "increase":
            product.increase_stock(amount)
            movement_type = MovementType.INCREASE
        elif action_type == "decrease":
            if product.stock < amount:
                raise InsufficientStockError(product.name, amount, product.stock)
            product.deduct_stock(amount)
            movement_type = MovementType.DECREASE
        else:
            raise ValueError("El tipo de ajuste debe ser 'increase' o 'decrease'.")

        saved = self.product_repo.save(product)

        # Registrar el movimiento
        movement = InventoryMovement(
            id=None,
            product_id=saved.id,
            movement_type=movement_type,
            quantity=amount,
            previous_stock=previous_stock,
            new_stock=saved.stock,
            reason=reason,
            created_by=creator_id
        )
        self.product_repo.save_movement(movement)

        return ProductDTO(
            id=saved.id,
            name=saved.name,
            description=saved.description,
            price=saved.price,
            stock=saved.stock,
            category=saved.category,
            image_url=saved.image_url,
            is_active=saved.is_active,
            created_at=saved.created_at,
            updated_at=saved.updated_at
        )
