from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session
from app.domain.entities.user import User
from app.domain.value_objects.order_status import UserRole
from app.domain.repositories.user_repository import UserRepository
from app.infrastructure.database.models.user_model import UserModel

class SQLAlchemyUserRepository(UserRepository):
    def __init__(self, db: Session):
        self.db = db

    def _to_domain(self, model: UserModel) -> User:
        return User(
            id=model.id,
            full_name=model.full_name,
            email=model.email,
            password_hash=model.password_hash,
            phone=model.phone,
            address=model.address,
            role=model.role,
            is_active=model.is_active,
            created_at=model.created_at,
            updated_at=model.updated_at
        )

    def get_by_id(self, user_id: UUID) -> Optional[User]:
        model = self.db.query(UserModel).filter(UserModel.id == user_id).first()
        return self._to_domain(model) if model else None

    def get_by_email(self, email: str) -> Optional[User]:
        model = self.db.query(UserModel).filter(UserModel.email == email).first()
        return self._to_domain(model) if model else None

    def save(self, user: User) -> User:
        if user.id:
            model = self.db.query(UserModel).filter(UserModel.id == user.id).first()
            if model:
                model.full_name = user.full_name
                model.email = user.email
                model.password_hash = user.password_hash
                model.phone = user.phone
                model.address = user.address
                model.role = user.role
                model.is_active = user.is_active
                self.db.commit()
                self.db.refresh(model)
                return self._to_domain(model)

        # Si no existe o no tiene ID
        model = UserModel(
            full_name=user.full_name,
            email=user.email,
            password_hash=user.password_hash,
            phone=user.phone,
            address=user.address,
            role=user.role,
            is_active=user.is_active
        )
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return self._to_domain(model)

    def list_all(self, role: Optional[UserRole] = None) -> List[User]:
        query = self.db.query(UserModel)
        if role:
            query = query.filter(UserModel.role == role)
        models = query.order_by(UserModel.full_name.asc()).all()
        return [self._to_domain(m) for m in models]

    def delete(self, user_id: UUID) -> bool:
        model = self.db.query(UserModel).filter(UserModel.id == user_id).first()
        if model:
            # Hacemos Soft Delete (desactivar el usuario) para no romper integridad de la base de datos
            model.is_active = False
            self.db.commit()
            return True
        return False
