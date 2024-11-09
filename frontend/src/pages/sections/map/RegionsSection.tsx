import React from "react";
import { LngLatLike, Map, Popup } from "mapbox-gl";
import "leaflet/dist/leaflet.css";
import { ISection } from "./ISection";
import MapBox from "../../../components/map/mapbox/Map";
import { useGetRegionsByDistrictQuery } from "../../../domain/store/api/geo";
import { addPolygon } from "../../../components/map/mapbox/Polygon";

const RegionsSection: React.FC<ISection> = (props) => {
  const { data: regions } = useGetRegionsByDistrictQuery(
    { district_id: 1 },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const poput = new Popup({ closeOnClick: false });

  const addLayer = (_map: Map) => {
    addPolygon("district", {
      map: _map!,
      geometries: [props.geo.features[0].geometry],
      options: undefined,
      properties: props.geo.features[0].properties,
    });

    if (regions) {
      regions.forEach((element, index) => {
        addPolygon(`region-${index}`, {
          map: _map,
          geometries: [element.features[0].geometry],
          options: {
            fillColor: "white",
            color: "white",
            fillOpacity: 0.08,
            weight: 1,
            dashArray: [],
          },
          properties: element.features[0].properties,
          showPoput: (m: Map) => {
            const p = element.features[0].properties;
            poput.remove();
            poput
              .setLngLat([p!.x, p!.y])
              .setHTML(
                `<strong>${p!.name}</strong><br>KATO: ${
                  p!.kato
                }<br>Координаты: [${p!.x.toFixed(4)}, ${p!.y.toFixed(4)}]`
              )
              .addTo(m);
          },
        });
      });
    }
  };

  return (
    <>
      {regions && (
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

export default RegionsSection;
