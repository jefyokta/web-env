import { useWebsocket } from "@/Hooks/useWebsocket"
import { Esp32 } from "./Icon/Esp32"
import { WebsocketIcon } from "./Icon/Websocket"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export const Status: React.FC = () => {
    const { espConnected, connected } = useWebsocket()

    return (
        <div className="flex justify-end space-x-1 items-start">
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={`flex cursor-pointer justify-center items-center rounded-3xl p-1 px-1.5 space-x-1 shadow transition-all duration-300 
                    ${espConnected ? "bg-green-700/70 animate-pulse" : "bg-red-800/30"}`}
                    >
                        <Esp32 className="stroke-zinc-200/70 w-4 h-4 transition-transform duration-300" />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    Esp32
                </TooltipContent>

            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>

                    <div
                        className={`flex cursor-pointer justify-center items-center rounded-3xl p-1 px-1.5 space-x-1 transition-all duration-300 
                    ${connected ? "bg-green-700/70 animate-pulse" : "bg-red-800/30"}`}
                    >
                        <WebsocketIcon className="stroke-zinc-200 w-4 h-4 transition-transform duration-300" />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    Websocket
                </TooltipContent>

            </Tooltip>


        </div>
    )
}
