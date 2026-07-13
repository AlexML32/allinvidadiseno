from uuid import UUID
from app.domain.exceptions.domain_exceptions import ProductNotFoundError
from app.domain.repositories.product_repository import ProductRepository
from app.application.dto.product_dto import ProductDTO

class GetProductDetail:
    def __init__(self, product_repo: ProductRepository):
        self.product_repo = product_repo

    def execute(self, product_id: UUID) -> ProductDTO:
        product = self.product_repo.get_by_id(product_id)
        if not product:
            raise ProductNotFoundError(str(product_id))

        return ProductDTO(
            id=product.id,
            name=product.name,
            description=product.description,
            price=product.price,
            stock=product.stock,
            category=product.category,
            image_url=product.image_url,
            is_active=product.is_active,
            created_at=product.created_at,
            updated_at=product.updated_at
        )
