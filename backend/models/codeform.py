from sqlalchemy import Column, Integer, String
from infrastructure.database import Base


class CodeForm(Base):
    __tablename__ = "code_form"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
