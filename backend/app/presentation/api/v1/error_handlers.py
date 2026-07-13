from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.domain.exceptions.domain_exceptions import (
    DomainException,
    InsufficientStockError,
    OrderImmutableError,
    ProductNotFoundError,
    UserNotFoundError,
    UserAlreadyExistsError,
    InvalidCredentialsError,
    UnauthorizedError,
    ForbiddenError
)

def register_error_handlers(app: FastAPI):
    @app.exception_handler(DomainException)
    async def domain_exception_handler(request: Request, exc: DomainException):
        # Determinar status code por tipo de excepción
        status_code = 400
        if isinstance(exc, (ProductNotFoundError, UserNotFoundError)):
            status_code = 404
        elif isinstance(exc, (InsufficientStockError, OrderImmutableError, UserAlreadyExistsError)):
            status_code = 409
        elif isinstance(exc, (InvalidCredentialsError, UnauthorizedError)):
            status_code = 401
        elif isinstance(exc, ForbiddenError):
            status_code = 403

        return JSONResponse(
            status_code=status_code,
            content={
                "error": True,
                "code": exc.code,
                "message": exc.message,
                "status_code": status_code
            }
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        # Formatear errores de validación de Pydantic
        errors = exc.errors()
        messages = []
        for err in errors:
            loc = " -> ".join(str(l) for l in err.get("loc", []))
            msg = err.get("msg", "Error de validación")
            messages.append(f"{loc}: {msg}")
        
        message_str = "; ".join(messages)
        status_code = 422

        return JSONResponse(
            status_code=status_code,
            content={
                "error": True,
                "code": "VALIDATION_ERROR",
                "message": f"Datos de entrada inválidos: {message_str}",
                "status_code": status_code
            }
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        # Captura cualquier otro tipo de error no controlado
        status_code = 500
        return JSONResponse(
            status_code=status_code,
            content={
                "error": True,
                "code": "INTERNAL_SERVER_ERROR",
                "message": f"Ha ocurrido un error interno en el servidor: {str(exc)}",
                "status_code": status_code
            }
        )
