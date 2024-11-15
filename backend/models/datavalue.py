from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from infrastructure.database import Base


class DataValue(Base):
    __tablename__ = "data_value"

    id = Column(Integer, primary_key=True, index=True)
    date_loc = Column(DateTime, nullable=True)
    date_utc = Column(DateTime, nullable=False)
    value = Column(Float, nullable=False)
    catalog_id = Column(Integer, ForeignKey("catalog.id"), nullable=False)
    offset_value = Column(Float, nullable=True)
    offset_value_add = Column(Float, nullable=True)
    qcl = Column(Integer, ForeignKey("qcl.id"), nullable=True)
    date_type_id = Column(Integer, ForeignKey("date_type.id"), nullable=True)

    catalog = relationship("Catalog", back_populates="data_values")
    qcl_rel = relationship("QCL")
    date_type = relationship("DateType")
