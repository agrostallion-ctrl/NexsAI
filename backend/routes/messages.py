from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, aliased
from sqlalchemy import func
import models
from dependencies import get_db, get_current_agent

router = APIRouter(tags=["Chat Logic"])


# 🔥 1. GET MESSAGES
@router.get("/messages")
def get_messages(
    phone: str,
    db: Session = Depends(get_db),
    current_agent: dict = Depends(get_current_agent)
):
    convo = db.query(models.Conversation)\
        .join(models.Contact)\
        .filter(models.Contact.phone == phone)\
        .first()

    if convo and convo.agent_id != current_agent["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    messages = db.query(models.Message)\
        .join(models.Conversation)\
        .join(models.Contact)\
        .filter(models.Contact.phone == phone)\
        .order_by(models.Message.id.asc())\
        .all()

    return [
        {
            "id": m.id,
            "content": m.content,
            "sender": m.sender,
            "timestamp": m.timestamp.strftime("%I:%M %p") if m.timestamp else None  # ✅ fix
        }
        for m in messages
    ]


# 🔥 2. GET CONTACTS
@router.get("/contacts")
def get_contacts(
    db: Session = Depends(get_db),
    current_agent: dict = Depends(get_current_agent)
):
    MessageAlias = aliased(models.Message)

    last_msg_subq = db.query(
        models.Message.conversation_id,
        func.max(models.Message.id).label("last_msg_id")
    ).group_by(models.Message.conversation_id).subquery()

    unread_subq = db.query(
        models.Message.conversation_id,
        func.count(models.Message.id).label("unread_count")
    ).filter(
        models.Message.is_read == False,
        models.Message.sender == "user"
    ).group_by(models.Message.conversation_id).subquery()

    results = db.query(
        models.Contact.id,
        models.Contact.phone,
        models.Contact.name,
        models.Conversation.agent_id,
        MessageAlias.content,
        MessageAlias.timestamp,  # ✅ fix
        func.coalesce(unread_subq.c.unread_count, 0).label("unread_count")
    )\
    .join(models.Conversation, models.Conversation.contact_id == models.Contact.id)\
    .outerjoin(last_msg_subq, last_msg_subq.c.conversation_id == models.Conversation.id)\
    .outerjoin(MessageAlias, MessageAlias.id == last_msg_subq.c.last_msg_id)\
    .outerjoin(unread_subq, unread_subq.c.conversation_id == models.Conversation.id)\
    .filter(models.Conversation.agent_id == current_agent["id"])\
    .order_by(MessageAlias.timestamp.desc())\
    .all()

    return [
        {
            "id": r.id,
            "phone": r.phone,
            "name": r.name or r.phone,
            "agent_id": r.agent_id,
            "last_message": r.content or "Start chatting...",
            "timestamp": r.timestamp.strftime("%I:%M %p") if r.timestamp else None,  # ✅ fix
            "unread_count": r.unread_count
        }
        for r in results
    ]


# 🔥 3. ASSIGN AGENT
@router.post("/assign")
def assign_agent(
    phone: str,
    agent_id: int,
    db: Session = Depends(get_db),
    current_agent: dict = Depends(get_current_agent)
):
    contact = db.query(models.Contact).filter_by(phone=phone).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    agent = db.query(models.Agent).filter_by(id=agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    convo = db.query(models.Conversation)\
        .filter_by(contact_id=contact.id)\
        .first()

    if convo and convo.agent_id != current_agent["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    if not convo:
        convo = models.Conversation(contact_id=contact.id)
        db.add(convo)

    convo.agent_id = agent_id
    db.commit()

    return {
        "status": "success",
        "assigned_to": agent.name,
        "agent_id": agent_id
    }