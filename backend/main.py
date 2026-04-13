from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
import models
from routes import webhook, messages, send, socket, auth

app = FastAPI()

origins = [
    "https://nexs-ai.vercel.app",
    "http://localhost:3000",  # dev ke liye
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

models.Base.metadata.create_all(bind=engine)