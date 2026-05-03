import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field
from dependencies import get_db
from utils.auth_utils import hash_password
import models
# 1. Auth logic import karein
from auth import create_access_token 

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/client",
    tags=["Client Onboarding"]
)

class CompanyRegister(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=120)
    admin_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)

# 2. Response model mein access_token add karein
class RegisterResponse(BaseModel):
    status: str
    company_id: int
    admin_id: int
    access_token: str  # <--- Ye add kiya
    message: str

@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED
)
def register_company(
    data: CompanyRegister,
    db: Session = Depends(get_db)
):
    # (Existing duplicate checks yahan rahenge...)
    existing_agent = db.query(models.Agent).filter(models.Agent.email == data.email).first()
    if existing_agent:
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    try:
        # 🏢 Create Company
        new_company = models.Company(
            name=data.company_name.strip(),
            email=data.email.strip().lower(),
            plan="free",
            is_active=True
        )
        db.add(new_company)
        db.flush()

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
        db.commit()

        db.refresh(new_company)
        db.refresh(new_agent)

        # 3. 🔥 Generate Token (Sub mein admin_id ya email daalein)
        token = create_access_token(data={"sub": str(new_agent.id), "email": new_agent.email})

        # 4. Response mein token bhejien
        return {
            "status": "success",
            "company_id": new_company.id,
            "admin_id": new_agent.id,
            "access_token": token, # <--- Frontend ise save karega
            "message": "Company and Admin created successfully"
        }

    except Exception as e:
        db.rollback()
        logger.error(f"Client Registration Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error.")