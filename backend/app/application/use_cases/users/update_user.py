from uuid import UUID
from typing import Optional
from app.domain.value_objects.order_status import UserRole
from app.domain.exceptions.domain_exceptions import UserNotFoundError, UserAlreadyExistsError
from app.domain.repositories.user_repository import UserRepository
from app.application.interfaces.password_hasher import PasswordHasher
from app.application.dto.user_dto import UserDTO

class UpdateUser:
    def __init__(self, user_repo: UserRepository, password_hasher: PasswordHasher):
        self.user_repo = user_repo
        self.password_hasher = password_hasher

    def execute(
        self,
        user_id: UUID,
        full_name: str,
        email: str,
        phone: Optional[str],
        address: Optional[str],
        role: UserRole,
        is_active: bool,
        password: Optional[str] = None
    ) -> UserDTO:
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise UserNotFoundError(str(user_id))

        # Validar si el nuevo email ya está en uso por otro usuario
        if user.email != email:
            existing = self.user_repo.get_by_email(email)
            if existing:
                raise UserAlreadyExistsError(email)
            user.email = email

        user.full_name = full_name
        user.phone = phone
        user.address = address
        user.role = role
        user.is_active = is_active

        if password:
            user.password_hash = self.password_hasher.hash_password(password)

        saved = self.user_repo.save(user)
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
