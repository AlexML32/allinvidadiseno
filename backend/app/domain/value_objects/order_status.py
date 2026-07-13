from enum import Enum

class UserRole(str, Enum):
    ADMIN = "ADMIN"
    CLIENT = "CLIENT"
    DELIVERY = "DELIVERY"

class OrderStatus(str, Enum):
    PENDING = "PENDING"
    DELIVERED_PAID = "DELIVERED_PAID"
    CANCELLED = "CANCELLED"

class MovementType(str, Enum):
    INITIAL = "INITIAL"
    INCREASE = "INCREASE"
    DECREASE = "DECREASE"
