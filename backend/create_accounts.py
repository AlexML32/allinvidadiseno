
import os
from sqlalchemy.orm import Session
from app.infrastructure.database.session import engine
from app.core.container import Container
from app.domain.value_objects.order_status import UserRole

def create_users():
    with Session(engine) as db:
        container = Container(db)
        
        users_to_create = [
            {'email': 'admin@allin.com', 'password': 'admin123', 'role': UserRole.ADMIN, 'name': 'Admin Allin'},
            {'email': 'usuario@vida.com', 'password': 'usu123', 'role': UserRole.CLIENT, 'name': 'Usuario Vida'},
            {'email': 'repa@dap.com', 'password': 'ven123', 'role': UserRole.DELIVERY, 'name': 'Repartidor Dap'}
        ]
        
        for u in users_to_create:
            try:
                container.create_user.execute(
                    full_name=u['name'],
                    email=u['email'],
                    password=u['password'],
                    phone='999999999',
                    address='Av. Principal 123',
                    role=u['role']
                )
                print(f"Creado {u['email']} exitosamente.")
            except Exception as e:
                print(f"Error creando {u['email']}: {e}")

create_users()

