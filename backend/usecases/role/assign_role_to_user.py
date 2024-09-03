from models.role import Role
from models.user import User
from sqlalchemy.orm import Session


def assign_role_to_user(db: Session, user: User, role: Role):
    if role not in user.roles:
        user.roles.append(role)
        db.commit()
        db.refresh(user)
