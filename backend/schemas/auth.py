from pydantic import BaseModel, ConfigDict
from typing import List, Optional


class Role(BaseModel):
    name: str

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[int] = None


class User(BaseModel):
    username: str
    email: str

    roles: List[Role] = []

    model_config = ConfigDict(from_attributes=True)


class UserInDB(User):
    hashed_password: str

class UserResetPassword(BaseModel):
    username: str
    old_password: str
    new_password: str