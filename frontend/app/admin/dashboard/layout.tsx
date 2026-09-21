import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDemoAdmin =
    (await cookies()).get("albiri_demo_admin")?.value === "1";

  if (!isDemoAdmin) {
    redirect("/admin/login");
  }

  return <div className="admin-dashboard">{children}</div>;
}
