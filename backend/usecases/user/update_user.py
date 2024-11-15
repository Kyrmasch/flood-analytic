from sqlalchemy.orm import Session
from models.user import User


def reset_user_password(db: Session, user: User, new_hashed_password: str):
    db.query(User).filter_by(username=user.username).update({User.hashed_password: new_hashed_password})
    db.commit()    
    db.refresh(user)

    return user