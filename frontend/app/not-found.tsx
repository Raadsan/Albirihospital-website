"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Home,
  CalendarDays,
  PhoneCall,
  Stethoscope,
  HeartPulse,
  HelpCircle,
  Clock,
} from "lucide-react"

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-[#F8FAFC] px-4 py-8 sm:px-6 lg:px-8">
      {/* Decorative ambient background gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 -top-28 size-[32rem] rounded-full bg-blue-100/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-1/2 size-[30rem] rounded-full bg-emerald-100/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/3 size-[28rem] rounded-full bg-blue-50/70 blur-3xl"
      />

      {/* Header with Hospital Logo */}
      <header className="relative z-10 flex w-full max-w-6xl items-center justify-between pb-6">
        <Link href="/" className="inline-flex items-center gap-3 transition-opacity hover:opacity-90">
          <Image
            src="/images/LOGO2-01.png"
            alt="Albiri Hospital Logo"
            width={180}
            height={55}
            className="h-11 w-auto object-contain sm:h-12"
            priority
          />
        </Link>

        <a
          href="tel:4446"
          className="hidden items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-semibold text-[#1E40AF] shadow-xs backdrop-blur-md transition-all hover:bg-blue-50 sm:flex"
        >
          <PhoneCall className="size-3.5 text-blue-600" />
          <span>Hotline: <strong className="font-bold">4446</strong></span>
        </a>
      </header>

      {/* Main Content Card */}
      <main className="relative z-10 my-auto flex w-full max-w-3xl flex-col items-center text-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1E40AF] shadow-xs backdrop-blur-sm"
        >
          <span className="flex size-2 rounded-full bg-rose-500 animate-pulse" />
          Error 404 • Page Not Found
        </motion.div>

        {/* 404 Big Art Graphic */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative mt-4 select-none"
        >
          <h1 className="text-[7rem] font-black leading-none tracking-tighter text-slate-900/10 sm:text-[10rem] md:text-[12rem]">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-20 items-center justify-center rounded-3xl bg-white shadow-xl shadow-blue-900/10 ring-1 ring-slate-100 sm:size-24">
              <HeartPulse className="size-10 text-[#1E40AF] animate-pulse sm:size-12" />
            </div>
          </div>
        </motion.div>

        {/* Heading & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-2 max-w-xl"
        >
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            We couldn&apos;t find the page you&apos;re looking for
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            The link you followed may be broken, or the page may have been moved.
            Don&apos;t worry, our medical services and patient care are always available.
          </p>
        </motion.div>

        {/* Primary CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1E40AF] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-all hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <Home className="size-4" />
            Back to Homepage
          </Link>
          <Link
            href="/appointment"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-xs transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:text-[#1E40AF] hover:-translate-y-0.5 active:translate-y-0"
          >
            <CalendarDays className="size-4 text-[#1E40AF]" />
            Book an Appointment
          </Link>
        </motion.div>

        {/* Helpful Quick Navigation Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 w-full"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Helpful Links
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link
              href="/services/overview"
              className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 text-left shadow-xs transition-all hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E40AF] group-hover:bg-[#1E40AF] group-hover:text-white transition-colors">
                <Stethoscope className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-[#1E40AF] transition-colors">
                  Medical Services
                </p>
                <p className="text-[11px] text-slate-500">
                  Explore clinical departments
                </p>
              </div>
            </Link>

            <Link
              href="/about/doctors"
              className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 text-left shadow-xs transition-all hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Clock className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-[#1E40AF] transition-colors">
                  Find a Doctor
                </p>
                <p className="text-[11px] text-slate-500">
                  Specialists &amp; consultants
                </p>
              </div>
            </Link>

            <Link
              href="/contact"
              className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 text-left shadow-xs transition-all hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <HelpCircle className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-[#1E40AF] transition-colors">
                  Contact Support
                </p>
                <p className="text-[11px] text-slate-500">
                  Get in touch with reception
                </p>
              </div>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 w-full max-w-6xl pt-6 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} Albirri Hospital. Dedicated to compassionate healthcare in Somalia.</p>
      </footer>
    </div>
  )
}
