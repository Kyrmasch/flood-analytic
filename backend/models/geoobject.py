from sqlalchemy import Column, Integer, String, ForeignKey, Float
from infrastructure.database import Base
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry


class GeoObject(Base):
    __tablename__ = "geo_object"

    id = Column(Integer, primary_key=True, index=True)
    geo_type_id = Column(Integer, ForeignKey("geo_type.id"))
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    shape = Column(Geometry(geometry_type="GEOMETRY", srid=4326), nullable=True)
    tags = Column(String, nullable=True)

    geo_type = relationship("GeoType")
