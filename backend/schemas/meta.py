from pydantic import BaseModel
from typing import List, Optional


class ColumnMeta(BaseModel):
    name: str
    type: str


class RelationshipMeta(BaseModel):
    relation: str
    related_model: str
    foreign_keys: List[str]


class TableMeta(BaseModel):
    table_name: str
    columns: List[ColumnMeta]
    relationships: List[RelationshipMeta]
