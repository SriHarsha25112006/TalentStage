from datetime import datetime, timedelta
from typing import Any, Union
import jwt
from core.config import settings
import hashlib
import os

ALGORITHM = "HS256"

def fallback_verify(plain_password: str, hashed_password: str) -> bool:
    if hashed_password.startswith("pbkdf2:"):
        parts = hashed_password.split(":")
        if len(parts) == 3:
            salt = bytes.fromhex(parts[1])
            expected = bytes.fromhex(parts[2])
            actual = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, 100000)
            return actual == expected
    try:
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        pass
    return False

# Use direct bcrypt library to avoid passlib Python 3.14 ValueError compatibility bugs
try:
    import bcrypt
    def get_password_hash(password: str) -> str:
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')

    def verify_password(plain_password: str, hashed_password: str) -> bool:
        try:
            return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
        except Exception:
            return fallback_verify(plain_password, hashed_password)
except ImportError:
    def get_password_hash(password: str) -> str:
        salt = os.urandom(16)
        hashed = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
        return f"pbkdf2:{salt.hex()}:{hashed.hex()}"

    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return fallback_verify(plain_password, hashed_password)

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
