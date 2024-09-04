import { Outlet } from "react-router-dom";
import { UserProvider } from "../contexts/UserContext";

const ProtectedLayout = () => {
  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  );
};

export default ProtectedLayout;
