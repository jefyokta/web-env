import { useEffect } from "react"
import { useWebsocket } from "./useWebsocket"
import { Message, SensorMessage } from "@/ws";
import { toast } from "sonner";
import { CheckCircle, CircleCheckIcon, XCircle } from "lucide-react";



export const Slave = () => {

    const { socket, setLastMessage, setEspConnected, espConnected } = useWebsocket()
    useEffect(() => {
        const handle = (e: MessageEvent) => {
            const msg: Message<unknown> = JSON.parse(e.data)
            if (msg.event == "esp_update") {
                if (msg.message && !espConnected) {
                    toast.success("ESP32 Connected", {
                        description: "ESP32 is now providing sensor data.",
                        icon: <CheckCircle className="text-green-500" />,
                    })
                } else {
                    toast.error("ESP32 Disconnected", {
                        description: "ESP32 has stopped sending sensor data.",
                        icon: <XCircle className="text-red-500" />,
                    })
                }
                setEspConnected((msg as Message<boolean>).message)

            } else {
                setLastMessage((msg as Message<SensorMessage>))
            }
        }
        socket?.addEventListener("message", handle)
        return () => socket?.removeEventListener("message", handle)
    }, [socket]);
    return <></>
}