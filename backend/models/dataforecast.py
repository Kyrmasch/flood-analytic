from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from infrastructure.database import Base


class DataForecast(Base):
    __tablename__ = "data_forecast"

    id = Column(Integer, primary_key=True, index=True)
    date_ini = Column(DateTime, nullable=False)
    date_fcs = Column(DateTime, nullable=False)
    catalog_id = Column(Integer, ForeignKey("catalog.id"), nullable=False)
    value = Column(Float, nullable=False)
    offset_value = Column(Float, nullable=True)
    insert_localtimestamp = Column(DateTime, nullable=True)

    catalog = relationship("Catalog")
