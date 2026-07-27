"use client"

import { motion, useReducedMotion } from "framer-motion"
import { CheckCircle2, Eye, HeartPulse, Target } from "lucide-react"

const values = [
    "Patient-centred care",
    "Professional excellence",
    "Respect and dignity",
    "Accessible healthcare",
] as const

export function MissionAndVision() {
    const prefersReducedMotion = useReducedMotion()

    return (
        <section className="relative overflow-hidden bg-slate-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div
                aria-hidden="true"
                className="absolute -left-32 top-12 size-80 rounded-full bg-blue-100/60 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="absolute -right-24 bottom-0 size-72 rounded-full bg-emerald-100/60 blur-3xl"
            />

            <div className="relative mx-auto max-w-7xl">
                <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.45 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto mb-12 max-w-2xl text-center"
                >
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                        <HeartPulse aria-hidden="true" className="size-6" />
                    </div>
                    <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                        What guides us
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        Our Mission &amp; <span className="text-[#1E40AF]">Vision</span>
                    </h2>
                    <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
                        The purpose and ambition that shape every decision we make and every patient we care for.
                    </p>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                    <motion.article
                        initial={prefersReducedMotion ? false : { opacity: 0, x: -45 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={prefersReducedMotion ? undefined : { y: -7 }}
                        className="group relative overflow-hidden rounded-[2rem] bg-[#1E40AF] p-7 text-white shadow-[0_20px_55px_rgba(30,64,175,0.2)] sm:p-10"
                    >
                        <div
                            aria-hidden="true"
                            className="absolute -right-16 -top-20 size-56 rounded-full border-[38px] border-white/5 transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="relative">
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15 text-emerald-300 backdrop-blur">
                                <Target aria-hidden="true" className="size-7" />
                            </div>
                            <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                                Our mission
                            </p>
                            <h3 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
                                Quality healthcare with compassion and dignity.
                            </h3>
                            <p className="mt-5 max-w-xl leading-7 text-blue-100/85">
                                To provide safe, accessible, and high-quality medical care through skilled
                                professionals, modern technology, and a genuine commitment to every patient we serve.
                            </p>
                        </div>
                    </motion.article>

                    <motion.article
                        initial={prefersReducedMotion ? false : { opacity: 0, x: 45 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.7, delay: prefersReducedMotion ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={prefersReducedMotion ? undefined : { y: -7 }}
                        className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-10"
                    >
                        <div
                            aria-hidden="true"
                            className="absolute -bottom-20 -right-14 size-56 rounded-full bg-emerald-50 transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="relative">
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1E40AF]">
                                <Eye aria-hidden="true" className="size-7" />
                            </div>
                            <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                                Our vision
                            </p>
                            <h3 className="mt-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                                A healthier future for every community.
                            </h3>
                            <p className="mt-5 max-w-xl leading-7 text-slate-600">
                                To be a trusted leader in healthcare across Somalia, recognised for clinical
                                excellence, innovation, and an exceptional patient experience.
                            </p>
                        </div>
                    </motion.article>
                </div>

                <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.2 }}
                    className="mt-8 grid grid-cols-2 gap-3 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:grid-cols-4 sm:gap-5 sm:p-6"
                >
                    {values.map((value) => (
                        <div key={value} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                            <CheckCircle2 aria-hidden="true" className="size-5 shrink-0 text-emerald-500" />
                            <span>{value}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

export default MissionAndVision
