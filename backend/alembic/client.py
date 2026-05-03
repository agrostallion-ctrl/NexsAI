import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field
from dependencies import get_db
from utils.auth_utils import hash_password
import models

# 📝 Logger setup
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/client",
    tags=["Client Onboarding"]
)


# 📋 CLIENT COMPANY REGISTER SCHEMA
class CompanyRegister(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=120)
    admin_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


# 📋 RESPONSE MODEL
class RegisterResponse(BaseModel):
    status: str
    company_id: int
    admin_id: int
    message: str


# 🚀 REGISTER CLIENT COMPANY + ADMIN
@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED
)
def register_company(
    data: CompanyRegister,
    db: Session = Depends(get_db)
):
    """
    Creates:
    - Company
    - Admin Agent
    - Multi-tenant SaaS account
    """

    # 🔍 Check duplicate agent
    existing_agent = db.query(models.Agent).filter(
        models.Agent.email == data.email
    ).first()

    if existing_agent:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists."
        )

    # 🔍 Check duplicate company
    existing_company = db.query(models.Company).filter(
        models.Company.email == data.email
    ).first()

    if existing_company:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company with this email already exists."
        )

    try:
        # 🏢 Create Company
        new_company = models.Company(
            name=data.company_name.strip(),
            email=data.email.strip().lower(),
            plan="free",
            is_active=True
        )

        db.add(new_company)
        db.flush()  # Generate company ID

        # 👨‍💼 Create Admin Agent
        new_agent = models.Agent(
            name=data.admin_name.strip(),
            email=data.email.strip().lower(),
            password=hash_password(data.password),
            company_id=new_company.id,
            role="admin",
            is_active=True
        )

        db.add(new_agent)

        # 💾 Final commit
        db.commit()

        db.refresh(new_company)
        db.refresh(new_agent)

        return {
            "status": "success",
            "company_id": new_company.id,
            "admin_id": new_agent.id,
            "message": "Company and Admin created successfully"
        }

    except Exception as e:
        db.rollback()

        # 🔒 Secure internal logging
        logger.error(f"Client Registration Error: {str(e)}")

        # ❌ Safe public response
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed due to an internal server error."
        )