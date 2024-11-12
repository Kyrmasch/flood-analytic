from sqlalchemy import Column, Integer, String, ForeignKey, Float
from infrastructure.database import Base
from sqlalchemy.orm import relationship


class Method(Base):
    __tablename__ = "method"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    parent_id = Column(Integer, nullable=True)
    method_type_id = Column(Integer, ForeignKey("method_type.id"))

    method_type = relationship("MethodType")
