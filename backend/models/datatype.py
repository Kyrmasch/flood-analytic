from sqlalchemy import Column, Integer, String
from infrastructure.database import Base


class DataType(Base):
    __tablename__ = "data_type"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
