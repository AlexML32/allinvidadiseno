from fastapi import APIRouter, Depends, status
from uuid import UUID
from typing import List, Optional
from app.core.container import Container
from app.domain.value_objects.order_status import UserRole
from app.presentation.api.v1.dependencies import get_container, require_role
from app.presentation.api.v1.schemas.user_schemas import (
    UserCreateRequest,
    UserUpdateRequest,
    UserResponse
)

router = APIRouter(prefix="/users", tags=["Gestión de Usuarios"])

# Proteger todo el router bajo el rol de ADMINISTRADOR
admin_dependency = Depends(require_role(UserRole.ADMIN))

@router.get("", response_model=List[UserResponse], dependencies=[admin_dependency])
def list_users(
    role: Optional[UserRole] = None,
    container: Container = Depends(get_container)
):
    users = container.list_users.execute(role)
    return users

@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED, dependencies=[admin_dependency])
def create_user(
    payload: UserCreateRequest,
    container: Container = Depends(get_container)
):
    user = container.create_user.execute(
        full_name=payload.full_name,
        email=payload.email,
        password=payload.password,
        phone=payload.phone,
        address=payload.address,
        role=payload.role
    )
    return user

@router.put("/{id}", response_model=UserResponse, dependencies=[admin_dependency])
def update_user(
    id: UUID,
    payload: UserUpdateRequest,
    container: Container = Depends(get_container)
):
    user = container.update_user.execute(
        user_id=id,
        full_name=payload.full_name,
        email=payload.email,
        phone=payload.phone,
        address=payload.address,
        role=payload.role,
        is_active=payload.is_active,
        password=payload.password
    )
    return user

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[admin_dependency])
def delete_user(
    id: UUID,
    container: Container = Depends(get_container)
):
    container.delete_user.execute(id)
    return
