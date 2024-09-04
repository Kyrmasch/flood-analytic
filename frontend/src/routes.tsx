import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./routes/error-page";
import App from "./App";
import LoginPage from "./routes/login";
import ProtectedLayout from "./domain/layouts/ProtectedLayout";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        path: "",
        element: <App />,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

export default router;
