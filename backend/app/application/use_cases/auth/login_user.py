from app.domain.exceptions.domain_exceptions import InvalidCredentialsError, UnauthorizedError
from app.domain.repositories.user_repository import UserRepository
from app.application.interfaces.password_hasher import PasswordHasher
from app.application.interfaces.token_provider import TokenProvider
from app.application.dto.user_dto import UserLoginDTO, TokenDTO

class LoginUser:
    def __init__(
        self,
        user_repo: UserRepository,
        password_hasher: PasswordHasher,
        token_provider: TokenProvider
    ):
        self.user_repo = user_repo
        self.password_hasher = password_hasher
        self.token_provider = token_provider

    def execute(self, dto: UserLoginDTO) -> TokenDTO:
        user = self.user_repo.get_by_email(dto.email)
        if not user or not user.is_active:
            raise InvalidCredentialsError()

        if not self.password_hasher.verify_password(dto.password, user.password_hash):
            raise InvalidCredentialsError()

        # Generar Token
        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role.value
        }
        access_token = self.token_provider.create_access_token(token_data)

        return TokenDTO(
            access_token=access_token,
            token_type="bearer",
            role=user.role.value,
            email=user.email,
            full_name=user.full_name
        )
