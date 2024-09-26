import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { GeoJSON } from "../../../domain/interfaces/geo";
import mapboxgl, { LngLatLike, Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { addPolygon } from "./Polygon";
import { addControls } from "./Controls";
export interface IMapBox {
  geoJson: GeoJSON;
  center: LngLatLike;
  zoom: number;
}

export interface IMapBoxRef {}

const MapBox = forwardRef<IMapBoxRef, IMapBox>((props, ref) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useRef<null | Map>(null);

  useImperativeHandle(ref, () => ({
    open: open,
  }));

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoia3lybWFzY2giLCJhIjoiY20xYWZwZHdxMWpzMzJrcXg3dWVoMjVnNCJ9.e_7AlYQyB0APm12_-ew4MA";

    if (mapContainerRef.current) {
      map.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        zoom: props.zoom,
        center: props.center,
        pitch: 0,
        bearing: 41,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
      });

      addControls({
        map: map.current,
        navigation: true,
        geolocate: true,
        fullscreen: true,
        scale: true,
      });

      map.current.on("load", function () {
        map.current?.addSource("water", {
          type: "vector",
          url: "mapbox://kyrmasch.1m3pfp0t",
        });

        map.current?.addLayer({
          id: "water",
          type: "fill",
          source: "water",
          "source-layer": "water",
          paint: {
            "fill-color": "#0077ff",
            "fill-opacity": 0.6,
          },
        });
      });

      map.current.on("style.load", () => {
        map.current?.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });

        addPolygon("district", {
          map: map.current!,
          geometries: [props.geoJson.features[0].geometry],
          options: {},
          properties: props.geoJson.features[0].properties,
        });

        map.current?.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

        const layers = map.current?.getStyle();
        layers?.layers.forEach(function (layer) {
          if (layer) {
          }
        });
      });

      return () => map.current?.remove();
    }
  }, []);

  return <div ref={mapContainerRef} className="h-full" />;
});

export default MapBox;
