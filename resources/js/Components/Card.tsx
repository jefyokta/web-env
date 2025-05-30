import React, { ComponentType, FC, SVGProps } from "react"

type CardProps = {
    title: string,
    Icon: any,
    value: string | number,
    unit?: string,
    valueClassName?: string,
    status?: string,
    statusColor?: string,
}

const Card: React.FC<CardProps> = ({
    title,
    Icon,
    value,
    unit = "",
    valueClassName = "text-yellow-400",
    status = "Normal",
    statusColor = "bg-green-600"
}) => {
    return <>
        <div className="rounded-3xl h-56 w-80 shadow-lg hover:shadow-xl p-6 bg-white/10 backdrop-blur-lg flex flex-col relative overflow-hidden group transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
                <div className="px-5 py-1 bg-zinc-800 rounded-xl">
                    <h3 className="text-sm text-gray-300 font-medium">{title}</h3>
                </div>
                <Icon className="w-6 h-6 text-white/80" />
            </div>
            <p className={`text-4xl font-black mt-4 mb-2 transition-colors ${valueClassName}`}>
                <span>{value}</span> {unit}
            </p>
            <p className="text-xs text-gray-200 mt-auto flex items-center">
                <span className={`w-2 h-2 ${statusColor} rounded-full mr-2`}></span>
                {status}
            </p>
        </div>
    </>

}


export default Card;