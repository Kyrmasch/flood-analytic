import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { WebSocketContextType } from "./types/WebSocketContextType";

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [clientId, setClientId] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messageHandlerRef = useRef<(message: string) => void>(() => {});

  useEffect(() => {
    const initializeWebSocket = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const visitorId = result.visitorId;
      if (messageHandlerRef.current) {
        messageHandlerRef.current(visitorId);
      }

      if (clientId == null) {
        setClientId(visitorId);
      }
      setSocket(null);
    };

    initializeWebSocket();

    return () => {};
  }, []);

  const sendMessage = (message: string) => {
    console.log(message);
  };

  const setMessageHandler = useCallback(
    (handler: (message: string) => void) => {
      messageHandlerRef.current = handler;
    },
    []
  );

  return (
    <WebSocketContext.Provider
      value={{ socket, sendMessage, setMessageHandler }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useWebSocket должен использоваться внутри WebSocketProvider"
    );
  }
  return context;
};
