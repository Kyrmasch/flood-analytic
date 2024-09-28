import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./routes/error-page";
import LoginPage from "./routes/login";
import ProtectedLayout from "./domain/layouts/ProtectedLayout";
import MapPage from "./pages/Map";
import ReferencePage from "./pages/Reference";

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
        element: <MapPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "reference",
        element: <ReferencePage />,
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
