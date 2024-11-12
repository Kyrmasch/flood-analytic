from sqlalchemy import Column, Integer, String, ForeignKey
from infrastructure.database import Base


class GeoType(Base):
    __tablename__ = "geo_type"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
