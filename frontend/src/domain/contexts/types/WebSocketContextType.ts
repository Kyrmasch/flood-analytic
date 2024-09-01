export type WebSocketContextType = {
  socket: WebSocket | null;
  sendMessage: (message: string) => void;
  setMessageHandler: (handler: (message: string) => void) => void;
};
