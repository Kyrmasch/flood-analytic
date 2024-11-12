from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from infrastructure.database import Base


class DataSource(Base):
    __tablename__ = "data_source"

    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("site.id"), nullable=False)
    code_form_id = Column(Integer, ForeignKey("code_form.id"), nullable=True)
    date_utc = Column(DateTime, nullable=True)
    date_utc_receive = Column(DateTime, nullable=True)
    date_insert = Column(DateTime, nullable=True)
    value = Column(String, nullable=True)
    hash = Column(String, nullable=True)

    site = relationship("Site")
    code_form = relationship("CodeForm")
