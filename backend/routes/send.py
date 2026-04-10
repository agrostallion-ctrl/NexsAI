from fastapi import APIRouter
import requests
import os
from dotenv import load_dotenv

# .env फ़ाइल को लोड करें
load_dotenv()

router = APIRouter()

# .env से टोकन और आईडी उठाएं
WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
PHONE_NUMBER_ID = os.getenv("PHONE_NUMBER_ID")

@router.post("/send")
def send_message(phone: str, message: str):
    # 1. URL को फिक्स कर दिया गया है (v20.0 और सही ID फॉर्मेट)
    url = f"https://graph.facebook.com/v20.0/{817967361394092}/messages"

    # 2. Headers बिल्कुल सही हैं
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }

    # 3. Payload (मैसेज का डेटा)
    data = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": phone,
        "type": "text",
        "text": {
            "body": message # यहाँ जो आप message भेजेंगे वही जाएगा
        }
    }
    # 4. मेटा को रिक्वेस्ट भेजना
    res = requests.post(url, headers=headers, json=data)

    # 5. रिजल्ट वापस करना ताकि Swagger UI में दिख सके
    return res.json()