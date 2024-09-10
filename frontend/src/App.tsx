import { useEffect } from "react";
import "./App.scss";
import { useWebSocket } from "./domain/contexts/WebSocketContext";
import Footer from "./components/footer";
import Header from "./components/header";
import Sidebar from "./components/Sidebar";

function App() {
  const { setMessageHandler } = useWebSocket();

  useEffect(() => {
    setMessageHandler((message) => {
      console.log(message);
    });
  }, [setMessageHandler]);

  return (
    <div className="flex flex-col h-screen justify-between">
      <Header />
      <Sidebar />
      <main></main>
      <Footer />
    </div>
  );
}

export default App;
