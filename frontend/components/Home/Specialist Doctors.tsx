"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, BadgeCheck, CalendarDays } from "lucide-react"

import { Card } from "@/components/ui/card"

const doctors = [
    {
        name: "Dr. Amina Yusuf",
        specialty: "Obstetrics & Gynaecology",
        image: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&w=900&q=85",
    },
    {
        name: "Dr. Ahmed Hassan",
        specialty: "General Medicine",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=85",
    },
    {
        name: "Dr. Fatima Ali",
        specialty: "Paediatrics",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=85",
    },
    {
        name: "Dr. Mohamed Osman",
        specialty: "General Surgery",
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=900&q=85",
    },
    {
        name: "Dr. Hodan Abdi",
        specialty: "Internal Medicine",
        image: "https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?auto=format&fit=crop&w=900&q=85",
    },
    {
        name: "Dr. Abdirahman Noor",
        specialty: "Emergency Medicine",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=85",
    },
] as const

export function SpecialistDoctors() {
    const prefersReducedMotion = useReducedMotion()

    return (
        <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div aria-hidden="true" className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-blue-50 blur-3xl" />

            <div className="relative mx-auto max-w-7xl">
                <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto mb-12 max-w-2xl text-center"
                >
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                        Meet our medical team
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        Specialist <span className="text-[#1E40AF]">Doctors</span>
                    </h2>
                    <p className="mt-4 leading-7 text-slate-600">
                        Experienced specialists committed to providing trusted, compassionate care.
                    </p>
                </motion.div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {doctors.map((doctor, index) => (
                        <motion.div
                            key={doctor.name}
                            initial={prefersReducedMotion ? false : { opacity: 0, y: 45, scale: 0.96 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                                delay: prefersReducedMotion ? 0 : (index % 3) * 0.1,
                                duration: 0.6,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            whileHover={prefersReducedMotion ? undefined : { y: -8 }}
                            className="h-full"
                        >
                            <Card className="group relative h-full overflow-hidden rounded-3xl border-slate-200/80 bg-slate-900 shadow-[0_14px_45px_rgba(15,23,42,0.12)] transition-all duration-500 hover:border-blue-300 hover:shadow-[0_25px_60px_rgba(30,64,175,0.22)]">
                                <div className="relative aspect-[4/5] min-h-[28rem] overflow-hidden">
                                    <Image
                                        src={doctor.image}
                                        alt={`${doctor.name}, ${doctor.specialty}`}
                                        fill
                                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent transition-colors duration-500 group-hover:via-[#1E40AF]/10" />

                                    <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                                        <BadgeCheck aria-hidden="true" className="size-4 text-emerald-400" />
                                        Specialist
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 p-6">
                                        <p className="text-sm font-semibold text-emerald-400">{doctor.specialty}</p>
                                        <h3 className="mt-1 text-2xl font-bold text-white">{doctor.name}</h3>

                                        <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-4">
                                            <Link
                                                href="/appointment"
                                                className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                            >
                                                <CalendarDays aria-hidden="true" className="size-4" />
                                                Book appointment
                                            </Link>
                                            <span className="flex size-10 items-center justify-center rounded-full bg-white text-[#1E40AF] transition-all duration-300 group-hover:rotate-45 group-hover:bg-emerald-400 group-hover:text-white">
                                                <ArrowUpRight aria-hidden="true" className="size-4" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.55 }}
                    className="mt-10 text-center"
                >
                    <Link
                        href="/about/doctors"
                        className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-6 py-3 font-semibold text-[#1E40AF] transition-all duration-300 hover:-translate-y-1 hover:border-[#1E40AF] hover:bg-[#1E40AF] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                    >
                        View all doctors
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}

export default SpecialistDoctors
