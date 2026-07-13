from uuid import UUID
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from app.domain.entities.order import Order
from app.domain.entities.order_item import OrderItem
from app.domain.value_objects.order_status import OrderStatus
from app.domain.repositories.order_repository import OrderRepository
from app.infrastructure.database.models.order_model import OrderModel
from app.infrastructure.database.models.order_item_model import OrderItemModel

class SQLAlchemyOrderRepository(OrderRepository):
    def __init__(self, db: Session):
        self.db = db

    def _to_domain(self, model: OrderModel) -> Order:
        items = [
            OrderItem(
                id=item.id,
                order_id=item.order_id,
                product_id=item.product_id,
                product_name=item.product_name,
                unit_price=item.unit_price,
                quantity=item.quantity,
                subtotal=item.subtotal
            )
            for item in model.items
        ]
        return Order(
            id=model.id,
            client_id=model.client_id,
            delivery_address=model.delivery_address,
            status=model.status,
            delivery_user_id=model.delivery_user_id,
            total=model.total,
            created_at=model.created_at,
            confirmed_at=model.confirmed_at,
            items=items
        )

    def get_by_id(self, order_id: UUID) -> Optional[Order]:
        model = self.db.query(OrderModel).filter(OrderModel.id == order_id).first()
        return self._to_domain(model) if model else None

    def save(self, order: Order) -> Order:
        if order.id:
            model = self.db.query(OrderModel).filter(OrderModel.id == order.id).first()
            if model:
                model.status = order.status
                model.delivery_user_id = order.delivery_user_id
                model.confirmed_at = order.confirmed_at
                model.total = order.total
                model.delivery_address = order.delivery_address
                self.db.commit()
                self.db.refresh(model)
                return self._to_domain(model)

        # Crear nuevo pedido
        model = OrderModel(
            client_id=order.client_id,
            delivery_address=order.delivery_address,
            status=order.status,
            total=order.total,
            created_at=order.created_at,
            confirmed_at=order.confirmed_at
        )

        for item in order.items:
            item_model = OrderItemModel(
                product_id=item.product_id,
                product_name=item.product_name,
                unit_price=item.unit_price,
                quantity=item.quantity,
                subtotal=item.subtotal
            )
            model.items.append(item_model)

        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return self._to_domain(model)

    def list_all(self, status: Optional[OrderStatus] = None, client_id: Optional[UUID] = None) -> List[Order]:
        query = self.db.query(OrderModel)
        if status:
            query = query.filter(OrderModel.status == status)
        if client_id:
            query = query.filter(OrderModel.client_id == client_id)
        models = query.order_by(OrderModel.created_at.desc()).all()
        return [self._to_domain(m) for m in models]

    def list_pending(self) -> List[Order]:
        models = (
            self.db.query(OrderModel)
            .filter(OrderModel.status == OrderStatus.PENDING)
            .order_by(OrderModel.created_at.desc())
            .all()
        )
        return [self._to_domain(m) for m in models]

    def list_sales(self, from_date: Optional[datetime] = None, to_date: Optional[datetime] = None) -> List[Order]:
        query = self.db.query(OrderModel).filter(OrderModel.status == OrderStatus.DELIVERED_PAID)
        if from_date:
            query = query.filter(OrderModel.confirmed_at >= from_date)
        if to_date:
            query = query.filter(OrderModel.confirmed_at <= to_date)
        models = query.order_by(OrderModel.confirmed_at.desc()).all()
        return [self._to_domain(m) for m in models]
