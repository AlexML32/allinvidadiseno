from app.domain.entities.user import User
from app.domain.value_objects.order_status import UserRole
from app.domain.exceptions.domain_exceptions import UserAlreadyExistsError
from app.domain.repositories.user_repository import UserRepository
from app.application.interfaces.password_hasher import PasswordHasher
from app.application.dto.user_dto import UserRegistrationDTO, UserDTO

class RegisterClient:
    def __init__(self, user_repo: UserRepository, password_hasher: PasswordHasher):
        self.user_repo = user_repo
        self.password_hasher = password_hasher

    def execute(self, dto: UserRegistrationDTO) -> UserDTO:
        # Validar si el usuario ya existe
        existing = self.user_repo.get_by_email(dto.email)
        if existing:
            raise UserAlreadyExistsError(dto.email)

        # Hashear la contraseña
        password_hash = self.password_hasher.hash_password(dto.password)

        # Crear entidad de dominio
        new_user = User(
            id=None,
            full_name=dto.full_name,
            email=dto.email,
            password_hash=password_hash,
            phone=dto.phone,
            address=dto.address,
            role=UserRole.CLIENT,
            is_active=True
        )

        saved_user = self.user_repo.save(new_user)

        return UserDTO(
            id=saved_user.id,
            full_name=saved_user.full_name,
            email=saved_user.email,
            phone=saved_user.phone,
            address=saved_user.address,
            role=saved_user.role,
            is_active=saved_user.is_active,
            created_at=saved_user.created_at
        )
