"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { AdminUser } from "@/lib/admin-session"

const AdminUserContext = createContext<AdminUser | null>(null)

export function AdminSessionProvider({ user, children }: { user: AdminUser; children: ReactNode }) {
  return <AdminUserContext.Provider value={user}>{children}</AdminUserContext.Provider>
}

export function useAdminUser() {
  const user = useContext(AdminUserContext)
  if (!user) throw new Error("The dashboard requires an admin session.")
  return user
}
