"use client"

import * as React from "react"
import Image from "next/image"
import {
  UserPlusIcon,
  SearchIcon,
  AwardIcon,
  Trash2Icon,
  BriefcaseIcon,
  GraduationCapIcon,
  RefreshCwIcon,
  UploadCloudIcon,
  Loader2Icon,
  PencilIcon,
  AlertCircleIcon,
  ArrowUpDownIcon,
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

export interface Leader {
  id: string
  name: string
  title: string
  role?: string | null
  specialty?: string | null
  badge?: string | null
  image: string
  details?: string | null
  experience?: string | null
  education?: string | null
  order: number
  available: boolean
}

const emptyLeaderForm = {
  name: "",
  title: "Chief Executive Officer (CEO)",
  role: "Chief Executive Officer (CEO)",
  specialty: "Hospital Leadership",
  badge: "Executive",
  image: "/images/Mr. Nur Ahmed Dirie.png",
  details: "",
  experience: "",
  education: "",
  order: 1,
  available: true,
}

export default function LeadershipAdminPage() {
  const [leaders, setLeaders] = React.useState<Leader[]>([])
  const [loading, setLoading] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  const [editingLeader, setEditingLeader] = React.useState<Leader | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [loadError, setLoadError] = React.useState("")
  const [uploadingImage, setUploadingImage] = React.useState(false)

  const [formData, setFormData] = React.useState(emptyLeaderForm)

  const fetchLeaders = React.useCallback(async () => {
    setLoading(true)
    setLoadError("")
    try {
      const response = await api.get("/leadership")
      if (response.data && Array.isArray(response.data.data)) {
        setLeaders(response.data.data)
      } else if (Array.isArray(response.data)) {
        setLeaders(response.data)
      }
    } catch (err: unknown) {
      console.error("Error fetching leadership:", err)
      setLoadError(getApiErrorMessage(err, "Leadership team could not be loaded. Please refresh."))
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeaders()
  }, [fetchLeaders])

  const openCreateLeader = () => {
    setEditingLeader(null)
    setFormData({
      ...emptyLeaderForm,
      order: leaders.length + 1,
    })
    setIsSheetOpen(true)
  }

  const openEditLeader = (leader: Leader) => {
    setEditingLeader(leader)
    setFormData({
      name: leader.name,
      title: leader.title,
      role: leader.role || leader.title,
      specialty: leader.specialty || "Hospital Leadership",
      badge: leader.badge || "Executive",
      image: leader.image,
      details: leader.details || "",
      experience: leader.experience || "",
      education: leader.education || "",
      order: leader.order || 1,
      available: leader.available,
    })
    setIsSheetOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const uploadFormData = new FormData()
    uploadFormData.append("image", file)
    uploadFormData.append("folder", "leadership")

    try {
      const response = await api.post("/upload", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      if (response.data && response.data.url) {
        setFormData((prev) => ({ ...prev, image: response.data.url }))
        toast.success("Executive photo uploaded to Cloudinary!")
      }
    } catch (err: unknown) {
      console.error("Image upload failed:", err)
      toast.error(getApiErrorMessage(err, "Failed to upload photo. You can paste an image URL directly."))
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSaveLeader = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.title.trim()) {
      toast.error("Please enter the leader's full name and title.")
      return
    }

    setSaving(true)
    try {
      const response = editingLeader
        ? await api.patch(`/leadership/${editingLeader.id}`, formData)
        : await api.post("/leadership", formData)

      const savedLeader = response.data?.data as Leader | undefined
      if (!savedLeader) throw new Error("Leadership API returned no record")

      setLeaders((prev) =>
        editingLeader
          ? prev.map((l) => (l.id === savedLeader.id ? savedLeader : l))
          : [...prev, savedLeader].sort((a, b) => a.order - b.order)
      )

      setIsSheetOpen(false)
      setEditingLeader(null)
      setFormData(emptyLeaderForm)
      toast.success(editingLeader ? "Leadership member updated" : "New leadership member added")
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to save leadership member."))
    } finally {
      setSaving(false)
    }
  }

  const toggleAvailability = async (id: string, current: boolean) => {
    try {
      const response = await api.patch(`/leadership/${id}`, { available: !current })
      const updated = response.data?.data as Leader | undefined
      setLeaders((prev) =>
        prev.map((l) => (l.id === id ? (updated || { ...l, available: !current }) : l))
      )
      toast.success("Display status updated")
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Status update failed."))
    }
  }

  const handleDeleteLeader = async (id: string) => {
    if (!confirm("Are you sure you want to remove this leadership member?")) return
    try {
      await api.delete(`/leadership/${id}`)
      setLeaders((prev) => prev.filter((l) => l.id !== id))
      toast.success("Member removed successfully")
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to delete record."))
    }
  }

  const filteredLeaders = leaders.filter((l) => {
    const q = searchQuery.toLowerCase()
    return (
      l.name.toLowerCase().includes(q) ||
      l.title.toLowerCase().includes(q) ||
      (l.role && l.role.toLowerCase().includes(q))
    )
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
                  Leadership Team Management
                </h1>
                <p className="text-sm text-muted-foreground">
                  Al-Birri Hospital: Manage board members, executives, and medical directors.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchLeaders}
                  disabled={loading}
                  className="gap-1.5"
                >
                  <RefreshCwIcon className={`size-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>

                {/* Add Leader Sheet */}
                <Sheet open={isSheetOpen} onOpenChange={(open) => {
                  setIsSheetOpen(open)
                  if (!open) setEditingLeader(null)
                }}>
                  <SheetTrigger render={
                    <Button size="sm" onClick={openCreateLeader} className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                      <UserPlusIcon className="size-4" />
                      Add Leader
                    </Button>
                  } />
                  <SheetContent className="w-full sm:max-w-2xl md:max-w-3xl overflow-y-auto p-6 sm:p-8">
                    <SheetHeader className="border-b border-border/60 pb-4">
                      <SheetTitle className="text-xl font-bold flex items-center gap-2.5 text-foreground">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <AwardIcon className="size-4" />
                        </span>
                        {editingLeader ? "Edit Executive Leader" : "Add Executive Leader"}
                      </SheetTitle>
                      <SheetDescription className="text-sm text-muted-foreground mt-1">
                        {editingLeader
                          ? "Update credentials, experience, and display order."
                          : "Register a new executive, medical director, or hospital administrator."}
                      </SheetDescription>
                    </SheetHeader>

                    <form onSubmit={handleSaveLeader} className="space-y-6 pt-5">
                      {/* Name & Title */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="lead-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Full Name <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            id="lead-name"
                            placeholder="e.g. Mr. Nur Ahmed Dirie"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="h-11 rounded-xl border-border/80 px-3.5 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lead-title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Executive Role / Title <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            id="lead-title"
                            placeholder="e.g. Chief Executive Officer (CEO)"
                            value={formData.role || formData.title}
                            onChange={(e) =>
                              setFormData({ ...formData, role: e.target.value, title: e.target.value })
                            }
                            required
                            className="h-11 rounded-xl border-border/80 px-3.5 text-sm"
                          />
                        </div>
                      </div>

                      {/* Display Order & Badge */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="lead-order" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Display Order (1 = Top / First)
                          </Label>
                          <Input
                            id="lead-order"
                            type="number"
                            min={1}
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                            className="h-11 rounded-xl border-border/80 px-3.5 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lead-badge" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Department / Specialty Badge
                          </Label>
                          <Input
                            id="lead-badge"
                            placeholder="e.g. Executive, Hospital Leadership"
                            value={formData.badge || "Executive"}
                            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                            className="h-11 rounded-xl border-border/80 px-3.5 text-sm"
                          />
                        </div>
                      </div>

                      {/* Photo Upload */}
                      <div className="space-y-2">
                        <Label htmlFor="lead-photo" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Executive Photograph
                        </Label>
                        <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border/80 p-4 bg-muted/20">
                          <div className="flex flex-wrap items-center gap-3">
                            <label
                              htmlFor="leader-file"
                              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors shadow-xs"
                            >
                              {uploadingImage ? (
                                <Loader2Icon className="size-4 animate-spin text-primary" />
                              ) : (
                                <UploadCloudIcon className="size-4 text-emerald-600" />
                              )}
                              {uploadingImage ? "Uploading..." : "Upload New Photo"}
                            </label>
                            <input
                              id="leader-file"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={uploadingImage}
                              className="hidden"
                            />
                            {uploadingImage && (
                              <span className="text-xs text-muted-foreground animate-pulse">Uploading to Cloudinary...</span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            {formData.image && (
                              <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-border bg-muted shadow-xs">
                                <Image
                                  src={formData.image}
                                  alt="Leader preview"
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <Input
                              id="lead-photo"
                              placeholder="/images/... or https://res.cloudinary.com/..."
                              value={formData.image}
                              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                              className="h-11 rounded-xl text-xs font-mono border-border/80"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Professional Experience */}
                      <div className="space-y-2">
                        <Label htmlFor="lead-exp" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Professional Background & Experience
                        </Label>
                        <textarea
                          id="lead-exp"
                          rows={3}
                          className="w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 resize-none leading-relaxed"
                          placeholder="Describe leadership journey, years of management experience, past organizations..."
                          value={formData.experience || ""}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        />
                      </div>

                      {/* Education & Credentials */}
                      <div className="space-y-2">
                        <Label htmlFor="lead-edu" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Academic Degrees & Certifications
                        </Label>
                        <textarea
                          id="lead-edu"
                          rows={3}
                          className="w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 resize-none leading-relaxed"
                          placeholder="Degree qualifications, universities attended, medical degrees..."
                          value={formData.education || ""}
                          onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        />
                      </div>

                      {/* Submit */}
                      <Button
                        type="submit"
                        disabled={saving || uploadingImage}
                        className="mt-4 h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
                      >
                        {saving ? <Loader2Icon className="size-4 animate-spin" /> : null}
                        {saving ? "Saving..." : editingLeader ? "Save Leader Changes" : "Save Leader"}
                      </Button>
                    </form>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Error notice */}
            {loadError && (
              <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
                <AlertCircleIcon className="size-4 shrink-0" />
                {loadError}
              </div>
            )}

            {/* Search */}
            <div className="flex items-center rounded-xl border border-border/70 bg-card p-3 shadow-xs">
              <SearchIcon className="size-4 text-muted-foreground ml-2 mr-3" />
              <Input
                placeholder="Search leadership member by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 h-9"
              />
            </div>

            {/* Leadership Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {!loading && filteredLeaders.length === 0 ? (
                <div className="col-span-full rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
                  No leadership members found. Click &quot;Add Leader&quot; to register members.
                </div>
              ) : null}

              {filteredLeaders.map((leader) => (
                <Card key={leader.id} className="overflow-hidden border-border/70 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-start gap-4">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-xs">
                        <Image
                          src={leader.image || "/images/Mr. Nur Ahmed Dirie.png"}
                          alt={leader.name}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <Badge variant="outline" className="text-[11px] font-mono">
                            <ArrowUpDownIcon className="size-3 mr-1" />
                            Order #{leader.order}
                          </Badge>
                          <button
                            onClick={() => toggleAvailability(leader.id, leader.available)}
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border transition-colors ${
                              leader.available
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-zinc-100 text-zinc-600 border-zinc-200"
                            }`}
                          >
                            <span className={`size-1.5 rounded-full ${leader.available ? "bg-emerald-500" : "bg-zinc-400"}`} />
                            {leader.available ? "Active" : "Hidden"}
                          </button>
                        </div>
                        <CardTitle className="text-base font-bold mt-1 text-foreground truncate">
                          {leader.name}
                        </CardTitle>
                        <CardDescription className="text-xs font-semibold text-primary truncate">
                          {leader.role || leader.title}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 space-y-3 text-xs text-muted-foreground flex-1">
                    {leader.experience && (
                      <div className="flex gap-2">
                        <BriefcaseIcon className="size-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <p className="line-clamp-2 leading-relaxed">{leader.experience}</p>
                      </div>
                    )}
                    {leader.education && (
                      <div className="flex gap-2">
                        <GraduationCapIcon className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <p className="line-clamp-2 leading-relaxed">{leader.education}</p>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-4 pt-2 border-t border-border/50 flex items-center justify-between">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs"
                      onClick={() => toggleAvailability(leader.id, leader.available)}
                    >
                      {leader.available ? "Hide from Website" : "Show on Website"}
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 gap-1 px-2.5 text-xs text-primary"
                        onClick={() => openEditLeader(leader)}
                      >
                        <PencilIcon className="size-3.5" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 size-8 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteLeader(leader.id)}
                        title="Delete"
                      >
                        <Trash2Icon className="size-4" />
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
