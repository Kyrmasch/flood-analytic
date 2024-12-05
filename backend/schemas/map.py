from pydantic import BaseModel
from typing import List


class GeoJSONData(BaseModel):
    type: str
    features: List[dict]

    class Config:
        orm_mode = True
