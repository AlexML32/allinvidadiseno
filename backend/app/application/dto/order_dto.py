from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from uuid import UUID
from typing import List, Optional
from app.domain.value_objects.order_status import OrderStatus

@dataclass
class OrderItemDTO:
    product_id: UUID
    quantity: int

@dataclass
class OrderCreateDTO:
    delivery_address: str
    items: List[OrderItemDTO]

@dataclass
class OrderItemDetailDTO:
    id: UUID
    product_id: UUID
    product_name: str
    unit_price: Decimal
    quantity: int
    subtotal: Decimal

@dataclass
class OrderDTO:
    id: UUID
    client_id: UUID
    client_name: str
    delivery_address: str
    status: OrderStatus
    total: Decimal
    created_at: datetime
    confirmed_at: Optional[datetime]
    delivery_user_id: Optional[UUID]
    delivery_user_name: Optional[str]
    items: List[OrderItemDetailDTO]

@dataclass
class ProductSalesCountDTO:
    product_name: str
    quantity_sold: int
    total_revenue: Decimal

@dataclass
class SalesSummaryDTO:
    total_sales: Decimal
    order_count: int
    average_ticket: Decimal
    top_selling_products: List[ProductSalesCountDTO]
