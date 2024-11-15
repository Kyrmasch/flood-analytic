from sqlalchemy import Column, Integer, String, ForeignKey
from infrastructure.database import Base
from sqlalchemy.orm import relationship


class OffsetType(Base):
    __tablename__ = "offset_type"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("unit.id"))
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    unit = relationship("Unit")
