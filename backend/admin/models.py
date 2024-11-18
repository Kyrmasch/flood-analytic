from shapely import relate
from starlette_admin import (
    BaseField,
    DateTimeField,
    FloatField,
    HasMany,
    HasOne,
    IntegerField,
    RelationField,
)
from starlette_admin.contrib.sqla import ModelView
from starlette_admin import StringField

from admin.converters import GeomField
from models.district import District
from models.region import Region
from models.site import Site
from models.geoobject import GeoObject
from models.datavalue import DataValue


class DistrictView(ModelView):
    label = "Область"
    label_plural = "Области"
    sortable_field = [District.id, District.name]
    exclude_fields_from_list = [District.regions]
    fields = [
        IntegerField(name="id", label="ИД"),
        StringField(name="name", label="Наменование"),
    ]


class RegionView(ModelView):
    label = "Регион"
    label_plural = "Регионы"
    sortable_field = ["id", "kato", "name_ru"]
    fields = [
        IntegerField(name="id", label="ID"),
        StringField(name="kato", label="КАТО"),
        StringField(name="name_ru", label="Название (РУ)"),
        StringField(name="name_kz", label="Название (КЗ)"),
        HasOne(
            name="district",
            identity="district",
            label="Область",
            display_template="details/name.html",
        ),
        GeomField(name="geom", label="Геометрия"),
    ]
    exclude_fields_from_list = [Region.geom]


class GeoTypeView(ModelView):
    label = "Тип геообъекта"
    label_plural = "Типы геообъектов"
    fields = [
        IntegerField(name="id", label="ИД"),
        StringField(name="name", label="Наменование"),
        StringField(name="description", label="Описание"),
    ]
    sortable_field = ["name", "description"]


class DataTypeView(ModelView):
    fields = [
        IntegerField(name="id", label="ИД"),
        StringField(name="name", label="Название"),
        StringField(name="description", label="Описание"),
    ]
    label = "Тип данных"
    label_plural = "Типы данных"


class MethodTypeView(ModelView):
    fields = [
        IntegerField(name="id", label="ИД"),
        StringField(name="name", label="Название"),
        StringField(name="description", label="Описание"),
    ]
    label = "Тип метода"
    label_plural = "Типы методов"


class ValueTypeView(ModelView):
    fields = [
        IntegerField(name="id", label="ИД"),
        StringField(name="name", label="Полное название"),
        StringField(name="name_short", label="Краткое название"),
        StringField(name="description", label="Описание"),
    ]
    label = "Тип значения"
    label_plural = "Типы значений"


class VariableTypeView(ModelView):
    fields = [
        IntegerField(name="id", label="ИД"),
        StringField(name="name", label="Название"),
        StringField(name="description", label="Описание"),
    ]
    label = "Тип переменной"
    label_plural = "Типы переменных"


class SiteTypeView(ModelView):
    fields = [
        IntegerField(name="id", label="ИД"),
        StringField(name="name", label="Название"),
    ]
    label = "Тип сайта"
    label_plural = "Типы сайтов"


class DateTypeView(ModelView):
    fields = [
        IntegerField(name="id", label="ИД"),
        StringField(name="name", label="Название"),
        StringField(name="description", label="Описание"),
    ]
    label = "Тип даты"
    label_plural = "Типы дат"


class OffsetTypeView(ModelView):
    label = "Тип смещения"
    label_plural = "Типы смещений"
    fields = [
        IntegerField(name="id", label="ID"),
        StringField(name="name", label="Название"),
        StringField(name="description", label="Описание"),
        HasOne(name="unit", identity="unit", label="Единица измерения"),
    ]


class CodeFormView(ModelView):
    label = "Форма кода"
    label_plural = "Формы кода"
    fields = [
        IntegerField(name="id", label="ID"),
        StringField(name="name", label="Название"),
    ]


