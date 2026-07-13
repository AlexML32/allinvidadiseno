from abc import ABC, abstractmethod
from uuid import UUID
from datetime import datetime
from typing import List, Optional
from app.domain.entities.order import Order
from app.domain.value_objects.order_status import OrderStatus

class OrderRepository(ABC):
    @abstractmethod
    def get_by_id(self, order_id: UUID) -> Optional[Order]:
        pass

    @abstractmethod
    def save(self, order: Order) -> Order:
        pass

    @abstractmethod
    def list_all(self, status: Optional[OrderStatus] = None, client_id: Optional[UUID] = None) -> List[Order]:
        pass

    @abstractmethod
    def list_pending(self) -> List[Order]:
        pass

    @abstractmethod
    def list_sales(self, from_date: Optional[datetime] = None, to_date: Optional[datetime] = None) -> List[Order]:
        pass
