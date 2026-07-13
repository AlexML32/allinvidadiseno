from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.infrastructure.config.settings import settings
from app.presentation.api.v1.error_handlers import register_error_handlers
from app.presentation.api.v1.routers.auth_router import router as auth_router
from app.presentation.api.v1.routers.users_router import router as users_router
from app.presentation.api.v1.routers.products_router import router as products_router
from app.presentation.api.v1.routers.orders_router import router as orders_router
from app.presentation.api.v1.routers.reports_router import router as reports_router

app = FastAPI(
    title="ALLINVIDA SALUD API",
    description="API REST para la gestión de compra, venta, inventario y repartos de ALLINVIDA SALUD (tienda naturista).",
    version="1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuración de CORS
cors_kwargs = {
    "allow_origins": settings.allowed_origins_list,
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}

cors_kwargs["allow_origin_regex"] = r"^https?://(localhost(:\d+)?|192\.168\.\d+\.\d+(:\d+)?|.*\.ngrok-free\.app|.*\.ngrok\.io)$"

app.add_middleware(CORSMiddleware, **cors_kwargs)

# Registro de controladores de errores globales (Clean Architecture Exceptions mapping)
register_error_handlers(app)

# Registro de rutas de la API v1
app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(products_router, prefix="/api/v1")
app.include_router(orders_router, prefix="/api/v1")
app.include_router(reports_router, prefix="/api/v1")

@app.get("/", tags=["Salud"])
def health_check():
    return {
        "status": "online",
        "service": "ALLINVIDA SALUD API",
        "version": "1.0.0"
    }

print('CORS KWARGS:', cors_kwargs)

