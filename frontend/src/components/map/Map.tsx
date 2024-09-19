import { LatLngExpression } from "leaflet";
import { forwardRef, useImperativeHandle } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { GeoJSON } from "../../domain/interfaces/geo";
import MapPolygon from "./Polygon";
import Region from "./Region";

export interface IMap {
  geoJson: GeoJSON;
  center: LatLngExpression;
  zoom: number;
}

export interface IMapRef {}

const Map = forwardRef<IMapRef, IMap>((props, ref) => {
  useImperativeHandle(ref, () => ({
    open: open,
  }));

  const arr2 = Array.from({ length: 30 }, (_, i) => i);

  return (
    <MapContainer
      center={props.center}
      zoom={props.zoom}
      scrollWheelZoom={false}
      className="h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapPolygon
        geometries={[props.geoJson.features[0].geometry]}
        options={{
          fillColor: "#5c6ac4",
          color: "#5c6ac4",
          fillOpacity: 0.08,
          weight: 2,
          dashArray: [],
        }}
      />

      {arr2.map((r) => {
        return <Region index={r + 1} key={`region_${r}`} />;
      })}
    </MapContainer>
  );
});

export default Map;
