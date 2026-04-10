from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

import models
from dependencies import get_db
from utils.auth_utils import hash_password, verify_password, create_access_token, verify_token

router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(models.Agent).filter(models.Agent.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    agent = models.Agent(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
    )

    db.add(agent)
    db.commit()
    db.refresh(agent)

    return {"message": "Agent created successfully"}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    agent = db.query(models.Agent).filter(models.Agent.email == user.email).first()

    if not agent or not verify_password(user.password, agent.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "id": agent.id,
        "email": agent.email
    })

    return {"access_token": token, "token_type": "bearer"}


@router.get("/me")
def get_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

    agent = db.query(models.Agent).filter(models.Agent.id == payload.get("id")).first()
    if not agent:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": agent.id,
        "name": agent.name,
        "email": agent.email
    }