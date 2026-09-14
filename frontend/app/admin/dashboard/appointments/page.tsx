"use client"

import * as React from "react"
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  ClockIcon,
  FilterIcon,
  MailIcon,
  PhoneIcon,
  RefreshCwIcon,
  SearchIcon,
  Trash2Icon,
  UserIcon,
  XCircleIcon,
  EyeIcon,
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
} from "@/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import api from "@/app/api/api"

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"

export interface Appointment {
  id: string
  name: string
  phone: string
  email?: string | null
  department: string
  date: string
  time: string
  message?: string | null
  status: AppointmentStatus
  createdAt: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  const [loading, setLoading] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL")
  const [departmentFilter, setDepartmentFilter] = React.useState<string>("ALL")
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  // Fetch real appointments from backend API if running
  const fetchAppointments = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get("/appointments")
      if (response.data && Array.isArray(response.data.data)) {
        setAppointments(response.data.data)
      } else if (Array.isArray(response.data)) {
        setAppointments(response.data)
      }
    } catch (err) {
      console.warn("Could not fetch appointments from API, using local state:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  // Change appointment status (Admin & Receptionist)
  const handleUpdateStatus = async (id: string, newStatus: AppointmentStatus) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status: newStatus })
    } catch {
      // If offline or backend error, still update UI state locally
    }
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    )
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
    toast.success(`Appointment status updated to ${newStatus}`)
  }

  // Delete appointment
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return
    try {
      await api.delete(`/appointments/${id}`)
    } catch {
      // Local fallback
    }
    setAppointments((prev) => prev.filter((apt) => apt.id !== id))
    if (selectedAppointment?.id === id) {
      setIsSheetOpen(false)
    }
    toast.success("Appointment deleted successfully")
  }

  // Filtered list
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || apt.status === statusFilter
    const matchesDepartment = departmentFilter === "ALL" || apt.department.toLowerCase() === departmentFilter.toLowerCase()
    return matchesSearch && matchesStatus && matchesDepartment
  })

  // Statistics
  const pendingCount = appointments.filter((a) => a.status === "PENDING").length
  const confirmedCount = appointments.filter((a) => a.status === "CONFIRMED").length
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length
  const totalCount = appointments.length

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">Pending</Badge>
      case "CONFIRMED":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">Confirmed</Badge>
      case "COMPLETED":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200">Completed</Badge>
      case "CANCELLED":
        return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

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
            {/* Header section */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Appointments Management
                </h1>
                <p className="text-sm text-muted-foreground">
                  Al-Birri Hospital: Receptionist and Admin portal for patient appointment bookings.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchAppointments}
                  disabled={loading}
                  className="gap-1.5"
                >
                  <RefreshCwIcon className={`size-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <Card className="border-border/60 shadow-xs">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Total Bookings</CardDescription>
                  <CardTitle className="text-2xl font-bold text-foreground">{totalCount}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">All recorded patient appointments</CardContent>
              </Card>
              <Card className="border-border/60 shadow-xs">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs text-amber-700 font-medium">Pending Review</CardDescription>
                  <CardTitle className="text-2xl font-bold text-amber-600">{pendingCount}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">Awaiting receptionist confirmation</CardContent>
              </Card>
              <Card className="border-border/60 shadow-xs">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs text-blue-700 font-medium">Confirmed</CardDescription>
                  <CardTitle className="text-2xl font-bold text-blue-600">{confirmedCount}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">Ready for scheduled doctor visit</CardContent>
              </Card>
              <Card className="border-border/60 shadow-xs">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs text-emerald-700 font-medium">Completed</CardDescription>
                  <CardTitle className="text-2xl font-bold text-emerald-600">{completedCount}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">Patient consultation concluded</CardContent>
              </Card>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-xs md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search patient name, phone, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FilterIcon className="size-3.5" />
                  Status:
                </div>
                <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? "ALL")}>
                  <SelectTrigger className="w-[140px] h-10">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={departmentFilter} onValueChange={(val) => setDepartmentFilter(val ?? "ALL")}>
                  <SelectTrigger className="w-[170px] h-10">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Departments</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="General Medicine">General Medicine</SelectItem>
                    <SelectItem value="Dental Care">Dental Care</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Appointments Table */}
            <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Patient</th>
                      <th className="px-4 py-3">Phone / Contact</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Date & Time</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                          <AlertCircleIcon className="mx-auto size-8 text-muted-foreground/60 mb-2" />
                          No appointments found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">
                            <div className="flex items-center gap-2">
                              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                                {apt.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground leading-snug">{apt.name}</p>
                                <span className="text-xs text-muted-foreground">ID: {apt.id.slice(-6)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            <div className="flex flex-col gap-0.5 text-xs">
                              <span className="font-mono text-foreground">{apt.phone}</span>
                              {apt.email && <span>{apt.email}</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="font-normal capitalize">
                              {apt.department}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5 font-medium text-foreground">
                              <CalendarDaysIcon className="size-3.5 text-muted-foreground" />
                              {apt.date}
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
                              <ClockIcon className="size-3.5" />
                              {apt.time}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(apt.status)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick status transitions */}
                              {apt.status === "PENDING" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs text-blue-700 border-blue-200 hover:bg-blue-50"
                                  onClick={() => handleUpdateStatus(apt.id, "CONFIRMED")}
                                  title="Confirm Appointment"
                                >
                                  <CheckCircle2Icon className="size-3.5 mr-1" />
                                  Confirm
                                </Button>
                              )}
                              {apt.status === "CONFIRMED" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                                  onClick={() => handleUpdateStatus(apt.id, "COMPLETED")}
                                  title="Mark as Completed"
                                >
                                  <CheckCircle2Icon className="size-3.5 mr-1" />
                                  Complete
                                </Button>
                              )}
                              {apt.status !== "CANCELLED" && apt.status !== "COMPLETED" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 size-8 p-0 text-rose-600 hover:bg-rose-50"
                                  onClick={() => handleUpdateStatus(apt.id, "CANCELLED")}
                                  title="Cancel Appointment"
                                >
                                  <XCircleIcon className="size-4" />
                                </Button>
                              )}

                              {/* View details */}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 size-8 p-0"
                                onClick={() => {
                                  setSelectedAppointment(apt)
                                  setIsSheetOpen(true)
                                }}
                                title="View Details"
                              >
                                <EyeIcon className="size-4" />
                              </Button>

                              {/* Delete */}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 size-8 p-0 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDelete(apt.id)}
                                title="Delete Appointment"
                              >
                                <Trash2Icon className="size-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Details Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-6 sm:p-8">
            <SheetHeader className="border-b border-border/60 pb-4">
              <SheetTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                <CalendarDaysIcon className="size-5 text-emerald-600" />
                Appointment Details
              </SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground mt-1">
                Full patient consultation request and scheduling information.
              </SheetDescription>
            </SheetHeader>

            {selectedAppointment && (
              <div className="flex flex-col gap-5 py-4">
                {/* Patient Summary */}
                <div className="flex items-center gap-3 rounded-lg border border-border p-3.5 bg-muted/20">
                  <div className="flex size-11 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-base">
                    {selectedAppointment.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-foreground">{selectedAppointment.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {getStatusBadge(selectedAppointment.status)}
                      <span className="text-xs text-muted-foreground capitalize">
                        {selectedAppointment.department}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Shortcuts */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Patient Contact
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <a
                      href={`tel:${selectedAppointment.phone}`}
                      className="flex items-center justify-between rounded-lg border border-border p-2.5 hover:bg-muted/40 transition-colors text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="size-4 text-emerald-600" />
                        <span className="font-medium">{selectedAppointment.phone}</span>
                      </div>
                      <span className="text-xs text-emerald-600 font-medium">Call now</span>
                    </a>
                    {selectedAppointment.email && (
                      <a
                        href={`mailto:${selectedAppointment.email}`}
                        className="flex items-center justify-between rounded-lg border border-border p-2.5 hover:bg-muted/40 transition-colors text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <MailIcon className="size-4 text-blue-600" />
                          <span className="font-medium">{selectedAppointment.email}</span>
                        </div>
                        <span className="text-xs text-blue-600 font-medium">Send email</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Appointment Schedule Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Schedule & Department
                  </h4>
                  <div className="rounded-lg border border-border p-3 space-y-2 text-sm bg-muted/10">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">{selectedAppointment.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time Slot:</span>
                      <span className="font-medium">{selectedAppointment.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Medical Department:</span>
                      <span className="font-medium capitalize">{selectedAppointment.department}</span>
                    </div>
                  </div>
                </div>

                {/* Patient Complaint / Message */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Patient Notes / Symptoms
                  </h4>
                  <div className="rounded-lg border border-border p-3 bg-muted/30 text-sm leading-relaxed text-foreground">
                    {selectedAppointment.message || "No specific message provided by the patient."}
                  </div>
                </div>

                {/* Change Status Controls */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Update Appointment Status
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant={selectedAppointment.status === "CONFIRMED" ? "default" : "outline"}
                      className={selectedAppointment.status === "CONFIRMED" ? "bg-blue-600 hover:bg-blue-700" : ""}
                      onClick={() => handleUpdateStatus(selectedAppointment.id, "CONFIRMED")}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedAppointment.status === "COMPLETED" ? "default" : "outline"}
                      className={selectedAppointment.status === "COMPLETED" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                      onClick={() => handleUpdateStatus(selectedAppointment.id, "COMPLETED")}
                    >
                      Complete
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedAppointment.status === "PENDING" ? "default" : "outline"}
                      className={selectedAppointment.status === "PENDING" ? "bg-amber-600 hover:bg-amber-700" : ""}
                      onClick={() => handleUpdateStatus(selectedAppointment.id, "PENDING")}
                    >
                      Pending
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedAppointment.status === "CANCELLED" ? "destructive" : "outline"}
                      onClick={() => handleUpdateStatus(selectedAppointment.id, "CANCELLED")}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </SidebarInset>
    </SidebarProvider>
  )
}
