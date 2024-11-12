from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from infrastructure.database import Base


class DataValueSource(Base):
    __tablename__ = "data_value_source"

    data_value_id = Column(Integer, ForeignKey("data_value.id"), primary_key=True)
    data_source_id = Column(Integer, ForeignKey("data_source.id"), primary_key=True)
    date_insert = Column(DateTime, nullable=True)

    data_value = relationship("DataValue")
    data_source = relationship("DataSource")
