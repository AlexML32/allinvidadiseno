from pydantic import BaseModel
from decimal import Decimal
from typing import List

class ProductSalesCountResponse(BaseModel):
    product_name: str
    quantity_sold: int
    total_revenue: Decimal

    class Config:
        from_attributes = True

class SalesSummaryResponse(BaseModel):
    total_sales: Decimal
    order_count: int
    average_ticket: Decimal
    top_selling_products: List[ProductSalesCountResponse]

    class Config:
        from_attributes = True
