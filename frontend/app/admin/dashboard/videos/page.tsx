"use client"

import * as React from "react"
import {
  VideoIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  RefreshCwIcon,
  PlayCircleIcon,
  ExternalLinkIcon,
  UserIcon,
} from "lucide-react"
import { toast } from "sonner"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import api from "@/app/api/api"

export interface VideoItem {
  id: string
  title: string
  doctor: string
  youtubeUrl: string
  category: string
  description?: string | null
  published: boolean
  createdAt: string
}

export default function VideosPage() {
  const [videos, setVideos] = React.useState<VideoItem[]>([])
  const [loading, setLoading] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("ALL")
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  const [formData, setFormData] = React.useState({
    title: "",
    doctor: "Dr. Ahmed Abdullahi",
    youtubeUrl: "",
    category: "Cardiology",
    description: "",
    published: true,
  })

  const fetchVideos = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get("/videos")
      if (response.data && Array.isArray(response.data.data)) {
        setVideos(response.data.data)
      } else if (Array.isArray(response.data)) {
        setVideos(response.data)
      }
    } catch (err) {
      console.warn("Error fetching videos:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.youtubeUrl.trim()) {
      toast.error("Please enter both the video title and YouTube URL.")
      return
    }

    const newVid: VideoItem = {
      id: `vid-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString().split("T")[0],
    }

    try {
      const res = await api.post("/videos", formData)
      if (res.data?.data) {
        setVideos((prev) => [res.data.data, ...prev])
      } else {
        setVideos((prev) => [newVid, ...prev])
      }
    } catch {
      setVideos((prev) => [newVid, ...prev])
    }

    setIsSheetOpen(false)
    setFormData({
      title: "",
      doctor: "Dr. Ahmed Abdullahi",
      youtubeUrl: "",
      category: "Cardiology",
      description: "",
      published: true,
    })
    toast.success("Health video added successfully!")
  }

  const togglePublished = async (id: string, current: boolean) => {
    try {
      await api.patch(`/videos/${id}`, { published: !current })
    } catch {
      // Fallback
    }
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, published: !current } : v))
    )
    toast.success(!current ? "Video published" : "Video hidden")
  }

  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return
    try {
      await api.delete(`/videos/${id}`)
    } catch {
      // Fallback
    }
    setVideos((prev) => prev.filter((v) => v.id !== id))
    toast.success("Video deleted successfully")
  }

  const filteredVideos = videos.filter((vid) => {
    const matchesSearch =
      vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat =
      categoryFilter === "ALL" || vid.category.toLowerCase() === categoryFilter.toLowerCase()
    return matchesSearch && matchesCat
  })

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Health Awareness Videos
                </h1>
                <p className="text-sm text-muted-foreground">
                  Al-Birri Hospital: Manage medical educational and health awareness video gallery.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchVideos}
                  disabled={loading}
                  className="gap-1.5"
                >
                  <RefreshCwIcon className={`size-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>

                {/* Add Video Sheet */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger render={
                    <Button size="sm" className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white">
                      <PlusIcon className="size-4" />
                      Add Video
                    </Button>
                  } />
                  <SheetContent className="w-full sm:max-w-2xl md:max-w-3xl overflow-y-auto p-6 sm:p-8">
                    <SheetHeader className="border-b border-border/60 pb-4">
                      <SheetTitle className="text-xl font-bold flex items-center gap-2.5 text-foreground">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                          <VideoIcon className="size-4" />
                        </span>
                        Add Educational Health Video
                      </SheetTitle>
                      <SheetDescription className="text-sm text-muted-foreground mt-1">
                        Add YouTube medical talks, clinical insights, and health advice to display in the Watch & Learn section.
                      </SheetDescription>
                    </SheetHeader>

                    <form onSubmit={handleCreateVideo} className="space-y-6 pt-5">
                      {/* Row 1: Title & YouTube URL */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Video Title <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            id="title"
                            placeholder="e.g. Preventing cardiovascular disease"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="h-11 rounded-xl border-border/80 px-3.5 text-sm focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="youtubeUrl" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            YouTube Video URL <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            id="youtubeUrl"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={formData.youtubeUrl}
                            onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                            required
                            className="h-11 rounded-xl border-border/80 px-3.5 text-sm font-mono focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                          />
                        </div>
                      </div>

                      {/* Row 2: Speaker & Category */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="doctor" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Speaker / Specialist Doctor
                          </Label>
                          <Input
                            id="doctor"
                            placeholder="e.g. Dr. Ahmed Abdullahi"
                            value={formData.doctor}
                            onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                            className="h-11 rounded-xl border-border/80 px-3.5 text-sm focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Video Category
                          </Label>
                          <Select
                            value={formData.category}
                            onValueChange={(val) => setFormData({ ...formData, category: val ?? "Cardiology" })}
                          >
                            <SelectTrigger id="category" className="h-11 rounded-xl border-border/80 px-3.5 text-sm">
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cardiology">Cardiology</SelectItem>
                              <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                              <SelectItem value="Dental Care">Dental Care</SelectItem>
                              <SelectItem value="Surgery">Surgery</SelectItem>
                              <SelectItem value="General Health">General Health</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Row 3: Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Short Summary / Topics Covered
                        </Label>
                        <textarea
                          id="description"
                          rows={4}
                          className="w-full rounded-xl border border-border/80 bg-background px-4 py-3.5 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 resize-none leading-relaxed"
                          placeholder="Summary of health topics, preventive tips, or medical guidance discussed in this video..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>

                      {/* Submit */}
                      <Button
                        type="submit"
                        className="w-full h-12 text-base font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-900/15 transition-all mt-4"
                      >
                        Publish Video to Website
                      </Button>
                    </form>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Filter */}
            <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-xs md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search video title, doctor, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val ?? "ALL")}>
                  <SelectTrigger className="w-[180px] h-10">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Categories</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Dental Care">Dental Care</SelectItem>
                    <SelectItem value="General Health">General Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.map((vid) => (
                <Card key={vid.id} className="overflow-hidden border-border/70 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="relative aspect-video w-full bg-zinc-900 flex items-center justify-center text-white group">
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                        <PlayCircleIcon className="size-12 text-white/90 drop-shadow-md group-hover:scale-110 transition-transform" />
                      </div>
                      <Badge className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white border-0 text-[11px]">
                        {vid.category}
                      </Badge>
                    </div>

                    <CardHeader className="p-4 pb-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <div className="flex items-center gap-1 font-medium text-emerald-700">
                          <UserIcon className="size-3.5" />
                          <span>{vid.doctor}</span>
                        </div>
                        <span>{vid.createdAt}</span>
                      </div>
                      <CardTitle className="text-base font-bold text-foreground line-clamp-2">
                        {vid.title}
                      </CardTitle>
                    </CardHeader>

                    {vid.description && (
                      <CardContent className="p-4 pt-1 text-xs text-muted-foreground line-clamp-2">
                        {vid.description}
                      </CardContent>
                    )}
                  </div>

                  <CardFooter className="p-4 pt-2 border-t border-border/50 flex items-center justify-between">
                    <a
                      href={vid.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                    >
                      <ExternalLinkIcon className="size-3.5" />
                      Watch on YouTube
                    </a>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => togglePublished(vid.id, vid.published)}
                      >
                        {vid.published ? "Active" : "Hidden"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 size-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteVideo(vid.id)}
                        title="Delete Video"
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
