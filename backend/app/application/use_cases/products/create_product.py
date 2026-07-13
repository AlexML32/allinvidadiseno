from uuid import UUID
from app.domain.entities.product import Product
from app.domain.entities.inventory_movement import InventoryMovement
from app.domain.value_objects.order_status import MovementType
from app.domain.repositories.product_repository import ProductRepository
from app.application.dto.product_dto import ProductCreateDTO, ProductDTO

class CreateProduct:
    def __init__(self, product_repo: ProductRepository):
        self.product_repo = product_repo

    def execute(self, dto: ProductCreateDTO, creator_id: UUID) -> ProductDTO:
        new_product = Product(
            id=None,
            name=dto.name,
            description=dto.description,
            price=dto.price,
            stock=dto.stock,
            category=dto.category,
            image_url=dto.image_url,
            is_active=True
        )

        saved = self.product_repo.save(new_product)

        # Si el stock inicial es mayor que 0, registrar movimiento de inventario
        if saved.stock > 0:
            movement = InventoryMovement(
                id=None,
                product_id=saved.id,
                movement_type=MovementType.INITIAL,
                quantity=saved.stock,
                previous_stock=0,
                new_stock=saved.stock,
                reason="Creación inicial del producto",
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
