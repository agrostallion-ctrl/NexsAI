# 📁 FILE: backend/routes/whatsapp.py

import os
import logging
import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from dependencies import get_db
import models
from utils.auth_utils import get_current_active_agent

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/whatsapp",
    tags=["WhatsApp Setup"]
)

# 🔐 Meta App Config
META_APP_ID = os.getenv("META_APP_ID")
META_APP_SECRET = os.getenv("META_APP_SECRET")
VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")
BACKEND_URL = os.getenv("BACKEND_URL")  # Example: https://your-railway-app.up.railway.app


# 📋 FRONTEND TOKEN INPUT
class WhatsAppCredentials(BaseModel):
    access_token: str
    whatsapp_business_account_id: str
    phone_number_id: str
    meta_business_id: str | None = None


# 🚀 AUTO SUBSCRIBE FUNCTION
async def subscribe_app_to_whatsapp_business(
    access_token: str,
    whatsapp_business_account_id: str
):
    """
    Automatically subscribes your app to client's WABA
    """
    url = f"https://graph.facebook.com/v22.0/{whatsapp_business_account_id}/subscribed_apps"

    params = {
        "access_token": access_token
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            url,
            params=params
        )

        logger.info(f"📡 Subscription Response: {response.text}")

        if response.status_code not in [200, 201]:
            raise HTTPException(
                status_code=500,
                detail=f"Meta subscription failed: {response.text}"
            )

        return response.json()


# 🚀 OPTIONAL WEBHOOK FIELD SETUP
async def verify_webhook_fields(access_token: str, app_id: str):
    """
    Ensures webhook fields are configured
    """
    url = f"https://graph.facebook.com/v22.0/{app_id}/subscriptions"

    params = {
        "object": "whatsapp_business_account",
        "callback_url": f"{BACKEND_URL}/whatsapp/webhook",
        "verify_token": VERIFY_TOKEN,
        "fields": "messages,message_template_status_update,message_template_quality_update",
        "access_token": access_token
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            url,
            params=params
        )

        logger.info(f"🔗 Webhook Config Response: {response.text}")

        return response.json()


# 🟢 SAVE CLIENT META CREDENTIALS + AUTO ACTIVATE
@router.post("/save-credentials", status_code=status.HTTP_200_OK)
async def save_whatsapp_credentials(
    data: WhatsAppCredentials,
    db: Session = Depends(get_db),
    current_agent: models.Agent = Depends(get_current_active_agent)
):
    """
    Full Embedded Signup Automation:
    1. Save client credentials
    2. Subscribe app automatically
    3. Activate webhook
    """

    company = db.query(models.Company).filter(
        models.Company.id == current_agent.company_id
    ).first()

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company profile not found"
        )

    try:
        # =========================
        # 💾 SAVE CLIENT TOKENS
        # =========================
        company.access_token = data.access_token
        company.whatsapp_business_account_id = data.whatsapp_business_account_id
        company.phone_number_id = data.phone_number_id

        if data.meta_business_id:
            company.meta_business_id = data.meta_business_id

        db.commit()

        # =========================
        # 📡 SUBSCRIBE APP TO CLIENT WABA
        # =========================
        subscription_result = await subscribe_app_to_whatsapp_business(
            access_token=data.access_token,
            whatsapp_business_account_id=data.whatsapp_business_account_id
        )

        # =========================
        # 🔗 OPTIONAL WEBHOOK ENSURE
        # =========================
        webhook_result = await verify_webhook_fields(
            access_token=data.access_token,
            app_id=META_APP_ID
        )

        logger.info(
            f"✅ Client {company.id} onboarding complete."
        )

        return {
            "status": "success",
            "message": "WhatsApp Business Account linked and subscribed successfully.",
            "company_id": company.id,
            "phone_number_id": company.phone_number_id,
            "subscription": subscription_result,
            "webhook": webhook_result
        }

    except Exception as e:
        db.rollback()

        logger.error(
            f"❌ WhatsApp onboarding failed: {str(e)}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to complete WhatsApp onboarding."
        )