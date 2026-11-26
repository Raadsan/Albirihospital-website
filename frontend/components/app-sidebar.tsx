"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { useAdminUser } from "@/components/admin-session-provider"
import { canAccessDashboard, type DashboardSection } from "@/lib/dashboard-access"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  CalendarDaysIcon,
  UsersIcon,
  FileTextIcon,
  VideoIcon,
  MailIcon,
  AwardIcon,
  UserCogIcon,
} from "lucide-react"

const navigation: Array<{title: string; url: string; icon: React.ReactNode; section?: DashboardSection | "users"}> = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Appointments",
      section: "appointments",
      url: "/admin/dashboard/appointments",
      icon: <CalendarDaysIcon />,
    },
    {
      title: "Inquiries & Messages",
      section: "contact",
      url: "/admin/dashboard/messages",
      icon: <MailIcon />,
    },
    {
      title: "Doctors",
      section: "doctors",
      url: "/admin/dashboard/doctors",
      icon: <UsersIcon />,
    },
    {
      title: "Leadership Team",
      section: "leadership",
      url: "/admin/dashboard/leadership",
      icon: <AwardIcon />,
    },
    {
      title: "News & Blogs",
      section: "blogs",
      url: "/admin/dashboard/blogs",
      icon: <FileTextIcon />,
    },
    {
      title: "Health Videos",
      section: "videos",
      url: "/admin/dashboard/videos",
      icon: <VideoIcon />,
    },
    {
      title: "Users",
      section: "users",
      url: "/admin/dashboard/users",
      icon: <UserCogIcon />,
    },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAdminUser()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-sidebar-border/40 py-2.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="h-auto py-1 px-1.5 hover:bg-transparent data-[slot=sidebar-menu-button]:p-1!"
              render={<Link href="/admin/dashboard" />}
            >
              <div className="flex items-center">
                <Image
                  src="/images/LOGO2-01.png"
                  alt="Albiri Hospital"
                  width={200}
                  height={50}
                  className="h-18 w-auto object-contain"
                  priority
                />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation.filter(({ section }) => !section || canAccessDashboard(user, section))} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ ...user, avatar: "" }} />
      </SidebarFooter>
    </Sidebar>
  )
}
