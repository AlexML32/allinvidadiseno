from sqlalchemy.orm import Session
from app.infrastructure.database.repositories.sqlalchemy_user_repository import SQLAlchemyUserRepository
from app.infrastructure.database.repositories.sqlalchemy_product_repository import SQLAlchemyProductRepository
from app.infrastructure.database.repositories.sqlalchemy_order_repository import SQLAlchemyOrderRepository
from app.infrastructure.security.bcrypt_password_hasher import BcryptPasswordHasher
from app.infrastructure.security.jwt_token_provider import JWTTokenProvider

# Importar casos de uso
from app.application.use_cases.auth.register_client import RegisterClient
from app.application.use_cases.auth.login_user import LoginUser
from app.application.use_cases.users.create_user import CreateUser
from app.application.use_cases.users.update_user import UpdateUser
from app.application.use_cases.users.delete_user import DeleteUser
from app.application.use_cases.users.list_users import ListUsers
from app.application.use_cases.products.list_products import ListProducts
from app.application.use_cases.products.get_product_detail import GetProductDetail
from app.application.use_cases.products.create_product import CreateProduct
from app.application.use_cases.products.update_product import UpdateProduct
from app.application.use_cases.products.delete_product import DeleteProduct
from app.application.use_cases.products.adjust_stock import AdjustStock
from app.application.use_cases.orders.create_order import CreateOrder
from app.application.use_cases.orders.list_my_orders import ListMyOrders
from app.application.use_cases.orders.list_pending_orders import ListPendingOrders
from app.application.use_cases.orders.list_sales import ListSales
from app.application.use_cases.orders.get_order_detail import GetOrderDetail
from app.application.use_cases.orders.confirm_delivery_payment import ConfirmDeliveryPayment
from app.application.use_cases.reports.generate_sales_report import GenerateSalesReport

class Container:
    def __init__(self, db: Session):
        self.db = db
        
        # Servicios e Infraestructura
        self.user_repo = SQLAlchemyUserRepository(db)
        self.product_repo = SQLAlchemyProductRepository(db)
        self.order_repo = SQLAlchemyOrderRepository(db)
        self.password_hasher = BcryptPasswordHasher()
        self.token_provider = JWTTokenProvider()

        # Casos de uso de autenticación y usuarios
        self.register_client = RegisterClient(self.user_repo, self.password_hasher)
        self.login_user = LoginUser(self.user_repo, self.password_hasher, self.token_provider)
        self.create_user = CreateUser(self.user_repo, self.password_hasher)
        self.update_user = UpdateUser(self.user_repo, self.password_hasher)
        self.delete_user = DeleteUser(self.user_repo)
        self.list_users = ListUsers(self.user_repo)

        # Casos de uso de productos
        self.list_products = ListProducts(self.product_repo)
        self.get_product_detail = GetProductDetail(self.product_repo)
        self.create_product = CreateProduct(self.product_repo)
        self.update_product = UpdateProduct(self.product_repo)
        self.delete_product = DeleteProduct(self.product_repo)
        self.adjust_stock = AdjustStock(self.product_repo)

        # Casos de uso de pedidos y reportes
        self.create_order = CreateOrder(self.order_repo, self.product_repo, self.user_repo)
        self.list_my_orders = ListMyOrders(self.order_repo, self.user_repo)
        self.list_pending_orders = ListPendingOrders(self.order_repo, self.user_repo)
        self.list_sales = ListSales(self.order_repo, self.user_repo)
        self.get_order_detail = GetOrderDetail(self.order_repo, self.user_repo)
        self.confirm_delivery_payment = ConfirmDeliveryPayment(self.order_repo, self.user_repo)
        self.generate_sales_report = GenerateSalesReport(self.order_repo)
