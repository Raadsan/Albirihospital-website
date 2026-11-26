const sections = new Set(["appointments", "contact", "doctors", "leadership", "blogs", "videos"]);

export const defaultReceptionistPermissions = Object.freeze(["appointments", "contact"]);

export function parseDashboardPermissions(value) {
  if (!Array.isArray(value) || value.some((section) => !sections.has(section))) return null;
  return [...new Set(value)];
}

export function canAccessSection(user, section) {
  return user?.role === "ADMIN" || (user?.role === "RECEPTIONIST" && user.permissions?.includes(section));
}

export async function loadDashboardPermissions(prisma, user) {
  if (user.role !== "RECEPTIONIST") return [];
  const access = await prisma.dashboardAccess.findUnique({ where: { userId: user.id } });
  return parseDashboardPermissions(access?.permissions) ?? [];
}