class UnitView(ModelView):
    fields = [
        IntegerField(name="id", label="ИД"),
        StringField(name="name", label="Название"),
        StringField(name="abbr", label="Сокращение"),
        StringField(name="type", label="Тип"),
        FloatField(name="si_conversion", label="Конвертация в СИ"),
    ]
    label = "Единица измерения"
    label_plural = "Единицы измерения"


class MethodView(ModelView):
    fields = [
        IntegerField(name="id", label="ИД"),
        StringField(name="name", label="Название"),
        StringField(name="description", label="Описание"),
        IntegerField(name="parent_id", label="ID родительского метода"),
        HasOne("method_type", identity="method_type", label="Тип метода"),
    ]
    label = "Метод"
    label_plural = "Методы"


class QCLView(ModelView):
    label = "QCL"
    label_plural = "QCLs"
    fields = [
        IntegerField(name="id", label="ID"),
        IntegerField(name="qc_flag", label="Флаг QC"),
        StringField(name="name", label="Название"),
    ]


class SampleMediumView(ModelView):
    fields = [
        IntegerField(name="id", label="ИД"),
        StringField(name="name", label="Название"),
        StringField(name="description", label="Описание"),
    ]
    label = "Среда образца"
    label_plural = "Среды образцов"


class CategoryView(ModelView):
    fields = [
        IntegerField(name="id", label="ИД"),
        StringField(name="name", label="Название"),
        StringField(name="description", label="Описание"),
    ]
    label = "Категория"
    label_plural = "Категории"


class VariableView(ModelView):
    fields = [
        IntegerField(name="id", label="ИД"),
        HasOne(
            name="variable_type",
            identity="varialbe_type",
            label="Тип переменной",
            render_function_key="relation_name",
            display_template="details/name.html",
        ),
        HasOne(
            name="time",
            identity="time",
            label="Время",
            render_function_key="relation_name",
            display_template="details/name.html",
        ),
        HasOne(
            name="unit",
            identity="unit",
            label="Единица измерения",
            render_function_key="relation_name",
            display_template="details/name.html",
        ),
        HasOne(
            name="data_type",
            identity="data_type",
            label="Тип данных",
            render_function_key="relation_name",
            display_template="details/name.html",
        ),
        HasOne(
            name="general_category",
            identity="general_category",
            label="Категория",
            render_function_key="relation_name",
            display_template="details/name.html",
        ),
        HasOne(
            name="sample_medium",
            identity="sample_medium",
            label="Среда образца",
            render_function_key="relation_name",
            display_template="details/name.html",
        ),
        FloatField(name="time_support", label="Поддержка времени"),
        StringField(name="name", label="Название"),
    ]
    label = "Переменная"
    label_plural = "Переменные"


class TimeView(ModelView):
    fields = [
        IntegerField(name="id", label="ИД"),
        StringField(name="name", label="Название"),
        StringField(name="abbr", label="Сокращение"),
        FloatField(name="si_conversion", label="Конвертация в СИ"),
    ]
    label = "Время"
    label_plural = "Времена"


class MeteoZoneView(ModelView):
    label = "Метео зона"
    label_plural = "Метео зоны"
    fields = [
        IntegerField(name="id", label="ID"),
        StringField(name="name", label="Название"),
        IntegerField(name="hour_meteoday_start", label="Час начала метеодня"),
        IntegerField(name="first_s_hour", label="Первый час"),
        IntegerField(name="hour_suff", label="Час суффикса"),
        IntegerField(name="hour_rr", label="Час для расчёта"),
    ]


class DataSourceView(ModelView):
    label = "Источник данных"
    label_plural = "Источники данных"
    fields = [
        IntegerField(name="id", label="ID"),
        HasOne(name="site", identity="site", label="Сайт"),
        HasOne(name="code_form", identity="code_form", label="Форма кода"),
        DateTimeField(name="date_utc", label="Дата (UTC)"),
        DateTimeField(name="date_utc_receive", label="Дата получения (UTC)"),
        DateTimeField(name="date_insert", label="Дата вставки"),
        StringField(name="value", label="Значение"),
        StringField(name="hash", label="Хэш"),
    ]


