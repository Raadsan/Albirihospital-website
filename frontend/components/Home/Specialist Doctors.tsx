"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, BadgeCheck, CalendarDays } from "lucide-react"

import { Card } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import api from "@/app/api/api"

export interface DoctorItem {
    id: string
    name: string
    specialty: string
    badge?: string
    image?: string
    department?: string
    experience?: string
    available?: boolean
    featured?: boolean
}

export function SpecialistDoctors() {
    const prefersReducedMotion = useReducedMotion()
    const { t } = useLanguage()
    const [doctors, setDoctors] = useState<DoctorItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get("/doctors?featured=true&available=true&limit=3")
            .then((res) => {
                const list = res.data?.data || (Array.isArray(res.data) ? res.data : [])
                setDoctors(list.slice(0, 3))
            })
            .catch((err) => {
                console.warn("Could not load dynamic doctors:", err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

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
                        {t("Meet our medical team")}
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        {t("Specialist")} <span className="text-[#1E40AF]">{t("Doctors")}</span>
                    </h2>
                    <p className="mt-4 leading-7 text-slate-600">
                        {t("Experienced specialists committed to providing trusted, compassionate care.")}
                    </p>
                </motion.div>

                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-[4/5] min-h-[28rem] rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
                        ))}
                    </div>
                ) : doctors.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-12 text-center max-w-xl mx-auto">
                        <BadgeCheck className="size-12 text-emerald-600 mx-auto mb-3 opacity-60" />
                        <h3 className="text-xl font-bold text-slate-800">{t("Specialist Doctors Updating")}</h3>
                        <p className="mt-2 text-sm text-slate-600">
                            {t("Our active medical team roster is being updated. You can still request an appointment directly.")}
                        </p>
                        <Link
                            href="/appointment"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1E40AF] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-600 transition-colors"
                        >
                            <CalendarDays className="size-4" />
                            {t("Book appointment")}
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {doctors.map((doctor, index) => (
                            <motion.div
                                key={doctor.id || doctor.name + index}
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
                                            src={doctor.image || "/images/doctor1.png"}
                                            alt={`${doctor.name}, ${doctor.specialty}`}
                                            fill
                                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent transition-colors duration-500 group-hover:via-[#1E40AF]/10" />

                                        <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                                            <BadgeCheck aria-hidden="true" className="size-4 text-emerald-400" />
                                            {doctor.badge || t("Specialist")}
                                        </div>

                                        <div className="absolute inset-x-0 bottom-0 p-6">
                                            <p className="text-sm font-semibold text-emerald-400">{t(doctor.specialty)}</p>
                                            <h3 className="mt-1 text-2xl font-bold text-white">{doctor.name}</h3>

                                            <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-4">
                                                <Link
                                                    href={`/appointment?doctor=${encodeURIComponent(doctor.name)}`}
                                                    className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                                >
                                                    <CalendarDays aria-hidden="true" className="size-4" />
                                                    {t("Book appointment")}
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
                )}

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
                        {t("View all doctors")}
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}

export default SpecialistDoctors
