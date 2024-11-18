import requests
from fastapi import HTTPException
from fastapi.responses import StreamingResponse
from io import BytesIO


MAPBOX_BASE_URL = "https://api.mapbox.com"
MAPBOX_TOKEN = "pk.eyJ1Ijoic2h5bmFsc2h5biIsImEiOiJjbTNjY2h5amIxdW5oMmxyNmR5Y2hkdGZyIn0.e39zSiT8HVndV8ESu-25PQ"


def get_static_image(
    longitude: float, latitude: float, zoom: float, width: int, height: int
):
    url = (
        f"{MAPBOX_BASE_URL}/styles/v1/mapbox/satellite-v9/static/"
        f"{longitude},{latitude},{zoom}/{width}x{height}"
        f"?access_token={MAPBOX_TOKEN}"
    )
    response = requests.get(url)

    if response.status_code != 200:
        return HTTPException(
            status_code=response.status_code, detail="Error fetching MapBox image"
        )

    # содержание картинки в виде байтов для отправки
    image_stream = BytesIO(response.content)

    return StreamingResponse(image_stream, media_type="image/png")
