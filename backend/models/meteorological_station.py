from sqlalchemy import Column, Integer, String, Float
from infrastructure.database import Base


class MeteorologicalStation(Base):
    __tablename__ = "meteorological_stations"
    __description__ = "Метеорологические станции"

    id = Column(Integer, primary_key=True, autoincrement=True)
    object_id = Column(Integer, nullable=False, unique=True)
    name = Column(String(100), nullable=False)
    address = Column(String(100))
    temperature = Column(String(50), nullable=True)
    elevation = Column(String(50), nullable=True)
    code = Column(String(50), nullable=True)
    longitude = Column(Float, nullable=False)
    latitude = Column(Float, nullable=False)
