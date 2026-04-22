from pydantic import BaseModel

class SendMessageRequest(BaseModel):
    phone: str
    message: str