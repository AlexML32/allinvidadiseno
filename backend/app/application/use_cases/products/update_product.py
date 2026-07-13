from uuid import UUID
from app.domain.exceptions.domain_exceptions import ProductNotFoundError
from app.domain.repositories.product_repository import ProductRepository
from app.application.dto.product_dto import ProductUpdateDTO, ProductDTO

class UpdateProduct:
    def __init__(self, product_repo: ProductRepository):
        self.product_repo = product_repo

    def execute(self, product_id: UUID, dto: ProductUpdateDTO) -> ProductDTO:
        product = self.product_repo.get_by_id(product_id)
        if not product:
            raise ProductNotFoundError(str(product_id))

        product.name = dto.name
        product.description = dto.description
        product.price = dto.price
        product.category = dto.category
        
        if dto.image_url is not None:
            product.image_url = dto.image_url

        saved = self.product_repo.save(product)

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
