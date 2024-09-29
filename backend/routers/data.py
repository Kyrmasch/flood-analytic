from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy import select
from deps import get_db
from schemas.data import PaginatedResponse, TableRow
from sqlalchemy.orm import Session
from usecases.metadata.get_meta import get_model_by_tablename
from geoalchemy2.elements import WKBElement
from sqlalchemy import func

data_router = APIRouter()


@data_router.get(
    "/{tablename}",
    response_model=PaginatedResponse,
)
async def get_table_data(
    tablename: str,
    limit: int = Query(10, ge=1),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):

    def row_to_dict(row):
        data = {}
        for c in row.__table__.columns:
            value = getattr(row, c.name)
            data[c.name] = wkb_to_geojson(value)
        return data

    def wkb_to_geojson(wkb):
        if isinstance(wkb, WKBElement):
            return "WKBElement"
        return wkb

    model = get_model_by_tablename(tablename)

    if not model:
        raise HTTPException(status_code=404, detail="Модель не найдена")

    count_query = select(func.count()).select_from(model)
    total_count = db.execute(count_query).scalar()

    query = select(model).limit(limit).offset(offset)
    result = db.execute(query)
    rows = result.scalars().all()

    data = [row_to_dict(row) for row in rows]

    return PaginatedResponse(
        data=[TableRow(data=row) for row in data],
        limit=limit,
        offset=offset,
        count=total_count,
    )
