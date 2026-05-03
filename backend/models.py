from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


# 🏢 COMPANY / CLIENT (Multi-tenant SaaS)
class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)

    # Basic info
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)

    # Meta / WhatsApp integration
    meta_business_id = Column(String, nullable=True)
    whatsapp_business_account_id = Column(String, nullable=True)
    phone_number_id = Column(String, nullable=True)
    access_token = Column(Text, nullable=True)

    # SaaS controls
    plan = Column(String, default="free")
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    # Relations
    agents = relationship("Agent", back_populates="company", cascade="all, delete")
    contacts = relationship("Contact", back_populates="company", cascade="all, delete")


# 👤 CUSTOMER CONTACT
class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)

    # Multi-tenant isolation
    company_id = Column(Integer, ForeignKey("companies.id"), index=True)

    phone = Column(String, index=True)
    name = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    # Relations
    company = relationship("Company", back_populates="contacts")
    conversations = relationship("Conversation", back_populates="contact", cascade="all, delete")


# 💬 CONVERSATION / CHAT THREAD
class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)

    contact_id = Column(Integer, ForeignKey("contacts.id"), index=True)

    # open / closed / pending
    status = Column(String, default="open", index=True)

    # Assigned support/sales/admin
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=True, index=True)

    # Performance optimization
    last_message_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    # Optional enterprise features
    priority = Column(String, default="normal")
    is_archived = Column(Boolean, default=False)

    # Relations
    contact = relationship("Contact", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete")
    agent = relationship("Agent", back_populates="conversations")


# 📨 MESSAGE
class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)

    conversation_id = Column(Integer, ForeignKey("conversations.id"), index=True)

    # customer / agent / system
    sender = Column(String, index=True)

    content = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    is_read = Column(Boolean, default=False, index=True)

    # Meta WhatsApp
    whatsapp_id = Column(String, nullable=True, index=True)

    # sent / delivered / read / failed
    status = Column(String, default="sent", index=True)

    # Relations
    conversation = relationship("Conversation", back_populates="messages")


# 👨‍💼 AGENT / ADMIN / SALES
class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)

    # Multi-tenant company ownership
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False, index=True)

    name = Column(String)
    email = Column(String, unique=True, index=True)

    # Secure hashed password
    password = Column(String(255))

    # admin / support / sales
    role = Column(String, default="admin", index=True)

    is_active = Column(Boolean, default=True, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    # Relations
    company = relationship("Company", back_populates="agents")
    conversations = relationship("Conversation", back_populates="agent")