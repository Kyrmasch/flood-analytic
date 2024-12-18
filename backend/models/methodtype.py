from sqlalchemy import Column, Integer, String, Float
from infrastructure.database import Base
from sqlalchemy.orm import relationship


class MethodType(Base):
    __tablename__ = "method_type"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    methods = relationship("Method", back_populates="method_type")
