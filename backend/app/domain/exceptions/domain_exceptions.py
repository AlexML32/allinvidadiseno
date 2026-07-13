class DomainException(Exception):
    """Clase base para todas las excepciones del dominio."""
    def __init__(self, message: str, code: str = "DOMAIN_ERROR"):
        self.message = message
        self.code = code
        super().__init__(message)

class InsufficientStockError(DomainException):
    def __init__(self, product_name: str, requested: int, available: int):
        self.product_name = product_name
        self.requested = requested
        self.available = available
        super().__init__(
            message=f"El producto '{product_name}' no tiene stock suficiente. Requerido: {requested}, Disponible: {available}.",
            code="INSUFFICIENT_STOCK"
        )

class OrderImmutableError(DomainException):
    def __init__(self, order_id: str):
        self.order_id = order_id
        super().__init__(
            message=f"El pedido '{order_id}' en estado entregado/pagado o cancelado es inmutable.",
            code="ORDER_IMMUTABLE"
        )

class ProductNotFoundError(DomainException):
    def __init__(self, product_id: str):
        self.product_id = product_id
        super().__init__(
            message=f"El producto con ID '{product_id}' no fue encontrado.",
            code="PRODUCT_NOT_FOUND"
        )

class UserNotFoundError(DomainException):
    def __init__(self, user_id_or_email: str):
        self.user_id_or_email = user_id_or_email
        super().__init__(
            message=f"El usuario '{user_id_or_email}' no fue encontrado.",
            code="USER_NOT_FOUND"
        )

class UserAlreadyExistsError(DomainException):
    def __init__(self, email: str):
        self.email = email
        super().__init__(
            message=f"El correo electrónico '{email}' ya se encuentra registrado.",
            code="USER_ALREADY_EXISTS"
        )

class InvalidCredentialsError(DomainException):
    def __init__(self):
        super().__init__(
            message="El correo electrónico o la contraseña ingresados son incorrectos.",
            code="INVALID_CREDENTIALS"
        )

class UnauthorizedError(DomainException):
    def __init__(self, message: str = "No autorizado para acceder a este recurso."):
        super().__init__(message, code="UNAUTHORIZED")

class ForbiddenError(DomainException):
    def __init__(self, message: str = "No tiene permisos suficientes para realizar esta acción."):
        super().__init__(message, code="FORBIDDEN")
