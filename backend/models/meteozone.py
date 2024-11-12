from sqlalchemy import Column, Integer, String, ForeignKey
from infrastructure.database import Base


class MeteoZone(Base):
    __tablename__ = "meteo_zone"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    hour_meteoday_start = Column(Integer, nullable=True)
    first_s_hour = Column(Integer, nullable=True)
    hour_suff = Column(Integer, nullable=True)
    hour_rr = Column(Integer, nullable=True)
