from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from infrastructure.database import Base
from geoalchemy2 import Geometry


class Region(Base):
    __tablename__ = "regions"
    id = Column(Integer, primary_key=True, index=True)
    kato = Column(Integer, unique=True, index=True)
    name_ru = Column(String, unique=True, index=True)
    name_kz = Column(String, unique=True, index=True)
    geom = Column(Geometry(geometry_type="POLYGON", srid=4326))

    district_id = Column(Integer, ForeignKey("districts.id"))
    district = relationship("District", back_populates="regions")
