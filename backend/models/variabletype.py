from sqlalchemy import Column, Integer, String
from infrastructure.database import Base


class VariableType(Base):
    __tablename__ = "variable_type"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
