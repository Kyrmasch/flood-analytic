from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from infrastructure.database import Base


class Catalog(Base):
    __tablename__ = "catalog"

    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("site.id"), nullable=False)
    variable_id = Column(Integer, ForeignKey("variable.id"), nullable=False)
    method_id = Column(Integer, ForeignKey("method.id"), nullable=True)
    source_id = Column(Integer, ForeignKey("data_source.id"), nullable=True)
    offset_type_id = Column(Integer, ForeignKey("offset_type.id"), nullable=True)
    value_type_id = Column(Integer, ForeignKey("value_type.id"), nullable=True)
    offset_type_id_add = Column(Integer, nullable=True)
    db_list_id = Column(Integer, nullable=True)

    site = relationship("Site", back_populates="catalogs")
    data_values = relationship("DataValue", back_populates="catalog")
    variable = relationship("Variable")
    method = relationship("Method")
    source = relationship("DataSource")
    offset_type = relationship("OffsetType")
    value_type = relationship("ValueType")
