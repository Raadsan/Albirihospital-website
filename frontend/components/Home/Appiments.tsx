"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, CalendarDays, Clock3, Phone, UserRound } from "lucide-react"

const fields = [
    { id: "name", label: "Name", placeholder: "Your name", type: "text", icon: UserRound, autoComplete: "name" },
    { id: "phone", label: "Phone Number", placeholder: "Your phone", type: "tel", icon: Phone, autoComplete: "tel" },
    { id: "date", label: "Preferred Date", placeholder: "", type: "date", icon: CalendarDays, autoComplete: "off" },
    { id: "time", label: "Preferred Time", placeholder: "", type: "time", icon: Clock3, autoComplete: "off" },
] as const

export function Appiments() {
    const prefersReducedMotion = useReducedMotion()

    return (
        <section aria-label="Quick appointment booking" className="relative z-20 mx-auto -mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.form
                action="/appointment"
                method="get"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.16)] sm:p-5 md:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-end lg:gap-2"
            >
                {fields.map((field, index) => {
                    const Icon = field.icon
                    return (
                        <motion.label
                            key={field.id}
                            htmlFor={field.id}
                            initial={prefersReducedMotion ? false : { opacity: 0, x: -18 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.12 + index * 0.08, duration: 0.45 }}
                            className="group flex min-w-0 flex-col gap-2 rounded-xl border border-transparent px-3 py-2 transition-colors focus-within:border-blue-100 focus-within:bg-blue-50/50 hover:bg-slate-50"
                        >
                            <span className="text-xs font-semibold text-slate-800">{field.label}</span>
                            <span className="flex items-center gap-2">
                                <Icon aria-hidden="true" className="size-4 shrink-0 text-blue-700 transition-transform group-focus-within:scale-110" />
                                <input
                                    id={field.id}
                                    name={field.id}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    autoComplete={field.autoComplete}
                                    required
                                    className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                                />
                            </span>
                        </motion.label>
                    )
                })}

                <motion.button
                    type="submit"
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.02 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.45, duration: 0.4 }}
                    className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 text-sm font-semibold whitespace-nowrap text-white shadow-lg shadow-blue-700/20 transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 md:col-span-2 lg:col-span-1 lg:mt-0"
                >
                    Book an appointment
                    <ArrowRight aria-hidden="true" className="size-4" />
                </motion.button>
            </motion.form>
        </section>
    )
}

export default Appiments
