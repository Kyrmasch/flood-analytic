from sqlalchemy.orm import Session

from usecases.user.create_user import create_user
from usecases.user.get_user import get_user_by_username
from infrastructure.auth import auth_manager


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def authenticate_user(self, username: str, password: str):
        user = get_user_by_username(self.db, username)
        if not user or not auth_manager.verify_password(password, user.hashed_password):
            return None
        return user

    def create_new_user(self, username: str, email: str, password: str):
        hashed_password = auth_manager.get_password_hash(password)
        return create_user(self.db, username, email, hashed_password)
