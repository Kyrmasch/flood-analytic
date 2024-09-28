import { Outlet } from "react-router-dom";
import { UserProvider } from "../contexts/UserContext";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

const ProtectedLayout = () => {
  return (
    <UserProvider>
      <Header />
      <Sidebar />
      <Outlet />
    </UserProvider>
  );
};

export default ProtectedLayout;
