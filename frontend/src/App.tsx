import { useEffect, useState } from "react";
import "./App.scss";
import { useWebSocket } from "./domain/contexts/WebSocketContext";
import Header from "./components/header";
import Sidebar from "./components/Sidebar";
import { useGetDistrictQuery } from "./domain/store/api/geo";
import Map from "./components/map/leaflet/Map";
import { LatLng } from "leaflet";
import { LngLatLike } from "mapbox-gl";
import "leaflet/dist/leaflet.css";
import { MapEnum } from "./domain/contexts/enums/MapEnum";
import MapBox from "./components/map/mapbox/Map";

function App() {
  const [mapType, _] = useState<MapEnum>(MapEnum.Leaflet);
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
    <div className="flex flex-col h-screen justify-between">
      <Header />
      <Sidebar />
      <main className="p-4 md:ml-64 h-auto pt-[7rem] min-h-screen">
        {geo && (
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
        )}
      </main>
    </div>
  );
}

export default App;
