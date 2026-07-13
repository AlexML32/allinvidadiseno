from fastapi import APIRouter, Depends
from datetime import datetime
from typing import Optional
from app.core.container import Container
from app.domain.value_objects.order_status import UserRole
from app.presentation.api.v1.dependencies import get_container, require_role
from app.presentation.api.v1.schemas.report_schemas import SalesSummaryResponse

router = APIRouter(prefix="/reports", tags=["Reportes Financieros"])

@router.get("/sales-summary", response_model=SalesSummaryResponse)
def get_sales_summary(
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    container: Container = Depends(get_container),
    current_user = Depends(require_role(UserRole.ADMIN))
):
    report = container.generate_sales_report.execute(from_date=from_date, to_date=to_date)
    return report
