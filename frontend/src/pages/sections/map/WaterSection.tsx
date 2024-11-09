import React from "react";
import { LngLatLike, Map } from "mapbox-gl";
import "leaflet/dist/leaflet.css";
import { ISection } from "./ISection";
import MapBox from "../../../components/map/mapbox/Map";
import { addPolygon } from "../../../components/map/mapbox/Polygon";

const WaterSection: React.FC<ISection> = (props) => {
  const addLayer = (_map: Map) => {
    if (_map) {
      addPolygon("district", {
        map: _map!,
        geometries: [props.geo.features[0].geometry],
        options: {
          fillColor: "white",
          color: "yellow",
          fillOpacity: 0.08,
          weight: 2,
          dashArray: [],
        },
        properties: props.geo.features[0].properties,
      });

      _map.addSource("water", {
        type: "vector",
        url: "mapbox://kyrmasch.1m3pfp0t",
      });

      _map.addLayer({
        id: "water",
        type: "fill",
        source: "water",
        "source-layer": "water",
        paint: {
          "fill-color": "#0077ff",
          "fill-opacity": 0.6,
        },
      });
    }
  };

  return (
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
  );
};

export default WaterSection;
