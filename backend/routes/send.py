from fastapi import APIRouter, Depends
import httpx
import os
from dotenv import load_dotenv
from database import SessionLocal
import models
from routes.socket import manager
from dependencies import get_current_agent

load_dotenv()

router = APIRouter()

WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
PHONE_NUMBER_ID = os.getenv("PHONE_NUMBER_ID")


@router.post("/send")
async def send_message(
    phone: str,
    message: str,
    current_agent: dict = Depends(get_current_agent)
):
    db = SessionLocal()
    try:
        # ✅ WhatsApp API call (async)
        url = f"https://graph.facebook.com/v20.0/{PHONE_NUMBER_ID}/messages"
        headers = {
            "Authorization": f"Bearer {WHATSAPP_TOKEN}",
            "Content-Type": "application/json"
        }
        data = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": phone,
            "type": "text",
            "text": {"body": message}
        }

        async with httpx.AsyncClient() as client:
            res = await client.post(url, headers=headers, json=data)

        # ✅ DB save
        contact = db.query(models.Contact).filter_by(phone=phone).first()
        if contact:
            convo = db.query(models.Conversation).filter_by(contact_id=contact.id).first()
            if convo:
                new_msg = models.Message(
                    conversation_id=convo.id,
                    sender="agent",
                    content=message,
                    is_read=True
                )
                db.add(new_msg)
                db.commit()
                db.refresh(new_msg)

                # 🔥 REAL-TIME PUSH
                await manager.send_to_user(phone, {
                    "id": new_msg.id,
                    "content": message,
                    "sender": "agent",
                    "timestamp": new_msg.created_at.strftime("%I:%M %p") if new_msg.created_at else None,
                    "is_read": True
                })

        return res.json()

    finally:
        db.close()