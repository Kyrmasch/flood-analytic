from starlette_admin import BaseField
from starlette_admin.contrib.sqla import ModelView

from models.district import District


class DistrictView(ModelView):
    label = "Область"
    label_plural = "Области"
    sortable_field = [District.id, District.name]
    exclude_fields_from_list = [District.regions]
    fields = [
        BaseField(name="id", label="ИД"),
        BaseField(name="name", label="Наменование"),
    ]


class RegionView(ModelView):
    label = "Регион"
    label_plural = "Регионы"
    sortable_field = ["id", "kato", "name_ru"]
