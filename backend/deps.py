from services.tokenservice import TokenService
from services.usersservice import UserService
from infrastructure.database import SessionLocal
from sqlalchemy.orm import Session
from fastapi import Depends


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_user_service(db: Session = Depends(get_db)):
    return UserService(db)


def get_token_service(db: Session = Depends(get_db)):
    return TokenService(db)
