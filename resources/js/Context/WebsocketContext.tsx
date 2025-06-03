import { Message } from "@/ws";
import React, { createContext, Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";

export interface IWebSocketContext {
  socket: WebSocket | null;
  connected: boolean;
  sendMessage: (msg: string) => void;
  lastMessage: Message | null;
  setLastMessage: Dispatch<SetStateAction<Message | null>>,
  espConnected: boolean,
  setEspConnected: Dispatch<SetStateAction<boolean>>


}

export const WebSocketContext = createContext<IWebSocketContext>({
  socket: null,
  connected: false,
  sendMessage: () => { },
  lastMessage: null,
  setLastMessage: () => { },
  espConnected: false,
  setEspConnected: () => { }

});

interface Props {
  url: string;
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<Props> = ({ url, children }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<Message | null>(null);
  const [espConnected, setEspConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;
    socket.onopen = () => {
      setConnected(true);
      socket.send(JSON.stringify({ event: "status" }))
      console.log("WebSocket connected");
    };


    socket.onclose = () => {
      setConnected(false);
      setEspConnected(false)
      console.log("WebSocket disconnected");
    };
    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      socket.close();
    };
  }, [url]);

  const sendMessage = (msg: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(msg);
    }
  };

  return (
    <WebSocketContext.Provider value={{
      socket: socketRef.current,
      connected,
      sendMessage,
      lastMessage,
      setLastMessage,
      espConnected,
      setEspConnected
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};
