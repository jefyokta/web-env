import React, { ComponentType, FC, SVGProps, useEffect, useState } from "react"
import { Card as CardUI } from "@/Components/ui/card"
import { AnimatePresence } from "motion/react"
import { motion } from "motion/react"
type CardProps = {
    title: string,
    Icon: any,
    value: number,
    unit?: string,
    valueClassName?: string,
    status?: string,
    statusColor?: string,
    className?: string
}

const Card: React.FC<CardProps> = ({
    title,
    Icon,
    value,
    unit = "",
    valueClassName = "text-yellow-400",
    status = "Normal",
    statusColor = "bg-green-600",
    className
}) => {
    const [dispValue, setDisValue] = useState<number>(value);

    useEffect(() => {
        setDisValue(value)
    }, [value])
    return <div className={`rounded-3xl border-0 h-full grid-rows-2 w-full grid grid-cols-2 shadow-lg hover:shadow-xl p-6 bg-zinc-200/10   relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 ${className}`}>
        <div className=" justify-between ">
            <div className="px-5 py-1 rounded-xl">
                <h3 className="text-sm text-gray-300 font-medium">{title}</h3>
            </div>

        </div>
        <div className="row-span-2  flex items-center justify-end">
            <Icon className="w-8/12 text-gray-200 " />
        </div>
        <div className="">
            <p className={`text-6xl font-black  mb-2 transition-colors ${valueClassName}`}>
                <AnimatePresence mode="wait">
                    <motion.span
                        key={value}
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.5 }}
                    >
                        {dispValue}
                    </motion.span>
                </AnimatePresence>
                <span className="text-4xl">
                    {unit}
                </span>
            </p>
            <p className="text-xs mt-5 text-gray-200 mt-auto flex items-center">
                <span className={`w-2 h-2 ${statusColor} rounded-full mr-2`}></span>
                {status}
            </p>
        </div>


    </div>

}


export default Card;