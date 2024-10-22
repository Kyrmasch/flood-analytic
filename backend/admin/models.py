from starlette_admin.contrib.sqla import ModelView

from models.district import District
from models.region import Region


class DistrictView(ModelView):
    label = "Область"
    label_plural = "Области"
    sortable_field = [District.id, District.name]
    exclude_fields_from_list = [District.regions]


class RegionView(ModelView):
    label = "Регион"
    label_plural = "Регионы"
    sortable_field = ["id", "kato", "name_ru"]
