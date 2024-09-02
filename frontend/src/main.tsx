import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { WebSocketProvider } from "./domain/contexts/WebSocketContext.tsx";
import { Provider } from "react-redux";
import { store } from "./domain/store/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <WebSocketProvider>
        <App />
      </WebSocketProvider>
    </Provider>
  </StrictMode>
);
