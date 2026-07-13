from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session
from app.domain.entities.product import Product
from app.domain.entities.inventory_movement import InventoryMovement
from app.domain.repositories.product_repository import ProductRepository
from app.infrastructure.database.models.product_model import ProductModel
from app.infrastructure.database.models.inventory_movement_model import InventoryMovementModel

class SQLAlchemyProductRepository(ProductRepository):
    def __init__(self, db: Session):
        self.db = db

    def _to_domain(self, model: ProductModel) -> Product:
        return Product(
            id=model.id,
            name=model.name,
            description=model.description,
            price=model.price,
            stock=model.stock,
            category=model.category,
            image_url=model.image_url,
            is_active=model.is_active,
            created_at=model.created_at,
            updated_at=model.updated_at
        )

    def get_by_id(self, product_id: UUID) -> Optional[Product]:
        model = self.db.query(ProductModel).filter(ProductModel.id == product_id).first()
        return self._to_domain(model) if model else None

    def save(self, product: Product) -> Product:
        if product.id:
            model = self.db.query(ProductModel).filter(ProductModel.id == product.id).first()
            if model:
                model.name = product.name
                model.description = product.description
                model.price = product.price
                model.stock = product.stock
                model.category = product.category
                model.image_url = product.image_url
                model.is_active = product.is_active
                self.db.commit()
                self.db.refresh(model)
                return self._to_domain(model)

        model = ProductModel(
            name=product.name,
            description=product.description,
            price=product.price,
            stock=product.stock,
            category=product.category,
            image_url=product.image_url,
            is_active=product.is_active
        )
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return self._to_domain(model)

    def list_all(self, category: Optional[str] = None, only_active: bool = True) -> List[Product]:
        query = self.db.query(ProductModel)
        if only_active:
            query = query.filter(ProductModel.is_active == True)
        if category:
            query = query.filter(ProductModel.category == category)
        models = query.order_by(ProductModel.name.asc()).all()
        return [self._to_domain(m) for m in models]

    def delete(self, product_id: UUID) -> bool:
        model = self.db.query(ProductModel).filter(ProductModel.id == product_id).first()
        if model:
            # Hacemos Soft Delete (desactivar el producto) debido a la restricción RESTRICT en compras existentes
            model.is_active = False
            self.db.commit()
            return True
        return False

    def save_movement(self, movement: InventoryMovement) -> InventoryMovement:
        model = InventoryMovementModel(
            product_id=movement.product_id,
            movement_type=movement.movement_type,
            quantity=movement.quantity,
            previous_stock=movement.previous_stock,
            new_stock=movement.new_stock,
            reason=movement.reason,
            created_by=movement.created_by
        )
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        
        return InventoryMovement(
            id=model.id,
            product_id=model.product_id,
            movement_type=model.movement_type,
            quantity=model.quantity,
            previous_stock=model.previous_stock,
            new_stock=model.new_stock,
            reason=model.reason,
            created_by=model.created_by,
            created_at=model.created_at
        )
