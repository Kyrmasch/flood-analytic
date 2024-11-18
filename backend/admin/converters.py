import asyncio
from json import JSONDecodeError
from typing import Dict, List, Optional, Sequence
from fastapi.datastructures import FormData
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
from infrastructure.dto.geo_json_dto import GeoJsonDto
from infrastructure.geo import GeoManager
from infrastructure.database import SessionLocal
import json
from geoalchemy2.shape import to_shape, from_shape
from shapely.geometry import shape

geo = GeoManager()
db = SessionLocal()


@dataclass
class GeomField(BaseField):
    height: str = "20em"
    modes: Optional[Sequence[str]] = None
    render_function_key: str = "json"
    form_template: str = "forms/json.html"
    display_template: str = "details/geom.html"

    def __post_init__(self) -> None:
        if self.modes is None:
            self.modes = ["view"] if self.read_only else ["tree", "code"]
        super().__post_init__()

    async def parse_form_data(
        self, request: Request, form_data: FormData, action: RequestAction
    ) -> Optional[Dict[str, Any]]:
        try:
            value = form_data.get(self.id)
            geo_json = json.loads(value) if value is not None else None
            if geo_json is not None:
                for feature in geo_json["features"]:
                    geom = shape(feature["geometry"])
                    geom_geoalchemy = from_shape(geom, srid=4326)
                    return geom_geoalchemy
            return None
        except JSONDecodeError:
            return None

    def additional_css_links(
        self, request: Request, action: RequestAction
    ) -> List[str]:
        if action.is_form():
            return [
                str(
                    request.url_for(
                        f"{request.app.state.ROUTE_NAME}:statics",
                        path="css/jsoneditor.min.css",
                    )
                )
            ]
        return []

    def additional_js_links(self, request: Request, action: RequestAction) -> List[str]:
        if action.is_form():
            return [
                str(
                    request.url_for(
                        f"{request.app.state.ROUTE_NAME}:statics",
                        path="js/vendor/jsoneditor.min.js",
                    )
                )
            ]
        return []

    async def serialize_value(
        self,
        request: Request,
        value: Any,
        action: RequestAction,
    ) -> Any:
        result = None
        if value is not None:
            try:
                geom_wkt = db.scalar(value.ST_AsText())
                polygon = geo.polygon_from_wkt(geom_wkt)
                result = await asyncio.create_task(
                    geo.create_geojson(
                        GeoJsonDto(
                            id,
                            "",
                            "",
                            polygon,
                            polygon.centroid,
                        )
                    )
                )
            except Exception as e:
                pass
        return result


class FloodAnalyticConverter(ModelConverter):
    @converts("geoalchemy2.types.Geometry")
    def conv_currency(self, *args: Any, **kwargs: Any) -> BaseField:
        return GeomField(
            **self._field_common(*args, **kwargs),
        )
