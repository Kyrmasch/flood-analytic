import { useEffect } from "react";
import "./App.scss";
import { useWebSocket } from "./domain/contexts/WebSocketContext";
import { useGetCalcQuery } from "./domain/store/api/calc";

function App() {
  const { setMessageHandler } = useWebSocket();
  const calcApi = useGetCalcQuery(null, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    setMessageHandler((message) => {
      console.log(message);
    });
  }, [setMessageHandler]);

  return (
    <>
      <div
        id="banner"
        tabIndex={-1}
        className="flex fixed z-50 gap-8 justify-between items-start py-3 px-4 w-full bg-gray-50 border border-b border-gray-200 sm:items-center dark:border-gray-700 lg:py-4 dark:bg-gray-800"
      >
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Floood-analitic -
          <a
            className="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline"
            href="#"
          >
            &nbsp; dask-cuda
          </a>{" "}
          {calcApi.data && calcApi.data.result.length}
        </p>
        <button
          data-collapse-toggle="banner"
          type="button"
          className="flex items-center text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </>
  );
}

export default App;
