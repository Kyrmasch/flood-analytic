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


def save_region_geojson(region: str):
    ## TBC
    # existing_record = mongo_collection.find_one({"features.0.properties.region": region})
    # if existing_record:
    #     existing_record["_id"] = str(existing_record["_id"])
    #     return {
    #         "message": f"Region '{region}' already exists in the database.",
    #         "status": "duplicate",
    #         "geojson": existing_record,
    #     }

    url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{region}.json"
    params = {"access_token": MAPBOX_TOKEN}
    response = requests.get(url, params=params)
    if response.status_code != 200:
        return {"message": "Failed to fetch data from Mapbox API", "status": "error"}

    data = response.json()
    if not data["features"]:
        return {
            "message": f"No features found for the specified region: {region}",
            "status": "error",
        }

    feature = data["features"][0]
    geometry = feature.get("geometry")

    if not geometry:
        return {"message": "Region does not have valid geometry", "status": "error"}

    coordinates = geometry["coordinates"]

    if geometry["type"] == "Point":
        lat, lon = coordinates[1], coordinates[0]
        buffer_size = 0.01
        coordinates = [
            [
                [lon - buffer_size, lat - buffer_size],
                [lon + buffer_size, lat - buffer_size],
                [lon + buffer_size, lat + buffer_size],
                [lon - buffer_size, lat + buffer_size],
                [lon - buffer_size, lat - buffer_size],
            ]
        ]
        geometry["type"] = "Polygon"

    # Prepare GeoJSON
    geojson_data = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": coordinates,
                },
                "properties": {
                    "region": region,
                },
            }
        ],
    }

    # Save GeoJSON to MongoDB
    ## TBC
    ## insert_result = mongo_collection.insert_one(geojson_data)

    # # Add the MongoDB ObjectId to the response as a string
    ## TBC
    # geojson_data["_id"] = str(insert_result.inserted_id)

    return {
        "message": f"Polygon for region '{region}' created and saved successfully.",
        "status": "success",
        "geojson": geojson_data,
    }
