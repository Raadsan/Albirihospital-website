"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CalendarDays, Stethoscope, Newspaper, Video } from "lucide-react"
import api from "@/app/api/api"

export function SectionCards() {
  const [stats, setStats] = React.useState({
    appointments: 0,
    doctors: 0,
    blogs: 0,
    videos: 0,
  })
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    Promise.allSettled([
      api.get("/appointments"),
      api.get("/doctors"),
      api.get("/blogs"),
      api.get("/videos"),
    ]).then(([apptRes, docRes, blogRes, vidRes]) => {
      const getCount = (res: PromiseSettledResult<{ data?: { count?: number; data?: unknown[] } | unknown[] }>) => {
        if (res.status === "fulfilled" && res.value?.data) {
          const d = res.value.data
          if (Array.isArray(d)) return d.length
          if (typeof d.count === "number") return d.count
          if (Array.isArray(d.data)) return d.data.length
        }
        return 0
      }

      setStats({
        appointments: getCount(apptRes),
        doctors: getCount(docRes),
        blogs: getCount(blogRes),
        videos: getCount(vidRes),
      })
      setLoading(false)
    })
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {/* Appointments Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Appointments Received</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? "..." : stats.appointments}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-primary">
              <CalendarDays className="size-3.5 mr-1" />
              Live DB
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Active patient booking requests
          </div>
          <div className="text-muted-foreground">
            Directly from website form
          </div>
        </CardFooter>
      </Card>

      {/* Doctors Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Registered Specialists</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? "..." : stats.doctors}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-emerald-200 bg-secondary/60 text-secondary-foreground">
              <Stethoscope className="size-3.5 mr-1" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Active medical practitioners
          </div>
          <div className="text-muted-foreground">Managed via Dashboard</div>
        </CardFooter>
      </Card>

      {/* Blogs Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Published Articles</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? "..." : stats.blogs}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-primary">
              <Newspaper className="size-3.5 mr-1" />
              Articles
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Hospital health updates
          </div>
          <div className="text-muted-foreground">Visible on public site</div>
        </CardFooter>
      </Card>

      {/* Videos Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Health Education Videos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? "..." : stats.videos}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-emerald-200 bg-secondary/60 text-secondary-foreground">
              <Video className="size-3.5 mr-1" />
              Media
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Published video sessions
          </div>
          <div className="text-muted-foreground">Streaming on homepage</div>
        </CardFooter>
      </Card>
    </div>
  )
}
