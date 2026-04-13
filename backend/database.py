import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL not set")

# Fix for Railway / old postgres URL
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,   # 🔥 connection auto-fix
)

SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()