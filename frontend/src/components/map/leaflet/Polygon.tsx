import React, { forwardRef, useImperativeHandle } from "react";
import { Polygon, Popup } from "react-leaflet";
import { Geometry, Properties } from "../../../domain/interfaces/geo";
import { LatLngExpression, PathOptions } from "leaflet";

export interface IPolygon {
  geometries: Geometry[];
  properties?: Properties | undefined;
  options: PathOptions | undefined;
}

export interface IPolygonRef {}

const MapPolygon = forwardRef<IPolygonRef, IPolygon>((props, ref) => {
  const items = React.useMemo(() => {
    let arr = props.geometries.map((polygon) => {
      return polygon.coordinates[0].map((coord) => [coord[1], coord[0]]);
    }) as LatLngExpression[][];

    return arr;
  }, [props.geometries]);

  useImperativeHandle(ref, () => ({}));

  return (
    <>
      <Polygon
        key={`polygon_${0}`}
        pathOptions={props.options}
        positions={items}
      >
        {props.properties && (
          <Popup>
            <div>
              <strong>{props.properties.name}</strong>
              <br />
              KATO: {props.properties.kato}
              <br />
              Координаты: [{props.properties.x}, {props.properties.y}]
            </div>
          </Popup>
        )}
      </Polygon>
    </>
  );
});

export default MapPolygon;
