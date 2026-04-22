import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("⚠️ WARNING: DATABASE_URL not set, using fallback")
    DATABASE_URL = "sqlite:///./test.db"  # fallback only for alembic

# Fix postgres URL
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 🔥 ADD THIS (MOST IMPORTANT)
if "sslmode" not in DATABASE_URL:
    DATABASE_URL += "?sslmode=require"

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()