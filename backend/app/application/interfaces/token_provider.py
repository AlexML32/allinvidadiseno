from abc import ABC, abstractmethod
from typing import Optional

class TokenProvider(ABC):
    @abstractmethod
    def create_access_token(self, data: dict, expires_delta_minutes: Optional[int] = None) -> str:
        pass

    @abstractmethod
    def decode_access_token(self, token: str) -> Optional[dict]:
        pass
