"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { Clock3, MapPin, Phone } from "lucide-react"

const quickLinks = [
    { label: "About us", href: "/about/us" },
    { label: "Our doctors", href: "/about/doctors" },
    { label: "News & blogs", href: "/news" },
    { label: "Contact us", href: "/contact" },
] as const

const serviceLinks = [
    { label: "Maternity", href: "/departments/maternity" },
    { label: "Laboratory", href: "/departments/laboratory" },
    { label: "Radiology", href: "/departments/radiology" },
    { label: "Pharmacy", href: "/departments/pharmacy" },
] as const

const socialLinks = [
    { label: "Facebook", href: "https://www.facebook.com", icon: "facebook" },
    { label: "Instagram", href: "https://www.instagram.com", icon: "instagram" },
    { label: "TikTok", href: "https://www.tiktok.com", icon: "tiktok" },
    { label: "Twitter", href: "https://x.com", icon: "twitter" },
] as const

export function Footer() {
    const prefersReducedMotion = useReducedMotion()

    return (
        <footer className="relative overflow-hidden bg-[#0d245f] px-4 pt-12 text-white sm:px-6 lg:px-8">
            <div
                aria-hidden="true"
                className="absolute -left-28 -top-28 size-72 rounded-full bg-blue-500/15 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="absolute -bottom-32 right-0 size-80 rounded-full bg-emerald-400/10 blur-3xl"
            />

            <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="relative mx-auto max-w-7xl"
            >
                <div className="grid gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.7fr_0.8fr_1.15fr] lg:gap-12">
                    <div>
                        <Link
                            href="/"
                            aria-label="Albirri Hospital home"
                            className="inline-flex rounded-2xl px-2 py-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/40"
                        >
                            <Image
                                src="/images/logo1.png"
                                alt="Albirri Hospital"
                                width={165}
                                height={58}
                                className="h-14 w-auto object-contain sm:h-16"
                            />
                        </Link>
                        <p className="mt-5 max-w-sm text-sm leading-6 text-blue-100/75">
                            Trusted, modern healthcare delivered with respect,<br /> compassion, and dignity.

                        </p>
                        <div className="mt-5 flex items-center gap-2.5">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Follow Albirri Hospital on ${social.label}`}
                                    whileHover={prefersReducedMotion ? undefined : { y: -4, scale: 1.06 }}
                                    whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
                                    className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors duration-300 hover:border-emerald-400 hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/40"
                                >
                                    {social.icon === "facebook" && (
                                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4.5 fill-current">
                                            <path d="M13.8 22v-9h3l.5-3.5h-3.5V7.3c0-1 .3-1.7 1.8-1.7h1.9V2.5c-.3 0-1.5-.1-2.8-.1-2.8 0-4.7 1.7-4.7 4.8v2.3H7V13h3v9h3.8Z" />
                                        </svg>
                                    )}
                                    {social.icon === "instagram" && (
                                        <svg
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            className="size-4.5 fill-none stroke-current"
                                            strokeWidth="2"
                                        >
                                            <rect x="3" y="3" width="18" height="18" rx="5" />
                                            <circle cx="12" cy="12" r="4" />
                                            <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
                                        </svg>
                                    )}
                                    {social.icon === "tiktok" && (
                                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4.5 fill-current">
                                            <path d="M15.5 3c.3 2.5 1.7 4 4.5 4.2v3.1a9 9 0 0 1-4.5-1.4v6.2a6.1 6.1 0 1 1-5.3-6v3.2a3 3 0 1 0 2.1 2.8V3h3.2Z" />
                                        </svg>
                                    )}
                                    {social.icon === "twitter" && (
                                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
                                            <path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.9-6.4L6.5 22H3.3l7.3-8.4L2.8 2h6.4l4.4 5.8L18.9 2Zm-1.1 17.8h1.7L8.3 4.1H6.5l11.3 15.7Z" />
                                        </svg>
                                    )}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <nav aria-label="Footer quick links">
                        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-400">Quick links</h2>
                        <ul className="mt-5 space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-blue-100/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:text-emerald-300"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-label="Footer services">
                        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-400">Services</h2>
                        <ul className="mt-5 space-y-3">
                            {serviceLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-blue-100/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:text-emerald-300"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-400">Contact</h2>
                        <ul className="mt-5 space-y-4 text-sm text-blue-100/75">
                            <li>
                                <a
                                    href="tel:4446"
                                    className="group flex items-center gap-3 transition-colors hover:text-white focus-visible:outline-none focus-visible:text-emerald-300"
                                >
                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-emerald-400 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                                        <Phone aria-hidden="true" className="size-4" />
                                    </span>
                                    <span>
                                        <span className="block text-xs text-blue-200/60">Emergency line</span>
                                        <span className="font-semibold text-white">4446</span>
                                    </span>
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                                <span>KM14 Afgoi Road, Mogadishu, Somalia</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Clock3 aria-hidden="true" className="size-5 shrink-0 text-emerald-400" />
                                <span>Emergency care open 24/7</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-white/10 py-5 text-xs text-blue-100/60 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} Albirri Hospital. All rights reserved.</p>
                    <p>Powered by Deero Advert</p>
                </div>
            </motion.div>
        </footer>
    )
}

export default Footer
