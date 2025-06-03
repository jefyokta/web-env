import Card from "@/Components/Card"
import { Card as CardUI } from "@/Components/ui/card"
import { Particle } from "@/Components/Icon/Particle"
import { Sun } from "@/Components/Icon/Sun"
import { Temperature } from "@/Components/Icon/Temperature"
import Application from "@/Layouts/Application"
import { RealTimeChart } from "@/Components/Chart"
import { Enviroment } from "@/Components/Icon/Globe"
import { useWebsocket } from "@/Hooks/useWebsocket"
import { useEffect, useState } from "react"
import { DataPoint } from "@/types"
import { generateData } from "./Charts"
import { getStatus } from "@/lib/utils"


const Index = () => {

    return <Application title="RealTime Datas">
        <RealTimeDashboard />


    </Application>
}


const RealTimeDashboard = () => {

    const ws = useWebsocket();
    const [lux, setLux] = useState<number>(0)
    const [dust, setDust] = useState<number>(0)
    const [temp, setTemperature] = useState<number>(0)
    const [crisp, setCrisp] = useState<number>(0)
    const [data, setData] = useState<DataPoint[]>([]);


    const { lastMessage } = useWebsocket()
    useEffect(() => {
        if (lastMessage?.message) {
            setLux(lastMessage.message.lux)
            setData(prev => [...prev.slice(-19), generateData(lastMessage.message.crisp)])
            setCrisp(lastMessage.message.crisp)
            setTemperature(lastMessage.message.temperature)
            setDust(lastMessage.message.dust)
        }
    }, [lastMessage]);
    return <div className="flex-1 ">
        <div className="w-full  grid grid-cols-1 md:grid-cols-3 md:grid-rows-2  h-full gap-3 flex-wrap">
            <div className="md:col-span-3 p-3  rounded-3xl flex relative gap-2 flex-col flex-reverse md:grid md:grid-cols-3 bg-zinc-200/10">
                <div className="md:col-span-2 bg-transparent relative ">
                    <RealTimeChart data={data} color="" title="Crisp Value" reponsiveClass="h-36" className="h-56 bg-transparent shadow-none" />
                </div>

                <Card
                    title="Crisp"
                    Icon={Enviroment}
                    value={crisp}
                    unit="%"
                    valueClassName="text-white"
                    status={getStatus.crisp(crisp).desc}
                    statusColor={getStatus.crisp(crisp).color}
                />

            </div>

            <Card
                title="Temperature"
                Icon={Temperature}
                value={temp}
                unit="°C"
                valueClassName="text-red-800"
                status={getStatus.temp(temp).desc}
                statusColor={getStatus.temp(temp).color}
            />

            <Card
                title="Dust"
                Icon={Particle}
                value={dust}
                unit="µg/m³"
                valueClassName="text-yellow-400"
                status={getStatus.dust(dust).desc}
                statusColor={getStatus.dust(dust).color}
            />

            <Card
                title="Light"
                Icon={Sun}
                value={lux}
                unit="lux"
                valueClassName="text-green-400"
                status={getStatus.lux(lux).desc}
                statusColor={getStatus.lux(lux).color}
            />
        </div>
    </div>
}

export default Index