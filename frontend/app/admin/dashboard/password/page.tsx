"use client"

import { type FormEvent, useState } from "react"
import { KeyRoundIcon, Loader2Icon } from "lucide-react"

import { adminApi } from "@/app/api/api"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getApiErrorMessage } from "@/lib/api-error"

export default function ChangePasswordPage() {
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [updated, setUpdated] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    const form = event.currentTarget
    const fields = new FormData(form)
    const currentPassword = String(fields.get("currentPassword") ?? "")
    const newPassword = String(fields.get("newPassword") ?? "")

    if (newPassword !== fields.get("confirmPassword")) {
      setError("The new passwords do not match.")
      return
    }

    setSubmitting(true)
    try {
      await adminApi.patch("/auth/password", { currentPassword, newPassword })
      form.reset()
      setUpdated(true)
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, "The password could not be changed. Try again."))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SidebarProvider style={{ "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="p-4 sm:p-6">
          <Card className="max-w-lg border-blue-100">
            <CardHeader>
              <div className="mb-2 grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <KeyRoundIcon className="size-5" aria-hidden="true" />
              </div>
              <CardTitle>Change password</CardTitle>
              <CardDescription>
                Enter your current password to update your account. You’ll be signed out on all devices after the change.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {updated ? (
                <div className="space-y-4">
                  <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
                    Password updated. Sign in again with your new password.
                  </p>
                  <Button render={<a href="/admin/login" />}>Sign in again</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current password</Label>
                    <Input id="current-password" name="currentPassword" type="password" autoComplete="current-password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New password</Label>
                    <Input id="new-password" name="newPassword" type="password" autoComplete="new-password" minLength={12} required aria-describedby="password-requirements" />
                    <p id="password-requirements" className="text-sm text-muted-foreground">Use at least 12 characters.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm new password</Label>
                    <Input id="confirm-password" name="confirmPassword" type="password" autoComplete="new-password" required />
                  </div>
                  {error && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />}
                    {submitting ? "Updating password…" : "Update password"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
