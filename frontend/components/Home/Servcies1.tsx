"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
    Ambulance,
    CalendarCheck2,
    ChevronRight,
    Hospital,
    Microscope,
    PhoneCall,
    Stethoscope,
} from "lucide-react"

const services = [
    {
        title: "Checkups",
        description: "Routine health screening",
        href: "/services/health-checkups",
        icon: Microscope,
    },
    {
        title: "Appointment",
        description: "Schedule your visit",
        href: "/appointment",
        icon: CalendarCheck2,
    },
    {
        title: "Ambulance",
        description: "Emergency assistance",
        href: "tel:4446",
        icon: Ambulance,
    },
    {
        title: "Call for help",
        description: "Call our care team",
        href: "tel:4446",
        icon: PhoneCall,
    },
    {
        title: "Hospital",
        description: "Explore our facilities",
        href: "/about/overview",
        icon: Hospital,
    },
    {
        title: "Doctors",
        description: "Meet our specialists",
        href: "/about/doctors",
        icon: Stethoscope,
    },
] as const

export function Servcies1() {
    const prefersReducedMotion = useReducedMotion()

    return (
        <section className="relative overflow-hidden px-4 pb-20 pt-24 sm:px-6 lg:px-8">

            <div className="relative mx-auto max-w-7xl">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
                    {services.map((service, index) => {
                        const Icon = service.icon

                        return (
                            <motion.div
                                key={service.title}
                                initial={prefersReducedMotion ? false : { opacity: 0, y: 35, scale: 0.94 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, amount: 0.25 }}
                                transition={{
                                    delay: prefersReducedMotion ? 0 : index * 0.08,
                                    duration: 0.55,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                whileHover={prefersReducedMotion ? undefined : { y: -8 }}
                                className="h-full"
                            >
                                <Link
                                    href={service.href}
                                    className="group relative flex h-full min-h-52 flex-col items-center overflow-hidden rounded-3xl border border-white/80 bg-white px-3 py-6 text-center shadow-[0_10px_35px_rgba(30,64,175,0.08)] transition-all duration-500 hover:border-[#1E40AF] hover:bg-[#1E40AF] hover:shadow-[0_20px_45px_rgba(30,64,175,0.3)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
                                >
                                    <span className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                    <span className="flex size-20 items-center justify-center rounded-2xl bg-blue-50 text-[#1E40AF] transition-all duration-500 group-hover:rotate-3 group-hover:scale-110 group-hover:bg-white/15 group-hover:text-white">
                                        <Icon aria-hidden="true" strokeWidth={1.7} className="size-10" />
                                    </span>

                                    <h3 className="mt-5 text-sm font-bold text-[#1E40AF] transition-colors duration-500 group-hover:text-white sm:text-base">
                                        {service.title}
                                    </h3>
                                    <p className="mt-1.5 text-xs leading-5 text-slate-500 transition-colors duration-500 group-hover:text-blue-100">
                                        {service.description}
                                    </p>

                                    <span className="mt-auto flex translate-y-2 items-center gap-1 pt-3 text-xs font-semibold text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                        Learn more
                                        <ChevronRight aria-hidden="true" className="size-3.5" />
                                    </span>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Servcies1
