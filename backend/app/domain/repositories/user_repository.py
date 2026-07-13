from abc import ABC, abstractmethod
from uuid import UUID
from typing import List, Optional
from app.domain.entities.user import User
from app.domain.value_objects.order_status import UserRole

class UserRepository(ABC):
    @abstractmethod
    def get_by_id(self, user_id: UUID) -> Optional[User]:
        pass

    @abstractmethod
    def get_by_email(self, email: str) -> Optional[User]:
        pass

    @abstractmethod
    def save(self, user: User) -> User:
        pass

    @abstractmethod
    def list_all(self, role: Optional[UserRole] = None) -> List[User]:
        pass

    @abstractmethod
    def delete(self, user_id: UUID) -> bool:
        pass
