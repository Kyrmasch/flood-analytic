import { useEffect } from "react";
import "./App.scss";
import { useWebSocket } from "./domain/contexts/WebSocketContext";
import Header from "./components/header";
import Sidebar from "./components/Sidebar";
import { useGetDistrictQuery } from "./domain/store/api/geo";
import Map from "./components/map/Map";
import { LatLng } from "leaflet";

import "leaflet/dist/leaflet.css";

function App() {
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
      </main>
    </div>
  );
}

export default App;
