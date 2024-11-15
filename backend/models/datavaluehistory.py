from sqlalchemy import Column, Integer, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from infrastructure.database import Base


class DataValueHistor(Base):
    __tablename__ = "data_value_histor"

    id = Column(Integer, primary_key=True, index=True)
    date_loc = Column(DateTime, nullable=True)
    date_utc = Column(DateTime, nullable=False)
    value = Column(Float, nullable=False)
    date_insert = Column(DateTime, nullable=True)
    qcl = Column(Integer, ForeignKey("qcl.id"), nullable=True)

    qcl_rel = relationship("QCL")
