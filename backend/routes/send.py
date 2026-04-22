from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import httpx
import os
from datetime import timezone
from dotenv import load_dotenv

import models
from routes.socket import manager
from dependencies import get_current_agent, get_db
from schemas import SendMessageRequest  # 👈 import schema

load_dotenv()

router = APIRouter()

WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
PHONE_NUMBER_ID = os.getenv("PHONE_NUMBER_ID")


def normalize_phone(phone: str) -> str:
    phone = "".join(ch for ch in phone if ch.isdigit())
    if len(phone) == 10:
        return "91" + phone
    return phone


def to_ist(dt):
    if not dt:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone().strftime("%I:%M %p")


@router.post("/send")
async def send_message(
    body: SendMessageRequest,
    db: Session = Depends(get_db),
    current_agent: dict = Depends(get_current_agent),
):
    if not WHATSAPP_TOKEN or not PHONE_NUMBER_ID:
        raise HTTPException(500, "WhatsApp credentials missing")

    phone = body.phone.strip()
    message = body.message.strip()

    if not phone or not message:
        raise HTTPException(400, "phone and message required")

    agent_id = current_agent.get("id")
    if not agent_id:
        raise HTTPException(401, "Invalid agent")

    try:
        # 🔥 TRANSACTION START
        with db.begin():

            # CONTACT
            contact = db.query(models.Contact).filter_by(phone=phone).first()
            if not contact:
                contact = models.Contact(phone=phone)
                db.add(contact)
                db.flush()

            # CONVERSATION
            convo = db.query(models.Conversation).filter_by(contact_id=contact.id).first()
            if not convo:
                convo = models.Conversation(
                    contact_id=contact.id,
                    agent_id=agent_id
                )
                db.add(convo)
                db.flush()

            # MESSAGE SAVE
            new_msg = models.Message(
                conversation_id=convo.id,
                sender="agent",
                content=message,
                is_read=False,
                status="sent"
            )
            db.add(new_msg)
            db.flush()

        print("✅ DB saved:", new_msg.id)

        # 🔥 WEBSOCKET
        await manager.send_to_user(phone, {
            "id": new_msg.id,
            "content": message,
            "sender": "agent",
            "timestamp": to_ist(new_msg.created_at),
            "status": "sent",
            "phone": phone
        })

        # 🔥 WHATSAPP API
        wa_phone = normalize_phone(phone)

        url = f"https://graph.facebook.com/v20.0/{PHONE_NUMBER_ID}/messages"
        headers = {
            "Authorization": f"Bearer {WHATSAPP_TOKEN}",
            "Content-Type": "application/json",
        }

        payload = {
            "messaging_product": "whatsapp",
            "to": wa_phone,
            "type": "text",
            "text": {"body": message},
        }

        async with httpx.AsyncClient(timeout=30) as client:
            res = await client.post(url, headers=headers, json=payload)

        if res.status_code != 200:
            print("❌ WhatsApp error:", res.text)
            raise HTTPException(500, "WhatsApp send failed")

        data = res.json()
        print("📤 WA:", data)

        # ✅ SAVE WHATSAPP ID
        if "messages" in data:
            wa_id = data["messages"][0]["id"]

            new_msg.whatsapp_id = wa_id
            db.commit()

            print("✅ WA ID saved:", wa_id)

        return {
            "status": "success",
            "message_id": new_msg.id,
            "conversation_id": convo.id
        }

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        print("❌ ERROR:", e)
        raise HTTPException(500, str(e))