"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
  Users,
  Siren,
  Microscope,
  Coins,
  ShieldCheck,
  Heart,
  CalendarDays,
  Ambulance,
  MapPin,
  ArrowRight,
} from "lucide-react"

const reasons = [
  {
    title: "Qualified Professionals",
    description: "Experienced medical teams delivering attentive, evidence-based care.",
    icon: Users,
    color: "blue",
  },
  {
    title: "24/7 Emergency Care",
    description: "Rapid emergency support and ambulance services, day and night.",
    icon: Siren,
    color: "teal",
  },
  {
    title: "Modern Technology",
    description: "Advanced diagnostic and treatment equipment for accurate results.",
    icon: Microscope,
    color: "teal",
  },
  {
    title: "Affordable Healthcare",
    description: "Dependable, high-quality medical services at accessible costs.",
    icon: Coins,
    color: "blue",
  },
  {
    title: "Patient Safety",
    description: "Strict clinical standards, confidentiality, and a clean environment.",
    icon: ShieldCheck,
    color: "blue",
  },
  {
    title: "Compassionate Service",
    description: "Every patient is treated with empathy, respect, and dignity.",
    icon: Heart,
    color: "teal",
  },
] as const

const facts = [
  {
    icon: CalendarDays,
    value: "2013",
    label: "Serving since",
  },
  {
    icon: Ambulance,
    value: "24/7",
    label: "Emergency care",
  },
  {
    icon: MapPin,
    value: "2",
    label: "Hospital locations",
  },
] as const

export function WhyChoose() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] py-20 px-4 sm:px-6 lg:px-8">
      {/* Decorative ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 size-96 rounded-full bg-blue-100/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-1/3 size-96 rounded-full bg-teal-100/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 bottom-10 size-80 rounded-full bg-cyan-100/40 blur-3xl"
      />

      {/* Decorative Dot Matrix in top-right and bottom-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 right-10 size-32 opacity-40 [background-image:radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:14px_14px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-8 size-28 opacity-40 [background-image:radial-gradient(#0d9488_1.5px,transparent_1.5px)] [background-size:14px_14px]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          
          {/* Left Column: Hospital Doctors Image with Floating Glass Card */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:col-span-5"
          >
            {/* Image Container with rounded-3xl and clean frame */}
            <div className="relative h-[480px] sm:h-[540px] lg:h-[600px] w-full overflow-hidden rounded-[2.2rem] bg-slate-100 shadow-[0_20px_50px_rgba(15,23,42,0.12)] border border-slate-100">
              <Image
                src="/images/3.png"
                alt="Albirri Hospital healthcare professionals and medical team"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-top transition-transform duration-1000 hover:scale-105"
                priority
              />

              {/* Gradient overlay on bottom of image for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />

              {/* Floating Glassmorphic Overlay Card */}
              <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5 rounded-3xl border border-white/80 bg-white/90 p-4 sm:p-5 shadow-[0_10px_35px_rgba(15,23,42,0.12)] backdrop-blur-xl">
                {/* Upper Feature */}
                <div className="flex items-start gap-3.5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 border border-teal-100/80 shadow-xs">
                    <ShieldCheck className="size-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug sm:text-lg">
                      Trusted healthcare, close to home.
                    </h4>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed sm:text-[13px]">
                      Modern medicine delivered with the compassion our communities deserve.
                    </p>
                  </div>
                </div>

                {/* Horizontal Stat Row */}
                <div className="mt-4 pt-3.5 border-t border-slate-200/70 grid grid-cols-3 divide-x divide-slate-200/70">
                  {facts.map((fact, index) => {
                    const Icon = fact.icon
                    return (
                      <div
                        key={fact.label}
                        className={`flex items-center gap-2 sm:gap-2.5 ${
                          index === 0
                            ? "pr-1 sm:pr-2"
                            : index === 1
                            ? "px-2 sm:px-3"
                            : "pl-2 sm:pl-3"
                        }`}
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E40AF]">
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-extrabold text-slate-900 leading-none sm:text-base">
                            {fact.value}
                          </p>
                          <p className="mt-1 truncate text-[10px] sm:text-[11px] font-medium text-slate-500">
                            {fact.label}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Section Header + 6 Feature Cards + CTA Button */}
          <div className="lg:col-span-7">
            {/* Header */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Eyebrow badge */}
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-teal-600">
                  Why Albirri
                </span>
                <span className="h-[2px] w-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-400" />
              </div>

              {/* Heading */}
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[44px] lg:leading-[1.18]">
                Why Choose <br className="hidden sm:inline" />
                <span className="text-[#1E40AF]">Albirri Hospital?</span>
              </h2>

              {/* Subtitle */}
              <p className="mt-3.5 max-w-xl text-sm sm:text-base leading-relaxed text-slate-600">
                We combine skilled professionals, modern facilities, and compassionate service to give every patient dependable care they can trust.
              </p>
            </motion.div>

            {/* 6 Feature Cards Grid */}
            <div className="mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
              {reasons.map((reason, index) => {
                const Icon = reason.icon
                const isTeal = reason.color === "teal"

                return (
                  <motion.div
                    key={reason.title}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      delay: prefersReducedMotion ? 0 : index * 0.06,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group flex items-start gap-3.5 rounded-2xl bg-white p-4 sm:p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_8px_25px_rgba(30,64,175,0.08)] hover:border-blue-100"
                  >
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${
                        isTeal
                          ? "bg-teal-50 text-teal-600 border border-teal-100/60"
                          : "bg-blue-50 text-[#1E40AF] border border-blue-100/60"
                      }`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-[15px] font-bold text-slate-900">
                        {reason.title}
                      </h3>
                      <p className="mt-1 text-xs sm:text-[13px] leading-relaxed text-slate-500">
                        {reason.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Bottom Button */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.3 }}
              className="mt-8"
            >
              <Link
                href="/appointment"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#1E40AF] px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-all duration-300 hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                Book an appointment
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default WhyChoose
