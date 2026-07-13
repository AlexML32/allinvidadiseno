from typing import List, Optional
from app.domain.repositories.product_repository import ProductRepository
from app.application.dto.product_dto import ProductDTO

class ListProducts:
    def __init__(self, product_repo: ProductRepository):
        self.product_repo = product_repo

    def execute(self, category: Optional[str] = None, only_active: bool = True) -> List[ProductDTO]:
        products = self.product_repo.list_all(category, only_active)
        return [
            ProductDTO(
                id=p.id,
                name=p.name,
                description=p.description,
                price=p.price,
                stock=p.stock,
                category=p.category,
                image_url=p.image_url,
                is_active=p.is_active,
                created_at=p.created_at,
                updated_at=p.updated_at
            )
            for p in products
        ]
