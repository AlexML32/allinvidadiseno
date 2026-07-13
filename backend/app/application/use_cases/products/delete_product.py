from uuid import UUID
from app.domain.exceptions.domain_exceptions import ProductNotFoundError
from app.domain.repositories.product_repository import ProductRepository

class DeleteProduct:
    def __init__(self, product_repo: ProductRepository):
        self.product_repo = product_repo

    def execute(self, product_id: UUID) -> bool:
        product = self.product_repo.get_by_id(product_id)
        if not product:
            raise ProductNotFoundError(str(product_id))

        return self.product_repo.delete(product_id)
