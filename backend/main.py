from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
import models

from routes import webhook, messages, send, socket, auth

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "https://nexs-ai.vercel.app",
        "https://nexs-ai-git-main-agrostallion-ctrls-projects.vercel.app",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["*"],  # ← yeh karo
   
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