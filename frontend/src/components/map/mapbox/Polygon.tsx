import { Map, Popup } from "mapbox-gl";
import { Geometry, Properties } from "../../../domain/interfaces/geo";

export interface IBoxPolygon {
  map: Map;
  geometries: Geometry[];
  properties?: Properties | undefined;
  options: any;
}

export const addPolygon = (layer: string, props: IBoxPolygon) => {
  if (!props.map) return;

  props.map.addSource(layer, {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: props.geometries[0].coordinates,
      },
      properties: {},
    },
  });

  props.map.addLayer({
    id: "polygon-layer",
    type: "fill",
    source: layer,
    layout: {},
    paint: {
      "fill-color": "#5c6ac4",
      "fill-opacity": 0.08,
    },
  });

  props.map.addLayer({
    id: "outline",
    type: "line",
    source: layer,
    layout: {},
    paint: {
      "line-color": "#5c6ac4",
      "line-width": 2,
    },
  });

  if (props.properties) {
    const poput = new Popup({ closeOnClick: false });
    poput
      .setLngLat([props.properties.x, props.properties.y])
      .setHTML(
        `<strong>${props.properties.name}</strong><br>KATO: ${props.properties.kato}<br>Координаты: [${props.properties.x}, ${props.properties.y}]`
      )
      .addTo(props.map);
  }
};

export const deletePolygon = (layer: string, props: IBoxPolygon) => {
  if (props.map.getLayer(layer)) {
    props.map.removeLayer(layer);
  }
};
