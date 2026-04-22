from fastapi import APIRouter, Request
from database import SessionLocal
import models
from routes.socket import manager
import json
from fastapi.responses import PlainTextResponse


router = APIRouter()

VERIFY_TOKEN = "nexusai123"  # same jo meta me dala hai


@router.get("/webhook")
async def verify_webhook(request: Request):
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")

    print("VERIFY HIT:", mode, token, challenge)

    if mode == "subscribe" and token == VERIFY_TOKEN:
        return PlainTextResponse(content=challenge)

    return PlainTextResponse(content="error", status_code=403)


# ✅ RECEIVE (POST)
@router.post("/webhook")
async def whatsapp_webhook(request: Request):
    db = SessionLocal()
    try:
        body = await request.body()

        if not body:
            return {"status": "empty"}  # 💥 crash fix

        payload = json.loads(body)

        entry = payload.get("entry", [])
        if not entry:
            return {"status": "no entry"}

        changes = entry[0].get("changes", [])
        if not changes:
            return {"status": "no changes"}

        value = changes[0].get("value", {})
        messages = value.get("messages")

        if messages:
            msg = messages[0]
            phone = msg.get("from")
            text = msg.get("text", {}).get("body")

            # save DB
            contact = db.query(models.Contact).filter_by(phone=phone).first()
            if contact:
                convo = db.query(models.Conversation).filter_by(contact_id=contact.id).first()
                if convo:
                    new_msg = models.Message(
                        conversation_id=convo.id,
                        sender="customer",
                        content=text,
                        is_read=False
                    )
                    db.add(new_msg)
                    db.commit()
                    db.refresh(new_msg)

                    # 🔥 realtime push
                    await manager.send_to_user(phone, {
                        "id": new_msg.id,
                        "content": text,
                        "sender": "customer",
                        "timestamp": new_msg.created_at.strftime("%I:%M %p"),
                        "is_read": False
                    })

        return {"status": "ok"}

    except Exception as e:
        print("❌ WEBHOOK ERROR:", e)
        return {"status": "error"}

    finally:
        db.close()