import { RealTimeChart } from '@/Components/Chart'
import { BentoGrid, BentoGridItem } from '@/Components/ui/bento-grid'
import { Card } from '@/Components/ui/card'
import { useWebsocket } from '@/Hooks/useWebsocket'
import Application from '@/Layouts/Application'
import { DataPoint, PageData, SensorChartProps } from '@/types'
import { usePage } from '@inertiajs/react'

import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'


export const generateData = (base: number = 0): DataPoint => {
    const now = new Date()
    return {
        time: now.toLocaleTimeString(),
        value: base,
    }
}

const SensorChart = ({ title, color, data, width, height, className }: SensorChartProps) => {
    return <Card className={`border-0 bg-zinc-400/10  flex flex-col flex-1 items-center justify-center`}>
        <h1 className="text-white">{title}</h1>
        <div className="flex justify-center items-center p-5">
            <LineChart width={width || 300} height={height || 150} data={data} className='text-xs flex-1'>
                <CartesianGrid vertical={false} className='stroke-gray-500' />
                <XAxis dataKey="time" className='text-white' />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke={color} dot={false} />
            </LineChart>
        </div>
        <div className="w-full px-5 text-neutral-200">
            dsad
        </div>
    </Card>
}

const Charts = () => {

    const { props } = usePage<PageData>();
    const [Temperature, setTemperature] = useState<DataPoint[]>([])
    const [dustData, setDustData] = useState<DataPoint[]>([])
    const [lightData, setLightData] = useState<DataPoint[]>([])

    const { lastMessage, socket } = useWebsocket()
    useEffect(() => {
        if (!lastMessage?.message) return
        console.log(Temperature)
        setTemperature(prev => [...prev.slice(-19), generateData(lastMessage.message.temperature)]);
        setDustData(prev => [...prev.slice(-19), generateData(lastMessage.message.dust)]);
        setLightData(prev => [...prev.slice(-19), generateData(lastMessage.message.lux)])

    }, [lastMessage])
    return (
        <>
            <div className="w-full grid md:grid-cols-3 md:grid-rows-2   flex gap-2 flex-wrap">
                <RealTimeChart className='w-full md:flex-1 bg-transparent bg-zinc-100/5 h-full md:row-span-2 md:col-span-2 ' reponsiveClass='h-full' title='Temperature' data={Temperature} color='test' desc='Realtime Temperature Graph' />
                <RealTimeChart className='w-full md:flex-1 bg-transparent bg-zinc-100/5' title='Dust' data={dustData} color='test' desc='Realtime Dust Graph' />
                <RealTimeChart className='w-full md:flex-1 bg-transparent bg-zinc-100/5' title='Light' data={lightData} color='test' desc='Realtime Light Graph' />
            </div>

        </>
    )


}

const MultiChart: React.FC = () => {



    return (
        <Application title='Chart'>
            <Charts />
        </Application>
    )
}

export default MultiChart
