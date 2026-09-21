"use client"

import * as React from "react"
import Link from "next/link"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
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
  HeartPulseIcon,
} from "lucide-react"

const data = {
  user: {
    name: "Albiri Admin",
    email: "admin@albirihospital.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Appointments",
      url: "/admin/dashboard/appointments",
      icon: <CalendarDaysIcon />,
    },
    {
      title: "Doctors",
      url: "/admin/dashboard/doctors",
      icon: <UsersIcon />,
    },
    {
      title: "News & Blogs",
      url: "/admin/dashboard/blogs",
      icon: <FileTextIcon />,
    },
    {
      title: "Health Videos",
      url: "/admin/dashboard/videos",
      icon: <VideoIcon />,
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/admin/dashboard" />}
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <HeartPulseIcon className="size-4!" />
              </span>
              <span className="text-base font-semibold">Albiri Hospital</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
