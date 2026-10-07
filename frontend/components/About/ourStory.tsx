"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { Sprout, Hospital, Users, HeartPulse, UserCheck } from "lucide-react"

const storyMilestones = [
  {
    icon: Sprout,
    title: "A Nation Rebuilding",
    text: "Albirri Hospital emerged during Somalia's period of recovery, when communities needed reliable access to essential healthcare. Born from a shared commitment to rebuild and heal, it set out to provide quality medical care for all, regardless of background.",
  },
  {
    icon: Hospital,
    title: "Albirri Hospital is Founded",
    text: "Established to serve the community, Albirri Hospital brings together dedicated healthcare professionals, modern facilities, and a patient-centered approach to deliver accessible, high-quality care in Somalia.",
  },
  {
    icon: Users,
    title: "Trusted Care Across Somalia",
    text: "Today, Albirri Hospital continues to expand its services, improve community health, and invest in a healthier, stronger Somalia — with a focus on accessible, compassionate care for every patient.",
  },
] as const

const hospitalStats = [
  {
    icon: Users,
    value: "20,000+",
    label: "Patients Served",
  },
  {
    icon: HeartPulse,
    value: "20+",
    label: "Specialized Services",
  },
  {
    icon: UserCheck,
    value: "100+",
    label: "Dedicated Staff",
  },
] as const

export function OurStory() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] py-20 px-4 sm:px-6 lg:px-8">
      {/* Background ambient decorative blurs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 size-96 rounded-full bg-blue-100/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -bottom-20 size-96 rounded-full bg-blue-100/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-14 max-w-3xl text-center lg:mb-16"
        >
          {/* Eyebrow badge */}
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1.5px] w-7 bg-blue-400" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#1E40AF]">
              Our Journey
            </span>
            <span className="h-[1.5px] w-7 bg-blue-400" />
          </div>

          {/* Heading */}
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[44px] lg:leading-tight">
            Our Story of <span className="text-[#1E40AF]">Care &amp; Resilience</span>
          </h2>

          {/* Subtitle */}
          <p className="mt-3.5 text-base sm:text-lg text-slate-500 font-normal leading-relaxed">
            From a community-led recovery effort to a trusted healthcare provider
            serving patients across Somalia.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-8 items-stretch">
          {/* Left Column: Hospital Image + Stats Card */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-between gap-6"
          >
            {/* Image Container */}
            <div className="relative min-h-[300px] sm:min-h-[360px] lg:min-h-[380px] w-full flex-1 overflow-hidden rounded-3xl bg-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-100">
              <Image
                src="/images/2.png"
                alt="Albirri Hospital Grounds and Medical Center"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>

            {/* Stats Card */}
            <div className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100/90">
              <div className="grid grid-cols-3 divide-x divide-slate-100">
                {hospitalStats.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div
                      key={stat.label}
                      className="flex flex-col items-center px-2 text-center sm:px-4"
                    >
                      <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-blue-50 text-[#1E40AF]">
                        <Icon className="size-5" />
                      </div>
                      <span className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                        {stat.value}
                      </span>
                      <span className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
                        {stat.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3 Story Milestones */}
          <div className="flex flex-col justify-between gap-5 sm:gap-6">
            {storyMilestones.map((milestone, index) => {
              const Icon = milestone.icon
              return (
                <motion.div
                  key={milestone.title}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: 25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    delay: prefersReducedMotion ? 0 : index * 0.1,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group flex flex-1 items-start gap-5 rounded-3xl bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100/90 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,64,175,0.08)] hover:border-blue-100"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#1E40AF] transition-transform duration-300 group-hover:scale-110">
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                      {milestone.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                      {milestone.text}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurStory
