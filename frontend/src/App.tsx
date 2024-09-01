import { useEffect } from "react";
import "./App.scss";
import { useWebSocket } from "./domain/contexts/WebSocketContext";

function App() {
  const { setMessageHandler } = useWebSocket();

  useEffect(() => {
    setMessageHandler((message) => {
      console.log(message);
    });
  }, [setMessageHandler]);

  return (
    <>
      <div className="text-gray-600">Flood</div>
      <div className="text-gray-400">Analitic</div>
    </>
  );
}

export default App;
