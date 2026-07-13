from app.domain.entities.user import User
from app.domain.value_objects.order_status import UserRole
from app.domain.exceptions.domain_exceptions import UserAlreadyExistsError
from app.domain.repositories.user_repository import UserRepository
from app.application.interfaces.password_hasher import PasswordHasher
from app.application.dto.user_dto import UserDTO

class CreateUser:
    def __init__(self, user_repo: UserRepository, password_hasher: PasswordHasher):
        self.user_repo = user_repo
        self.password_hasher = password_hasher

    def execute(
        self,
        full_name: str,
        email: str,
        password: str,
        phone: str,
        address: str,
        role: UserRole
    ) -> UserDTO:
        existing = self.user_repo.get_by_email(email)
        if existing:
            raise UserAlreadyExistsError(email)

        password_hash = self.password_hasher.hash_password(password)

        new_user = User(
            id=None,
            full_name=full_name,
            email=email,
            password_hash=password_hash,
            phone=phone,
            address=address,
            role=role,
            is_active=True
        )

        saved = self.user_repo.save(new_user)
        return UserDTO(
            id=saved.id,
            full_name=saved.full_name,
            email=saved.email,
            phone=saved.phone,
            address=saved.address,
            role=saved.role,
            is_active=saved.is_active,
            created_at=saved.created_at
        )
