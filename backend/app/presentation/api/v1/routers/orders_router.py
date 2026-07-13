from fastapi import APIRouter, Depends, status
from uuid import UUID
from datetime import datetime
from typing import List, Optional
from app.core.container import Container
from app.domain.entities.user import User
from app.domain.value_objects.order_status import UserRole, OrderStatus
from app.domain.exceptions.domain_exceptions import ForbiddenError
from app.presentation.api.v1.dependencies import get_container, require_role, get_current_user
from app.application.dto.order_dto import OrderCreateDTO, OrderItemDTO
from app.presentation.api.v1.schemas.order_schemas import (
    OrderCreateRequest,
    OrderResponse
)

router = APIRouter(prefix="/orders", tags=["Pedidos / Ventas"])

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: OrderCreateRequest,
    container: Container = Depends(get_container),
    current_user: User = Depends(require_role(UserRole.CLIENT))
):
    items_dto = [
        OrderItemDTO(product_id=item.product_id, quantity=item.quantity)
        for item in payload.items
    ]
    dto = OrderCreateDTO(
        delivery_address=payload.delivery_address,
        items=items_dto
    )
    order = container.create_order.execute(client_id=current_user.id, dto=dto)
    return order

@router.get("/me", response_model=List[OrderResponse])
def list_my_orders(
    container: Container = Depends(get_container),
    current_user: User = Depends(require_role(UserRole.CLIENT))
):
    orders = container.list_my_orders.execute(client_id=current_user.id)
    return orders

@router.get("/pending", response_model=List[OrderResponse])
def list_pending_orders(
    container: Container = Depends(get_container),
    current_user: User = Depends(require_role(UserRole.ADMIN, UserRole.DELIVERY))
):
    orders = container.list_pending_orders.execute()
    return orders

@router.get("/sales", response_model=List[OrderResponse])
def list_sales(
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    container: Container = Depends(get_container),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    orders = container.list_sales.execute(from_date=from_date, to_date=to_date)
    return orders

@router.get("/client/{clientId}", response_model=List[OrderResponse])
def list_client_history(
    clientId: UUID,
    container: Container = Depends(get_container),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    orders = container.list_my_orders.execute(client_id=clientId)
    return orders

@router.get("", response_model=List[OrderResponse])
def list_all_orders(
    status: Optional[OrderStatus] = None,
    client_id: Optional[UUID] = None,
    container: Container = Depends(get_container),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    orders = container.order_repo.list_all(status=status, client_id=client_id)
    result = []
    for order in orders:
        client = container.user_repo.get_by_id(order.client_id)
        client_name = client.full_name if client else "Cliente Desconocido"

        delivery_name = None
        if order.delivery_user_id:
            delivery_user = container.user_repo.get_by_id(order.delivery_user_id)
            if delivery_user:
                delivery_name = delivery_user.full_name

        from app.application.dto.order_dto import OrderDTO, OrderItemDetailDTO
        items_dto = [
            OrderItemDetailDTO(
                id=item.id,
                product_id=item.product_id,
                product_name=item.product_name,
                unit_price=item.unit_price,
                quantity=item.quantity,
                subtotal=item.subtotal
            )
            for item in order.items
        ]
        result.append(
            OrderDTO(
                id=order.id,
                client_id=order.client_id,
                client_name=client_name,
                delivery_address=order.delivery_address,
                status=order.status,
                total=order.total,
                created_at=order.created_at,
                confirmed_at=order.confirmed_at,
                delivery_user_id=order.delivery_user_id,
                delivery_user_name=delivery_name,
                items=items_dto
            )
        )
    return result

@router.get("/{id}", response_model=OrderResponse)
def get_order(
    id: UUID,
    container: Container = Depends(get_container),
    current_user: User = Depends(get_current_user)
):
    order = container.get_order_detail.execute(id)
    
    # Validar permisos
    if current_user.role == UserRole.CLIENT:
        if order.client_id != current_user.id:
            raise ForbiddenError("No tienes acceso a este pedido.")
    elif current_user.role == UserRole.DELIVERY:
        if order.status != OrderStatus.PENDING and order.delivery_user_id != current_user.id:
            raise ForbiddenError("No tienes acceso a este pedido.")
            
    return order

@router.patch("/{id}/confirm-delivery", response_model=OrderResponse)
def confirm_delivery(
    id: UUID,
    container: Container = Depends(get_container),
    current_user: User = Depends(require_role(UserRole.DELIVERY, UserRole.ADMIN))
):
    order = container.confirm_delivery_payment.execute(order_id=id, delivery_user_id=current_user.id)
    return order
