"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { Building2, CalendarDays, HeartHandshake, MapPin } from "lucide-react"

const storyChapters = [
    {
        year: "1991",
        title: "A nation rebuilding",
        text:
            "Following the collapse of the Somali government in 1991, the nation experienced a severe disruption of essential public services, with the healthcare sector among the most affected. Hospitals, clinics, and public health systems deteriorated, leaving millions of people without access to reliable and affordable medical care. In response, Somali communities launched initiatives to rebuild critical social infrastructure, prioritizing the restoration of dependable and accessible healthcare services. These collective efforts marked the beginning of a national recovery journey focused on restoring dignity, wellbeing, and hope for future generations.",
    },
    {
        year: "2013",
        title: "Albirri Hospital is founded",
        text:
            "Albirri Hospital was established as part of this national recovery effort, with a clear mission to serve the community by delivering high-quality, dependable, and first-class medical care at low cost through patient-centered services grounded in professionalism, trust, and compassion. Founded on 14th April 2013 by the Somali local NGO Markaz Ahlu-Hadith in partnership with a team of Somali and international medical doctors, the hospital was created to strengthen Somalia’s healthcare system and bridge the gap between high-cost private hospitals and lower-level healthcare facilities. From its inception, Albirri Hospital has been guided by a strong commitment to ethical medical practice, social responsibility, and community service.",
    },
    {
        year: "Today",
        title: "Trusted care across Somalia",
        text:
            "Today, Albirri Hospital operates as a licensed and fully registered healthcare service provider under the Federal Government of Somalia, in full compliance with the Ministry of Health regulations and national healthcare standards. The hospital delivers world-class medical services through fast and reliable care, highly qualified medical professionals, advanced medical technology, quality medicines, and a modern patient-centered healthcare environment. Albirri Hospital serves communities across multiple regions of Somalia, including Mogadishu in the Banadir Region and Adado Town in Galmudug State, providing accessible and affordable healthcare solutions to thousands of patients every year.",
    },
    {
        year: "Future",
        title: "A healthier, stronger Somalia",
        text:
            "Patient safety, security, and trust remain the core pillars of Albirri Hospital. The hospital maintains strict clinical protocols, modern security systems, and a clean, well-organized medical environment to ensure every patient receives safe, confidential, and professional care. Since 2013, Albirri Hospital has consistently supported the Somali community by expanding access to quality healthcare services. With a long-term vision to become a nationwide healthcare provider, the hospital continues to invest in innovation, modern technology, and human capital. Today, Albirri Hospital stands as a symbol of resilience, excellence, and community commitment, dedicated to delivering dependable, first-class medical care at affordable cost for a healthier and stronger Somalia.",
    },
] as const

const highlights = [
    { icon: CalendarDays, value: "2013", label: "Established" },
    { icon: MapPin, value: "2", label: "Hospital locations" },
    { icon: HeartHandshake, value: "We care", label: "Our commitment" },
] as const

const storyChapterLayouts = {
    "1991": "md:col-span-1 lg:col-span-5 lg:col-start-8 lg:row-start-1",
    "2013": "md:col-span-1 lg:col-span-5 lg:col-start-8 lg:row-start-2",
    Today: "md:col-span-1 lg:col-span-4 lg:col-start-1 lg:row-start-3",
    Future: "md:col-span-1 lg:col-span-8 lg:col-start-5 lg:row-start-3",
} as const

export function OurStory() {
    const prefersReducedMotion = useReducedMotion()

    return (
        <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div
                aria-hidden="true"
                className="absolute -right-36 top-1/3 size-96 rounded-full bg-blue-50 blur-3xl"
            />

            <div className="relative mx-auto max-w-7xl">
                <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-12 max-w-3xl lg:mb-16"
                >
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Our journey</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        Our Story of <span className="text-[#1E40AF]">Care &amp; Resilience</span>
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                        From a community-led recovery effort to a trusted healthcare provider serving thousands of
                        patients across Somalia.
                    </p>
                </motion.div>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[auto_auto_auto]">
                    <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, x: -45 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                        className="group relative min-h-[32rem] overflow-hidden rounded-[2rem] bg-slate-100 shadow-[0_22px_60px_rgba(15,23,42,0.16)] md:col-span-2 md:min-h-[38rem] lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:min-h-[44rem]"
                    >
                        <Image
                            src="/images/2.png"
                            alt="Albirri Hospital and its healthcare facilities"
                            fill
                            sizes="(min-width: 1024px) 58vw, 100vw"
                            className="object-cover transition-transform duration-[1500ms] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#081b4d]/95 via-[#0d245f]/20 to-transparent" />

                        <div className="absolute inset-x-5 bottom-5 sm:inset-x-8 sm:bottom-8">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg">
                                <Building2 aria-hidden="true" className="size-6" />
                            </div>
                            <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                                Serving since 2013
                            </p>
                            <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">Built for the community</p>

                            <div className="mt-5 grid grid-cols-3 divide-x divide-white/15 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md sm:p-4">
                                {highlights.map((item) => {
                                    const Icon = item.icon
                                    return (
                                        <div key={item.label} className="px-2 text-center sm:px-4">
                                            <Icon aria-hidden="true" className="mx-auto size-5 text-emerald-300" />
                                            <p className="mt-2 text-sm font-bold text-white sm:text-base">{item.value}</p>
                                            <p className="mt-0.5 text-[10px] leading-4 text-blue-100 sm:text-xs">
                                                {item.label}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {storyChapters.map((chapter, index) => (
                        <motion.article
                            key={chapter.year}
                            initial={prefersReducedMotion ? false : { opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{
                                delay: prefersReducedMotion ? 0 : index * 0.06,
                                duration: 0.65,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className={`h-full ${storyChapterLayouts[chapter.year]}`}
                        >
                            <div className="group relative h-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-50/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-[0_15px_40px_rgba(15,23,42,0.07)] sm:p-7 lg:p-8">
                                <div
                                    aria-hidden="true"
                                    className="absolute -right-12 -top-12 size-32 rounded-full bg-blue-100/70 transition-transform duration-500 group-hover:scale-125"
                                />
                                <div className="relative">
                                    <div className="flex items-center gap-3">
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#1E40AF] shadow-md shadow-blue-900/20">
                                            <span className="size-2.5 rounded-full bg-emerald-300" />
                                        </span>
                                        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-[#1E40AF]">
                                            {chapter.year}
                                        </span>
                                    </div>
                                    <h3 className="mt-5 text-xl font-bold text-slate-900 sm:text-2xl">{chapter.title}</h3>
                                    <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                                        {chapter.text}
                                    </p>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default OurStory
