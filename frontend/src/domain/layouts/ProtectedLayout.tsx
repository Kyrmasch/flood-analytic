import { Outlet } from "react-router-dom";
import { UserProvider } from "../contexts/UserContext";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

const ProtectedLayout = () => {
  return (
    <UserProvider>
      <Header />
      <div className="flex-grow min-h-0 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-0">
          <Outlet />
        </div>
      </div>
    </UserProvider>
  );
};

export default ProtectedLayout;
