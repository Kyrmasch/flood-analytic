from sqlalchemy import Column, Integer, String
from infrastructure.database import Base
from sqlalchemy.orm import relationship


class District(Base):
    __tablename__ = "districts"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    regions = relationship("Region", back_populates="district")
