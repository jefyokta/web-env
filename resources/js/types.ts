import {  PageProps } from '@inertiajs/core';


export interface PageData extends PageProps{
    props:{
        env?:EnvData[]
    }
}

type EnvData = {
    lux:number,
    temperature:number,
    dust:number,
    crisp:number

}

export interface SensorChartProps {
    title: string,
    color: string,
    data: DataPoint[],
    width?: number,
    height?: number,
    className?: string
}
export type DataPoint = {
    time: string
    value: number
}
