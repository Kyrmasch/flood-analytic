import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import { WebSocketProvider } from "./domain/contexts/WebSocketContext.tsx";
import { Provider } from "react-redux";
import { store } from "./domain/store/store.ts";
import { RouterProvider } from "react-router-dom";
import router from "./routes.tsx";
import ErrorBoundary from "./domain/layouts/ErrorBoundary.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <WebSocketProvider>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </WebSocketProvider>
    </Provider>
  </StrictMode>
);
