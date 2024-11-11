import { useEffect, useState } from "react";
import { useWebSocket } from "../domain/contexts/WebSocketContext";
import { useGetDistrictQuery } from "../domain/store/api/geo";
import "leaflet/dist/leaflet.css";
import Container from "../components/Container";
import MapHeader from "../components/headers/Map";
import { MapSectionEnum } from "../domain/contexts/enums/MapSectionEnum";
import WaterSection from "./sections/map/WaterSection";
import RegionsSection from "./sections/map/RegionsSection";
import MeteoStantionsSection from "./sections/map/MeteoStantionsSection";

function MapPage() {
  const [section, setSection] = useState<MapSectionEnum | string>(
    MapSectionEnum.Regions
  );

  const { setMessageHandler } = useWebSocket();
  const { data: geo } = useGetDistrictQuery(
    { index: 1 },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    setMessageHandler((message) => {
      if (message) {
      }
    });
  }, [setMessageHandler]);

  return (
    <Container
      header={<MapHeader OnSelect={setSection} />}
      main={
        geo && (
          <>
            {section == MapSectionEnum.Regions && <RegionsSection geo={geo} />}
            {section == MapSectionEnum.Waters && <WaterSection geo={geo} />}
            {section == MapSectionEnum.Meteo && (
              <MeteoStantionsSection geo={geo} />
            )}
          </>
        )
      }
    ></Container>
  );
}

export default MapPage;
