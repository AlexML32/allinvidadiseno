from fastapi import APIRouter, Depends, status
from app.core.container import Container
from app.domain.entities.user import User
from app.application.dto.user_dto import UserRegistrationDTO, UserLoginDTO
from app.presentation.api.v1.dependencies import get_container, get_current_user
from app.presentation.api.v1.schemas.auth_schemas import (
    UserRegisterRequest,
    UserLoginRequest,
    TokenResponse,
    UserMeResponse
)

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/register", response_model=UserMeResponse, status_code=status.HTTP_201_CREATED)
def register(
    payload: UserRegisterRequest,
    container: Container = Depends(get_container)
):
    dto = UserRegistrationDTO(
        full_name=payload.full_name,
        email=payload.email,
        password=payload.password,
        phone=payload.phone,
        address=payload.address
    )
    user_dto = container.register_client.execute(dto)
    return user_dto

@router.post("/login", response_model=TokenResponse)
def login(
    payload: UserLoginRequest,
    container: Container = Depends(get_container)
):
    dto = UserLoginDTO(
        email=payload.email,
        password=payload.password
    )
    token_dto = container.login_user.execute(dto)
    return token_dto

@router.get("/me", response_model=UserMeResponse)
def me(
    current_user: User = Depends(get_current_user)
):
    return UserMeResponse(
        id=current_user.id,
        full_name=current_user.full_name,
        email=current_user.email,
        phone=current_user.phone,
        address=current_user.address,
        role=current_user.role,
        is_active=current_user.is_active,
        created_at=current_user.created_at
    )
