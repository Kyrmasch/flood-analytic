from sqlalchemy import Column, Integer, String
from infrastructure.database import Base


class SiteType(Base):
    __tablename__ = "site_type"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
