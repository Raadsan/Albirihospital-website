"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PencilIcon, Trash2Icon, UserPlusIcon } from "lucide-react"
import { toast } from "react-toastify"
import { adminApi } from "@/app/api/api"
import { useAdminUser } from "@/components/admin-session-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getApiErrorMessage } from "@/lib/api-error"
import { dashboardSections, defaultReceptionistPermissions, type AccountRole, type DashboardSection, type DashboardUser } from "@/lib/dashboard-access"

type UserEditor = {
  id?: string
  name: string
  email: string
  password: string
  role: AccountRole
  permissions: DashboardSection[]
}

const emptyEditor: UserEditor = { name: "", email: "", password: "", role: "RECEPTIONIST", permissions: [...defaultReceptionistPermissions] }

export default function UsersPage() {
  const admin = useAdminUser()
  const router = useRouter()
  const [users, setUsers] = useState<DashboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [editor, setEditor] = useState<UserEditor | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<DashboardUser | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    adminApi.get<{ data: DashboardUser[] }>("/auth/users", { signal: controller.signal })
      .then(({ data }) => setUsers(data.data))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setLoadError(getApiErrorMessage(error, "Could not load users."))
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  function toggleSection(section: DashboardSection, checked: boolean) {
    setEditor((current) => current && {
      ...current,
      permissions: checked ? [...new Set([...current.permissions, section])] : current.permissions.filter((item) => item !== section),
    })
  }

  async function saveUser(event: FormEvent) {
    event.preventDefault()
    if (!editor || saving) return
    const { id, name, email, password, role, permissions } = editor
    setSaving(true)
    try {
      const { data } = id
        ? await adminApi.patch<{ user: DashboardUser }>(`/auth/users/${id}`, {
          name, email,
          ...(password ? { password } : {}),
          ...(role === "RECEPTIONIST" ? { permissions } : {}),
        })
        : await adminApi.post<{ user: DashboardUser }>("/auth/register", { name, email, password, role, permissions: role === "ADMIN" ? [] : permissions })
      setUsers((current) => id ? current.map((user) => user.id === id ? data.user : user) : [data.user, ...current])
      setEditor(null)
      toast.success(id ? "User updated." : "User created.")
      if (id === admin.id) router.refresh()
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Could not save the user."))
    } finally {
      setSaving(false)
    }
  }

  async function deleteUser() {
    if (!deleteTarget || deleting) return
    setDeleting(true)
    try {
      await adminApi.delete(`/auth/users/${deleteTarget.id}`)
      setUsers((current) => current.filter((user) => user.id !== deleteTarget.id))
      setDeleteTarget(null)
      toast.success("User deleted.")
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Could not delete the user."))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "18rem", "--header-height": "3rem" } as React.CSSProperties}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="space-y-5 p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Users</h2>
              <p className="mt-1 text-sm text-muted-foreground">Manage staff accounts, sign-in details, and dashboard access.</p>
            </div>
            <Button type="button" onClick={() => setEditor(emptyEditor)} disabled={loading || Boolean(loadError)}>
              <UserPlusIcon className="size-4" aria-hidden="true" /> Add User
            </Button>
          </div>

          {loading ? <p role="status" className="text-sm text-muted-foreground">Loading users…</p> : loadError ? (
            <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{loadError}</p>
          ) : (
            <div className="divide-y divide-border rounded-xl border bg-card shadow-xs">
              {users.map((user) => (
                <article key={user.id} className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">{user.name}</h3>
                      <Badge variant="outline">{user.role === "ADMIN" ? "Admin" : "Receptionist"}</Badge>
                      {user.id === admin.id && <Badge variant="secondary">Your account</Badge>}
                    </div>
                    <p className="break-all text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.role === "ADMIN" ? "Full dashboard access" : dashboardSections.filter(({ key }) => user.permissions.includes(key)).map(({ label }) => label).join(", ") || "Access paused"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" size="sm" variant="outline" aria-label={`Edit ${user.name}`} onClick={() => setEditor({ ...user, password: "" })}>
                      <PencilIcon className="size-4" aria-hidden="true" /> Edit
                    </Button>
                    {user.id !== admin.id && (
                      <Button type="button" size="sm" variant="outline" className="text-destructive hover:text-destructive" aria-label={`Delete ${user.name}`} onClick={() => setDeleteTarget(user)}>
                        <Trash2Icon className="size-4" aria-hidden="true" /> Delete
                      </Button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          <Sheet open={editor !== null} onOpenChange={(open) => { if (!open && !saving) setEditor(null) }}>
            {editor && (
              <SheetContent className="w-full overflow-y-auto p-6 sm:max-w-xl">
                <SheetHeader className="px-0">
                  <SheetTitle>{editor.id ? "Edit User" : "Add User"}</SheetTitle>
                  <SheetDescription>Staff sign in at /admin/login with the email and password you set.</SheetDescription>
                </SheetHeader>

                <form onSubmit={saveUser} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="staff-name">Full Name</Label>
                      <Input id="staff-name" maxLength={191} required value={editor.name} onChange={(event) => setEditor({ ...editor, name: event.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="staff-email">Email</Label>
                      <Input id="staff-email" type="email" maxLength={191} required value={editor.email} onChange={(event) => setEditor({ ...editor, email: event.target.value })} />
                    </div>
                    {editor.id !== admin.id ? (
                      <div className="space-y-2">
                        <Label htmlFor="staff-password">{editor.id ? "New Password (Optional)" : "Initial Password"}</Label>
                        <Input id="staff-password" type="password" autoComplete="new-password" minLength={12} maxLength={72} required={!editor.id} value={editor.password} onChange={(event) => setEditor({ ...editor, password: event.target.value })} />
                        <p className="text-xs text-muted-foreground">{editor.id ? "Leave blank to keep the current password. A new password signs this user out of existing sessions." : "Use at least 12 characters and no more than 72 bytes."}</p>
                      </div>
                    ) : (
                      <Link href="/admin/dashboard/password" className="self-center text-sm font-semibold text-primary underline-offset-4 hover:underline">Change your password</Link>
                    )}
                    {!editor.id && (
                      <div className="space-y-2">
                        <Label htmlFor="staff-role">Role</Label>
                        <select id="staff-role" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={editor.role} onChange={(event) => setEditor({ ...editor, role: event.target.value === "ADMIN" ? "ADMIN" : "RECEPTIONIST" })}>
                          <option value="RECEPTIONIST">Receptionist</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {editor.role === "RECEPTIONIST" ? (
                    <fieldset className="space-y-3" disabled={saving}>
                      <legend className="mb-2 font-semibold text-foreground">Dashboard Sections</legend>
                      <p className="text-sm text-muted-foreground">Select at least one section to enable sign-in. Clearing all selections pauses access.</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {dashboardSections.map(({ key, label }) => (
                          <label key={key} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm font-medium">
                            <input type="checkbox" className="size-4 accent-primary" checked={editor.permissions.includes(key)} onChange={(event) => toggleSection(key, event.target.checked)} />
                            {label}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ) : (
                    <p className="rounded-lg border bg-muted/50 p-3 text-sm">Admins have full dashboard access, including Users and record deletion.</p>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" disabled={saving} onClick={() => setEditor(null)}>Cancel</Button>
                    <Button type="submit" disabled={saving}>{saving ? "Saving…" : editor.id ? "Save Changes" : "Create User"}</Button>
                  </div>
                </form>
              </SheetContent>
            )}
          </Sheet>

          <Sheet open={deleteTarget !== null} onOpenChange={(open) => { if (!open && !deleting) setDeleteTarget(null) }}>
            {deleteTarget && (
              <SheetContent className="w-full p-6 sm:max-w-md">
                <SheetHeader className="px-0">
                  <SheetTitle>Delete User</SheetTitle>
                  <SheetDescription>
                    This permanently removes the account for {deleteTarget.name} ({deleteTarget.email}) and revokes dashboard access.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" disabled={deleting} onClick={() => setDeleteTarget(null)}>Cancel</Button>
                  <Button type="button" variant="destructive" disabled={deleting} onClick={deleteUser}>{deleting ? "Deleting…" : "Delete User"}</Button>
                </div>
              </SheetContent>
            )}
          </Sheet>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
