"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, Building2, CalendarDays, HeartHandshake, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

const aboutImages = ["/images/1.png", "/images/2.png", "/images/3.png"]

const highlights = [
    { value: "2013", label: "Established", icon: CalendarDays },
    { value: "2", label: "Hospital locations", icon: MapPin },
    { value: "We care", label: "Our promise", icon: HeartHandshake },
] as const

export function About() {
    const [activeImage, setActiveImage] = useState(0)
    const prefersReducedMotion = useReducedMotion()

    useEffect(() => {
        if (prefersReducedMotion) return

        const interval = window.setInterval(() => {
            setActiveImage((current) => (current + 1) % aboutImages.length)
        }, 4500)

        return () => window.clearInterval(interval)
    }, [prefersReducedMotion])

    return (
        <section className="overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto grid max-w-7xl items-stretch gap-12 lg:grid-cols-2 lg:gap-16">
                <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, x: -60, scale: 0.96 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                    className="relative h-full"
                >
                    <div className="relative h-[28rem] overflow-hidden rounded-[2rem] bg-slate-100 shadow-[0_25px_70px_rgba(15,23,42,0.18)] sm:h-[34rem] lg:h-full lg:min-h-[42rem]">
                        {aboutImages.map((src, index) => (
                            <motion.div
                                key={src}
                                aria-hidden="true"
                                className="absolute inset-0"
                                initial={false}
                                animate={{
                                    opacity: index === activeImage ? 1 : 0,
                                    scale: index === activeImage && !prefersReducedMotion ? 1.06 : 1,
                                }}
                                transition={{
                                    opacity: { duration: prefersReducedMotion ? 0 : 1.2, ease: "easeInOut" },
                                    scale: { duration: 5, ease: "linear" },
                                }}
                            >
                                <Image
                                    src={src}
                                    alt=""
                                    fill
                                    sizes="(min-width: 1024px) 50vw, 100vw"
                                    className="object-cover"
                                />
                            </motion.div>
                        ))}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

                        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                            <div className="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-white backdrop-blur-md">
                                <p className="text-xs font-medium uppercase tracking-widest text-blue-100">Serving Somalia</p>
                                <p className="mt-1 font-semibold">Mogadishu &amp; Adado</p>
                            </div>

                            <div className="flex gap-2">
                                {aboutImages.map((src, index) => (
                                    <button
                                        key={src}
                                        type="button"
                                        aria-label={`Show hospital image ${index + 1}`}
                                        aria-current={index === activeImage}
                                        onClick={() => setActiveImage(index)}
                                        className={`h-2.5 rounded-full transition-all duration-500 ${
                                            index === activeImage ? "w-8 bg-emerald-400" : "w-2.5 bg-white/70 hover:bg-white"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <motion.div
                        aria-hidden="true"
                        animate={prefersReducedMotion ? undefined : { y: [0, -9, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-7 -right-3 hidden size-28 items-center justify-center rounded-3xl border-8 border-white bg-[#1E40AF] text-white shadow-xl sm:flex lg:-right-7"
                    >
                        <Building2 className="size-12" strokeWidth={1.5} />
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="flex h-full flex-col justify-center"
                >
                    <motion.p
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600"
                    >
                        About Albirri Hospital
                    </motion.p>

                    <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        Modern healthcare,
                        <span className="block text-[#1E40AF]">built around you.</span>
                    </h2>

                    <div className="mt-6 space-y-4 text-base leading-8 text-slate-600 sm:text-lg">
                        <p>
                            <strong className="font-semibold text-slate-900">Albirri Hospitals</strong> are modern health
                            facilities located at KM14 Afgoi Road, Mogadishu, and in Adado Town, Galgaduud Region.
                            Established on April 14, 2013, Albirri is a Somali-owned hospital registered under the
                            Somali Federal Government and follows Ministry of Health guidelines.
                        </p>
                        <p>
                            With advanced equipment and skilled staff, we offer quality care in diagnostics, treatment,
                            and surgery. Every patient is treated with respect, privacy, and dignity under our motto:
                            <em className="font-semibold text-[#1E40AF]"> We care.</em>
                        </p>
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
                        {highlights.map((item, index) => {
                            const Icon = item.icon
                            return (
                                <motion.div
                                    key={item.label}
                                    initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                                    whileHover={prefersReducedMotion ? undefined : { y: -5 }}
                                    className="rounded-2xl border border-blue-100 bg-blue-50/60 p-3 transition-colors hover:bg-blue-50 sm:p-4"
                                >
                                    <Icon aria-hidden="true" className="size-5 text-emerald-600" />
                                    <p className="mt-3 text-base font-bold text-[#1E40AF] sm:text-lg">{item.value}</p>
                                    <p className="mt-0.5 text-[11px] leading-4 text-slate-500 sm:text-xs">{item.label}</p>
                                </motion.div>
                            )
                        })}
                    </div>

                    <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.55, duration: 0.55 }}
                        className="mt-8"
                    >
                        <Link
                            href="/about/us"
                            className="group inline-flex items-center gap-2 rounded-full bg-[#1E40AF] px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-900/15 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-600 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                        >
                            Discover our story
                            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default About
