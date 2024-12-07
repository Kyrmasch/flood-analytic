import React from "react";
import { LngLatLike, Map, Popup } from "mapbox-gl";
import "leaflet/dist/leaflet.css";
import { ISection } from "./ISection";
import MapBox from "../../../components/map/mapbox/Map";
import { useGetMeteoStantionsQuery } from "../../../domain/store/api/geo";
import { addPolygon } from "../../../components/map/mapbox/Polygon";
import { convertPointsToCircles } from "../../../components/map/utils";
import { FeatureCollection, Point } from "geojson";

const MeteoStantionsSection: React.FC<ISection> = (props) => {
  const { data: stantions } = useGetMeteoStantionsQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  const poput = new Popup({ closeOnClick: false });

  const animateCircles = (
    _map: mapboxgl.Map,
    geojson: FeatureCollection<Point>
  ) => {
    let t = 0;
    const minHeight = 90; // Минимальная высота
    const maxHeight = 100; // Максимальная высота
    const range = maxHeight - minHeight; // Разница между максимумом и минимумом

    const animate = () => {
      t += 0.02;

      geojson.features.forEach((feature) => {
        const height = minHeight + ((Math.sin(t) + 1) / 2) * range;
        feature.properties!.height = height;
      });

      (
        _map.getSource("meteo-stations-circles") as mapboxgl.GeoJSONSource
      ).setData(geojson);

      requestAnimationFrame(animate);
    };

    animate();
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
        data: stantions as GeoJSON.GeoJSON,
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

      const circleStations: FeatureCollection =
        convertPointsToCircles(stantions);

      if (!_map.getSource("meteo-stations-circles")) {
        _map.addSource("meteo-stations-circles", {
          type: "geojson",
          data: circleStations as GeoJSON.GeoJSON,
        });
      }

      _map.addLayer({
        id: "meteo-stations-cylinders",
        type: "fill-extrusion",
        source: "meteo-stations-circles",
        paint: {
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-color": "#00aaff",
          "fill-extrusion-opacity": 1,
        },
      });

      animateCircles(_map, circleStations as FeatureCollection<any>);
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
