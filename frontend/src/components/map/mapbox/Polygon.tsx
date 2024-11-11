import { Map } from "mapbox-gl";
import { Geometry, Properties } from "../../../domain/interfaces/geo";
import { PathOptions } from "leaflet";

export interface IBoxPolygon {
  map: Map;
  geometries: Geometry[];
  properties?: Properties | undefined;
  options: PathOptions | undefined;
  showPoput?: (m: Map) => void;
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
    id: `polygon-layer-${layer}`,
    type: "fill",
    source: layer,
    layout: {},
    paint: {
      "fill-color": props.options ? props.options.fillColor : "#5c6ac4",
      "fill-opacity": props.options ? props.options.fillOpacity : 0.08,
    },
  });

  props.map.addLayer({
    id: `polygon-outline-${layer}`,
    type: "line",
    source: layer,
    layout: {},
    paint: {
      "line-color": props.options ? props.options.color : "yellow",
      "line-width": props.options ? props.options.weight : 2,
    },
  });

  if (props.properties) {
    props.map.on("click", `polygon-layer-${layer}`, (event) => {
      const features = props.map.queryRenderedFeatures(event.point, {
        layers: [`polygon-layer-${layer}`],
      });

      if (!features.length) return;

      if (props.showPoput) props.showPoput(props.map);
    });
  }
};

export const deletePolygon = (layer: string, props: IBoxPolygon) => {
  if (props.map.getLayer(layer)) {
    props.map.removeLayer(layer);
  }
};
