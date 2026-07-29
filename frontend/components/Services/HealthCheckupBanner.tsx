"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ChevronRight, Home } from "lucide-react"

type ServiceBannerProps = {
  title: string
  accent?: string
  image: string
  imageAlt: string
  breadcrumb: string
}

export function ServiceBanner({
  title,
  accent,
  image,
  imageAlt,
  breadcrumb,
}: ServiceBannerProps) {
  const prefersReducedMotion = useReducedMotion()
  const titleStart = accent ? title.slice(0, title.lastIndexOf(accent)) : title

  return (
    <section className="relative isolate flex min-h-72 items-center justify-center overflow-hidden px-4 py-16 sm:min-h-80 sm:px-6 lg:px-8">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-30 object-cover object-center"
      />

      <div className="absolute inset-0 -z-20 bg-[#0b245f]/80" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071a47]/95 via-[#12368f]/75 to-emerald-900/45" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071a47]/55 via-transparent to-transparent" />

      <div
        aria-hidden="true"
        className="absolute -right-24 -top-28 -z-10 size-96 rounded-full border-[65px] border-white/5"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 left-1/3 -z-10 size-80 rounded-full border-[55px] border-emerald-300/10"
      />

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
      >
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.12, duration: 0.65 }}
          className="max-w-4xl text-4xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl"
        >
          {titleStart}
          {accent && <span className="text-emerald-300">{accent}</span>}
        </motion.h1>

        <motion.nav
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.28, duration: 0.55 }}
          aria-label="Breadcrumb"
          className="mt-6 flex w-fit flex-wrap items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100 shadow-lg backdrop-blur-md"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-emerald-300 focus-visible:outline-none focus-visible:text-emerald-300"
          >
            <Home aria-hidden="true" className="size-3.5" />
            Home
          </Link>
          <ChevronRight aria-hidden="true" className="size-3.5 text-blue-200/60" />
          <span>Services</span>
          <ChevronRight aria-hidden="true" className="size-3.5 text-blue-200/60" />
          <span aria-current="page" className="text-white">
            {breadcrumb}
          </span>
        </motion.nav>
      </motion.div>
    </section>
  )
}

export function HealthCheckupBanner() {
  return (
    <ServiceBanner
      title="Health Checkup Packages"
      accent="Packages"
      image="/images/3.png"
      imageAlt="Albirri Hospital medical team"
      breadcrumb="Health Checkups"
    />
  )
}

export function HospitalServicesBanner() {
  return (
    <ServiceBanner
      title="Hospital Services"
      accent="Services"
      image="/images/2.png"
      imageAlt="Aerial view of Albirri Hospital"
      breadcrumb="Hospital Services"
    />
  )
}
