import { useEffect, useState } from "react";
import { useWebSocket } from "../domain/contexts/WebSocketContext";
import { useGetDistrictQuery } from "../domain/store/api/geo";
import Map from "../components/map/leaflet/Map";
import { LatLng } from "leaflet";
import { LngLatLike } from "mapbox-gl";
import "leaflet/dist/leaflet.css";
import { MapEnum } from "../domain/contexts/enums/MapEnum";
import MapBox from "../components/map/mapbox/Map";
import Container from "../components/Container";
import MapHeader from "../components/headers/Map";

function MapPage() {
  const [mapType, _] = useState<MapEnum>(MapEnum.MapBox);
  const { setMessageHandler } = useWebSocket();
  const { data: geo } = useGetDistrictQuery(
    { index: 1 },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    setMessageHandler((message) => {
      console.log(message);
    });
  }, [setMessageHandler]);

  return (
    <div className="flex flex-col h-screen justify-between pt-[3.5rem]">
      <Container
        header={<MapHeader />}
        main={
          geo && (
            <>
              {mapType == MapEnum.Leaflet && (
                <Map
                  center={
                    new LatLng(
                      geo.features[0].properties.y,
                      geo.features[0].properties.x
                    )
                  }
                  geoJson={geo}
                  zoom={7}
                />
              )}
              {mapType == MapEnum.MapBox && (
                <MapBox
                  geoJson={geo}
                  center={
                    [
                      geo.features[0].properties.x,
                      geo.features[0].properties.y,
                    ] as LngLatLike
                  }
                  zoom={6.8}
                />
              )}
            </>
          )
        }
      ></Container>
    </div>
  );
}

export default MapPage;
