from sqlalchemy import Column, Integer, String, Float
from infrastructure.database import Base


class Time(Base):
    __tablename__ = "time"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    abbr = Column(String, nullable=True)
    si_conversion = Column(Float, nullable=True)
