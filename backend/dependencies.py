from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import SessionLocal
from utils.auth_utils import verify_token

# 🔐 OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# 🗄️ DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🔥 Current Agent
def get_current_agent(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    print("PAYLOAD:", payload)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    return payload