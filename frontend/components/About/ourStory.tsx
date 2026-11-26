"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { Sprout, Hospital, Users, ShieldCheck, HeartPulse, UserCheck } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

const storyMilestones = [
  {
    icon: Sprout,
    title: "A nation rebuilding",
    text: "Following the collapse of the Somali government in 1991, the nation experienced a severe disruption of essential public services, with the healthcare sector among the most affected. Hospitals, clinics, and public health systems deteriorated, leaving millions of people without access to reliable and affordable medical care. In response, Somali communities launched initiatives to rebuild critical social infrastructure, prioritizing the restoration of dependable and accessible healthcare services. These collective efforts marked the beginning of a national recovery journey focused on restoring dignity, wellbeing, and hope for future generations.",
  },
  {
    icon: Hospital,
    title: "Albirri Hospital is founded",
    text: "Albirri Hospital was established as part of this national recovery effort, with a clear mission to serve the community by delivering high-quality, dependable, and first-class medical care at low cost through patient-centered services grounded in professionalism, trust, and compassion. Founded on 14th April 2013 by the Somali local NGO Markaz Ahlu-Hadith in partnership with a team of Somali and international medical doctors, the hospital was created to strengthen Somalia’s healthcare system and bridge the gap between high-cost private hospitals and lower-level healthcare facilities. From its inception, Albirri Hospital has been guided by a strong commitment to ethical medical practice, social responsibility, and community service.",
  },
  {
    icon: Users,
    title: "Trusted care across Somalia",
    text: "Today, Albirri Hospital operates as a licensed and fully registered healthcare service provider under the Federal Government of Somalia, in full compliance with the Ministry of Health regulations and national healthcare standards. The hospital delivers world-class medical services through fast and reliable care, highly qualified medical professionals, advanced medical technology, quality medicines, and a modern patient-centered healthcare environment. Albirri Hospital serves communities across multiple regions of Somalia, including Mogadishu in the Banadir Region and Adado Town in Galmudug State, providing accessible and affordable healthcare solutions to thousands of patients every year.",
  },
  {
    icon: ShieldCheck,
    title: "A healthier, stronger Somalia",
    text: "Patient safety, security, and trust remain the core pillars of Albirri Hospital. The hospital maintains strict clinical protocols, modern security systems, and a clean, well-organized medical environment to ensure every patient receives safe, confidential, and professional care. Since 2013, Albirri Hospital has consistently supported the Somali community by expanding access to quality healthcare services. With a long-term vision to become a nationwide healthcare provider, the hospital continues to invest in innovation, modern technology, and human capital. Today, Albirri Hospital stands as a symbol of resilience, excellence, and community commitment, dedicated to delivering dependable, first-class medical care at affordable cost for a healthier and stronger Somalia.",
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
  const { t } = useLanguage()

  return (
    <section aria-labelledby="our-story-heading" className="relative overflow-clip bg-[#F8FAFC] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
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
          className="mx-auto mb-10 max-w-3xl text-center sm:mb-14 lg:mb-16"
        >
          {/* Eyebrow badge */}
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1.5px] w-7 bg-blue-400" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#1E40AF]">
              {t("Our journey")}
            </span>
            <span className="h-[1.5px] w-7 bg-blue-400" />
          </div>

          {/* Heading */}
          <h2 id="our-story-heading" className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[44px] lg:leading-tight">
            {t("Our Story of")}{" "}<span className="text-[#1E40AF]">{t("Care & Resilience")}</span>
          </h2>

          {/* Subtitle */}
          <p className="mt-3.5 text-base sm:text-lg text-slate-500 font-normal leading-relaxed">
            {t("From a community-led recovery effort to a trusted healthcare provider serving patients across Somalia.")}
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)]">
          {/* Left Column: Hospital Image + Stats Card */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-w-0 flex-col gap-6 lg:sticky lg:top-36"
          >
            {/* Image Container */}
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-3xl border border-slate-100 bg-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
              <Image
                src="/images/2.png"
                alt={t("Albirri Hospital Grounds and Medical Center")}
                fill
                sizes="(min-width: 1280px) 530px, (min-width: 1024px) 44vw, 100vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Stats Card */}
            <div className="rounded-3xl border border-slate-100/90 bg-white px-3 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] sm:p-6">
              <div className="grid grid-cols-3 divide-x divide-slate-100">
                {hospitalStats.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div
                      key={stat.label}
                      className="flex min-w-0 flex-col items-center px-1.5 text-center sm:px-3"
                    >
                      <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-blue-50 text-[#1E40AF]">
                        <Icon className="size-5" aria-hidden="true" />
                      </div>
                      <span className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                        {stat.value}
                      </span>
                      <span className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
                        {t(stat.label)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Story Milestones */}
          <div className="grid min-w-0 gap-5 sm:gap-6">
            {storyMilestones.map((milestone, index) => {
              const Icon = milestone.icon
              return (
                <motion.article
                  key={milestone.title}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: 25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    delay: prefersReducedMotion ? 0 : index * 0.1,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="rounded-3xl border border-slate-100/90 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-blue-100 hover:shadow-[0_8px_30px_rgba(30,64,175,0.08)] sm:p-7"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#1E40AF] sm:size-11">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-bold leading-snug text-slate-900 sm:text-xl">
                      {t(milestone.title)}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600 sm:ms-[3.75rem] sm:text-[15px]">
                    {t(milestone.text)}
                  </p>
                </motion.article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurStory
