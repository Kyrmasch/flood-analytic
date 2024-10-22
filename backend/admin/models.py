from starlette_admin.contrib.sqla import ModelView

from models.region import Region


class DistrictView(ModelView):
    label = "Область"
    label_plural = "Области"
    sortable_field = ["id", "name"]


class RegionView(ModelView):
    label = "Регион"
    label_plural = "Регионы"
    sortable_field = ["id", "kato", "name_ru"]
