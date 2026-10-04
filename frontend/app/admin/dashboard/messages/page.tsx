"use client"

import * as React from "react"
import {
  MailIcon,
  PhoneIcon,
  SearchIcon,
  RefreshCwIcon,
  Trash2Icon,
  EyeIcon,
  CheckCircle2Icon,
  ArchiveIcon,
  AlertCircleIcon,
  ClockIcon,
  SendIcon,
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
import { getApiErrorMessage } from "@/lib/api-error"

export type MessageStatus = "UNREAD" | "READ" | "ARCHIVED"

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string | null
  subject: string
  message: string
  status: MessageStatus
  createdAt: string
}

export default function MessagesPage() {
  const [messages, setMessages] = React.useState<ContactMessage[]>([])
  const [loading, setLoading] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL")
  const [selectedMessage, setSelectedMessage] = React.useState<ContactMessage | null>(null)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  const [loadError, setLoadError] = React.useState("")

  const fetchMessages = React.useCallback(async () => {
    setLoading(true)
    setLoadError("")
    try {
      const response = await api.get("/contact")
      if (response.data && Array.isArray(response.data.data)) {
        setMessages(response.data.data)
      } else if (Array.isArray(response.data)) {
        setMessages(response.data)
      }
    } catch (err: unknown) {
      console.error("Could not fetch contact messages:", err)
      setLoadError(getApiErrorMessage(err, "Failed to load messages. Please refresh."))
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMessages()
  }, [fetchMessages])

  const handleUpdateStatus = async (id: string, newStatus: MessageStatus) => {
    try {
      await api.patch(`/contact/${id}/status`, { status: newStatus })
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      )
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
      toast.success(`Message marked as ${newStatus.toLowerCase()}`)
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to update status."))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return
    try {
      await api.delete(`/contact/${id}`)
      setMessages((prev) => prev.filter((m) => m.id !== id))
      if (selectedMessage?.id === id) {
        setIsSheetOpen(false)
      }
      toast.success("Message deleted successfully")
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to delete message."))
    }
  }

  const handleOpenMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg)
    setIsSheetOpen(true)
    if (msg.status === "UNREAD") {
      handleUpdateStatus(msg.id, "READ")
    }
  }

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.phone && msg.phone.includes(searchQuery))
    const matchesStatus = statusFilter === "ALL" || msg.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalCount = messages.length
  const unreadCount = messages.filter((m) => m.status === "UNREAD").length
  const readCount = messages.filter((m) => m.status === "READ").length
  const archivedCount = messages.filter((m) => m.status === "ARCHIVED").length

  const getStatusBadge = (status: MessageStatus) => {
    switch (status) {
      case "UNREAD":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">New / Unread</Badge>
      case "READ":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Read</Badge>
      case "ARCHIVED":
        return <Badge className="bg-slate-100 text-slate-700 border-slate-200">Archived</Badge>
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
            
            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Inquiries & Messages Inbox
                </h1>
                <p className="text-sm text-muted-foreground">
                  Al-Birri Hospital: Patient and visitor inquiries submitted from the Contact Us page.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchMessages}
                  disabled={loading}
                  className="gap-1.5"
                >
                  <RefreshCwIcon className={`size-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Error banner */}
            {loadError && (
              <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
                <AlertCircleIcon className="size-4 shrink-0" />
                {loadError}
              </div>
            )}

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <Card className="border-border/60 shadow-xs">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Total Inquiries</CardDescription>
                  <CardTitle className="text-2xl font-bold text-foreground">{totalCount}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">All messages received</CardContent>
              </Card>
              <Card className="border-border/60 shadow-xs">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs text-amber-700 font-medium">Unread Messages</CardDescription>
                  <CardTitle className="text-2xl font-bold text-amber-600">{unreadCount}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">Requires staff review</CardContent>
              </Card>
              <Card className="border-border/60 shadow-xs">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs text-blue-700 font-medium">Read / In-Process</CardDescription>
                  <CardTitle className="text-2xl font-bold text-blue-600">{readCount}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">Opened by coordinators</CardContent>
              </Card>
              <Card className="border-border/60 shadow-xs">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs text-slate-700 font-medium">Archived</CardDescription>
                  <CardTitle className="text-2xl font-bold text-slate-700">{archivedCount}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">Resolved inquiries</CardContent>
              </Card>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-xs md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search sender, email, subject, or message text..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Status:</span>
                <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? "ALL")}>
                  <SelectTrigger className="w-[150px] h-10">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Messages</SelectItem>
                    <SelectItem value="UNREAD">Unread Only</SelectItem>
                    <SelectItem value="READ">Read</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Messages Table */}
            <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Sender</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-4 py-3">Received At</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredMessages.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                          <AlertCircleIcon className="mx-auto size-8 text-muted-foreground/60 mb-2" />
                          No inquiries found.
                        </td>
                      </tr>
                    ) : (
                      filteredMessages.map((msg) => (
                        <tr
                          key={msg.id}
                          className={`hover:bg-muted/30 transition-colors ${
                            msg.status === "UNREAD" ? "bg-amber-50/30 font-medium" : ""
                          }`}
                        >
                          <td className="px-4 py-3 text-foreground">
                            <div className="flex items-center gap-2">
                              <div className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                msg.status === "UNREAD"
                                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                                  : "bg-primary/10 text-primary"
                              }`}>
                                {msg.name.charAt(0)}
                              </div>
                              <span className="font-semibold text-foreground">{msg.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-foreground">{msg.email}</span>
                              {msg.phone && <span className="font-mono">{msg.phone}</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-foreground max-w-xs truncate font-medium">
                            {msg.subject}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <ClockIcon className="size-3.5 text-muted-foreground" />
                              {new Date(msg.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(msg.status)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1 text-xs"
                                onClick={() => handleOpenMessage(msg)}
                              >
                                <EyeIcon className="size-3.5" />
                                Read
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 size-8 p-0 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDelete(msg.id)}
                                title="Delete"
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

        {/* Message Details Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-6 sm:p-8">
            <SheetHeader className="border-b border-border/60 pb-4">
              <SheetTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                <MailIcon className="size-5 text-primary" />
                Message Inquiry
              </SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground mt-1">
                Detailed view of visitor communication and inquiry details.
              </SheetDescription>
            </SheetHeader>

            {selectedMessage && (
              <div className="flex flex-col gap-5 py-4">
                {/* Sender details */}
                <div className="flex items-center gap-3 rounded-lg border border-border p-3.5 bg-muted/20">
                  <div className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-base">
                    {selectedMessage.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-foreground">{selectedMessage.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {getStatusBadge(selectedMessage.status)}
                      <span className="text-xs text-muted-foreground">
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick contact buttons */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Direct Contact Actions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
                    >
                      <SendIcon className="size-3.5" />
                      Reply via Email
                    </a>
                    {selectedMessage.phone ? (
                      <a
                        href={`tel:${selectedMessage.phone}`}
                        className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                      >
                        <PhoneIcon className="size-3.5 text-emerald-600" />
                        Call {selectedMessage.phone}
                      </a>
                    ) : (
                      <div className="flex items-center justify-center rounded-xl border border-dashed border-border px-4 py-2 text-xs text-muted-foreground">
                        No phone provided
                      </div>
                    )}
                  </div>
                </div>

                {/* Subject & Message Content */}
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block">
                      Subject
                    </span>
                    <h4 className="text-base font-bold text-foreground mt-1">
                      {selectedMessage.subject}
                    </h4>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block mb-1">
                      Message Content
                    </span>
                    <div className="rounded-xl border border-border/70 bg-muted/20 p-4 text-sm leading-relaxed text-foreground whitespace-pre-line">
                      {selectedMessage.message}
                    </div>
                  </div>
                </div>

                {/* Status transitions */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Update Message Status
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      size="sm"
                      variant={selectedMessage.status === "READ" ? "default" : "outline"}
                      className={selectedMessage.status === "READ" ? "bg-blue-600 hover:bg-blue-700" : ""}
                      onClick={() => handleUpdateStatus(selectedMessage.id, "READ")}
                    >
                      <CheckCircle2Icon className="size-3.5 mr-1" />
                      Mark Read
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedMessage.status === "UNREAD" ? "default" : "outline"}
                      className={selectedMessage.status === "UNREAD" ? "bg-amber-600 hover:bg-amber-700" : ""}
                      onClick={() => handleUpdateStatus(selectedMessage.id, "UNREAD")}
                    >
                      Mark Unread
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedMessage.status === "ARCHIVED" ? "default" : "outline"}
                      onClick={() => handleUpdateStatus(selectedMessage.id, "ARCHIVED")}
                    >
                      <ArchiveIcon className="size-3.5 mr-1" />
                      Archive
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
