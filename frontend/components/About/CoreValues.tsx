"use client"

import { motion, useReducedMotion } from "framer-motion"
import {
    BadgeCheck,
    HandHeart,
    HeartHandshake,
    HeartPulse,
    ShieldCheck,
    Sparkles,
    UsersRound,
} from "lucide-react"

const coreValues = [
    {
        title: "Quality Healthcare for All",
        description:
            "We are committed to providing accessible, affordable, and high-quality healthcare services for every community.",
        icon: HeartPulse,
        accent: "bg-rose-50 text-rose-600 group-hover:bg-rose-500",
    },
    {
        title: "Professionalism and Ethics",
        description:
            "We uphold the highest standards of medical professionalism, integrity, and ethical practice.",
        icon: BadgeCheck,
        accent: "bg-blue-50 text-[#1E40AF] group-hover:bg-[#1E40AF]",
    },
    {
        title: "Compassionate Patient Care",
        description:
            "We deliver patient-centered care with empathy, dignity, and respect.",
        icon: HandHeart,
        accent: "bg-amber-50 text-amber-600 group-hover:bg-amber-500",
    },
    {
        title: "Safety and Confidentiality",
        description:
            "We prioritize patient safety, data protection, and ethical medical practice in every aspect of care.",
        icon: ShieldCheck,
        accent: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500",
    },
    {
        title: "Social Responsibility",
        description:
            "We actively contribute to community wellbeing through outreach, awareness, and humanitarian initiatives.",
        icon: UsersRound,
        accent: "bg-violet-50 text-violet-600 group-hover:bg-violet-500",
    },
    {
        title: "Dynamic Healthcare Provision",
        description:
            "We continuously improve our services through innovation, modern technology, and evidence-based medical practices.",
        icon: Sparkles,
        accent: "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-500",
    },
] as const

export function CoreValues() {
    const prefersReducedMotion = useReducedMotion()

    return (
        <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div
                aria-hidden="true"
                className="absolute -left-40 -top-40 size-[30rem] rounded-full border-[70px] border-white/[0.035]"
            />
            <div
                aria-hidden="true"
                className="absolute -bottom-48 -right-32 size-[32rem] rounded-full border-[80px] border-emerald-400/[0.06]"
            />
            <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl"
            />

            <div className="relative mx-auto max-w-7xl">
                <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto mb-12 max-w-2xl text-center lg:mb-14"
                >
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">What we stand for</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        Our Core Values
                    </h2>
                    <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
                        The principles behind our care, our decisions, and the trust patients place in Albirri
                        Hospital every day.
                    </p>
                </motion.div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {coreValues.map((value, index) => {
                        const Icon = value.icon

                        return (
                            <motion.article
                                key={value.title}
                                initial={prefersReducedMotion ? false : { opacity: 0, y: 40, scale: 0.97 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{
                                    delay: prefersReducedMotion ? 0 : (index % 3) * 0.09,
                                    duration: 0.6,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                whileHover={prefersReducedMotion ? undefined : { y: -8 }}
                                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)] transition-all duration-500 hover:border-[#1E40AF] hover:bg-[#0d245f] hover:shadow-[0_22px_55px_rgba(13,36,95,0.24)] sm:p-7"
                            >
                                <span className="absolute right-5 top-4 text-5xl font-black text-slate-200/70 transition-colors duration-500 group-hover:text-white/[0.08]">
                                    0{index + 1}
                                </span>

                                <div
                                    className={`flex size-13 items-center justify-center rounded-2xl transition-all duration-500 group-hover:rotate-3 group-hover:text-white ${value.accent}`}
                                >
                                    <Icon aria-hidden="true" className="size-6" strokeWidth={1.8} />
                                </div>

                                <h3 className="mt-6 text-xl font-bold text-slate-900 transition-colors duration-500 group-hover:text-white sm:text-2xl">
                                    {value.title}
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-slate-600 transition-colors duration-500 group-hover:text-blue-100/85 sm:text-base sm:leading-7">
                                    {value.description}
                                </p>

                                <div className="mt-6 h-0.5 w-10 rounded-full bg-emerald-400 transition-all duration-500 group-hover:w-20" />
                            </motion.article>
                        )
                    })}
                </div>

                <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.25 }}
                    className="mx-auto mt-10 flex max-w-3xl items-center justify-center gap-3 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-center text-sm font-semibold text-emerald-800 sm:text-base"
                >
                    <HeartHandshake aria-hidden="true" className="size-5 shrink-0 text-emerald-400" />
                    <span>Every value supports one promise: compassionate care you can trust.</span>
                </motion.div>
            </div>
        </section>
    )
}

export default CoreValues
