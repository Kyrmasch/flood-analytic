from sqlalchemy import Column, Integer, String
from infrastructure.database import Base
from sqlalchemy.orm import relationship
from models.role import user_roles


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    roles = relationship("Role", secondary=user_roles, back_populates="users")
