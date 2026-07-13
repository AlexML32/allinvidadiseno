from typing import List, Optional
from app.domain.value_objects.order_status import UserRole
from app.domain.repositories.user_repository import UserRepository
from app.application.dto.user_dto import UserDTO

class ListUsers:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def execute(self, role: Optional[UserRole] = None) -> List[UserDTO]:
        users = self.user_repo.list_all(role)
        return [
            UserDTO(
                id=u.id,
                full_name=u.full_name,
                email=u.email,
                phone=u.phone,
                address=u.address,
                role=u.role,
                is_active=u.is_active,
                created_at=u.created_at
            )
            for u in users
        ]
