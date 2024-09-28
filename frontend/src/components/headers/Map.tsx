import React from "react";

const MapHeader: React.FC = () => {
  return (
    <nav className="bg-gray-50 z-40 w-full border-b border-gray-200">
      <div className="text-sm font-semibold text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="me-2">
            <a
              href="#"
              className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            >
              Регионы
            </a>
          </li>
          <li className="me-2">
            <a
              href="#"
              className="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
              aria-current="page"
            >
              Водоемы
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default MapHeader;
