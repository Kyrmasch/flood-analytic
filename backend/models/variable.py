from sqlalchemy import Column, Integer, String, ForeignKey, Float
from infrastructure.database import Base
from sqlalchemy.orm import relationship


class Variable(Base):
    __tablename__ = "variable"

    id = Column(Integer, primary_key=True, index=True)
    variable_type_id = Column(Integer, ForeignKey("variable_type.id"))
    time_id = Column(Integer, ForeignKey("time.id"))
    unit_id = Column(Integer, ForeignKey("unit.id"))
    data_type_id = Column(Integer, ForeignKey("data_type.id"))
    general_category_id = Column(Integer, ForeignKey("category.id"))
    sample_medium_id = Column(Integer, ForeignKey("sample_medium.id"))
    time_support = Column(Float, nullable=True)
    name = Column(String, nullable=False)

    unit = relationship("Unit")
    data_type = relationship("DataType")
    general_category = relationship("Category")
    sample_medium = relationship("SampleMedium")
    variable_type = relationship("VariableType")
