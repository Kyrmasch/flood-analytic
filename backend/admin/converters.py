from typing import Optional
from starlette_admin.contrib.sqla.converters import ModelConverter
from dataclasses import dataclass
from typing import Any

from requests import Request
from starlette_admin import BaseField, RequestAction

from typing import Any, Optional

from starlette_admin.converters import converts
from starlette_admin.fields import (
    BaseField,
)


@dataclass
class GeomField(BaseField):
    maxlength: Optional[int] = None
    minlength: Optional[int] = None
    search_builder_type: Optional[str] = "string"
    input_type: str = "text"
    class_: str = "field-string form-control"
    placeholder: Optional[str] = None

    async def serialize_value(
        self, request: Request, value: Any, action: RequestAction
    ) -> Any:
        return str("GEOMETRY")


class FloodAmaliticConverter(ModelConverter):
    @converts("geoalchemy2.types.Geometry")
    def conv_currency(self, *args: Any, **kwargs: Any) -> BaseField:
        return GeomField(
            **self._field_common(*args, **kwargs),
        )
