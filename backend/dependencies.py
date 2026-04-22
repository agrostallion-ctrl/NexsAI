from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import SessionLocal
from utils.auth_utils import verify_token



# 🔐 Bearer Token
security = HTTPBearer()

# 🗄️ DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🔥 Current Agent
def get_current_agent(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    print("PAYLOAD:", payload)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload