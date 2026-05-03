import os
import logging
import requests
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
import models
from dependencies import get_db
from utils.auth_utils import get_current_active_agent

# 📝 Logger Setup
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/whatsapp",
    tags=["WhatsApp Setup"]
)

# 🔐 Environment Variables (Ensure these are in your .env file)
META_APP_ID = os.getenv("META_APP_ID", "YOUR_META_APP_ID")
META_APP_SECRET = os.getenv("META_APP_SECRET", "YOUR_META_APP_SECRET")

# 📋 FRONTEND TOKEN INPUT
class WhatsAppCredentials(BaseModel):
    access_token: str = Field(..., min_length=20)

# 📋 RESPONSE MODEL
class WhatsAppSaveResponse(BaseModel):
    status: str
    message: str
    phone_number_id: str


# 🛠️ HELPER 1: Convert Short-Lived Token to 60-Day Token
def get_long_lived_token(short_token: str) -> str:
    """Exchange a short-lived token for a 60-day long-lived token."""
    url = "https://graph.facebook.com/v20.0/oauth/access_token"
    params = {
        "grant_type": "fb_exchange_token",
        "client_id": META_APP_ID,
        "client_secret": META_APP_SECRET,
        "fb_exchange_token": short_token
    }
    
    response = requests.get(url, params=params)
    
    if response.status_code != 200:
        logger.error(f"Token Exchange Error: {response.text}")
        raise Exception("Failed to get long-lived token from Meta.")
        
    return response.json().get("access_token")


# 🛠️ HELPER 2: Fetch Meta IDs (Business, WABA, Phone)
def fetch_whatsapp_business_data(access_token: str) -> dict:
    """Fetch Business ID, WABA ID, and Phone Number ID from Meta Graph API."""
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Using a session for faster, connection-pooled requests
    session = requests.Session()
    session.headers.update(headers)

    try:
        # Step 1: Get Businesses
        res = session.get("https://graph.facebook.com/v20.0/me/businesses")
        res.raise_for_status()
        businesses = res.json().get("data", [])
        if not businesses: 
            raise Exception("No Meta business account found.")
        business_id = businesses[0]["id"]

        # Step 2: Get WhatsApp Business Accounts (WABA)
        res = session.get(f"https://graph.facebook.com/v20.0/{business_id}/owned_whatsapp_business_accounts")
        res.raise_for_status()
        wabas = res.json().get("data", [])
        if not wabas: 
            raise Exception("No WhatsApp Business Account found.")
        waba_id = wabas[0]["id"]

        # Step 3: Get Phone Number ID
        res = session.get(f"https://graph.facebook.com/v20.0/{waba_id}/phone_numbers")
        res.raise_for_status()
        phones = res.json().get("data", [])
        if not phones: 
            raise Exception("No WhatsApp phone number found.")
        phone_number_id = phones[0]["id"]

        return {
            "meta_business_id": business_id,
            "whatsapp_business_account_id": waba_id,
            "phone_number_id": phone_number_id
        }
    except Exception as e:
        logger.error(f"Meta Graph API Error: {str(e)}")
        raise Exception(f"Meta API Error: {str(e)}")


# 🚀 MAIN ROUTE: Save Client Meta WhatsApp Credentials
@router.post(
    "/save-credentials",
    response_model=WhatsAppSaveResponse,
    status_code=status.HTTP_200_OK
)
def save_whatsapp_credentials(
    data: WhatsAppCredentials,
    db: Session = Depends(get_db),
    current_agent: models.Agent = Depends(get_current_active_agent)
):
    """
    Process:
    1. Authenticate user.
    2. Extend access token life to 60 days.
    3. Fetch Meta Business IDs.
    4. Save to the database.
    """

    # 🏢 Find company tied to the active agent
    company = db.query(models.Company).filter(
        models.Company.id == current_agent.company_id
    ).first()

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company profile not found."
        )

    try:
        # Step 1: Extend token validity
        long_lived_token = get_long_lived_token(data.access_token)

        # Step 2: Fetch data from Meta using the new long token
        meta_data = fetch_whatsapp_business_data(long_lived_token)

        # Step 3: Save all credentials to the database
        company.access_token = long_lived_token
        company.meta_business_id = meta_data["meta_business_id"]
        company.whatsapp_business_account_id = meta_data["whatsapp_business_account_id"]
        company.phone_number_id = meta_data["phone_number_id"]

        db.commit()
        db.refresh(company)

        return {
            "status": "success",
            "message": "WhatsApp Business Account linked successfully!",
            "phone_number_id": company.phone_number_id
        }

    except Exception as e:
        db.rollback()
        logger.error(f"WhatsApp Onboarding Error | Company ID: {current_agent.company_id} | Error: {str(e)}")
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )