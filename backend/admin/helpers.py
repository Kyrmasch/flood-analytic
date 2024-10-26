def remove_meta(data):
    """Рекурсивно удаляет поле '_meta' из словарей и списков."""
    if isinstance(data, dict):
        data.pop("_meta", None)
        for key, value in data.items():
            data[key] = remove_meta(value)
    elif isinstance(data, list):
        data = [remove_meta(item) for item in data]
    return data
