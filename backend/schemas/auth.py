from pydantic import BaseModel
from typing import Optional


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[int] = None


class User(BaseModel):
    username: str
    email: str


class UserInDB(User):
    hashed_password: str
