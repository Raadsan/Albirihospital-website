"use client"

import * as React from "react"
import Link from "next/link"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
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
  GlobeIcon,
  HeartPulseIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  Building2Icon,
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
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: (
        <Settings2Icon
        />
      ),
    },
    {
      title: "Get Help",
      url: "#",
      icon: (
        <CircleHelpIcon
        />
      ),
    },
    {
      title: "Search",
      url: "#",
      icon: (
        <SearchIcon
        />
      ),
    },
  ],
  documents: [
    {
      name: "Public Website",
      url: "/",
      icon: <GlobeIcon />,
    },
    {
      name: "Appointment Form",
      url: "/appointment",
      icon: <HeartPulseIcon />,
    },
    {
      name: "Departments",
      url: "/departments",
      icon: <Building2Icon />,
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
              <HeartPulseIcon className="size-5!" />
              <span className="text-base font-semibold">Albiri Hospital</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
