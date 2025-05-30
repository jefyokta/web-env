import { Card } from '@/Components/ui/card'
import Application from '@/Layouts/Application'
import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

type DataPoint = {
    time: string
    value: number
}

const generateData = (base: number = 0) => {
    const now = new Date()
    return {
        time: now.toLocaleTimeString(),
        value: (base + (Math.random() * 100)),
    }
}

const SensorChart = ({ title, color, data }: { title: string, color: string, data: DataPoint[] }) => (
    <Card className='border-0 bg-zinc-400/10  flex flex-col items-center justify-center'>
        <h1 className="text-white">{title}</h1>
        <div className="flex justify-center items-center p-5">
            <LineChart width={500} height={200} data={data} className='text-xs'>
                <CartesianGrid vertical={false} className='stroke-gray-500' />
                <XAxis dataKey="time" className='text-white' />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke={color} dot={false} />
            </LineChart>
        </div>
    </Card>
)

const MultiChart: React.FC = () => {
    const [Temperature, setTemperature] = useState<DataPoint[]>([])
    const [dustData, setDustData] = useState<DataPoint[]>([])
    const [lightData, setLightData] = useState<DataPoint[]>([])

    useEffect(() => {
        const interval = setInterval(() => {
            setTemperature((prev) => [...prev.slice(-20), generateData(25)])
            setDustData((prev) => [...prev.slice(-20), generateData(150)])
            setLightData((prev) => [...prev.slice(-20), generateData(700)])
        }, 2000)

        return () => clearInterval(interval)
    }, [])

    return (
        <Application title='Chart'>
            <div className="py-6 pl-6 flex-1 flex-wrap flex gap-3 rounded-xl ">
                <SensorChart title="Temperature (°C)" color="#f59e0b" data={Temperature} />
                <SensorChart title="Dust (ppm)" color="#ef4444" data={dustData} />
                <SensorChart title="Light (lux)" color="#3b82f6" data={lightData} />
            </div>
        </Application>
    )
}

export default MultiChart
