import { WebSocketContext } from "@/Context/Websocket";
import { useContext } from "react";


export const useWebsocket = () => useContext(WebSocketContext)

