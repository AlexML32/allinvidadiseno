from passlib.context import CryptContext
from app.application.interfaces.password_hasher import PasswordHasher

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class BcryptPasswordHasher(PasswordHasher):
    def hash_password(self, password: str) -> str:
        return pwd_context.hash(password)

    def verify_password(self, password: str, hashed: str) -> bool:
        try:
            return pwd_context.verify(password, hashed)
        except Exception:
            return False
