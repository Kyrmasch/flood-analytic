from typing import Optional
from models.role import Role
from sqlalchemy.orm import Session


def get_role_by_name(db: Session, name: str) -> Optional[Role]:
    return db.query(Role).filter(Role.name == name).first()
