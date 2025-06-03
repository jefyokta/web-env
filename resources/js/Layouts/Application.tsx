import { ChartIcon } from "@/Components/Icon/Chart"
import { Esp32 } from "@/Components/Icon/Esp32"
import { HistoryIcon } from "@/Components/Icon/History"
import { Realtime } from "@/Components/Icon/Realtime"
import { WebsocketIcon } from "@/Components/Icon/Websocket"
import { Status } from "@/Components/Status"
import { FloatingDock } from "@/Components/ui/floating-dock"
import { Toaster } from "@/Components/ui/sonner"
import { WebSocketContext, WebSocketProvider } from "@/Context/WebsocketContext"
import { Slave } from "@/Hooks/wsSlave"
import { Message } from "@/ws"
import { Link } from "@inertiajs/react"
import { useEffect, useState } from "react"

type ApplicationProps = {
    title?: string
    children: React.ReactNode
}

const Application: React.FC<ApplicationProps> = ({ children, title }) => {


    const wshost = window.location.hostname;
    const isSecure = window.location.protocol === "https:";
    const port = window.location.port || (isSecure ? 443 : 80);
    const protocol = isSecure ? "wss" : "ws";
    const url = `${protocol}://${wshost}:${port}`;


    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date;
    const [time, setTime] = useState(new Date)
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])
    const Links = [
        {
            title: "Realtime",
            icon: <Realtime />,
            href: "/"
        },
        {
            title: "Chart",
            icon: <ChartIcon />,
            href: "/chart"
        },
        {
            title: "History",
            icon: <HistoryIcon />,
            href: "/history"
        },
    ]

    return (
        <>
            <div className="h-screen w-full bg-radial-[at_40%_70%] from-orange-900 via-40% relative  via-slate-900 to-neutral-900 to-70% flex flex-col backdrop-blur p-2 md:p-5">
                <div className="flex bg-zinc-100/10   rounded-3xl backdrop-blur flex-1 overflow-hidden p-3 gap-2.5">
                    <aside className="hidden md:flex  bg-zinc-900 backdrop-blur-md shadow-xl rounded-3xl p-6 pr-16 flex flex-col">
                        <h2 className="text-xl font-bold mb-6 ms-2 text-gray-300">Menu</h2>
                        <ul className="space-y-4 text-gray-500">
                            {Links.map(({ title, icon, href }, i) => {
                                return <li key={i} className="cursor-pointer hover:text-neutral-200 transition flex items-center gap-2">
                                    {icon}
                                    <Link href={href}>{title}</Link>
                                </li>
                            })}
                        </ul>
                    </aside>

                    <div className="flex flex-col flex-1 h-full w-full">

                        <div className="my-2 flex justify-between  rounded-3xl p-5 text-sm font-semibold text-gray-400">
                            <div className="flex items-center space-x-2">

                                <svg fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-200 w-6 h-6" viewBox="0 0 24 24">
                                    <path d="M3 9H21M7 3V5M17 3V5M6 12H8M11 12H13M16 12H18M6 15H8M11 15H13M16 15H18M6 18H8M11 18H13M16 18H18M6.2 21H17.8C18.92 21 19.48 21 19.91 20.78C20.28 20.59 20.59 20.28 20.78 19.91C21 19.48 21 18.92 21 17.8V8.2C21 7.08 21 6.52 20.78 6.09C20.59 5.72 20.28 5.41 19.91 5.22C19.48 5 18.92 5 17.8 5H6.2C5.08 5 4.52 5 4.09 5.22C3.72 5.41 3.41 5.72 3.22 6.09C3 6.52 3 7.08 3 8.2V17.8C3 18.92 3 19.48 3.22 19.91C3.41 20.28 3.72 20.59 4.09 20.78C4.52 21 5.08 21 6.2 21Z" />
                                </svg>
                                <span>{days[date.getDay()]}, {date.getDate()} {monthNames[date.getMonth()]} {date.getFullYear()}</span>
                            </div>
                            <div className="flex items-center justify-center text-sm bg-zinc-100 text-gray-900 p-1 rounded-3xl px-2 md:px-4 font-normal space-x-2">

                                <svg fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-900 w-4 h-4 " viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M12 8V12L15 15" />
                                </svg>
                                <span className="text-xs">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                            </div>
                        </div>

                        <main className="flex-1 flex flex-col w-full pt-8 pb-8 md:pb-0 md:px-3 md:bg-zinc-400/20 md:shadow-xl rounded-3xl overflow-auto no-scrollbar">
                            <div className="text-4xl md:text-5xl grid grid-cols-[4fr_1fr] font-semibold text-zinc-300 px-5">
                                <h2 className="">
                                    {title || "title"}
                                </h2>
                                <Status />
                            </div>
                            <div className="flex flex-1 md:px-3  flex-wrap justify-center   rounded-3xl  py-5 w-full gap-6">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            <div className="fixed bottom-0 md:hidden pb-1  flex justify-center w-full">
                <FloatingDock items={Links} className="bg-zinc-900 backdrop-blur-md" />
            </div>
            {/* <Toaster /> */}
            <Slave />
        </>
    )
}

export default Application