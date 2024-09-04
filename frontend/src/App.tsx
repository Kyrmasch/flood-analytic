import { useEffect } from "react";
import "./App.scss";
import { useWebSocket } from "./domain/contexts/WebSocketContext";
import { useGetCalcQuery } from "./domain/store/api/calc";
import { useUser } from "./domain/contexts/UserContext";

function App() {
  const { setMessageHandler } = useWebSocket();
  const user = useUser();
  const calcApi = useGetCalcQuery(null, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    setMessageHandler((message) => {
      console.log(message);
    });
  }, [setMessageHandler]);

  const logOut = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <>
      <header>
        <nav className="bg-white border-b border-gray-200 dark:bg-gray-800">
          <div className="flex justify-between items-center mx-auto max-w-7xl px-4 py-2">
            <a href="https://flowbite.com" className="flex items-center">
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                Flood
              </span>
            </a>
            <div className="flex items-center space-x-6">
              <button
                onClick={logOut}
                className="text-[1em] font-medium text-primary-600 dark:text-primary-500 hover:underline hidden sm:block"
              >
                Выход
              </button>
            </div>
          </div>
        </nav>
        <nav className="bg-gray-50 dark:bg-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <ul className="flex space-x-8 text-gray-900 dark:text-white">
              <li>
                <a href="#" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Company
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Team
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Features
                </a>
              </li>
              <li className="hidden md:block">
                <a href="#" className="hover:underline">
                  Marketplace
                </a>
              </li>
              <li className="hidden md:block">
                <a href="#" className="hover:underline">
                  Resources
                </a>
              </li>
              <li className="hidden md:block">
                <a href="#" className="hover:underline">
                  {user && user.username}
                </a>
              </li>
              <li className="hidden md:block">
                <a href="#" className="hover:underline">
                  {calcApi.data && calcApi.data.result.length}
                </a>
              </li>
            </ul>
            <div
              id="dropdown"
              className="hidden absolute bg-white shadow-lg rounded-lg mt-2 py-2"
            >
              <ul className="text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Marketplace
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Resources
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Forum
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default App;
