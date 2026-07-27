"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
    ArrowUpRight,
    BadgeCheck,
    Clock3,
    HeartHandshake,
    Microscope,
    ShieldCheck,
    Stethoscope,
    WalletCards,
} from "lucide-react"

const reasons = [
    {
        title: "Qualified Professionals",
        description: "Experienced medical teams delivering attentive, evidence-based care.",
        icon: Stethoscope,
    },
    {
        title: "24/7 Emergency Care",
        description: "Rapid emergency support and ambulance services, day and night.",
        icon: Clock3,
    },
    {
        title: "Modern Technology",
        description: "Advanced diagnostic and treatment equipment for accurate results.",
        icon: Microscope,
    },
    {
        title: "Affordable Healthcare",
        description: "Dependable, high-quality medical services at accessible costs.",
        icon: WalletCards,
    },
    {
        title: "Patient Safety",
        description: "Strict clinical standards, confidentiality, and a clean environment.",
        icon: ShieldCheck,
    },
    {
        title: "Compassionate Service",
        description: "Every patient is treated with empathy, respect, and dignity.",
        icon: HeartHandshake,
    },
] as const

const facts = [
    { value: "2013", label: "Serving since" },
    { value: "24/7", label: "Emergency care" },
    { value: "2", label: "Hospital locations" },
] as const

export function WhyChoose() {
    const prefersReducedMotion = useReducedMotion()

    return (
        <section className="relative overflow-hidden bg-slate-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div
                aria-hidden="true"
                className="absolute -left-28 bottom-0 size-80 rounded-full bg-emerald-100/50 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="absolute -right-28 top-10 size-80 rounded-full bg-blue-100/60 blur-3xl"
            />

            <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
                <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                >
                    <div className="relative h-[31rem] overflow-hidden rounded-[2rem] bg-slate-200 shadow-[0_24px_65px_rgba(15,23,42,0.17)] sm:h-[38rem]">
                        <Image
                            src="/images/3.png"
                            alt="Albirri Hospital healthcare professionals and facilities"
                            fill
                            sizes="(min-width: 1024px) 45vw, 100vw"
                            className="object-cover transition-transform duration-[1400ms] hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d245f]/75 via-transparent to-transparent" />

                        <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-md">
                            <BadgeCheck aria-hidden="true" className="size-7 text-emerald-300" />
                            <p className="mt-3 text-xl font-bold">Trusted healthcare, close to home.</p>
                            <p className="mt-2 text-sm leading-6 text-blue-50/80">
                                Modern medicine delivered with the compassion our communities deserve.
                            </p>
                        </div>
                    </div>

                    <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.3 }}
                        className="relative -mt-5 mx-4 grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:mx-7 sm:p-5"
                    >
                        {facts.map((fact) => (
                            <div key={fact.label} className="text-center">
                                <p className="text-lg font-extrabold text-[#1E40AF] sm:text-xl">{fact.value}</p>
                                <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">{fact.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                <div>
                    <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Why Albirri</p>
                        <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                            Why Choose
                            <span className="block text-[#1E40AF]">Albirri Hospital?</span>
                        </h2>
                        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                            We combine skilled professionals, modern facilities, and compassionate service to give
                            every patient dependable care they can trust.
                        </p>
                    </motion.div>

                    <div className="mt-9 grid gap-4 sm:grid-cols-2">
                        {reasons.map((reason, index) => {
                            const Icon = reason.icon

                            return (
                                <motion.article
                                    key={reason.title}
                                    initial={prefersReducedMotion ? false : { opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{
                                        delay: prefersReducedMotion ? 0 : (index % 2) * 0.08,
                                        duration: 0.55,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    whileHover={prefersReducedMotion ? undefined : { y: -5 }}
                                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-[0_14px_35px_rgba(30,64,175,0.1)]"
                                >
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-[#1E40AF] transition-colors duration-300 group-hover:bg-[#1E40AF] group-hover:text-white">
                                        <Icon aria-hidden="true" className="size-5" />
                                    </div>
                                    <h3 className="mt-4 font-bold text-slate-900">{reason.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{reason.description}</p>
                                </motion.article>
                            )
                        })}
                    </div>

                    <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: prefersReducedMotion ? 0 : 0.25 }}
                        className="mt-8"
                    >
                        <Link
                            href="/appointment"
                            className="group inline-flex items-center gap-2 rounded-full bg-[#1E40AF] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/15 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-600 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                        >
                            Book an appointment
                            <ArrowUpRight
                                aria-hidden="true"
                                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default WhyChoose
