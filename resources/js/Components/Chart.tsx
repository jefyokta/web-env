"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/ui/chart"
import React from "react"
import { SensorChartProps } from "@/types"

export const description = "An area chart with gradient fill"


interface RealtimeSensorChartProps extends SensorChartProps {
  desc?: string,
  reponsiveClass?: string,
  label?: string,
  dataKey?: string
}
export const RealTimeChart: React.FC<RealtimeSensorChartProps> = ({ title, desc, className, reponsiveClass, data, label, dataKey }) => {


  const chartConfig = {
    mobile: {
      label: label || "stuff",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig
  return (
    <Card className={`bg-neutral-100/20 ${className}   border-0`}>
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
        <CardDescription className="text-zinc-300">
          {desc}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} reponsiveClass={reponsiveClass} >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 0,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis className="text-slate-100" />
            <XAxis
              dataKey={"time"}
              color="white"
              tick={{ fill: "white" }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
              stroke="white"
              className="text-xs"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey={dataKey || "value"}
              type="natural"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />

          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