class GeoObjectView(ModelView):
    label = "Геообъект"
    label_plural = "Геообъекты"
    fields = [
        IntegerField(name="id", label="ID"),
        HasOne(name="geo_type", identity="geo_type", label="Тип геообъекта"),
        StringField(name="name", label="Название"),
        StringField(name="description", label="Описание"),
        GeomField(name="shape", label="Геометрия"),
        StringField(name="tags", label="Теги"),
    ]
    exclude_fields_from_list = [GeoObject.shape]


class SiteView(ModelView):
    label = "Локация"
    label_plural = "Локации"
    fields = [
        IntegerField(name="id", label="ID"),
        StringField(name="code", label="Код"),
        StringField(name="name", label="Название"),
        HasOne(
            name="site_type",
            identity="site_type",
            label="Тип сайта",
            render_function_key="relation_name",
            display_template="details/name.html",
        ),
        HasOne(
            name="meteo_zone",
            identity="meteo_zone",
            label="Метеозона",
            render_function_key="relation_name",
            display_template="details/name.html",
        ),
        IntegerField(name="owner_id", label="ID владельца"),
        IntegerField(name="addr_id", label="ID адреса"),
        StringField(name="description", label="Описание"),
        IntegerField(name="parent_id", label="ID родительского сайта"),
        StringField(name="name_lat", label="Название латиницей"),
        FloatField(name="lat", label="Широта"),
        FloatField(name="lon", label="Долгота"),
        GeomField(name="geom_lation", label="Геометрия"),
    ]
    exclude_fields_from_list = [
        Site.geom_lation,
        Site.owner_id,
        Site.parent_id,
    ]


class CatalogView(ModelView):
    label = "Каталог"
    label_plural = "Каталоги"
    fields = [
        IntegerField(name="id", label="ID"),
        HasOne(
            name="site",
            identity="site",
            label="Сайт",
            render_function_key="relation_name",
            display_template="details/code.html",
        ),
        HasOne(
            name="variable",
            identity="variable",
            label="Переменная",
            render_function_key="relation_name",
            display_template="details/name.html",
        ),
        HasOne(
            name="method",
            identity="method",
            label="Метод",
            render_function_key="relation_name",
            display_template="details/name.html",
        ),
        HasOne(name="source", identity="data_source", label="Источник"),
        HasOne(name="offset_type", identity="offset_type", label="Тип смещения"),
        HasOne(name="value_type", identity="value_type", label="Тип значения"),
        IntegerField(name="offset_type_id_add", label="Дополнительный тип смещения"),
        IntegerField(name="db_list_id", label="ID списка БД"),
    ]


class DataValueView(ModelView):
    label = "Значение данных"
    label_plural = "Значения данных"
    fields = [
        IntegerField(name="id", label="ID"),
        DateTimeField(name="date_loc", label="Дата и время (локальное)"),
        DateTimeField(name="date_utc", label="Дата и время (UTC)"),
        FloatField(name="value", label="Значение"),
        HasOne(
            name="catalog",
            identity="catalog",
            label="Каталог",
        ),
        FloatField(name="offset_value", label="Смещение (значение)"),
        FloatField(name="offset_value_add", label="Дополнительное смещение (значение)"),
        HasOne(
            name="qcl_rel",
            identity="qcl",
            label="QCL",
            render_function_key="relation_name",
            display_template="details/name.html",
        ),
        HasOne(
            name="date_type",
            identity="date_type",
            label="Тип даты",
            render_function_key="relation_name",
            display_template="details/name.html",
        ),
    ]

    exclude_fields_from_list = [
        DataValue.offset_value_add,
    ]
    page_size = 50
    page_size_options = [50, 100, 150, 200]
