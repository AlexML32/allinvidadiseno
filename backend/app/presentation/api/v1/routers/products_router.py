from fastapi import APIRouter, Depends, status, Header
from uuid import UUID
from typing import List, Optional
from app.core.container import Container
from app.domain.entities.user import User
from app.domain.value_objects.order_status import UserRole
from app.presentation.api.v1.dependencies import get_container, require_role, get_current_user
from app.application.dto.product_dto import ProductCreateDTO, ProductUpdateDTO
from app.presentation.api.v1.schemas.product_schemas import (
    ProductCreateRequest,
    ProductUpdateRequest,
    StockAdjustmentRequest,
    ProductResponse
)

router = APIRouter(prefix="/products", tags=["Productos / Catálogo"])

# Dependencia del admin
admin_dependency = Depends(require_role(UserRole.ADMIN))

@router.get("", response_model=List[ProductResponse])
def list_products(
    category: Optional[str] = None,
    only_active: bool = True,
    container: Container = Depends(get_container),
    authorization: Optional[str] = Header(None)
):
    # Si se solicitan productos inactivos, validamos que el token pertenezca a un ADMIN
    actual_only_active = only_active
    if not only_active:
        if authorization and authorization.startswith("Bearer "):
            token = authorization.split(" ")[1]
            try:
                payload = container.token_provider.decode_access_token(token)
                if payload and payload.get("role") == UserRole.ADMIN.value:
                    actual_only_active = False
                else:
                    actual_only_active = True
            except Exception:
                actual_only_active = True
        else:
            actual_only_active = True

    products = container.list_products.execute(category=category, only_active=actual_only_active)
    return products

@router.get("/{id}", response_model=ProductResponse)
def get_product(
    id: UUID,
    container: Container = Depends(get_container)
):
    product = container.get_product_detail.execute(id)
    return product

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED, dependencies=[admin_dependency])
def create_product(
    payload: ProductCreateRequest,
    container: Container = Depends(get_container),
    current_user: User = Depends(get_current_user)
):
    dto = ProductCreateDTO(
        name=payload.name,
        description=payload.description,
        price=payload.price,
        stock=payload.stock,
        category=payload.category,
        image_url=payload.image_url
    )
    product = container.create_product.execute(dto, creator_id=current_user.id)
    return product

@router.put("/{id}", response_model=ProductResponse, dependencies=[admin_dependency])
def update_product(
    id: UUID,
    payload: ProductUpdateRequest,
    container: Container = Depends(get_container)
):
    dto = ProductUpdateDTO(
        name=payload.name,
        description=payload.description,
        price=payload.price,
        category=payload.category,
        image_url=payload.image_url
    )
    product = container.update_product.execute(id, dto)
    return product

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[admin_dependency])
def delete_product(
    id: UUID,
    container: Container = Depends(get_container)
):
    container.delete_product.execute(id)
    return

@router.patch("/{id}/stock", response_model=ProductResponse, dependencies=[admin_dependency])
def adjust_stock(
    id: UUID,
    payload: StockAdjustmentRequest,
    container: Container = Depends(get_container),
    current_user: User = Depends(get_current_user)
):
    product = container.adjust_stock.execute(
        product_id=id,
        amount=payload.amount,
        action_type=payload.type,
        reason=payload.reason,
        creator_id=current_user.id
    )
    return product
