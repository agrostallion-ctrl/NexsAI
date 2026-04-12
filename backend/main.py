from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine, SessionLocal
import models
import hashlib
import bcrypt

from routes import webhook, messages, send, socket, auth

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ← sabko allow karo abhi ke liye
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(webhook.router)
app.include_router(messages.router)
app.include_router(send.router)
app.include_router(socket.router)
app.include_router(auth.router)

@app.get("/")
def home():
    return {"message": "NexusAI running 🚀"}

@app.on_event("startup")
async def startup():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Agent
        agent = db.query(models.Agent).filter_by(email="nitish@gmail.com").first()
        if not agent:
            sha = hashlib.sha256("123456".encode()).digest()
            hashed = bcrypt.hashpw(sha, bcrypt.gensalt()).decode()
            agent = models.Agent(name="nitish", email="nitish@gmail.com", password=hashed)
            db.add(agent)
            db.commit()
            db.refresh(agent)

        # Contact
        contact = db.query(models.Contact).filter_by(phone="9999999999").first()
        if not contact:
            contact = models.Contact(phone="9999999999", name="Test User")
            db.add(contact)
            db.commit()
            db.refresh(contact)

        # Conversation
        convo = db.query(models.Conversation).filter_by(contact_id=contact.id).first()
        if not convo:
            convo = models.Conversation(contact_id=contact.id, agent_id=agent.id)
            db.add(convo)
            db.commit()
    finally:
        db.close()