from fastapi import APIRouter, Depends, HTTPException
from deps import get_current_user, get_db
from schemas.auth import User as UserSchema
from schemas.meta import ColumnMeta, RelationshipMeta, TableItem, TableMeta
from sqlalchemy.orm import Session
from sqlalchemy.inspection import inspect
from infrastructure.database import Base
from usecases.metadata.get_meta import get_model_by_tablename
from sqlalchemy.ext.declarative import DeclarativeMeta
from infrastructure.database import Base

meta_router = APIRouter()


@meta_router.get("/model/{tablename}", response_model=TableMeta)
async def get_meta_model(
    tablename: str,
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    model = get_model_by_tablename(tablename)

    if model:
        inspector = inspect(model)
        metadata = TableMeta(
            table_name=inspector.local_table.name,
            columns=[
                ColumnMeta(name=column.name, type=str(column.type))
                for column in inspector.columns
            ],
            relationships=[
                RelationshipMeta(
                    relation=relationship.key,
                    related_model=relationship.mapper.entity.__name__,
                    foreign_keys=[fk.name for fk in relationship.local_columns],
                )
                for relationship in inspector.relationships.values()
            ],
        )
        return metadata
    else:
        raise HTTPException(status_code=404, detail="Модель не найдена")


@meta_router.get("/tables")
async def get_tables(
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    list = []
    for cls in Base.registry._class_registry.values():
        if isinstance(cls, DeclarativeMeta):
            table_name = getattr(cls, "__tablename__", None)
            description = getattr(cls, "__description__", None)
            if description:
                meta = TableItem()
                meta.name = table_name
                meta.description = description
                list.append(meta)

    return list
