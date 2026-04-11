from database import SessionLocal
import models
import hashlib
import bcrypt

db = SessionLocal()

# Check karo agent hai ya nahi
existing = db.query(models.Agent).filter_by(email="nitish@gmail.com").first()
if not existing:
    sha = hashlib.sha256("123456".encode()).digest()
    hashed = bcrypt.hashpw(sha, bcrypt.gensalt()).decode()
    agent = models.Agent(name="nitish", email="nitish@gmail.com", password=hashed)
    db.add(agent)
    db.commit()
    db.refresh(agent)
    print(f"Agent created: {agent.id}")
else:
    print(f"Agent exists: {existing.id}")

db.close()