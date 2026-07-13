from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from uuid import UUID
from app.infrastructure.database.session import get_db
from app.core.container import Container
from app.domain.entities.user import User
from app.domain.value_objects.order_status import UserRole
from app.domain.exceptions.domain_exceptions import UnauthorizedError, ForbiddenError

# Composición e Inyección
def get_container(db: Session = Depends(get_db)) -> Container:
    return Container(db)

# Esquema OAuth2 para FastAPI Swagger
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

def get_current_user(
    token: str = Depends(oauth2_scheme),
    container: Container = Depends(get_container)
) -> User:
    if not token:
        raise UnauthorizedError("No se proporcionó un token de acceso.")
    
    payload = container.token_provider.decode_access_token(token)
    if not payload:
        raise UnauthorizedError("Token inválido o expirado.")
        
    user_id_str = payload.get("sub")
    if not user_id_str:
        raise UnauthorizedError("Token inválido: falta el identificador del usuario.")
        
    try:
        user_id = UUID(user_id_str)
    except ValueError:
        raise UnauthorizedError("Formato de ID de usuario inválido.")
        
    user = container.user_repo.get_by_id(user_id)
    if not user or not user.is_active:
        raise UnauthorizedError("El usuario no está activo o no existe.")
        
    return user

def require_role(*roles: UserRole):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in roles:
            raise ForbiddenError("No tienes permisos para acceder a este recurso.")
        return current_user
    return role_checker
