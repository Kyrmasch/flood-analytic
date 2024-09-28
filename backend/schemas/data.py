from pydantic import BaseModel
from typing import List, Any


class TableRow(BaseModel):
    data: dict

    class Config:
        orm_mode = True


class PaginatedResponse(BaseModel):
    data: List[TableRow]
    limit: int
    offset: int
    count: int

    class Config:
        orm_mode = True
