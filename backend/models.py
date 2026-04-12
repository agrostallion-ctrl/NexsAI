from fastapi import APIRouter, Request
from database import SessionLocal
import models
from routes.socket import manager
import os

router = APIRouter()

VERIFY_TOKEN = os.getenv("VERIFY_TOKEN", "nexusai123")


# ✅ Meta Webhook Verification
@router.get("/webhook")
async def verify_webhook(request: Request):
    params = dict(request.query_params)
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")

    if mode == "subscribe" and token == VERIFY_TOKEN:
        return int(challenge)

    return {"status": "invalid token"}


# ✅ WhatsApp Incoming Message Webhook
@router.post("/webhook")
async def whatsapp_webhook(request: Request):
    payload = await request.json()
    db = SessionLocal()

    try:
        entry = payload.get("entry", [{}])[0]
        changes = entry.get("changes", [{}])[0]
        value = changes.get("value", {})

        # ❌ Ignore non-message events
        if "messages" not in value:
            return {"status": "ignored"}

        message_data = value["messages"][0]
        phone = message_data.get("from", "").replace("+", "").strip()
        message_text = message_data.get("text", {}).get("body", "").strip()

        if not phone or not message_text:
            return {"status": "invalid data"}

        # ✅ Get contact name (fallback to phone)
        name = value.get("contacts", [{}])[0].get("profile", {}).get("name") or phone

        # ✅ Contact
        contact = db.query(models.Contact).filter_by(phone=phone).first()
        if not contact:
            contact = models.Contact(phone=phone, name=name)
            db.add(contact)
            db.commit()
            db.refresh(contact)

        # ✅ Conversation
        conversation = db.query(models.Conversation).filter_by(contact_id=contact.id).first()
        if not conversation:
            conversation = models.Conversation(contact_id=contact.id)
            db.add(conversation)
            db.commit()
            db.refresh(conversation)

        # ✅ Duplicate protection
        existing = db.query(models.Message).filter_by(
            conversation_id=conversation.id,
            content=message_text,
            sender="customer"
        ).first()

        if existing:
            return {"status": "duplicate ignored"}

        # ✅ Save message (unread)
        new_msg = models.Message(
            conversation_id=conversation.id,
            sender="customer",
            content=message_text,
            is_read=False
        )
        db.add(new_msg)
        db.commit()
        db.refresh(new_msg)

        # ✅ Real-time push (fail-safe)
        try:
            await manager.send_to_user(phone, {
                "id": new_msg.id,
                "content": new_msg.content,
                "sender": "customer",
                "timestamp": new_msg.created_at.strftime("%I:%M %p") if new_msg.created_at else None,  # ← comma
                "is_read": False,
                "phone": phone
            })
        except Exception as ws_err:
            print("⚠️ WebSocket failed (user offline):", ws_err)

        return {"status": "success"}

    except Exception as e:
        print("❌ Webhook Error:", e)
        return {"status": "error", "message": str(e)}

    finally:
        db.close()