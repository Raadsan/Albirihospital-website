import "server-only"

import { cache } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { canAccessDashboard, isDashboardSection, type DashboardSection, type DashboardAccess } from "@/lib/dashboard-access"

export type AdminUser = DashboardAccess & {
  id: string
  name: string
  email: string
}

export const adminSessionCookie = "albiri_admin_session"
export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
} as const

type BackendRequest = RequestInit & { duplex?: "half" }

export function fetchAdminBackend(path: string, options: BackendRequest = {}) {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  return fetch(baseUrl.replace(/\/+$/, "") + path, {
    ...options,
    cache: "no-store",
    redirect: "error",
    signal: options.signal ?? AbortSignal.timeout(12_000),
  })
}

// Admin mutations require a custom same-origin header that forms cannot send.
export function isAdminMutation(request: Request) {
  return request.headers.get("x-requested-with") === "XMLHttpRequest"
}

export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  const token = (await cookies()).get(adminSessionCookie)?.value
  if (!token) return null

  try {
    const response = await fetchAdminBackend("/auth/me", {
      headers: { Authorization: "Bearer " + token },
    })
    if (!response.ok) return null

    const { user } = await response.json()
    if (user?.role !== "ADMIN" && user?.role !== "RECEPTIONIST") return null
    if (typeof user.id !== "string" || !user.id) return null
    const permissions: DashboardSection[] = Array.isArray(user.permissions) ? user.permissions.filter(isDashboardSection) : []
    if (user.role === "RECEPTIONIST" && !permissions.length) return null

    return { id: user.id, name: user.name, email: user.email, role: user.role, permissions }
  } catch {
    return null
  }
})

export function dashboardSectionLayout(section: DashboardSection | "users") {
  return async function SectionLayout({ children }: { children: React.ReactNode }) {
    const user = await getAdminUser()
    if (!user) redirect("/admin/login")
    if (!canAccessDashboard(user, section)) redirect("/admin/dashboard")
    return children
  }
}
