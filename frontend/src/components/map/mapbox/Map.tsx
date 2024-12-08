import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { GeoJSON } from "../../../domain/interfaces/geo";
import mapboxgl, { LngLatLike, Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { addControls } from "./Controls";

export interface IMapBox {
  geoJson: GeoJSON;
  center: LngLatLike;
  zoom: number;
  addLayer?: (map: Map) => void;
  addStyle?: (map: Map) => void;
}

export interface IMapBoxRef {
  getMap: () => Map | null;
}

const MapBox = forwardRef<IMapBoxRef, IMapBox>((props, ref) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useRef<null | Map>(null);

  useImperativeHandle(ref, () => ({
    getMap: () => map.current,
  }));

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoia3lybWFzY2giLCJhIjoiY20xYWZwZHdxMWpzMzJrcXg3dWVoMjVnNCJ9.e_7AlYQyB0APm12_-ew4MA";

    if (mapContainerRef.current) {
      map.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        refreshExpiredTiles: false,
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
        if (props.addLayer) {
          props.addLayer(map.current!);
        }
      });

      map.current.on("style.load", () => {
        map.current?.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });

        if (props.addStyle) {
          props.addStyle(map.current!);
        }

        map.current?.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

        const layers = map.current?.getStyle();
        layers?.layers.forEach(function (layer) {
          if (layer) {
          }
        });
      });

      map.current.on("error", (e) => {
        console.error("Mapbox Error:", e.error);
      });

      return () => map.current?.remove();
    }
  }, []);

  return <div ref={mapContainerRef} className="min-h-0 w-full  bg-gray-100" />;
});

export default MapBox;
