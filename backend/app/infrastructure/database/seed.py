import sys
import os
from decimal import Decimal

# Añadir el directorio backend a la ruta de búsqueda
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models.user_model import UserModel
from app.infrastructure.database.models.product_model import ProductModel
from app.infrastructure.database.models.inventory_movement_model import InventoryMovementModel
from app.infrastructure.security.bcrypt_password_hasher import BcryptPasswordHasher
from app.domain.value_objects.order_status import UserRole, MovementType

def seed_db():
    print("Iniciando seed de la base de datos...")
    db = SessionLocal()
    hasher = BcryptPasswordHasher()
    try:
        # 1. Semilla de Administrador
        admin_email = "admin@allinvida.com"
        admin = db.query(UserModel).filter(UserModel.email == admin_email).first()
        if not admin:
            print("Creando usuario administrador semilla...")
            hashed_pw = hasher.hash_password("Admin123!")
            admin = UserModel(
                full_name="Administrador ALLINVIDA",
                email=admin_email,
                password_hash=hashed_pw,
                phone="+51999999999",
                address="Av. Selva Alegre 123",
                role=UserRole.ADMIN,
                is_active=True
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
            print("Usuario administrador creado exitosamente.")
        else:
            print("El usuario administrador semilla ya existe.")

        # 2. Productos semilla (si la tabla está vacía)
        product_count = db.query(ProductModel).count()
        if product_count == 0:
            print("Insertando productos semilla...")
            sample_products = [
                {
                    "name": "Miel de abeja 500ml",
                    "description": "Miel pura de abeja, 100% natural.",
                    "price": Decimal("25.00"),
                    "stock": 40,
                    "category": "Endulzantes naturales",
                    "image_url": "/placeholder-product.png"
                },
                {
                    "name": "Aceite esencial de eucalipto 30ml",
                    "description": "Ideal para aromaterapia y vías respiratorias.",
                    "price": Decimal("18.50"),
                    "stock": 25,
                    "category": "Aceites esenciales",
                    "image_url": "/placeholder-product.png"
                },
                {
                    "name": "Quinua orgánica 1kg",
                    "description": "Quinua andina orgánica, rica en proteína.",
                    "price": Decimal("14.90"),
                    "stock": 60,
                    "category": "Cereales y granos",
                    "image_url": "/placeholder-product.png"
                },
                {
                    "name": "Té verde de hierbas 20 sobres",
                    "description": "Mezcla de hierbas naturales para infusión.",
                    "price": Decimal("9.90"),
                    "stock": 80,
                    "category": "Infusiones",
                    "image_url": "/placeholder-product.png"
                },
                {
                    "name": "Jabón artesanal de avena",
                    "description": "Jabón natural exfoliante con avena.",
                    "price": Decimal("7.50"),
                    "stock": 100,
                    "category": "Cuidado personal",
                    "image_url": "/placeholder-product.png"
                }
            ]

            for p_data in sample_products:
                p = ProductModel(
                    name=p_data["name"],
                    description=p_data["description"],
                    price=p_data["price"],
                    stock=p_data["stock"],
                    category=p_data["category"],
                    image_url=p_data["image_url"],
                    is_active=True
                )
                db.add(p)
                db.commit()
                db.refresh(p)

                # Registrar movimiento de inventario inicial para auditoría
                movement = InventoryMovementModel(
                    product_id=p.id,
                    movement_type=MovementType.INITIAL,
                    quantity=p.stock,
                    previous_stock=0,
                    new_stock=p.stock,
                    reason="Carga inicial semilla",
                    created_by=admin.id
                )
                db.add(movement)
                db.commit()

            print("Productos semilla e inventario insertados exitosamente.")
        else:
            print("La tabla de productos ya contiene datos. Se omitió la inserción semilla.")

        print("Proceso de seed finalizado con éxito.")
    except Exception as e:
        db.rollback()
        print(f"Error durante el seed: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
