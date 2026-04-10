from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from typing import Optional
import os

# 👉 Pro Tip: इसे .env फाइल में रखें, कभी भी कोड में हार्डकोड न करें
SECRET_KEY = os.getenv("SECRET_KEY", "एक-बहुत-लंबा-और-कठिन-सीक्रेट-कोड-123")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 घंटे

def create_access_token(data: dict):
    to_encode = data.copy()
    # ✅ datetime.now(timezone.utc) का इस्तेमाल करें (लेटेस्ट तरीका)
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        # अगर टोकन एक्सपायर हो गया है या गलत है, तो None वापस जाएगा
        return None
    