"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ChevronRight, Home } from "lucide-react"

type AboutBannerProps = {
    title?: string
    breadcrumbPage?: string
}

export function AboutBanner({ title = "About Us", breadcrumbPage }: AboutBannerProps) {
    const prefersReducedMotion = useReducedMotion()
    const displayBreadcrumb = breadcrumbPage || (title === "About Us" ? "About" : title)

    return (
        <section className="relative isolate flex min-h-64 items-center justify-center overflow-hidden px-4 py-16 sm:min-h-72 sm:px-6 lg:min-h-80 lg:px-8">
            <Image
                src="/images/1.png"
                alt=""
                fill
                priority
                sizes="100vw"
                className="absolute inset-0 -z-30 object-cover object-center"
            />

            <div className="absolute inset-0 -z-20 bg-[#12368f]/80" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0d245f]/75 via-[#1E40AF]/35 to-[#0d245f]/65" />
            <div
                aria-hidden="true"
                className="absolute -left-24 -top-32 -z-10 size-80 rounded-full border-[55px] border-white/5"
            />
            <div
                aria-hidden="true"
                className="absolute -bottom-40 -right-16 -z-10 size-80 rounded-full border-[55px] border-emerald-300/10"
            />

            <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto flex max-w-4xl flex-col items-center text-center"
            >
                <motion.h1
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: prefersReducedMotion ? 0 : 0.12, duration: 0.6 }}
                    className="text-4xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl"
                >
                    {title}
                </motion.h1>

                <motion.nav
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: prefersReducedMotion ? 0 : 0.28, duration: 0.5 }}
                    aria-label="Breadcrumb"
                    className="mt-5 flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-blue-50 shadow-lg backdrop-blur-sm"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 transition-colors hover:text-emerald-300 focus-visible:outline-none focus-visible:text-emerald-300"
                    >
                        <Home aria-hidden="true" className="size-3.5" />
                        Home
                    </Link>
                    <ChevronRight aria-hidden="true" className="size-3.5 text-blue-200/70" />
                    <span aria-current="page" className="text-white">
                        {displayBreadcrumb}
                    </span>
                </motion.nav>
            </motion.div>
        </section>
    )
}

export default AboutBanner
