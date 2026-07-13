from abc import ABC, abstractmethod
from uuid import UUID
from typing import List, Optional
from app.domain.entities.product import Product
from app.domain.entities.inventory_movement import InventoryMovement

class ProductRepository(ABC):
    @abstractmethod
    def get_by_id(self, product_id: UUID) -> Optional[Product]:
        pass

    @abstractmethod
    def save(self, product: Product) -> Product:
        pass

    @abstractmethod
    def list_all(self, category: Optional[str] = None, only_active: bool = True) -> List[Product]:
        pass

    @abstractmethod
    def delete(self, product_id: UUID) -> bool:
        pass

    @abstractmethod
    def save_movement(self, movement: InventoryMovement) -> InventoryMovement:
        pass
