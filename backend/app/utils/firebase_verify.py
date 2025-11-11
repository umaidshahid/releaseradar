import os
import firebase_admin
from firebase_admin import auth, credentials
from fastapi import HTTPException, Header

cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase.json")

if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

def verify_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")
    token = authorization.split(" ")[1]
    try:
        decoded = auth.verify_id_token(token)
        return decoded
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")
