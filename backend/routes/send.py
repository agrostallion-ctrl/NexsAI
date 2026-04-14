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
        # =========================
        # 1️⃣ CONTACT ENSURE
        # =========================
        contact = db.query(models.Contact).filter_by(phone=phone).first()
        if not contact:
            contact = models.Contact(phone=phone)
            db.add(contact)
            db.commit()
            db.refresh(contact)
            print("🆕 Contact created:", contact.id)

        # =========================
        # 2️⃣ CONVERSATION ENSURE
        # =========================
        convo = db.query(models.Conversation).filter_by(contact_id=contact.id).first()
        if not convo:
            convo = models.Conversation(
                contact_id=contact.id,
                agent_id=current_agent["id"]
            )
            db.add(convo)
            db.commit()
            db.refresh(convo)
            print("🆕 Conversation created:", convo.id)

        # =========================
        # 3️⃣ SAVE MESSAGE (FIRST)
        # =========================
        new_msg = models.Message(
            conversation_id=convo.id,
            sender="agent",
            content=message,
            is_read=True
        )
        db.add(new_msg)
        db.commit()
        db.refresh(new_msg)

        print("✅ Saved in DB:", new_msg.id)

        # =========================
        # 4️⃣ REAL-TIME WEBSOCKET
        # =========================
        await manager.send_to_user(phone, {
            "id": new_msg.id,
            "content": message,
            "sender": "agent",
            "timestamp": new_msg.created_at.strftime("%I:%M %p") if new_msg.created_at else None,
            "is_read": True
        })

        # =========================
        # 5️⃣ WHATSAPP API (NON-BLOCKING)
        # =========================
        try:
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

            print("📤 WhatsApp:", res.status_code, res.text)

        except Exception as e:
            print("❌ WhatsApp error:", e)

        return {
            "status": "success",
            "message_id": new_msg.id
        }

    finally:
        db.close()