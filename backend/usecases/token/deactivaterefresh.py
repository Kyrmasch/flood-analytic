from sqlalchemy.orm import Session

from usecases.token.getrefresh import get_refresh_token


def deactivate_refresh_token(db: Session, token: str):
    token_record = get_refresh_token(db, token)
    if token_record:
        token_record.is_active = False
        db.commit()
        db.refresh(token_record)
    return token_record
