import "./App.scss";
import "leaflet/dist/leaflet.css";
import Container from "./components/Container";

function App() {
  return (
    <div className="flex flex-col h-screen justify-between pt-[3rem]">
      <Container header={<></>} main={<></>}></Container>
    </div>
  );
}

export default App;
