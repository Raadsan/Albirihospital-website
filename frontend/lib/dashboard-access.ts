export const dashboardSections = [
  { key: "appointments", label: "Appointments", path: "appointments" },
  { key: "contact", label: "Inquiries & Messages", path: "messages" },
  { key: "doctors", label: "Doctors", path: "doctors" },
  { key: "leadership", label: "Leadership Team", path: "leadership" },
  { key: "blogs", label: "News & Blogs", path: "blogs" },
  { key: "videos", label: "Health Videos", path: "videos" },
] as const

export type DashboardSection = (typeof dashboardSections)[number]["key"]
export type AccountRole = "ADMIN" | "RECEPTIONIST"
export type DashboardAccess = { role: AccountRole; permissions: DashboardSection[] }
export type DashboardUser = DashboardAccess & { id: string; name: string; email: string; createdAt: string }

export const defaultReceptionistPermissions = ["appointments", "contact"] as const satisfies readonly DashboardSection[]

export function isDashboardSection(value: unknown): value is DashboardSection {
  return dashboardSections.some(({ key }) => key === value)
}

export function canAccessDashboard(user: DashboardAccess, section: DashboardSection | "users") {
  return user.role === "ADMIN" || (section !== "users" && user.permissions.includes(section))
}
