"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
    Ambulance,
    ArrowRight,
    Baby,
    HeartHandshake,
    Hospital,
    Microscope,
    Pill,
    ScanLine,
    Siren,
    Stethoscope,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

const services = [
    {
        title: "Maternity",
        description: "Full care for mothers, from prenatal to postnatal, ensuring safety and comfort for both mother and baby.",
        href: "/departments/maternity",
        image: "/images/1.png",
        icon: Baby,
    },
    {
        title: "Consultant",
        description: "Skilled doctors providing personalized consultations and treatments for every patient.",
        href: "/about/doctors",
        image: "/images/2.png",
        icon: Stethoscope,
    },
    {
        title: "Pharmacy",
        description: "High-quality medications and expert advice to ensure safe and effective treatment for all patients.",
        href: "/departments/pharmacy",
        image: "/images/3.png",
        icon: Pill,
    },
    {
        title: "Modern Laboratory",
        description: "Advanced technology providing accurate diagnostic testing and dependable laboratory services.",
        href: "/departments/laboratory",
        image: "/images/2.png",
        icon: Microscope,
    },
    {
        title: "24/7 Emergency",
        description: "Round-the-clock emergency services for immediate and critical medical care.",
        href: "tel:4446",
        image: "/images/3.png",
        icon: Siren,
    },
    {
        title: "Radiology / X-Ray",
        description: "Diagnostic imaging services for accurate diagnosis, monitoring, and treatment.",
        href: "/departments/radiology",
        image: "/images/1.png",
        icon: ScanLine,
    },
    {
        title: "Pre-Marriage Checkup",
        description: "Health checkups and family-planning counselling designed especially for couples.",
        href: "/services/health-checkups",
        image: "/images/3.png",
        icon: HeartHandshake,
    },
    {
        title: "Modern Operating Theatres",
        description: "State-of-the-art theatres for safe, sterile, and successful surgical procedures.",
        href: "/departments/theatre",
        image: "/images/1.png",
        icon: Hospital,
    },
    {
        title: "Ambulance Services",
        description: "Fully equipped ambulances offering safe and swift transport during emergencies.",
        href: "tel:4446",
        image: "/images/2.png",
        icon: Ambulance,
    },
] as const

export function Services() {
    const prefersReducedMotion = useReducedMotion()

    return (
        <section className="relative overflow-hidden bg-slate-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div aria-hidden="true" className="absolute left-0 top-0 size-96 -translate-x-1/2 rounded-full bg-blue-100/60 blur-3xl" />
            <div aria-hidden="true" className="absolute bottom-0 right-0 size-96 translate-x-1/2 rounded-full bg-emerald-100/60 blur-3xl" />

            <div className="relative mx-auto max-w-7xl">
                <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto mb-12 max-w-2xl text-center"
                >
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Our medical care</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1E40AF] sm:text-4xl lg:text-5xl">
                        Hospital Services
                    </h2>
                    <p className="mt-4 leading-7 text-slate-600">
                        At Albirri Hospital, patient care is our top priority.
                    </p>
                </motion.div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => {
                        const Icon = service.icon

                        return (
                            <motion.div
                                key={service.title}
                                initial={prefersReducedMotion ? false : { opacity: 0, y: 45, scale: 0.96 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{
                                    delay: prefersReducedMotion ? 0 : (index % 3) * 0.09,
                                    duration: 0.6,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                whileHover={prefersReducedMotion ? undefined : { y: -8 }}
                                className="h-full"
                            >
                                <Card className="group h-full overflow-hidden rounded-3xl border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)] transition-all duration-500 hover:border-blue-200 hover:shadow-[0_22px_55px_rgba(30,64,175,0.18)]">
                                    <div className="relative h-44 overflow-hidden">
                                        <Image
                                            src={service.image}
                                            alt=""
                                            fill
                                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/5 to-transparent transition-colors duration-500 group-hover:from-[#1E40AF]/70" />
                                    </div>

                                    <CardContent className="relative flex min-h-60 flex-col px-6 pb-6 pt-12">
                                        <motion.div
                                            whileHover={prefersReducedMotion ? undefined : { rotate: 6, scale: 1.06 }}
                                            className="absolute -top-10 left-6 flex size-20 items-center justify-center rounded-2xl border-[6px] border-white bg-[#1E40AF] text-white shadow-lg shadow-blue-900/20 transition-colors duration-500 group-hover:bg-emerald-500"
                                        >
                                            <Icon aria-hidden="true" className="size-9" strokeWidth={1.7} />
                                        </motion.div>

                                        <h3 className="text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-[#1E40AF]">
                                            {service.title}
                                        </h3>
                                        <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>

                                        <Link
                                            href={service.href}
                                            className="mt-auto inline-flex w-fit items-center gap-2 pt-5 text-sm font-bold text-[#1E40AF] transition-colors hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                                        >
                                            Learn more
                                            <ArrowRight
                                                aria-hidden="true"
                                                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                                            />
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Services
