from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt, JWTError
from app.application.interfaces.token_provider import TokenProvider
from app.infrastructure.config.settings import settings

ALGORITHM = "HS256"

class JWTTokenProvider(TokenProvider):
    def create_access_token(self, data: dict, expires_delta_minutes: Optional[int] = None) -> str:
        to_encode = data.copy()
        expire_minutes = expires_delta_minutes or settings.JWT_EXPIRATION_MINUTES
        expire = datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)
        to_encode.update({"exp": int(expire.timestamp())})
        encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=ALGORITHM)
        return encoded_jwt

    def decode_access_token(self, token: str) -> Optional[dict]:
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[ALGORITHM])
            return payload
        except JWTError:
            return None
