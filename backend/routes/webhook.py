from fastapi import APIRouter, Request
from fastapi.responses import PlainTextResponse
from database import SessionLocal
import models
from routes.socket import manager

router = APIRouter()

VERIFY_TOKEN = "nexusai123"


# ✅ VERIFY (GET)
@router.get("/webhook")
async def verify_webhook(request: Request):
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")

    if mode == "subscribe" and token == VERIFY_TOKEN:
        return PlainTextResponse(content=challenge)

    return PlainTextResponse("error", status_code=403)


# ✅ RECEIVE MESSAGE (POST)
@router.post("/webhook")
async def whatsapp_webhook(request: Request):
    payload = await request.json()
    print("🔥 WEBHOOK:", payload)

    db = SessionLocal()

    try:
        entry = payload.get("entry", [])
        for e in entry:
            changes = e.get("changes", [])
            for change in changes:
                value = change.get("value", {})

                messages = value.get("messages")
                if messages:
                    for msg in messages:
                        phone = msg["from"]
                        text = msg.get("text", {}).get("body", "")

                        print("📩 MSG:", phone, text)

                        # ✅ find contact
                        contact = db.query(models.Contact).filter_by(phone=phone).first()
                        if not contact:
                            contact = models.Contact(phone=phone)
                            db.add(contact)
                            db.commit()
                            db.refresh(contact)

                        # ✅ find/create conversation
                        convo = db.query(models.Conversation).filter_by(contact_id=contact.id).first()
                        if not convo:
                            convo = models.Conversation(contact_id=contact.id)
                            db.add(convo)
                            db.commit()
                            db.refresh(convo)

                        # ✅ save message
                        new_msg = models.Message(
                            conversation_id=convo.id,
                            sender="customer",
                            content=text,
                            is_read=False
                        )
                        db.add(new_msg)
                        db.commit()
                        db.refresh(new_msg)

                        # 🔥 REALTIME PUSH
                        await manager.send_to_user(phone, {
                            "id": new_msg.id,
                            "content": text,
                            "sender": "customer",
                            "timestamp": new_msg.created_at.strftime("%I:%M %p") if new_msg.created_at else None,
                            "is_read": False
                        })

    except Exception as e:
        print("❌ ERROR:", str(e))

    finally:
        db.close()

    return {"status": "ok"}