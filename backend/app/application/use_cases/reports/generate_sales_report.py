from datetime import datetime
from decimal import Decimal
from typing import Optional, Dict
from app.domain.repositories.order_repository import OrderRepository
from app.application.dto.order_dto import SalesSummaryDTO, ProductSalesCountDTO

class GenerateSalesReport:
    def __init__(self, order_repo: OrderRepository):
        self.order_repo = order_repo

    def execute(self, from_date: Optional[datetime] = None, to_date: Optional[datetime] = None) -> SalesSummaryDTO:
        orders = self.order_repo.list_sales(from_date, to_date)

        total_sales = Decimal("0.00")
        order_count = len(orders)
        
        # Diccionario para agrupar productos vendidos: product_name -> {quantity, revenue}
        product_stats: Dict[str, Dict[str, any]] = {}

        for order in orders:
            total_sales += order.total
            for item in order.items:
                name = item.product_name
                if name not in product_stats:
                    product_stats[name] = {"quantity": 0, "revenue": Decimal("0.00")}
                product_stats[name]["quantity"] += item.quantity
                product_stats[name]["revenue"] += item.subtotal

        # Calcular ticket promedio
        average_ticket = Decimal("0.00")
        if order_count > 0:
            average_ticket = total_sales / Decimal(str(order_count))

        # Crear y ordenar lista de productos más vendidos
        top_products = []
        for name, stats in product_stats.items():
            top_products.append(
                ProductSalesCountDTO(
                    product_name=name,
                    quantity_sold=stats["quantity"],
                    total_revenue=stats["revenue"]
                )
            )
            
        # Ordenar de mayor a menor cantidad vendida
        top_products.sort(key=lambda x: x.quantity_sold, reverse=True)

        return SalesSummaryDTO(
            total_sales=total_sales,
            order_count=order_count,
            average_ticket=average_ticket,
            top_selling_products=top_products
        )
