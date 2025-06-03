import { WebSocketContext } from "@/Context/WebsocketContext";
import { useContext } from "react";


export const useWebsocket = () => useContext(WebSocketContext)

