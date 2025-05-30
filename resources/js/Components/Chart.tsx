"use client"

import { useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { TrendingUp } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/ui/chart"

export type RealtimeSensorChartProps = {
  title: string
  description?: string
  sensorKey: string
  label: string
  colorVar?: string // default ke --chart-1
  generateData: () => number
  intervalMs?: number
  maxDataPoints?: number
}

export function RealtimeSensorChart({
  title,
  description = "Data realtime",
  sensorKey,
  label,
  colorVar = "hsl(var(--chart-1))",
  generateData,
  intervalMs = 2000,
  maxDataPoints = 20,
}: RealtimeSensorChartProps) {
  const [data, setData] = useState<Record<string, any>[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const time = now.toLocaleTimeString()
      const value = generateData()

      setData((prev) => [
        ...prev.slice(-maxDataPoints + 1),
        { time, [sensorKey]: value },
      ])
    }, intervalMs)

    return () => clearInterval(interval)
  }, [sensorKey, generateData, intervalMs, maxDataPoints])

  const chartConfig = {
    [sensorKey]: {
      label,
      color: colorVar,
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey={sensorKey}
              type="monotone"
              stroke={`var(--color-${sensorKey})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Data diperbarui setiap {intervalMs / 1000}s <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Menampilkan {maxDataPoints} data terakhir
        </div>
      </CardFooter>
    </Card>
  )
}
