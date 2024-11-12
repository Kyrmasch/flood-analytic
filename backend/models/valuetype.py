from sqlalchemy import Column, Integer, String
from infrastructure.database import Base


class ValueType(Base):
    __tablename__ = "value_type"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    name_short = Column(String, nullable=True)
    description = Column(String, nullable=True)
