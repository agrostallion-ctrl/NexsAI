import os
import logging
import pytz
from datetime import datetime, timezone
from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from database import SessionLocal
import models
from routes.socket import manager

# 📝 Logger Setup
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/whatsapp",
    tags=["WhatsApp Webhook"]
)

# 🔐 Environment Variables
VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")
ist = pytz.timezone("Asia/Kolkata")

# --- 🛠️ HELPERS ---

def get_db():
    """Database session dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def to_ist(dt):
    """Convert UTC datetime to IST display format."""
    if not dt:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(ist).strftime("%I:%M %p")

# --- 🟢 1. META WEBHOOK VERIFICATION (GET) ---

@router.get("/webhook")
async def verify_webhook(request: Request):
    """
    Meta calls this once to verify your server is legit.
    """
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")

    if mode == "subscribe" and token == VERIFY_TOKEN:
        logger.info("✅ Webhook verified successfully by Meta.")
        return PlainTextResponse(content=challenge)

    logger.warning("❌ Webhook verification failed: Token mismatch.")
    raise HTTPException(status_code=403, detail="Verification failed")

# --- 📨 2. RECEIVE WEBHOOK EVENTS (POST) ---

@router.post("/webhook")
async def whatsapp_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Processes incoming messages and delivery statuses.
    """
    payload = await request.json()
    logger.info(f"🔥 Webhook Payload Received: {payload}")

    try:
        for entry in payload.get("entry", []):
            for change in entry.get("changes", []):
                value = change.get("value", {})

                # 📊 CASE A: Message Status Updates (sent, delivered, read)
                statuses = value.get("statuses", [])
                for status in statuses:
                    msg_id = status.get("id")
                    status_type = status.get("status")

                    db_msg = db.query(models.Message).filter_by(whatsapp_id=msg_id).first()
                    if db_msg:
                        db_msg.status = status_type
                        db.commit()
                        
                        # Real-time UI Update via WebSocket
                        phone = db_msg.conversation.contact.phone
                        await manager.send_personal_message({
                            "type": "status_update",
                            "id": db_msg.id,
                            "status": status_type
                        }, phone)

                # 📩 CASE B: Incoming Customer Messages
                messages = value.get("messages", [])
                for msg in messages:
                    phone = msg.get("from") # Full number with country code
                    msg_type = msg.get("type")
                    whatsapp_msg_id = msg.get("id")

                    # Currently supporting only text messages
                    if msg_type != "text" or not whatsapp_msg_id:
                        continue

                    text = msg.get("text", {}).get("body", "")

                    # 🚫 Duplicate Prevention
                    if db.query(models.Message).filter_by(whatsapp_id=whatsapp_msg_id).first():
                        continue

                    # 1. Sync Contact
                    contact = db.query(models.Contact).filter_by(phone=phone).first()
                    if not contact:
                        contact = models.Contact(phone=phone)
                        db.add(contact)
                        db.commit()
                        db.refresh(contact)

                    # 2. Sync Conversation
                    convo = db.query(models.Conversation).filter_by(contact_id=contact.id).first()
                    if not convo:
                        convo = models.Conversation(contact_id=contact.id)
                        db.add(convo)
                        db.commit()
                        db.refresh(convo)

                    convo.last_message_at = datetime.now(timezone.utc)

                    # 3. Save New Message
                    new_msg = models.Message(
                        conversation_id=convo.id,
                        sender="customer",
                        content=text,
                        whatsapp_id=whatsapp_msg_id,
                        is_read=False,
                        status="received"
                    )
                    db.add(new_msg)
                    db.commit()
                    db.refresh(new_msg)

                    # 4. Notify Frontend
                    await manager.send_personal_message({
                        "type": "new_message",
                        "id": new_msg.id,
                        "content": text,
                        "sender": "customer",
                        "timestamp": to_ist(new_msg.created_at),
                        "status": "received"
                    }, phone)

        return {"status": "success"}

    except Exception as e:
        db.rollback()
        logger.error(f"❌ Webhook Error: {str(e)}")
        # We return 200/success even on error to stop Meta from retrying endlessly
        return {"status": "error", "message": "Handled internally"}