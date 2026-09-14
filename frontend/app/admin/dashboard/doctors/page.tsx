"use client"

import * as React from "react"
import {
  UserPlusIcon,
  SearchIcon,
  StethoscopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  Trash2Icon,
  SparklesIcon,
  BriefcaseIcon,
  BuildingIcon,
  PhoneCallIcon,
  RefreshCwIcon,
  UploadCloudIcon,
  Loader2Icon,
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

export interface Doctor {
  id: string
  name: string
  title: string
  specialty: string
  badge: string
  image: string
  details?: string | null
  department?: string | null
  experience?: string | null
  available: boolean
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = React.useState<Doctor[]>([])
  const [loading, setLoading] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [departmentFilter, setDepartmentFilter] = React.useState("ALL")
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  // New doctor form state
  const [formData, setFormData] = React.useState({
    name: "",
    title: "Consultant Specialist",
    specialty: "",
    department: "General Medicine",
    experience: "5+ Years",
    badge: "Specialist",
    image: "/images/doctor1.png",
    details: "",
    available: true,
  })

  const [uploadingImage, setUploadingImage] = React.useState(false)

  const fetchDoctors = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get("/doctors")
      if (response.data && Array.isArray(response.data.data)) {
        setDoctors(response.data.data)
      } else if (Array.isArray(response.data)) {
        setDoctors(response.data)
      }
    } catch (err) {
      console.warn("Error fetching doctors:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const uploadFormData = new FormData()
    uploadFormData.append("image", file)
    uploadFormData.append("folder", "doctors")

    try {
      const response = await api.post("/upload", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      if (response.data && response.data.url) {
        setFormData((prev) => ({ ...prev, image: response.data.url }))
        toast.success("Doctor photo uploaded to Cloudinary!")
      }
    } catch (err: any) {
      console.error("Image upload failed:", err)
      toast.error(err.response?.data?.error || "Failed to upload image. You can also paste an image URL.")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.specialty.trim()) {
      toast.error("Please enter the doctor's name and specialty.")
      return
    }

    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      ...formData,
    }

    try {
      const response = await api.post("/doctors", formData)
      if (response.data?.data) {
        setDoctors((prev) => [response.data.data, ...prev])
      } else {
        setDoctors((prev) => [newDoc, ...prev])
      }
    } catch (err: any) {
      console.warn("Backend doctor creation fallback:", err)
      setDoctors((prev) => [newDoc, ...prev])
    }

    setIsSheetOpen(false)
    setFormData({
      name: "",
      title: "Consultant Specialist",
      specialty: "",
      department: "General Medicine",
      experience: "5+ Years",
      badge: "Specialist",
      image: "/images/doctor1.png",
      details: "",
      available: true,
    })
    toast.success("New doctor successfully registered!")
  }

  const toggleAvailability = async (id: string, current: boolean) => {
    try {
      await api.patch(`/doctors/${id}`, { available: !current })
    } catch {
      // Offline fallback
    }
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, available: !current } : d))
    )
    toast.success("Doctor availability updated")
  }

  const handleDeleteDoctor = async (id: string) => {
    if (!confirm("Are you sure you want to remove this doctor?")) return
    try {
      await api.delete(`/doctors/${id}`)
    } catch {
      // Offline fallback
    }
    setDoctors((prev) => prev.filter((d) => d.id !== id))
    toast.success("Doctor successfully removed")
  }

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.department && doc.department.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesDept =
      departmentFilter === "ALL" ||
      (doc.department && doc.department.toLowerCase() === departmentFilter.toLowerCase())
    return matchesSearch && matchesDept
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
                  Doctors Management
                </h1>
                <p className="text-sm text-muted-foreground">
                  Al-Birri Hospital: Medical specialists, schedules, and practitioner management.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchDoctors}
                  disabled={loading}
                  className="gap-1.5"
                >
                  <RefreshCwIcon className={`size-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>

                {/* Add Doctor Sheet */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger render={
                    <Button size="sm" className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white">
                      <UserPlusIcon className="size-4" />
                      Add Doctor
                    </Button>
                  } />
                  <SheetContent className="w-full sm:max-w-2xl md:max-w-3xl overflow-y-auto p-6 sm:p-8">
                    <SheetHeader className="border-b border-border/60 pb-4">
                      <SheetTitle className="text-xl font-bold flex items-center gap-2.5 text-foreground">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                          <StethoscopeIcon className="size-4" />
                        </span>
                        Add New Medical Specialist
                      </SheetTitle>
                      <SheetDescription className="text-sm text-muted-foreground mt-1">
                        Register practitioner credentials, specialty, and photo to publish directly to the hospital website.
                      </SheetDescription>
                    </SheetHeader>

                    <form onSubmit={handleCreateDoctor} className="space-y-6 pt-5">
                      {/* Row 1: Name & Specialty */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Doctor Full Name <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            id="name"
                            placeholder="e.g. Dr. Amina Yusuf"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="h-11 rounded-xl border-border/80 px-3.5 text-sm focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="specialty" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Medical Specialty <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            id="specialty"
                            placeholder="e.g. Obstetrics & Gynaecology"
                            value={formData.specialty}
                            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                            required
                            className="h-11 rounded-xl border-border/80 px-3.5 text-sm focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                          />
                        </div>
                      </div>

                      {/* Row 2: Title & Badge */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Professional Title
                          </Label>
                          <Input
                            id="title"
                            placeholder="e.g. Senior Consultant Specialist"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="h-11 rounded-xl border-border/80 px-3.5 text-sm focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="badge" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Display Badge
                          </Label>
                          <Input
                            id="badge"
                            placeholder="e.g. Specialist, Head of Dept"
                            value={formData.badge}
                            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                            className="h-11 rounded-xl border-border/80 px-3.5 text-sm focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                          />
                        </div>
                      </div>

                      {/* Row 3: Department & Experience */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="department" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Hospital Department
                          </Label>
                          <Select
                            value={formData.department}
                            onValueChange={(val) => setFormData({ ...formData, department: val ?? "General Medicine" })}
                          >
                            <SelectTrigger id="department" className="h-11 rounded-xl border-border/80 px-3.5 text-sm">
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cardiology">Cardiology</SelectItem>
                              <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                              <SelectItem value="Surgery">Surgery</SelectItem>
                              <SelectItem value="Gynecology">Gynecology</SelectItem>
                              <SelectItem value="Dental Care">Dental Care</SelectItem>
                              <SelectItem value="General Medicine">General Medicine</SelectItem>
                              <SelectItem value="Neurology">Neurology</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="experience" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Years of Experience
                          </Label>
                          <Input
                            id="experience"
                            placeholder="e.g. 8+ Years Experience"
                            value={formData.experience}
                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                            className="h-11 rounded-xl border-border/80 px-3.5 text-sm focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                          />
                        </div>
                      </div>

                      {/* Row 4: Photo & Cloudinary */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="image" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Doctor Photograph
                          </Label>
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Cloudinary Storage Active
                          </span>
                        </div>

                        <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border/80 p-4 bg-muted/20">
                          <div className="flex flex-wrap items-center gap-3">
                            <label
                              htmlFor="photo-file"
                              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors shadow-xs"
                            >
                              {uploadingImage ? (
                                <Loader2Icon className="size-4 animate-spin text-emerald-600" />
                              ) : (
                                <UploadCloudIcon className="size-4 text-emerald-600" />
                              )}
                              {uploadingImage ? "Uploading to Cloudinary..." : "Choose Image File"}
                            </label>
                            <input
                              id="photo-file"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={uploadingImage}
                              className="hidden"
                            />
                            {uploadingImage && (
                              <span className="text-xs text-muted-foreground animate-pulse">Uploading to cloud storage...</span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            {formData.image && (
                              <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-border bg-muted shadow-xs">
                                <img
                                  src={formData.image}
                                  alt="Doctor preview"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <Input
                              id="image"
                              placeholder="/images/doctor1.png or https://res.cloudinary.com/..."
                              value={formData.image}
                              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                              className="h-11 rounded-xl text-xs font-mono border-border/80"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Row 5: Summary */}
                      <div className="space-y-2">
                        <Label htmlFor="details" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Biography & Summary
                        </Label>
                        <textarea
                          id="details"
                          rows={4}
                          className="w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 resize-none leading-relaxed"
                          placeholder="Brief description of credentials, special procedures, or background..."
                          value={formData.details}
                          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                        />
                      </div>

                      {/* Submit */}
                      <Button
                        type="submit"
                        className="w-full h-12 text-base font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-900/15 transition-all mt-4"
                      >
                        Save & Publish Doctor
                      </Button>
                    </form>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Filter toolbar */}
            <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-xs md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search doctor name, specialty, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={departmentFilter} onValueChange={(val) => setDepartmentFilter(val ?? "ALL")}>
                  <SelectTrigger className="w-[180px] h-10">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Departments</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Surgery">Surgery</SelectItem>
                    <SelectItem value="Gynecology">Gynecology</SelectItem>
                    <SelectItem value="General Medicine">General Medicine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredDoctors.map((doc) => (
                <Card key={doc.id} className="overflow-hidden border-border/70 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold text-lg">
                        {doc.name.replace("Dr. ", "").charAt(0)}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="secondary" className="text-[11px] font-medium">
                          {doc.badge}
                        </Badge>
                        <button
                          onClick={() => toggleAvailability(doc.id, doc.available)}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border transition-colors ${
                            doc.available
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-zinc-100 text-zinc-600 border-zinc-200"
                          }`}
                        >
                          <span className={`size-1.5 rounded-full ${doc.available ? "bg-emerald-500" : "bg-zinc-400"}`} />
                          {doc.available ? "On Duty" : "Off Duty"}
                        </button>
                      </div>
                    </div>
                    <CardTitle className="text-base font-bold mt-2 text-foreground">{doc.name}</CardTitle>
                    <CardDescription className="text-xs font-medium text-emerald-700">
                      {doc.specialty}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-4 pt-1 space-y-2 text-xs text-muted-foreground flex-1">
                    <div className="flex items-center gap-1.5">
                      <BuildingIcon className="size-3.5 text-muted-foreground" />
                      <span>Department: <strong className="text-foreground font-medium">{doc.department || "General"}</strong></span>
                    </div>
                    {doc.experience && (
                      <div className="flex items-center gap-1.5">
                        <BriefcaseIcon className="size-3.5 text-muted-foreground" />
                        <span>Experience: <strong className="text-foreground font-medium">{doc.experience}</strong></span>
                      </div>
                    )}
                    {doc.details && (
                      <p className="line-clamp-2 text-xs text-muted-foreground/90 mt-1">
                        {doc.details}
                      </p>
                    )}
                  </CardContent>

                  <CardFooter className="p-4 pt-2 border-t border-border/50 flex items-center justify-between">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1"
                      onClick={() => toggleAvailability(doc.id, doc.available)}
                    >
                      {doc.available ? "Set Off-duty" : "Set Available"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 size-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteDoctor(doc.id)}
                      title="Delete Doctor"
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
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
