from fastapi import APIRouter, Depends, HTTPException, Query
import httpx
import os
from datetime import timezone
from dotenv import load_dotenv

from database import SessionLocal
import models
from routes.socket import manager
from dependencies import get_current_agent

load_dotenv()

router = APIRouter()

WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
PHONE_NUMBER_ID = os.getenv("PHONE_NUMBER_ID")


def normalize_phone_for_whatsapp(phone: str) -> str:
    """
    WhatsApp Cloud API needs a clean international number.
    For India, 10-digit numbers are converted to 91XXXXXXXXXX.
    """
    phone = "".join(ch for ch in str(phone).strip() if ch.isdigit())

    if len(phone) == 10:
        return "91" + phone

    if phone.startswith("0") and len(phone) == 11:
        return "91" + phone[1:]

    return phone


def to_ist_time(dt) -> str | None:
    if not dt:
        return None

    try:
        # If DB time is naive, treat it as UTC
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)

        return dt.astimezone().strftime("%I:%M %p")
    except Exception:
        return None


@router.post("/send")
async def send_message(
    phone: str = Query(...),
    message: str = Query(...),
    current_agent: dict = Depends(get_current_agent),
):
    if not WHATSAPP_TOKEN or not PHONE_NUMBER_ID:
        raise HTTPException(status_code=500, detail="WhatsApp credentials are missing")

    db = SessionLocal()

    try:
        phone = str(phone).strip()
        message = str(message).strip()

        if not phone or not message:
            raise HTTPException(status_code=400, detail="phone and message are required")

        agent_id = current_agent.get("id")
        if not agent_id:
            raise HTTPException(status_code=401, detail="Invalid agent")

        # 1) Ensure contact
        contact = db.query(models.Contact).filter_by(phone=phone).first()
        if not contact:
            contact = models.Contact(phone=phone)
            db.add(contact)
            db.commit()
            db.refresh(contact)
            print("🆕 Contact created:", contact.id)

        # 2) Ensure conversation
        convo = db.query(models.Conversation).filter_by(contact_id=contact.id).first()
        if not convo:
            convo = models.Conversation(
                contact_id=contact.id,
                agent_id=agent_id,
            )
            db.add(convo)
            db.commit()
            db.refresh(convo)
            print("🆕 Conversation created:", convo.id)

        # 3) Save message in DB
        new_msg = models.Message(
            conversation_id=convo.id,
            sender="agent",
            content=message,
            is_read=False,
        )
        db.add(new_msg)
        db.commit()
        db.refresh(new_msg)

        print("✅ Saved in DB:", new_msg.id)

        # Optional: update last_message fields if your models have them
        try:
            if hasattr(contact, "last_message"):
                contact.last_message = message
            if hasattr(convo, "last_message"):
                convo.last_message = message
            db.commit()
        except Exception as e:
            print("⚠️ last_message update skipped:", e)
            db.rollback()

        # 4) Realtime websocket update
        payload = {
            "id": new_msg.id,
            "content": message,
            "sender": "agent",
            "timestamp": to_ist_time(getattr(new_msg, "created_at", None)),
            "is_read": False,
            "phone": phone,
        }

        try:
            await manager.send_to_user(phone, payload)
            print("✅ WebSocket sent to:", phone)
        except Exception as e:
            print("❌ WebSocket error:", e)

        # 5) WhatsApp Cloud API
        whatsapp_status = None
        whatsapp_response = None

        try:
            wa_phone = normalize_phone_for_whatsapp(phone)

            url = f"https://graph.facebook.com/v20.0/{PHONE_NUMBER_ID}/messages"
            headers = {
                "Authorization": f"Bearer {WHATSAPP_TOKEN}",
                "Content-Type": "application/json",
            }
            data = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": wa_phone,
                "type": "text",
                "text": {"body": message},
            }

            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(url, headers=headers, json=data)

            whatsapp_status = res.status_code
            try:
                whatsapp_response = res.json()
            except Exception:
                whatsapp_response = res.text

            print("📤 WhatsApp:", res.status_code, res.text)

        except Exception as e:
            print("❌ WhatsApp error:", e)
            whatsapp_status = "error"
            whatsapp_response = str(e)

        return {
            "status": "success",
            "message_id": new_msg.id,
            "conversation_id": convo.id,
            "whatsapp_status": whatsapp_status,
            "whatsapp_response": whatsapp_response,
            "payload": payload,
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print("❌ Send API error:", e)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()