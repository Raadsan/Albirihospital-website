"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Badge } from "@/components/ui/badge"
import api from "@/app/api/api"

export const description = "Real-time interactive patient appointments chart"

const chartConfig = {
  bookings: {
    label: "Bookings Received",
    color: "#2563eb", // Blue
  },
  consultations: {
    label: "Scheduled Consultations",
    color: "#10b981", // Emerald Green
  },
} satisfies ChartConfig

interface AppointmentItem {
  id: string
  name: string
  date: string
  time: string
  status: string
  createdAt?: string
}

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("30d")
  const [appointments, setAppointments] = React.useState<AppointmentItem[]>([])
  const [loading, setLoading] = React.useState(true)

  // Fetch real appointments from backend database
  React.useEffect(() => {
    api.get("/appointments")
      .then((res) => {
        if (res.data && Array.isArray(res.data.data)) {
          setAppointments(res.data.data)
        } else if (Array.isArray(res.data)) {
          setAppointments(res.data)
        }
      })
      .catch((err) => {
        console.error("Failed to load appointments for chart:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Aggregate appointments by date for the selected timeframe
  const chartData = React.useMemo(() => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const now = new Date()
    const result: { date: string; bookings: number; consultations: number }[] = []

    // Generate date map covering the selected timeframe plus upcoming days
    const upcomingDays = timeRange === "7d" ? 3 : timeRange === "30d" ? 7 : 14
    const startDate = new Date(now)
    startDate.setDate(now.getDate() - (days - 1))

    const endDate = new Date(now)
    endDate.setDate(now.getDate() + upcomingDays)

    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split("T")[0]

      // Count bookings created on this day
      const bookingsCount = appointments.filter((apt) => {
        if (!apt.createdAt) return false
        const cDate = new Date(apt.createdAt).toISOString().split("T")[0]
        return cDate === dateKey
      }).length

      // Count consultations scheduled for this day
      const consultationsCount = appointments.filter((apt) => {
        return apt.date === dateKey
      }).length

      result.push({
        date: dateKey,
        bookings: bookingsCount,
        consultations: consultationsCount,
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return result
  }, [appointments, timeRange])

  // Summary statistics for selected range
  const totalBookingsInRange = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.bookings, 0),
    [chartData]
  )
  const totalConsultationsInRange = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.consultations, 0),
    [chartData]
  )

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle>Patient Appointments & Consultations</CardTitle>
            <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800 text-[11px] font-medium">
              Live DB
            </Badge>
          </div>
          <CardDescription>
            <span className="hidden @[540px]/card:inline">
              Real-time patient booking requests and scheduled doctor visits ({totalBookingsInRange} bookings, {totalConsultationsInRange} visits)
            </span>
            <span className="@[540px]/card:hidden">
              Live patient booking volume
            </span>
          </CardDescription>
        </div>

        <CardAction>
          <ToggleGroup
            multiple={false}
            value={timeRange ? [timeRange] : []}
            onValueChange={(value) => {
              if (value && value[0]) {
                setTimeRange(value[0])
              }
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-3.5! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>

          <Select
            value={timeRange}
            onValueChange={(value) => {
              if (value) {
                setTimeRange(value)
              }
            }}
          >
            <SelectTrigger
              className="flex w-36 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select timeframe"
            >
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex h-[250px] w-full items-center justify-center text-xs text-muted-foreground">
            Loading real appointment analytics...
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-bookings)"
                    stopOpacity={0.7}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-bookings)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <linearGradient id="fillConsultations" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-consultations)"
                    stopOpacity={0.7}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-consultations)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
                width={28}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="bookings"
                type="monotone"
                fill="url(#fillBookings)"
                stroke="var(--color-bookings)"
                strokeWidth={2}
              />
              <Area
                dataKey="consultations"
                type="monotone"
                fill="url(#fillConsultations)"
                stroke="var(--color-consultations)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
