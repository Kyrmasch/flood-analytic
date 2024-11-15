from sqlalchemy import Column, Integer, String, ForeignKey, Float
from infrastructure.database import Base
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry


class Site(Base):
    __tablename__ = "site"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, nullable=False)
    name = Column(String, nullable=False)
    site_type_id = Column(Integer, ForeignKey("site_type.id"))
    meteo_zone_id = Column(Integer, ForeignKey("meteo_zone.id"), nullable=True)
    owner_id = Column(Integer, nullable=True)
    addr_id = Column(Integer, nullable=True)
    description = Column(String, nullable=True)
    parent_id = Column(Integer, nullable=True)
    name_lat = Column(String, nullable=True)
    lat = Column(Float, nullable=True)
    lon = Column(Float, nullable=True)
    geom_lation = Column(Geometry(geometry_type="POINT", srid=4326), nullable=True)

    site_type = relationship("SiteType")
    meteo_zone = relationship("MeteoZone")
