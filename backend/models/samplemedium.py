from sqlalchemy import Column, Integer, String
from infrastructure.database import Base


class SampleMedium(Base):
    __tablename__ = "sample_medium"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
