import os
import hashlib
import bcrypt
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError

# 🔐 Environment-based secure config
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440)
)

# 🚨 Fail fast if secret missing
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable is missing.")


# 🔒 HASH PASSWORD
def hash_password(password: str) -> str:
    password = password.strip()

    # SHA256 first → avoids bcrypt 72-byte issue
    sha = hashlib.sha256(password.encode("utf-8")).digest()

    # bcrypt hash
    return bcrypt.hashpw(
        sha,
        bcrypt.gensalt()
    ).decode("utf-8")


# 🔒 VERIFY PASSWORD
def verify_password(password: str, hashed_password: str) -> bool:
    password = password.strip()

    sha = hashlib.sha256(password.encode("utf-8")).digest()

    return bcrypt.checkpw(
        sha,
        hashed_password.encode("utf-8")
    )


# 🎟️ CREATE JWT ACCESS TOKEN
def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None
) -> str:
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    to_encode.update({
        "exp": expire
    })

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


# 🔍 VERIFY JWT TOKEN
def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:
        return None