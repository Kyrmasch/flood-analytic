from models.role import Role
from sqlalchemy.orm import Session


def create_role(db: Session, name: str) -> Role:
    role = Role(name=name)
    db.add(role)
    db.commit()
    db.refresh(role)
    return role
