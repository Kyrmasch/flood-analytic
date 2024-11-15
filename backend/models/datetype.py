from sqlalchemy import Column, Integer, String
from infrastructure.database import Base


class DateType(Base):
    __tablename__ = "date_type"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
