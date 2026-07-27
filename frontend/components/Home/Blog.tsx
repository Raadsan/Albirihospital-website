"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, CalendarDays } from "lucide-react"

const blogPosts = [
    {
        title: "How Technology Is Revolutionizing Healthcare at Albirri Hospital",
        excerpt:
            "Discover how modern technology is transforming patient care and helping Albirri Hospital deliver faster, safer, and more accurate healthcare.",
        image: "/images/1.png",
        category: "Technology",
        date: "July 18, 2026",
        href: "/news",
    },
    {
        title: "Understanding the Role of Emergency Care in Critical Times",
        excerpt:
            "Emergencies can happen at any time. Learn how a prepared medical team and timely treatment can make a life-saving difference.",
        image: "/images/2.png",
        category: "Emergency Care",
        date: "July 12, 2026",
        href: "/news",
    },
    {
        title: "The Importance of Preventive Care in Maintaining Good Health",
        excerpt:
            "Regular checkups and early screening help prevent illness, identify health concerns sooner, and support a healthier life.",
        image: "/images/3.png",
        category: "Health Tips",
        date: "July 05, 2026",
        href: "/news",
    },
] as const

export function Blog() {
    const prefersReducedMotion = useReducedMotion()

    return (
        <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div
                aria-hidden="true"
                className="absolute -left-32 top-16 size-80 rounded-full bg-blue-100/50 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="absolute -right-28 bottom-0 size-80 rounded-full bg-emerald-100/40 blur-3xl"
            />

            <div className="relative mx-auto max-w-7xl">
                <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-12 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between"
                >
                    <div className="max-w-2xl">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                            Latest news
                        </p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                            Health insights from
                            <span className="block text-[#1E40AF]">Albirri Hospital</span>
                        </h2>
                        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                            Helpful guidance, hospital updates, and trusted information to help you make better
                            decisions about your health.
                        </p>
                    </div>

                    <Link
                        href="/news"
                        className="group inline-flex w-fit items-center gap-2 font-bold text-[#1E40AF] transition-colors hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                    >
                        View all articles
                        <ArrowUpRight
                            aria-hidden="true"
                            className="size-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                        />
                    </Link>
                </motion.div>

                <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                    {blogPosts.map((post, index) => (
                        <motion.article
                            key={post.title}
                            initial={prefersReducedMotion ? false : { opacity: 0, y: 45, scale: 0.97 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                                delay: prefersReducedMotion ? 0 : index * 0.1,
                                duration: 0.6,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            whileHover={prefersReducedMotion ? undefined : { y: -9 }}
                            className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.07)] transition-[border-color,box-shadow] duration-500 hover:border-blue-200 hover:shadow-[0_24px_60px_rgba(30,64,175,0.15)]"
                        >
                            <Link
                                href={post.href}
                                aria-label={`Read ${post.title}`}
                                className="relative m-3 block h-56 overflow-hidden rounded-[1.25rem] bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                            >
                                <Image
                                    src={post.image}
                                    alt=""
                                    fill
                                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
                                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#1E40AF] shadow-sm backdrop-blur">
                                    {post.category}
                                </span>
                            </Link>

                            <div className="flex flex-1 flex-col px-6 pb-7 pt-3">
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                    <CalendarDays aria-hidden="true" className="size-4 text-emerald-600" />
                                    <time>{post.date}</time>
                                </div>

                                <h3 className="mt-4 text-xl font-bold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-[#1E40AF] sm:text-2xl">
                                    <Link
                                        href={post.href}
                                        className="focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                                    >
                                        {post.title}
                                    </Link>
                                </h3>

                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>

                                <Link
                                    href={post.href}
                                    className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#1E40AF] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-900/15 transition-all duration-300 hover:bg-emerald-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                                >
                                    Read more
                                    <ArrowUpRight
                                        aria-hidden="true"
                                        className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                    />
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Blog
