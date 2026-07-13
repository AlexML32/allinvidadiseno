from uuid import UUID
from app.domain.exceptions.domain_exceptions import UserNotFoundError
from app.domain.repositories.user_repository import UserRepository

class DeleteUser:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def execute(self, user_id: UUID) -> bool:
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise UserNotFoundError(str(user_id))
        
        return self.user_repo.delete(user_id)
