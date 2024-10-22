import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-30 w-64 h-screen pt-[3rem] transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 "
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pt-4 pb-4 overflow-y-auto bg-gray-50 ">
        <ul className="space-y-2 font-medium">
          <li>
            <Link
              to={"/"}
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
            >
              <svg
                className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 21"
              >
                <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
              </svg>
              <span className="ms-3">Карта</span>
            </Link>
          </li>
          <li>
            <Link
              to={"/reference"}
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
            >
              <svg
                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
              </svg>
              <span className="ms-3">Справочники</span>
            </Link>
          </li>
          <li>
            <Link
              to={"http://127.0.0.1:8000/admin/"}
              target="_blank"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
            >
              <svg
                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <rect x="0" fill="none" width="20" height="20" />

                <g>
                  <path d="M18 12h-2.18c-.17.7-.44 1.35-.81 1.93l1.54 1.54-2.1 2.1-1.54-1.54c-.58.36-1.23.63-1.91.79V19H8v-2.18c-.68-.16-1.33-.43-1.91-.79l-1.54 1.54-2.12-2.12 1.54-1.54c-.36-.58-.63-1.23-.79-1.91H1V9.03h2.17c.16-.7.44-1.35.8-1.94L2.43 5.55l2.1-2.1 1.54 1.54c.58-.37 1.24-.64 1.93-.81V2h3v2.18c.68.16 1.33.43 1.91.79l1.54-1.54 2.12 2.12-1.54 1.54c.36.59.64 1.24.8 1.94H18V12zm-8.5 1.5c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z" />
                </g>
              </svg>
              <span className="ms-3">Администрирование</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
