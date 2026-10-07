"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"

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
  MailIcon,
  AwardIcon,
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
      title: "Inquiries & Messages",
      url: "/admin/dashboard/messages",
      icon: <MailIcon />,
    },
    {
      title: "Doctors",
      url: "/admin/dashboard/doctors",
      icon: <UsersIcon />,
    },
    {
      title: "Leadership Team",
      url: "/admin/dashboard/leadership",
      icon: <AwardIcon />,
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
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
