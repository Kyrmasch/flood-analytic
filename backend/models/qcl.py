from sqlalchemy import Column, Integer, String
from infrastructure.database import Base


class QCL(Base):
    __tablename__ = "qcl"

    id = Column(Integer, primary_key=True, index=True)
    qc_flag = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
