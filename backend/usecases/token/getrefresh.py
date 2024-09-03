from sqlalchemy.orm import Session
from models.refreshtoken import RefreshToken


def get_refresh_token(db: Session, token: str):
    return (
        db.query(RefreshToken)
        .filter(RefreshToken.token == token, RefreshToken.is_active == True)
        .first()
    )
