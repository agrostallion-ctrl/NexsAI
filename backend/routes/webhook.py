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


# ✅ RECEIVE MESSAGE + STATUS
@router.post("/webhook")
async def whatsapp_webhook(request: Request):
    payload = await request.json()
    print("🔥 WEBHOOK:", payload)

    db = SessionLocal()

    try:
        for entry in payload.get("entry", []):
            for change in entry.get("changes", []):
                value = change.get("value", {})

                # =========================
                # ✅ HANDLE DELIVERY STATUS
                # =========================
                statuses = value.get("statuses")
                if statuses:
                    for status in statuses:
                        msg_id = status.get("id")
                        status_type = status.get("status")  # sent / delivered / read

                        print("📊 STATUS:", msg_id, status_type)

                        db_msg = db.query(models.Message).filter_by(whatsapp_id=msg_id).first()
                        if db_msg:
                            db_msg.status = status_type
                            db.commit()

                            phone = db_msg.conversation.contact.phone

                            # realtime push
                            await manager.send_to_user(phone, {
                                "id": db_msg.id,
                                "status": status_type
                            })

                # =========================
                # ✅ HANDLE INCOMING MESSAGE
                # =========================
                messages = value.get("messages")
                if not messages:
                    continue

                for msg in messages:
                    phone = msg.get("from")

                    # ✅ normalize phone
                    phone = phone[-10:]

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

                    # save message
                    new_msg = models.Message(
                        conversation_id=convo.id,
                        sender="customer",
                        content=text,
                        is_read=False
                    )
                    db.add(new_msg)
                    db.commit()
                    db.refresh(new_msg)

                    # timestamp IST
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