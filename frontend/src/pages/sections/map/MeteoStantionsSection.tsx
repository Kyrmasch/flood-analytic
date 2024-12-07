import React from "react";
import { LngLatLike, Map, Popup } from "mapbox-gl";
import "leaflet/dist/leaflet.css";
import { ISection } from "./ISection";
import MapBox from "../../../components/map/mapbox/Map";
import { useGetMeteoStantionsQuery } from "../../../domain/store/api/geo";
import { addPolygon } from "../../../components/map/mapbox/Polygon";

const MeteoStantionsSection: React.FC<ISection> = (props) => {
  const { data: stantions } = useGetMeteoStantionsQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  const poput = new Popup({ closeOnClick: false });

  const convertPointsToPolygons = (geojson: any) => {
    return {
      ...geojson,
      features: geojson.features.map((feature: any) => {
        const [lng, lat] = feature.geometry.coordinates;
        const size = 0.0001; // Размер полигона
        return {
          ...feature,
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [lng - size, lat - size],
                [lng + size, lat - size],
                [lng + size, lat + size],
                [lng - size, lat + size],
                [lng - size, lat - size],
              ],
            ],
          },
        };
      }),
    };
  };

  const addLayer = (_map: Map) => {
    addPolygon("district", {
      map: _map!,
      geometries: [props.geo.features[0].geometry],
      options: undefined,
      properties: props.geo.features[0].properties,
    });

    if (stantions && poput) {
      _map.addSource("meteo-stations", {
        type: "geojson",
        data: stantions as any,
      });

      _map.addLayer({
        id: "meteo-stations-layer",
        type: "circle",
        source: "meteo-stations",
        paint: {
          "circle-radius": 6,
          "circle-color": "#007cbf",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      const polygonStations = convertPointsToPolygons(stantions);
      if (!_map.getSource("meteo-stations-polygons")) {
        _map.addSource("meteo-stations-polygons", {
          type: "geojson",
          data: polygonStations as any,
        });
      }

      _map.addLayer({
        id: "meteo-stations-bars",
        type: "fill-extrusion",
        source: "meteo-stations-polygons",
        paint: {
          "fill-extrusion-height": 200,
          "fill-extrusion-color": "#00aaff",
          "fill-extrusion-opacity": 1,
        },
      });
    }
  };

  return (
    <>
      {stantions && (
        <MapBox
          geoJson={props.geo}
          center={
            [
              props.geo.features[0].properties.x,
              props.geo.features[0].properties.y,
            ] as LngLatLike
          }
          zoom={6.8}
          addLayer={addLayer}
        />
      )}
    </>
  );
};

export default MeteoStantionsSection;
