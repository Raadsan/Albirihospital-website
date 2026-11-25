import "server-only"

import { cache } from "react"
import { cookies } from "next/headers"

export type AdminUser = {
  name: string
  email: string
  role: "ADMIN" | "RECEPTIONIST"
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

    return { name: user.name, email: user.email, role: user.role }
  } catch {
    return null
  }
})
