from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True)
    phone = Column(String, unique=True, index=True)
    name = Column(String, nullable=True)

    conversations = relationship("Conversation", back_populates="contact")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True)
    contact_id = Column(Integer, ForeignKey("contacts.id"))
    status = Column(String, default="open")
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=True)

    contact = relationship("Contact", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation")
    agent = relationship("Agent", back_populates="conversations")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), index=True)
    sender = Column(String)  # "customer" / "agent"
    content = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_read = Column(Boolean, default=False)

    conversation = relationship("Conversation", back_populates="messages")


class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String(255))

    conversations = relationship("Conversation", back_populates="agent")