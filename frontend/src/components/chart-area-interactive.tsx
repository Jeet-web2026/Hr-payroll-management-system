"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useRoleLabel } from "@/hooks/userRoleLabel"
import apiService from "@/comon/api/apiService"

export const description = "An interactive area chart"

type ChartPoint = {
  date: string
  active: number
  newlyJoined: number
}

const chartConfigByRole: Record<string, ChartConfig> = {
  Employees: {
    active: {
      label: "Active Employees",
      color: "var(--primary)",
    },
    newlyJoined: {
      label: "Newly Joined",
      color: "var(--primary)",
    },
  },
  Companies: {
    active: {
      label: "Active Companies",
      color: "var(--primary)",
    },
    newlyJoined: {
      label: "Newly Onboarded",
      color: "var(--primary)",
    },
  },
}

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")
  const roleLabel = useRoleLabel()

  const [chartData, setChartData] = React.useState<ChartPoint[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const label = roleLabel ?? "Employees"
  const chartConfig = chartConfigByRole[label]

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  React.useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await apiService.get('v2/dashboard/stat-charts', {})

        const rawData: ChartPoint[] =
          Array.isArray(response) ? response :
            Array.isArray(response?.data) ? response.data :
              typeof response === 'object' && response !== null ? Object.values(response.data?.data) :
                []

        if (rawData.length === 0) {
          console.warn('Chart data empty or unexpected response shape:', response)
        }

        setChartData(rawData)
      } catch (err) {
        setError('Failed to load chart data')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [])

  const filteredData = Array.isArray(chartData)
    ? chartData.filter((item) => {
      const date = new Date(item.date)
      const referenceDate = new Date()
      let daysToSubtract = 90
      if (timeRange === "30d") {
        daysToSubtract = 30
      } else if (timeRange === "7d") {
        daysToSubtract = 7
      }
      const startDate = new Date(referenceDate)
      startDate.setDate(startDate.getDate() - daysToSubtract)
      return date >= startDate
    })
    : []

  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardContent className="flex h-[250px] items-center justify-center">
          Loading chart...
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="@container/card">
        <CardContent className="flex h-[250px] items-center justify-center text-destructive">
          {error}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total {label}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillActive" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-active)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-active)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillNewlyJoined" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-newlyJoined)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-newlyJoined)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="newlyJoined"
              type="natural"
              fill="url(#fillNewlyJoined)"
              stroke="var(--color-newlyJoined)"
              stackId="a"
            />
            <Area
              dataKey="active"
              type="natural"
              fill="url(#fillActive)"
              stroke="var(--color-active)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}