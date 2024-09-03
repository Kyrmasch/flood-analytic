from sqlalchemy.orm import Session
from models.refreshtoken import RefreshToken


def create_refresh_token(db: Session, token: str, user_id: int, expires_at):
    refresh_token = RefreshToken(token=token, user_id=user_id, expires_at=expires_at)
    db.add(refresh_token)
    db.commit()
    db.refresh(refresh_token)
    return refresh_token
