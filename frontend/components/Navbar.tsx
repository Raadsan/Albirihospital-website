"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"

const aboutItems: { title: string; href: string }[] = [
  { title: "About Us", href: "/about/us" },
  { title: "Doctors", href: "/about/doctors" },
  { title: "Leadership Team", href: "/about/leadership" },
  { title: "Hospital Overview", href: "/about/overview" },
]

const servicesItems: { title: string; href: string }[] = [
  { title: "Health Checkups", href: "/services/health-checkups" },
  { title: "Hospital Services", href: "/services/hospital-services" },
]

const departmentsItems: { title: string; href: string }[] = [
  { title: "Inpatient", href: "/departments/inpatient" },
  { title: "Outpatient", href: "/departments/outpatient" },
  { title: "Theatre(OT)", href: "/departments/theatre" },
  { title: "Specialties", href: "/departments/specialties" },
  { title: "Maternity", href: "/departments/maternity" },
  { title: "Pharmacy", href: "/departments/pharmacy" },
  { title: "Laboratory", href: "/departments/laboratory" },
  { title: "Radiology", href: "/departments/radiology" },
]

export function Navbar() {
  return (
    <div className="w-full bg-[#1e40af] border-b border-white/20 shadow-md relative z-40">
      <div className="flex h-20 items-center justify-between max-w-7xl mx-auto px-4 md:px-8 w-full">
        {/* Brand/Logo */}
        <div className="flex-1 flex items-center">
        <Link href="/" className="flex items-center">
          <Image 
            src="/images/logo1.png" 
            alt="Albiri Logo" 
            width={140} 
            height={50} 
            className="object-contain"
            priority 
          />
        </Link>
      </div>

      {/* Navigation */}
      <NavigationMenu>
        <NavigationMenuList className="gap-2">
          {/* Home */}
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[active]:bg-white/10 data-[state=open]:bg-white/10")}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          {/* About */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[active]:bg-white/10 data-[state=open]:bg-white/10">About</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[200px] gap-3 p-4">
                {aboutItems.map((item) => (
                  <ListItem key={item.title} title={item.title} href={item.href} />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Services */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[active]:bg-white/10 data-[state=open]:bg-white/10">Services</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[200px] gap-3 p-4">
                {servicesItems.map((item) => (
                  <ListItem key={item.title} title={item.title} href={item.href} />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Departments */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[active]:bg-white/10 data-[state=open]:bg-white/10">Departments</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[200px] gap-3 p-4">
                {departmentsItems.map((item) => (
                  <ListItem key={item.title} title={item.title} href={item.href} />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* News & Blogs */}
          <NavigationMenuItem>
            <Link href="/news" legacyBehavior passHref>
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[active]:bg-white/10 data-[state=open]:bg-white/10")}>
                News & Blogs
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          {/* Contact Us */}
          <NavigationMenuItem>
            <Link href="/contact" legacyBehavior passHref>
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[active]:bg-white/10 data-[state=open]:bg-white/10")}>
                Contact Us
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Appointment Button */}
      <div className="flex-1 flex justify-end">
        <Link href="/appointment">
          <Button className="rounded-full bg-[#10b981] text-white hover:bg-[#059669] font-semibold text-base px-8 py-6 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            Appointment
          </Button>
        </Link>
      </div>
    </div>
  </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <Link href={href || "#"} legacyBehavior passHref>
        <NavigationMenuLink
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-[#1e3a8a]",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {children && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          )}
        </NavigationMenuLink>
      </Link>
    </li>
  )
})
ListItem.displayName = "ListItem"
