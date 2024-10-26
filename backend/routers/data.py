from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy import select
from deps import get_db
from schemas.data import PaginatedResponse, TableRow
from sqlalchemy.orm import Session
from usecases.metadata.get_meta import get_model_by_tablename
from geoalchemy2.elements import WKBElement
from sqlalchemy import func
from sqlalchemy.orm import joinedload

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

    def row_to_dict(row, visited=None):
        if visited is None:
            visited = set()

        if id(row) in visited:
            return None

        visited.add(id(row))

        data = {}
        for c in row.__table__.columns:
            value = getattr(row, c.name)
            data[c.name] = wkb_to_geojson(value)

        for relationship in row.__mapper__.relationships:
            related_data = getattr(row, relationship.key)
            if related_data is not None and not isinstance(related_data, list):
                data[relationship.key] = row_to_dict(related_data, visited)
        return data

    def wkb_to_geojson(wkb):
        if isinstance(wkb, WKBElement):
            return "GEOMETRY"
        return wkb

    model = get_model_by_tablename(tablename)

    if not model:
        raise HTTPException(status_code=404, detail="Модель не найдена")

    query = select(model).options(joinedload("*")).limit(limit).offset(offset)
    result = db.execute(query)
    rows = result.unique().scalars().all()

    count_query = select(func.count()).select_from(model)
    total_count = db.execute(count_query).scalar()

    data = [row_to_dict(row) for row in rows]

    return PaginatedResponse(
        data=[TableRow(data=row) for row in data],
        limit=limit,
        offset=offset,
        count=total_count,
    )
