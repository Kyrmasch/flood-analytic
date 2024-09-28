from infrastructure.database import Base


def get_model_by_tablename(tablename):
    for mapper in Base.registry.mappers:
        cls = mapper.class_
        if cls.__tablename__ == tablename:
            return cls
    return None
