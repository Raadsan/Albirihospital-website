import { redirect } from "next/navigation";
import { AdminSessionProvider } from "@/components/admin-session-provider";
import { getAdminUser } from "@/lib/admin-session";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAdminUser();
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <AdminSessionProvider user={user}>
      <div className="admin-dashboard">{children}</div>
    </AdminSessionProvider>
  );
}
