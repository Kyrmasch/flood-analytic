import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./routes/error-page";
import App from "./App";
import LoginPage from "./routes/login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
]);

export default router;
