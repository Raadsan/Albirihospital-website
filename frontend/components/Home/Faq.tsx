"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Plus } from "lucide-react"
import { useState } from "react"

const faqs = [
    {
        question: "What services does Albirri Hospital provide?",
        answer:
            "We provide maternity care, specialist consultations, pharmacy services, laboratory testing, radiology, surgery, ambulance support, and 24/7 emergency care.",
    },
    {
        question: "Is Albirri Hospital open 24 hours?",
        answer:
            "Yes. Our emergency department is open 24 hours a day, seven days a week, so patients can receive urgent medical attention whenever they need it.",
    },
    {
        question: "Where is Albirri Hospital located?",
        answer:
            "We serve patients from our facilities at KM14 Afgoi Road in Mogadishu and in Adado Town, Galgaduud Region.",
    },
    {
        question: "Do I need an appointment to see a doctor?",
        answer:
            "Appointments are recommended for specialist consultations, but emergency patients are always seen immediately. You can contact our team to arrange a convenient time.",
    },
    {
        question: "How can I contact the emergency department?",
        answer:
            "For urgent medical assistance or ambulance services, call our emergency line on 4446. Our team is available around the clock.",
    },
] as const

export function Faq() {
    const [openItem, setOpenItem] = useState<number | null>(null)
    const prefersReducedMotion = useReducedMotion()

    return (
        <section className="relative overflow-hidden bg-slate-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div
                aria-hidden="true"
                className="absolute -left-32 top-1/2 size-80 -translate-y-1/2 rounded-full bg-blue-100/50 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="absolute -right-24 top-0 size-72 rounded-full bg-emerald-100/40 blur-3xl"
            />

            <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
                <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, x: -35 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="lg:sticky lg:top-28 lg:self-start"
                >
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                        FAQ&apos;s
                    </p>
                    <h2 className="mt-3 max-w-lg text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        Frequently Asked
                        <span className="block text-[#1E40AF]">Questions</span>
                    </h2>
                    <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
                        Find quick answers to common questions about Albirri Hospital, our medical services, and how we
                        care for you.
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openItem === index
                        const panelId = `faq-panel-${index}`
                        const buttonId = `faq-button-${index}`

                        return (
                            <motion.div
                                key={faq.question}
                                initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{
                                    delay: prefersReducedMotion ? 0 : index * 0.07,
                                    duration: 0.5,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className={`overflow-hidden rounded-3xl border bg-white transition-all duration-300 ${
                                    isOpen
                                        ? "border-blue-200 shadow-[0_18px_45px_rgba(30,64,175,0.12)]"
                                        : "border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.05)] hover:border-blue-200 hover:shadow-[0_14px_35px_rgba(15,23,42,0.09)]"
                                }`}
                            >
                                <h3>
                                    <button
                                        id={buttonId}
                                        type="button"
                                        aria-expanded={isOpen}
                                        aria-controls={panelId}
                                        onClick={() => setOpenItem(isOpen ? null : index)}
                                        className="group flex w-full items-center justify-between gap-5 px-5 py-5 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-blue-100 sm:px-7 sm:py-6"
                                    >
                                        <span className="text-base font-semibold leading-6 text-slate-900 transition-colors group-hover:text-[#1E40AF] sm:text-lg">
                                            {faq.question}
                                        </span>
                                        <span
                                            className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                                                isOpen
                                                    ? "border-[#1E40AF] bg-[#1E40AF] text-white"
                                                    : "border-slate-300 text-slate-700 group-hover:border-[#1E40AF] group-hover:text-[#1E40AF]"
                                            }`}
                                        >
                                            <Plus
                                                aria-hidden="true"
                                                className={`size-4 transition-transform duration-300 ${
                                                    isOpen ? "rotate-45" : ""
                                                }`}
                                                strokeWidth={2}
                                            />
                                        </span>
                                    </button>
                                </h3>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            id={panelId}
                                            role="region"
                                            aria-labelledby={buttonId}
                                            initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: "easeOut" }}
                                            className="overflow-hidden"
                                        >
                                            <p className="mx-5 border-t border-slate-100 pb-6 pt-4 text-sm leading-7 text-slate-600 sm:mx-7 sm:pr-14 sm:text-base">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Faq
