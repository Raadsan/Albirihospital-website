"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Menu } from "lucide-react"

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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      className="w-full bg-white border-b border-gray-200 shadow-sm relative z-40"
    >
      <div className="flex h-20 items-center justify-between max-w-7xl mx-auto px-4 md:px-8 w-full">
        {/* Brand/Logo */}
        <div className="flex-1 flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/LOGO2-01.png"
              alt="Albiri Logo"
              width={140}
              height={50}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Navigation - Hidden on Mobile */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <NavigationMenu>
          <NavigationMenuList className="gap-2">
            {/* Home */}
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent text-zinc-800 font-medium hover:bg-blue-50 hover:text-[#1e40af] focus:bg-blue-50 focus:text-[#1e40af] data-[active]:bg-blue-50 data-[state=open]:bg-blue-50")}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* About */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-zinc-800 font-medium hover:bg-blue-50 hover:text-[#1e40af] focus:bg-blue-50 focus:text-[#1e40af] data-[active]:bg-blue-50 data-[state=open]:bg-blue-50">About</NavigationMenuTrigger>
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
              <NavigationMenuTrigger className="bg-transparent text-zinc-800 font-medium hover:bg-blue-50 hover:text-[#1e40af] focus:bg-blue-50 focus:text-[#1e40af] data-[active]:bg-blue-50 data-[state=open]:bg-blue-50">Services</NavigationMenuTrigger>
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
              <NavigationMenuTrigger className="bg-transparent text-zinc-800 font-medium hover:bg-blue-50 hover:text-[#1e40af] focus:bg-blue-50 focus:text-[#1e40af] data-[active]:bg-blue-50 data-[state=open]:bg-blue-50">Departments</NavigationMenuTrigger>
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
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent text-zinc-800 font-medium hover:bg-blue-50 hover:text-[#1e40af] focus:bg-blue-50 focus:text-[#1e40af] data-[active]:bg-blue-50 data-[state=open]:bg-blue-50")}>
                  News & Blogs
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* Contact Us */}
            <NavigationMenuItem>
              <Link href="/contact" legacyBehavior passHref>
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent text-zinc-800 font-medium hover:bg-blue-50 hover:text-[#1e40af] focus:bg-blue-50 focus:text-[#1e40af] data-[active]:bg-blue-50 data-[state=open]:bg-blue-50")}>
                  Contact Us
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        </div>

        {/* Right Actions & Mobile Menu */}
        <div className="flex flex-1 justify-end items-center gap-4">
          <div className="hidden sm:block">
            <Link href="/appointment">
              <Button className="rounded-full bg-[#10b981] text-white hover:bg-[#1E40AF] font-semibold text-base px-8 py-6 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                Appointment
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-zinc-800"
                    aria-label="Open navigation menu"
                  />
                }
              >
                <Menu className="w-8 h-8" />
              </SheetTrigger>
              <SheetContent side="right" className="bg-white border-none w-[300px] p-6 z-[100]">
                <div className="flex flex-col gap-6 mt-8">
                  <Link href="/" className="text-lg font-semibold text-zinc-800 hover:text-[#1e40af]">Home</Link>
                  <Link href="/about/us" className="text-lg font-semibold text-zinc-800 hover:text-[#1e40af]">About</Link>
                  <Link href="/services/hospital-services" className="text-lg font-semibold text-zinc-800 hover:text-[#1e40af]">Services</Link>
                  <Link href="/departments/outpatient" className="text-lg font-semibold text-zinc-800 hover:text-[#1e40af]">Departments</Link>
                  <Link href="/news" className="text-lg font-semibold text-zinc-800 hover:text-[#1e40af]">News & Blogs</Link>
                  <Link href="/contact" className="text-lg font-semibold text-zinc-800 hover:text-[#1e40af]">Contact Us</Link>
                  <Link href="/appointment" className="mt-6">
                    <Button className="w-full rounded-full bg-[#10b981] text-white hover:bg-[#1E40AF] font-semibold py-6 text-base">
                      Book Appointment
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.div>
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
