# 📁 FILE: backend/routes/auth.py

import os
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

import models
from dependencies import get_db
from utils.auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
    verify_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)

# =========================
# 📋 LOGIN SCHEMA
# =========================
class LoginSchema(BaseModel):
    email: EmailStr
    password: str


# =========================
# 🔐 CURRENT AGENT
# =========================
def get_current_agent(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    agent_id = payload.get("agent_id")

    if not agent_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    agent = db.query(models.Agent).filter(
        models.Agent.id == agent_id
    ).first()

    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )

    return agent


# =========================
# 🚀 LOGIN
# =========================
@router.post("/login")
def login(
    data: LoginSchema,
    db: Session = Depends(get_db)
):
    agent = db.query(models.Agent).filter(
        models.Agent.email == data.email.lower().strip()
    ).first()

    if not agent:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        data.password,
        agent.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    company = db.query(models.Company).filter(
        models.Company.id == agent.company_id
    ).first()

    whatsapp_connected = bool(
        company and
        company.access_token and
        company.whatsapp_business_account_id and
        company.phone_number_id
    )

    access_token = create_access_token(
        data={
            "agent_id": agent.id,
            "company_id": agent.company_id,
            "role": agent.role
        }
    )

    return {
        "status": "success",
        "access_token": access_token,
        "token_type": "bearer",
        "agent_id": agent.id,
        "company_id": agent.company_id,
        "role": agent.role,
        "whatsapp_connected": whatsapp_connected
    }


# =========================
# ✅ TOKEN VERIFY
# =========================
@router.get("/verify")
def verify_auth(
    current_agent: models.Agent = Depends(
        get_current_agent
    )
):
    return {
        "status": "valid",
        "agent_id": current_agent.id,
        "company_id": current_agent.company_id,
        "role": current_agent.role
    }


# =========================
# 📊 AUTH STATUS
# =========================
@router.get("/status")
def auth_status(
    current_agent: models.Agent = Depends(
        get_current_agent
    ),
    db: Session = Depends(get_db)
):
    company = db.query(models.Company).filter(
        models.Company.id == current_agent.company_id
    ).first()

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    whatsapp_connected = bool(
        company.access_token and
        company.whatsapp_business_account_id and
        company.phone_number_id
    )

    return {
        "status": "success",
        "agent_id": current_agent.id,
        "company_id": company.id,
        "company_name": company.name,
        "role": current_agent.role,
        "whatsapp_connected": whatsapp_connected
    }