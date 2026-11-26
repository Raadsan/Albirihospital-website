"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Award, CalendarDays, Mail, Newspaper, RefreshCw, Stethoscope, Video } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { adminApi } from "@/app/api/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { dashboardSections, type DashboardSection } from "@/lib/dashboard-access"

type OverviewRecord = { id: string; createdAt?: string; status?: string; published?: boolean }
type SectionResults = Partial<Record<DashboardSection, { records: OverviewRecord[] } | { failed: true }>>

const sectionDetails = {
  appointments: { icon: CalendarDays, title: "Appointment request", summary: "Booking requests" },
  contact: { icon: Mail, title: "Contact inquiry", summary: "Messages received" },
  doctors: { icon: Stethoscope, title: "Doctor profile", summary: "Doctor profiles" },
  leadership: { icon: Award, title: "Leadership profile", summary: "Leadership profiles" },
  blogs: { icon: Newspaper, title: "News article", summary: "Articles and drafts" },
  videos: { icon: Video, title: "Health video", summary: "Videos and drafts" },
}

const series = ["appointments", "contact", "content"] as const
const chartConfig = {
  appointments: { label: "Appointments", color: "#2563eb" },
  contact: { label: "Inquiries", color: "#059669" },
  content: { label: "Website records", color: "#7c3aed" },
} satisfies ChartConfig

const localDay = new Intl.DateTimeFormat("sv-SE", { timeZone: "Africa/Nairobi", year: "numeric", month: "2-digit", day: "2-digit" })
const shortDate = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Nairobi", day: "numeric", month: "short" })
const activityDate = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Nairobi", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })

function activitySeries(section: DashboardSection) {
  return section === "appointments" || section === "contact" ? section : "content"
}

function activityStatus(record: OverviewRecord) {
  if (record.status) return record.status.toLowerCase().replaceAll("_", " ")
  if (typeof record.published === "boolean") return record.published ? "Published" : "Draft"
  return "Added"
}

