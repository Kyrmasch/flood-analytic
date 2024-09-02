import { useEffect } from "react";
import "./App.scss";
import { useWebSocket } from "./domain/contexts/WebSocketContext";
import { useGetCalcQuery } from "./domain/store/api/calc";

function App() {
  const { setMessageHandler } = useWebSocket();
  const calcApi = useGetCalcQuery(null, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    setMessageHandler((message) => {
      console.log(message);
    });
  }, [setMessageHandler]);

  return (
    <>
      <div className="text-gray-600">Flood</div>
      <div className="text-gray-400">Analitic</div>
      {calcApi.data && (
        <div className="text-gray-400">{calcApi.data.result.length}</div>
      )}
    </>
  );
}

export default App;
