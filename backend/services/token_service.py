from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import uuid
from usecases.token.create_refresh import create_refresh_token
from usecases.token.deactivate_refresh import deactivate_refresh_token
from usecases.token.get_refresh import get_refresh_token
from infrastructure.auth import auth_manager
import logging

logging.getLogger("passlib").setLevel(logging.ERROR)


class TokenService:
    def __init__(self, db: Session):
        self.db = db

    def create_tokens(self, user_id: int):
        access_token_expires = timedelta(minutes=60)
        access_token = auth_manager.create_access_token(
            data={"sub": str(user_id)}, expires_delta=access_token_expires
        )

        refresh_token_str = str(uuid.uuid4())
        refresh_token_expires = datetime.utcnow() + timedelta(days=7)
        create_refresh_token(self.db, refresh_token_str, user_id, refresh_token_expires)

        return access_token, refresh_token_str

    def verify_refresh_token(self, token: str):
        refresh_token = get_refresh_token(self.db, token)
        if refresh_token and refresh_token.expires_at > datetime.utcnow():
            return refresh_token.user
        return None

    def rotate_refresh_token(self, token: str):
        user = self.verify_refresh_token(token)
        if user:
            deactivate_refresh_token(self.db, token)
            new_access_token, new_refresh_token = self.create_tokens(user.id)
            return new_access_token, new_refresh_token
        return None, None
