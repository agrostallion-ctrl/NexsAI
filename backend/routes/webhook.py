from fastapi import APIRouter, Request
from database import SessionLocal
import models
from routes.socket import manager

router = APIRouter()

@router.post("/webhook")
async def whatsapp_webhook(request: Request):
    payload = await request.json()

    db = SessionLocal()

    try:
        entry = payload.get("entry", [{}])[0]
        changes = entry.get("changes", [{}])[0]
        value = changes.get("value", {})

        # ❌ ignore non-message payload
        if "messages" not in value:
            return {"status": "ignored"}

        message_data = value["messages"][0]

        phone = message_data.get("from")
        message_text = message_data.get("text", {}).get("body", "")

        if not message_text:
            return {"status": "no content"}

        # ✅ CONTACT
        contact = db.query(models.Contact).filter_by(phone=phone).first()
        if not contact:
            contact = models.Contact(
                phone=phone,
                name=value.get("contacts", [{}])[0]
                .get("profile", {})
                .get("name")
            )
            db.add(contact)
            db.commit()
            db.refresh(contact)

        # ✅ CONVERSATION
        conversation = db.query(models.Conversation)\
            .filter_by(contact_id=contact.id).first()

        if not conversation:
            conversation = models.Conversation(contact_id=contact.id)
            db.add(conversation)
            db.commit()
            db.refresh(conversation)

        # ✅ SAVE MESSAGE
        new_msg = models.Message(
            conversation_id=conversation.id,
            sender="customer",
            content=message_text
        )

        db.add(new_msg)
        db.commit()
        db.refresh(new_msg)

        # 🔥 REAL-TIME PUSH (FIXED)
        await manager.send_to_user(phone, {
            "id": new_msg.id,
            "content": message_text,
            "sender": "customer",
            "timestamp": new_msg.created_at
        })

        return {"status": "success"}

    except Exception as e:
        print("❌ Webhook Error:", e)
        return {"status": "error", "message": str(e)}

    finally:
        db.close()

