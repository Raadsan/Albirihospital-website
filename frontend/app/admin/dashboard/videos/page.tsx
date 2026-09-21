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
  PencilIcon,
  UploadCloudIcon,
  Loader2Icon,
  AlertCircleIcon,
} from "lucide-react"
import { toast } from "sonner"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
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
import { getApiErrorMessage } from "@/lib/api-error"

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

const emptyVideoForm = {
  title: "",
  doctor: "Al-Birri Medical Team",
  youtubeUrl: "",
  category: "General Health",
  description: "",
  published: true,
}

export default function VideosPage() {
  const [videos, setVideos] = React.useState<VideoItem[]>([])
  const [loading, setLoading] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("ALL")
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  const [editingVideo, setEditingVideo] = React.useState<VideoItem | null>(null)
  const [uploadingVideo, setUploadingVideo] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [loadError, setLoadError] = React.useState("")

  const [formData, setFormData] = React.useState(emptyVideoForm)

  const fetchVideos = React.useCallback(async () => {
    setLoading(true)
    setLoadError("")
    try {
      const response = await api.get("/videos?all=true")
      if (response.data && Array.isArray(response.data.data)) {
        setVideos(response.data.data)
      } else if (Array.isArray(response.data)) {
        setVideos(response.data)
      }
    } catch (err: unknown) {
      console.error("Error fetching videos:", err)
      setLoadError(getApiErrorMessage(err, "Videos could not be loaded. Please refresh and try again."))
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVideos()
  }, [fetchVideos])

  const openCreateVideo = () => {
    setEditingVideo(null)
    setFormData(emptyVideoForm)
    setIsSheetOpen(true)
  }

  const openEditVideo = (video: VideoItem) => {
    setEditingVideo(video)
    setFormData({
      title: video.title,
      doctor: video.doctor,
      youtubeUrl: video.youtubeUrl,
      category: video.category,
      description: video.description || "",
      published: video.published,
    })
    setIsSheetOpen(true)
  }

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingVideo(true)
    const uploadData = new FormData()
    uploadData.append("file", file)
    uploadData.append("folder", "videos")
    try {
      const response = await api.post("/upload/media", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      if (!response.data?.url) throw new Error("Upload API returned no URL")
      setFormData((current) => ({ ...current, youtubeUrl: response.data.url }))
      toast.success("Video uploaded successfully")
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "The video file could not be uploaded."))
    } finally {
      setUploadingVideo(false)
      event.target.value = ""
    }
  }

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.youtubeUrl.trim()) {
      toast.error("Please enter both the video title and YouTube URL.")
      return
    }

    setSaving(true)
    try {
      const response = editingVideo
        ? await api.patch(`/videos/${editingVideo.id}`, formData)
        : await api.post("/videos", formData)
      const savedVideo = response.data?.data as VideoItem | undefined
      if (!savedVideo) throw new Error("Video API returned no record")
      setVideos((prev) => editingVideo
        ? prev.map((video) => video.id === savedVideo.id ? savedVideo : video)
        : [savedVideo, ...prev]
      )
      setIsSheetOpen(false)
      setEditingVideo(null)
      setFormData(emptyVideoForm)
      toast.success(editingVideo ? "Video updated successfully" : "Health video added successfully")
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "The video could not be saved."))
    } finally {
      setSaving(false)
    }
  }

  const togglePublished = async (id: string, current: boolean) => {
    try {
      const response = await api.patch(`/videos/${id}`, { published: !current })
      const updated = response.data?.data as VideoItem | undefined
      setVideos((prev) => prev.map((v) => (v.id === id ? (updated || { ...v, published: !current }) : v)))
      toast.success(!current ? "Video published" : "Video hidden")
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "The video status was not updated."))
    }
  }

  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return
    try {
      await api.delete(`/videos/${id}`)
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "The video could not be deleted."))
      return
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
                <Sheet open={isSheetOpen} onOpenChange={(open) => {
                  setIsSheetOpen(open)
                  if (!open) setEditingVideo(null)
                }}>
                  <SheetTrigger render={
                    <Button size="sm" onClick={openCreateVideo} className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                      <PlusIcon className="size-4" />
                      Add Video
                    </Button>
                  } />
                  <SheetContent className="w-full sm:max-w-2xl md:max-w-3xl overflow-y-auto p-6 sm:p-8">
                    <SheetHeader className="border-b border-border/60 pb-4">
                      <SheetTitle className="text-xl font-bold flex items-center gap-2.5 text-foreground">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                          <VideoIcon className="size-4" />
                        </span>
                        {editingVideo ? "Edit Educational Health Video" : "Add Educational Health Video"}
                      </SheetTitle>
                      <SheetDescription className="text-sm text-muted-foreground mt-1">
                        Upload a video file or add a YouTube link for the Watch & Learn section.
                      </SheetDescription>
                    </SheetHeader>

                    <form onSubmit={handleSaveVideo} className="space-y-6 pt-5">
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
                            Video URL <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            id="youtubeUrl"
                            placeholder="YouTube link or uploaded video URL"
                            value={formData.youtubeUrl}
                            onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                            required
                            className="h-11 rounded-xl border-border/80 px-3.5 text-sm font-mono focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/60 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Upload a video file</p>
                            <p className="mt-0.5 text-xs text-slate-600">MP4, WebM, or MOV, up to 50 MB. The uploaded URL fills the field above.</p>
                          </div>
                          <label htmlFor="video-file" className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-secondary px-4 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80">
                            {uploadingVideo ? <Loader2Icon className="size-4 animate-spin" /> : <UploadCloudIcon className="size-4" />}
                            {uploadingVideo ? "Uploading..." : "Choose Video"}
                          </label>
                          <input id="video-file" type="file" accept="video/mp4,video/webm,video/quicktime,video/x-m4v" onChange={handleVideoUpload} disabled={uploadingVideo} className="hidden" />
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
                        disabled={saving || uploadingVideo}
                        className="mt-4 h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-md shadow-blue-950/15 transition-all hover:bg-primary/90"
                      >
                        {saving ? <Loader2Icon className="size-4 animate-spin" /> : null}
                        {saving ? "Saving..." : editingVideo ? "Save Video Changes" : "Publish Video"}
                      </Button>
                    </form>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {loadError ? (
              <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
                <AlertCircleIcon className="size-4 shrink-0" />
                {loadError}
              </div>
            ) : null}

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
              {!loading && filteredVideos.length === 0 ? (
                <div className="col-span-full rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
                  No videos match this view. Add a video or change the filters.
                </div>
              ) : null}
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
                        className="h-7 gap-1 px-2 text-xs text-primary"
                        onClick={() => openEditVideo(vid)}
                      >
                        <PencilIcon className="size-3.5" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteVideo(vid.id)}
                        title="Delete Video"
                      >
                        <Trash2Icon className="size-3.5" />
                        Delete
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
