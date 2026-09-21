"use client"

import * as React from "react"
import Link from "next/link"
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  ClockIcon,
  FilterIcon,
  MailIcon,
  PhoneIcon,
  RefreshCwIcon,
  SearchIcon,
  XCircleIcon,
  EyeIcon,
  ExternalLinkIcon,
  UserIcon,
  Building2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  BanIcon,
} from "lucide-react"
import { toast } from "sonner"

import api from "@/app/api/api"
import { getApiErrorMessage } from "@/lib/api-error"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"

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
  updatedAt?: string
}

export function RecentAppointmentsTable() {
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL")
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  const [page, setPage] = React.useState(1)
  const pageSize = 8

  // Fetch real appointments from backend API
  const fetchAppointments = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get("/appointments")
      if (response.data && Array.isArray(response.data.data)) {
        setAppointments(response.data.data)
      } else if (Array.isArray(response.data)) {
        setAppointments(response.data)
      }
    } catch (err: unknown) {
      console.error("Could not fetch appointments for dashboard:", err)
      toast.error(getApiErrorMessage(err, "Could not load appointments."))
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  // Change appointment status
  const handleUpdateStatus = async (id: string, newStatus: AppointmentStatus) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status: newStatus })
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
      )
      if (selectedAppointment && selectedAppointment.id === id) {
        setSelectedAppointment((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
      toast.success(`Status updated to ${newStatus}`)
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to update appointment status."))
    }
  }

  // Counts
  const totalCount = appointments.length
  const pendingCount = appointments.filter((a) => a.status === "PENDING").length
  const confirmedCount = appointments.filter((a) => a.status === "CONFIRMED").length
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length
  const cancelledCount = appointments.filter((a) => a.status === "CANCELLED").length

  // Filter & Search
  const filtered = appointments.filter((apt) => {
    const matchesSearch =
      apt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (apt.email && apt.email.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "ALL" || apt.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginatedData = filtered.slice((page - 1) * pageSize, page * pageSize)

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800 gap-1 font-medium">
            <ClockIcon className="size-3" />
            Pending
          </Badge>
        )
      case "CONFIRMED":
        return (
          <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-800 gap-1 font-medium">
            <CheckIcon className="size-3" />
            Confirmed
          </Badge>
        )
      case "COMPLETED":
        return (
          <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800 gap-1 font-medium">
            <CheckCircle2Icon className="size-3" />
            Completed
          </Badge>
        )
      case "CANCELLED":
        return (
          <Badge variant="outline" className="border-rose-300 bg-rose-50 text-rose-800 gap-1 font-medium">
            <XCircleIcon className="size-3" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDept = (dept: string) => {
    if (!dept) return "General Medicine"
    return dept
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      {/* Top Header Card */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Recent Patient Appointments
            </h2>
            <Badge variant="secondary" className="font-semibold text-xs px-2 py-0.5">
              Live Data ({totalCount})
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Real-time patient bookings submitted directly through the hospital website
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAppointments}
            disabled={loading}
            className="gap-1.5 h-9"
          >
            <RefreshCwIcon className={`size-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
            Refresh
          </Button>

          <Button size="sm" render={<Link href="/admin/dashboard/appointments" />} className="gap-1.5 h-9">
            Manage All
            <ExternalLinkIcon className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-xs md:flex-row md:items-center md:justify-between">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => {
              setStatusFilter("ALL")
              setPage(1)
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === "ALL"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All Bookings
            <span className="rounded-full bg-background/20 px-1.5 py-0.2 text-[10px]">
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => {
              setStatusFilter("PENDING")
              setPage(1)
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === "PENDING"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100"
            }`}
          >
            Pending
            <span className="rounded-full bg-background/20 px-1.5 py-0.2 text-[10px]">
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => {
              setStatusFilter("CONFIRMED")
              setPage(1)
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === "CONFIRMED"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-blue-50 text-blue-800 hover:bg-blue-100"
            }`}
          >
            Confirmed
            <span className="rounded-full bg-background/20 px-1.5 py-0.2 text-[10px]">
              {confirmedCount}
            </span>
          </button>

          <button
            onClick={() => {
              setStatusFilter("COMPLETED")
              setPage(1)
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === "COMPLETED"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            }`}
          >
            Completed
            <span className="rounded-full bg-background/20 px-1.5 py-0.2 text-[10px]">
              {completedCount}
            </span>
          </button>

          {cancelledCount > 0 && (
            <button
              onClick={() => {
                setStatusFilter("CANCELLED")
                setPage(1)
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === "CANCELLED"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-rose-50 text-rose-800 hover:bg-rose-100"
              }`}
            >
              Cancelled
              <span className="rounded-full bg-background/20 px-1.5 py-0.2 text-[10px]">
                {cancelledCount}
              </span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, phone, dept..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
        {loading && appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <RefreshCwIcon className="size-8 animate-spin text-primary/60 mb-3" />
            <p className="text-sm font-medium text-foreground">Loading hospital appointments...</p>
            <p className="text-xs text-muted-foreground mt-1">Connecting to live database</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground mb-4">
              <CalendarDaysIcon className="size-7" />
            </div>
            <h3 className="text-base font-semibold text-foreground">No appointments found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1.5">
              {searchQuery || statusFilter !== "ALL"
                ? "No bookings match your current search or filter criteria. Try clearing filters."
                : "No patient bookings have been submitted yet. New bookings from the website form will appear here automatically."}
            </p>
            <div className="mt-4 flex gap-2">
              {(searchQuery || statusFilter !== "ALL") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("ALL")
                  }}
                >
                  Clear Filters
                </Button>
              )}
              <Button size="sm" render={<Link href="/appointment" />}>
                Test Appointment Form
              </Button>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[280px]">Patient</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Booking Received</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((apt) => (
                <TableRow key={apt.id} className="hover:bg-muted/30">
                  {/* Patient Info */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs uppercase">
                        {apt.name.substring(0, 2)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-foreground text-sm truncate">
                          {apt.name}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1 font-mono">
                            <PhoneIcon className="size-3 text-muted-foreground/80" />
                            {apt.phone}
                          </span>
                          {apt.email && (
                            <span className="hidden lg:inline truncate">
                              • {apt.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Department */}
                  <TableCell>
                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1 text-xs font-medium text-foreground">
                      <Building2Icon className="size-3 text-primary/70" />
                      {formatDept(apt.department)}
                    </div>
                  </TableCell>

                  {/* Date & Time */}
                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <span className="font-medium text-foreground inline-flex items-center gap-1">
                        <CalendarDaysIcon className="size-3 text-muted-foreground" />
                        {apt.date}
                      </span>
                      <span className="text-muted-foreground inline-flex items-center gap-1 font-mono">
                        <ClockIcon className="size-3" />
                        {apt.time}
                      </span>
                    </div>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>{getStatusBadge(apt.status)}</TableCell>

                  {/* Created At */}
                  <TableCell className="text-xs text-muted-foreground">
                    {apt.createdAt ? new Date(apt.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }) : "N/A"}
                  </TableCell>

                  {/* Action Dropdown */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon" className="size-8" />
                        }
                      >
                        <MoreHorizontalIcon className="size-4" />
                        <span className="sr-only">Open menu</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedAppointment(apt)
                            setIsSheetOpen(true)
                          }}
                          className="gap-2 cursor-pointer"
                        >
                          <EyeIcon className="size-4 text-blue-600" />
                          View Full Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-[11px] text-muted-foreground font-normal">
                          Change Status
                        </DropdownMenuLabel>
                        {apt.status !== "CONFIRMED" && (
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(apt.id, "CONFIRMED")}
                            className="gap-2 cursor-pointer text-blue-700 font-medium"
                          >
                            <CheckIcon className="size-4" />
                            Mark as Confirmed
                          </DropdownMenuItem>
                        )}
                        {apt.status !== "COMPLETED" && (
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(apt.id, "COMPLETED")}
                            className="gap-2 cursor-pointer text-emerald-700 font-medium"
                          >
                            <CheckCircle2Icon className="size-4" />
                            Mark as Completed
                          </DropdownMenuItem>
                        )}
                        {apt.status !== "CANCELLED" && (
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(apt.id, "CANCELLED")}
                            className="gap-2 cursor-pointer text-rose-700"
                          >
                            <BanIcon className="size-4" />
                            Mark as Cancelled
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Footer with Pagination */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/80 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
            <div>
              Showing <span className="font-semibold text-foreground">{Math.min(filtered.length, (page - 1) * pageSize + 1)}</span> to{" "}
              <span className="font-semibold text-foreground">{Math.min(filtered.length, page * pageSize)}</span> of{" "}
              <span className="font-semibold text-foreground">{filtered.length}</span> bookings
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="size-8 p-0"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeftIcon className="size-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              <span className="px-2 font-medium text-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="size-8 p-0"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                <ChevronRightIcon className="size-4" />
                <span className="sr-only">Next Page</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Appointment Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selectedAppointment && (
            <div className="flex flex-col gap-6 py-2">
              <SheetHeader>
                <div className="flex items-center justify-between pr-6">
                  {getStatusBadge(selectedAppointment.status)}
                  <span className="font-mono text-xs text-muted-foreground">
                    ID: {selectedAppointment.id.substring(0, 8)}...
                  </span>
                </div>
                <SheetTitle className="text-xl font-bold mt-2">
                  {selectedAppointment.name}
                </SheetTitle>
                <SheetDescription>
                  Appointment requested on {new Date(selectedAppointment.createdAt).toLocaleDateString()}
                </SheetDescription>
              </SheetHeader>

              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  Contact Information
                </h4>
                <div className="flex flex-col gap-2">
                  <a
                    href={`tel:${selectedAppointment.phone}`}
                    className="flex items-center justify-between rounded-xl border border-border p-3 hover:bg-muted/40 transition-colors text-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <PhoneIcon className="size-4 text-emerald-600" />
                      <span className="font-mono font-medium">{selectedAppointment.phone}</span>
                    </div>
                    <span className="text-xs text-emerald-600 font-semibold">Call Patient</span>
                  </a>

                  {selectedAppointment.email && (
                    <a
                      href={`mailto:${selectedAppointment.email}`}
                      className="flex items-center justify-between rounded-xl border border-border p-3 hover:bg-muted/40 transition-colors text-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <MailIcon className="size-4 text-blue-600" />
                        <span className="font-medium truncate max-w-[200px]">{selectedAppointment.email}</span>
                      </div>
                      <span className="text-xs text-blue-600 font-semibold">Send Email</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Appointment Schedule Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  Schedule & Department
                </h4>
                <div className="rounded-xl border border-border p-3.5 space-y-2.5 text-sm bg-muted/20">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department:</span>
                    <span className="font-semibold capitalize text-foreground">
                      {formatDept(selectedAppointment.department)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled Date:</span>
                    <span className="font-medium text-foreground">{selectedAppointment.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled Time:</span>
                    <span className="font-medium text-foreground font-mono">{selectedAppointment.time}</span>
                  </div>
                </div>
              </div>

              {/* Patient Notes / Message */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  Patient Notes / Symptoms
                </h4>
                <div className="rounded-xl border border-border p-3.5 bg-muted/30 text-sm leading-relaxed text-foreground min-h-[70px]">
                  {selectedAppointment.message || "No notes or special symptoms provided."}
                </div>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="space-y-3 pt-2 border-t border-border">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  Update Booking Status
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant={selectedAppointment.status === "CONFIRMED" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedAppointment.id, "CONFIRMED")}
                    className="justify-start gap-1.5"
                  >
                    <CheckIcon className="size-3.5 text-blue-600" />
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedAppointment.status === "COMPLETED" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedAppointment.id, "COMPLETED")}
                    className="justify-start gap-1.5"
                  >
                    <CheckCircle2Icon className="size-3.5 text-emerald-600" />
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedAppointment.status === "PENDING" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedAppointment.id, "PENDING")}
                    className="justify-start gap-1.5"
                  >
                    <ClockIcon className="size-3.5 text-amber-600" />
                    Pending
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedAppointment.status === "CANCELLED" ? "destructive" : "outline"}
                    onClick={() => handleUpdateStatus(selectedAppointment.id, "CANCELLED")}
                    className="justify-start gap-1.5"
                  >
                    <XCircleIcon className="size-3.5 text-rose-600" />
                    Cancel
                  </Button>
                </div>
              </div>

              {/* Link to Appointment Manager */}
              <Button
                variant="secondary"
                size="sm"
                render={<Link href="/admin/dashboard/appointments" />}
                className="w-full gap-2 mt-2"
              >
                Go to Full Appointments Manager
                <ExternalLinkIcon className="size-4" />
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
