"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarDays } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"

const heroImages = ["/images/1.png", "/images/2.png", "/images/3.png"]

export function Hero() {
    const [activeImage, setActiveImage] = useState(0)
    const prefersReducedMotion = useReducedMotion()

    useEffect(() => {
        if (prefersReducedMotion) return

        const interval = window.setInterval(() => {
            setActiveImage((current) => (current + 1) % heroImages.length)
        }, 5000)

        return () => window.clearInterval(interval)
    }, [prefersReducedMotion])

    return (
        <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-950">
            {heroImages.map((src, index) => (
                <motion.div
                    key={src}
                    aria-hidden="true"
                    className="absolute inset-0"
                    initial={false}
                    animate={{
                        opacity: index === activeImage ? 1 : 0,
                        scale: index === activeImage && !prefersReducedMotion ? 1.05 : 1,
                    }}
                    transition={{
                        opacity: { duration: prefersReducedMotion ? 0 : 1.4, ease: "easeInOut" },
                        scale: { duration: 5.5, ease: "linear" },
                    }}
                >
                    <Image
                        src={src}
                        alt=""
                        fill
                        priority={index === 0}
                        sizes="100vw"
                        className="object-cover"
                    />
                </motion.div>
            ))}

            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-blue-950/75 to-slate-950/20" />

            <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-6 py-20 lg:px-8">
                <motion.div
                    className="max-w-3xl text-white"
                    initial={prefersReducedMotion ? false : { opacity: 0, x: -60, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                    <motion.p
                        className="mb-5 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm"
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.6 }}
                    >
                        Trusted healthcare in Somalia
                    </motion.p>

                    <motion.h1
                        className="text-[clamp(1.45rem,5vw,3.75rem)] font-bold leading-tight tracking-tight"
                        initial={prefersReducedMotion ? false : { opacity: 0, x: -45 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25, duration: 0.75, ease: "easeOut" }}
                    >
                        <span className="block">Quality Care For You </span>
                        <span className="block whitespace-nowrap">
                            And <span className="text-[#10b981]">Your Family</span>
                        </span>
                    </motion.h1>

                    <motion.p
                        className="mt-6 max-w-2xl text-lg leading-8 text-blue-50 sm:text-xl"
                        initial={prefersReducedMotion ? false : { opacity: 0, x: -35 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                    >
                        Albirri Hospital provides compassionate, reliable, and accessible
                        healthcare through experienced medical professionals.
                    </motion.p>

                    <motion.div
                        className="mt-9 flex flex-wrap gap-4"
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55, duration: 0.65 }}
                    >
                        <Link
                            href="/appointment"
                            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600"
                        >
                            <CalendarDays className="size-5" aria-hidden="true" />
                            Book an appointment
                        </Link>

                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                        >
                            Explore our services
                            <ArrowRight className="size-5" aria-hidden="true" />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                {heroImages.map((src, index) => (
                    <button
                        key={src}
                        type="button"
                        aria-label={`Show background image ${index + 1}`}
                        aria-current={index === activeImage}
                        onClick={() => setActiveImage(index)}
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                            index === activeImage
                                ? "w-9 bg-emerald-400"
                                : "w-2.5 bg-white/60 hover:bg-white"
                        }`}
                    />
                ))}
            </div>
        </section>
    )
}
