from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
import models
from routes import webhook, messages, send, socket, auth

app = FastAPI()

# Sirf ek baar allow_origins define karein
origins = [
    "https://nexs-ai.vercel.app",  # Aapka production URL
    "http://localhost:3001",       # Local development ke liye (optional)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, # Agar aap cookies ya auth headers use kar rahe hain toh True rakhein
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

models.Base.metadata.create_all(bind=engine)