export function ReceptionDashboard({ name, permissions }: { name: string; permissions: DashboardSection[] }) {
  const [results, setResults] = useState<SectionResults>({})
  const [refresh, setRefresh] = useState(0)
  const [days, setDays] = useState<7 | 30>(7)
  const sections = useMemo(() => dashboardSections.filter(({ key }) => permissions.includes(key)), [permissions])

  useEffect(() => {
    const controller = new AbortController()
    Promise.all(sections.map(async ({ key }) => {
      try {
        const { data } = await adminApi.get<{ data: OverviewRecord[] }>(`/${key}`, {
          params: key === "blogs" || key === "videos" ? { all: true } : undefined,
          signal: controller.signal,
          timeout: 15000,
        })
        if (!Array.isArray(data.data)) throw new Error("Invalid dashboard response")
        return [key, { records: data.data }] as const
      } catch {
        return [key, { failed: true }] as const
      }
    })).then((entries) => {
      if (!controller.signal.aborted) setResults(Object.fromEntries(entries))
    })
    return () => controller.abort()
  }, [sections, refresh])

  const activity = useMemo(() => sections.flatMap((section) => {
    const result = results[section.key]
    if (!result || !("records" in result)) return []
    return result.records.flatMap((record) => {
      const timestamp = Date.parse(record.createdAt ?? "")
      return Number.isFinite(timestamp) ? [{ section, record, timestamp }] : []
    })
  }).sort((a, b) => b.timestamp - a.timestamp), [results, sections])

  const chart = useMemo(() => {
    const end = new Date(`${localDay.format(new Date())}T00:00:00Z`)
    const points = Array.from({ length: days }, (_, index) => {
      const date = new Date(end)
      date.setUTCDate(end.getUTCDate() - (days - index - 1))
      return { day: date.toISOString().slice(0, 10), appointments: 0, contact: 0, content: 0 }
    })
    const byDay = new Map(points.map((point) => [point.day, point]))
    for (const event of activity) {
      const point = byDay.get(localDay.format(event.timestamp))
      if (point) point[activitySeries(event.section.key)] += 1
    }
    return points
  }, [activity, days])

  const activeSeries = series.filter((key) => sections.some((section) => {
    const result = results[section.key]
    return activitySeries(section.key) === key && result && "records" in result
  }))
  const loading = sections.some(({ key }) => !results[key])
  const queues = sections.filter(({ key }) => key === "appointments" || key === "contact")

  function refreshOverview() {
    setResults({})
    setRefresh((value) => value + 1)
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-end justify-between gap-5 rounded-2xl bg-[#102b71] bg-linear-to-br from-[#102b71] to-[#1e40af] px-5 py-6 text-white shadow-sm sm:px-8 sm:py-8">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Welcome, {name}</h2>
          <p className="mt-2 text-sm text-blue-100">See recent activity and open the sections you manage.</p>
        </div>
        <Button type="button" variant="outline" onClick={refreshOverview} disabled={loading} className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
          <RefreshCw aria-hidden="true" className={loading ? "animate-spin" : undefined} /> Refresh
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map(({ key, label, path }) => {
          const { icon: Icon, summary } = sectionDetails[key]
          const result = results[key]
          const total = result && "records" in result ? result.records.length : null
          return (
            <Link key={key} href={`/admin/dashboard/${path}`} className="group rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-blue-300">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-xl bg-blue-50 p-2.5 text-primary"><Icon className="size-5" aria-hidden="true" /></span>
                <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{label}</h3>
              <p className="mt-1 text-3xl font-bold tabular-nums text-foreground">{total?.toLocaleString() ?? "—"}</p>
              <p className="mt-1 text-xs text-muted-foreground">{!result ? "Loading…" : "failed" in result ? "Unavailable · Try refreshing" : summary}</p>
            </Link>
          )
        })}
      </div>

      <div className={queues.length ? "grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(17rem,1fr)]" : ""}>
        <Card>
          <CardHeader className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Daily activity</CardTitle>
              <CardDescription className="mt-1">New requests and records in your dashboard sections.</CardDescription>
            </div>
            <div role="group" aria-label="Activity date range" className="flex gap-2">
              {([7, 30] as const).map((range) => (
                <Button key={range} type="button" size="sm" variant={range === days ? "default" : "outline"} aria-pressed={range === days} onClick={() => setDays(range)}>
                  {range} days
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {activeSeries.length > 0 ? (
              <>
                <div className="mb-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  {activeSeries.map((key) => <span key={key} className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2 rounded-full" style={{ background: chartConfig[key].color }} />{chartConfig[key].label}</span>)}
                </div>
                <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full sm:h-64">
                  <AreaChart accessibilityLayer data={chart} margin={{ top: 8, right: 12, left: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} minTickGap={20} tickFormatter={(day) => shortDate.format(new Date(day))} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={26} />
                    <ChartTooltip content={<ChartTooltipContent labelFormatter={(day) => shortDate.format(new Date(day))} />} />
                    {activeSeries.map((key) => <Area key={key} dataKey={key} type="monotone" stroke={`var(--color-${key})`} fill={`var(--color-${key})`} fillOpacity={0.12} strokeWidth={2} />)}
                  </AreaChart>
                </ChartContainer>
              </>
            ) : <p role="status" className="grid min-h-56 place-items-center text-sm text-muted-foreground">{loading ? "Loading activity…" : "Activity could not be loaded."}</p>}
          </CardContent>
        </Card>

        {queues.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Reception queue</CardTitle>
              <CardDescription>Items that need attention.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {queues.map(({ key, path }) => {
                const result = results[key]
                const targetStatus = key === "appointments" ? "PENDING" : "UNREAD"
                const count = result && "records" in result ? result.records.filter(({ status }) => status === targetStatus).length : null
                return (
                  <Link key={key} href={`/admin/dashboard/${path}`} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/35 p-4 transition-colors hover:border-blue-300">
                    <span className="text-sm font-medium text-foreground">{key === "appointments" ? "Pending appointments" : "Unread inquiries"}</span>
                    <span className="rounded-lg bg-blue-50 px-3 py-1 text-lg font-bold tabular-nums text-primary">{count ?? "—"}</span>
                  </Link>
                )
              })}
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>The latest entries from your assigned sections.</CardDescription>
        </CardHeader>
        <CardContent>
          {activity.length ? (
            <ul className="divide-y divide-border">
              {activity.slice(0, 6).map(({ section, record, timestamp }) => {
                const { icon: Icon, title } = sectionDetails[section.key]
                return (
                  <li key={`${section.key}:${record.id}`}>
                    <Link href={`/admin/dashboard/${section.path}`} className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md py-3 hover:bg-muted/40">
                      <span className="rounded-lg bg-blue-50 p-2 text-primary"><Icon className="size-4" aria-hidden="true" /></span>
                      <span className="flex-1 text-sm font-medium">{title}</span>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs capitalize">{activityStatus(record)}</span>
                      <time dateTime={new Date(timestamp).toISOString()} className="text-xs text-muted-foreground">{activityDate.format(timestamp)}</time>
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : <p className="text-sm text-muted-foreground">{loading ? "Loading recent entries…" : activeSeries.length ? "No recent entries yet." : "Recent activity could not be loaded."}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
