from fastapi import APIRouter, Request
from fastapi.responses import PlainTextResponse
from database import SessionLocal
import models
from zoneinfo import ZoneInfo
from routes.socket import manager

router = APIRouter()

VERIFY_TOKEN = "nexusai123"
ist = ZoneInfo("Asia/Kolkata")

# ✅ VERIFY
@router.get("/webhook")
async def verify_webhook(request: Request):
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")

    if mode == "subscribe" and token == VERIFY_TOKEN:
        return PlainTextResponse(content=challenge)

    return PlainTextResponse("error", status_code=403)


# ✅ RECEIVE MESSAGE
@router.post("/webhook")
async def whatsapp_webhook(request: Request):
    payload = await request.json()
    print("🔥 WEBHOOK:", payload)

    db = SessionLocal()

    try:
        for entry in payload.get("entry", []):
            for change in entry.get("changes", []):
                value = change.get("value", {})

                messages = value.get("messages")
                if not messages:
                    continue

                for msg in messages:
                    phone = msg["from"]
                    if phone.startswith("91"):
                       phone = phone[2:]
                    text = msg.get("text", {}).get("body", "")

                    print("📩 MSG:", phone, text)

                    # contact
                    contact = db.query(models.Contact).filter_by(phone=phone).first()
                    if not contact:
                        contact = models.Contact(phone=phone)
                        db.add(contact)
                        db.commit()
                        db.refresh(contact)

                    # conversation
                    convo = db.query(models.Conversation).filter_by(contact_id=contact.id).first()
                    if not convo:
                        convo = models.Conversation(contact_id=contact.id)
                        db.add(convo)
                        db.commit()
                        db.refresh(convo)

                    # message save
                    new_msg = models.Message(
                        conversation_id=convo.id,
                        sender="customer",
                        content=text,
                        is_read=False
                    )
                    db.add(new_msg)
                    db.commit()
                    db.refresh(new_msg)

                    # ✅ FIXED TIMESTAMP
                    timestamp = new_msg.created_at.astimezone(ist).strftime("%I:%M %p")

                    # realtime push
                    await manager.send_to_user(phone, {
                        "id": new_msg.id,
                        "content": text,
                        "sender": "customer",
                        "timestamp": timestamp,
                        "is_read": False
                    })

    except Exception as e:
        print("❌ ERROR:", str(e))

    finally:
        db.close()

    return {"status": "ok"}