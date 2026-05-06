from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
import models
# Saare valid routes ko ek hi line mein import karein
from routes import webhook, messages, send, socket, auth, client, whatsapp
from sqlalchemy import text


app = FastAPI()

# Database tables create karein (Startup par)
models.Base.metadata.create_all(bind=engine)

# AUTO ADD company_id COLUMN
with engine.connect() as conn:
    conn.execute(text("""
        ALTER TABLE agents
        ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
    """))
    conn.commit()
    
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False, 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers registration
app.include_router(webhook.router)
app.include_router(messages.router)
app.include_router(send.router)
app.include_router(socket.router)
app.include_router(auth.router, prefix="/auth")
app.include_router(client.router)
app.include_router(whatsapp.router)

@app.get("/")
def home():
    return {"message": "NexusAI is Live 🚀"}