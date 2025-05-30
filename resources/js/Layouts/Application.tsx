import { Link } from "@inertiajs/react"
import { PropsWithChildren } from "react"

type ApplicationProps = {
    title?: string
    children: React.ReactNode
}

const Application: React.FC<ApplicationProps> = ({ children, title }) => {
    return <div className="h-screen w-full bg-radial-[at_40%_70%] from-orange-900 via-40%  via-indigo-950 to-zinc-900 to-70% flex flex-col backdrop-blur">
        <div className="flex bg-zinc-100/10 m-5 rounded-3xl backdrop-blur flex-1 overflow-hidden p-3 gap-2.5">
            <aside className=" bg-zinc-900 backdrop-blur-md shadow-xl rounded-3xl p-6 pr-16 flex flex-col">
                <h2 className="text-xl font-bold mb-6 ms-2 text-gray-300">Menu</h2>
                <ul className="space-y-4 text-gray-500">
                    <li className="cursor-pointer hover:text-neutral-200 transition flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                        </svg>
                        <Link href="/">Realtime</Link>
                    </li>
                    <li className="cursor-pointer hover:text-neutral-200 transition flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <line x1="12" y1="20" x2="12" y2="10"></line>
                            <line x1="18" y1="20" x2="18" y2="4"></line>
                            <line x1="6" y1="20" x2="6" y2="16"></line>
                        </svg>
                        <Link href="/chart">Chart</Link>
                    </li>
                    <li className="cursor-pointer hover:text-neutral-200 transition flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M3 3v5h5"></path>
                            <path d="M3.05 13a9 9 0 1 0 .5-4.5L3 8"></path>
                            <path d="M12 7v5l4 2"></path>
                        </svg>
                        <Link href="/history">History</Link>
                    </li>
                </ul>
            </aside>

            <div className="flex flex-col flex-1 h-full w-full">

                <div className="my-2 flex justify-between  rounded-3xl p-5 text-xl font-semibold text-gray-400">
                    <div className="flex items-center space-x-2">

                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-200" viewBox="0 0 24 24">
                            <path d="M3 9H21M7 3V5M17 3V5M6 12H8M11 12H13M16 12H18M6 15H8M11 15H13M16 15H18M6 18H8M11 18H13M16 18H18M6.2 21H17.8C18.92 21 19.48 21 19.91 20.78C20.28 20.59 20.59 20.28 20.78 19.91C21 19.48 21 18.92 21 17.8V8.2C21 7.08 21 6.52 20.78 6.09C20.59 5.72 20.28 5.41 19.91 5.22C19.48 5 18.92 5 17.8 5H6.2C5.08 5 4.52 5 4.09 5.22C3.72 5.41 3.41 5.72 3.22 6.09C3 6.52 3 7.08 3 8.2V17.8C3 18.92 3 19.48 3.22 19.91C3.41 20.28 3.72 20.59 4.09 20.78C4.52 21 5.08 21 6.2 21Z" />
                        </svg>
                        <span>Thursday, 29 May 2025</span>
                    </div>
                    <div className="flex items-center bg-zinc-900 text-gray-200 p-2 rounded-3xl px-5 space-x-2">

                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-200" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 8V12L15 15" />
                        </svg>
                        <span>12.00</span>
                    </div>
                </div>

                <main className="flex-1 flex flex-col w-full pt-8 pb-3 px-3 bg-slate-800/10 backdrop-blur shadow-xl rounded-3xl overflow-auto">


                    <div className="text-5xl underline-2 font-semibold text-slate-200 px-5">{title || "title"}</div>


                    <div className="flex flex-1 justify-center mt-10 bg-slate-950/10 backdrop-blur rounded-3xl  py-10 w-full space-x-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>

    </div>
}

export default Application