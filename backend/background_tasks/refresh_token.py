from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from infrastructure.database import SessionLocal
from models import RefreshToken


def delete_expired_refresh_tokens():
    with SessionLocal() as db:
        now = datetime.utcnow()
        expired_tokens = db.query(RefreshToken).filter(RefreshToken.expires_at < now)
        count = expired_tokens.delete(synchronize_session=False)
        db.commit()

        return count
