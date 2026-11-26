"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, CalendarDays, HeartHandshake, MapPin, Play, X } from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/app/api/api"
import { useLanguage } from "@/components/language-provider"

const aboutImages = [
    { src: "/images/1.png", alt: "Albirri Hospital main campus" },
    { src: "/images/2.png", alt: "Albirri Hospital building" },
    { src: "/images/3.png", alt: "Albirri Hospital facilities" },
    { src: "/images/outpatient_clinic.png", alt: "Albirri Hospital outpatient clinic" },
] as const

const highlights = [
    { value: "2013", label: "Established", icon: CalendarDays },
    { value: "2", label: "Hospital locations", icon: MapPin },
    { value: "We care", label: "Our promise", icon: HeartHandshake },
] as const

type AboutVideo = {
    title: string
    youtubeUrl: string
}

const defaultAboutVideo: AboutVideo = {
    title: "Albirri Hospital video",
    youtubeUrl: "https://youtu.be/qGJDnGWzEZ0",
}

function getYouTubeId(url: string) {
    const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^?&/]+)/,
    )
    return match?.[1] ?? ""
}

function getVideoList(responseData: unknown): AboutVideo[] {
    if (Array.isArray(responseData)) return responseData as AboutVideo[]

    if (
        responseData &&
        typeof responseData === "object" &&
        "data" in responseData &&
        Array.isArray(responseData.data)
    ) {
        return responseData.data as AboutVideo[]
    }

    return []
}

export function About() {
    const [aboutVideo, setAboutVideo] = useState(defaultAboutVideo)
    const [activeVideo, setActiveVideo] = useState<AboutVideo | null>(null)
    const prefersReducedMotion = useReducedMotion()
    const { t } = useLanguage()

    useEffect(() => {
        let cancelled = false

        async function loadAboutVideo() {
            try {
                const aboutResponse = await api.get("/videos?department=about")
                const [publishedVideo] = getVideoList(aboutResponse.data)
                if (!cancelled && publishedVideo?.youtubeUrl) setAboutVideo(publishedVideo)
            } catch (error) {
                console.warn("Could not load the About section video:", error)
            }
        }

        loadAboutVideo()
        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        if (!activeVideo) return

        const previousOverflow = document.body.style.overflow
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setActiveVideo(null)
        }

        document.body.style.overflow = "hidden"
        window.addEventListener("keydown", closeOnEscape)

        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener("keydown", closeOnEscape)
        }
    }, [activeVideo])

    const activeYoutubeId = activeVideo ? getYouTubeId(activeVideo.youtubeUrl) : ""

    return (
        <>
            <section className="overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
                <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, x: -60, scale: 0.96 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                        className="relative"
                    >
                        <div className="grid h-[31rem] grid-cols-2 gap-3 sm:h-[36rem] sm:gap-4 lg:h-[39rem]">
                            <div className="grid grid-rows-[1.35fr_0.8fr] gap-3 sm:gap-4">
                                <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-100 shadow-[0_20px_55px_rgba(15,23,42,0.14)]">
                                    <Image
                                        src={aboutImages[0].src}
                                        alt={t(aboutImages[0].alt)}
                                        fill
                                        sizes="(min-width: 1024px) 25vw, 50vw"
                                        className="object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                </div>
                                <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-100 shadow-[0_20px_55px_rgba(15,23,42,0.12)]">
                                    <Image
                                        src={aboutImages[1].src}
                                        alt={t(aboutImages[1].alt)}
                                        fill
                                        sizes="(min-width: 1024px) 25vw, 50vw"
                                        className="object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-rows-[0.8fr_1.35fr] gap-3 sm:gap-4">
                                <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-100 shadow-[0_20px_55px_rgba(15,23,42,0.12)]">
                                    <Image
                                        src={aboutImages[2].src}
                                        alt={t(aboutImages[2].alt)}
                                        fill
                                        sizes="(min-width: 1024px) 25vw, 50vw"
                                        className="object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                </div>
                                <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-100 shadow-[0_20px_55px_rgba(15,23,42,0.14)]">
                                    <Image
                                        src={aboutImages[3].src}
                                        alt={t(aboutImages[3].alt)}
                                        fill
                                        sizes="(min-width: 1024px) 25vw, 50vw"
                                        className="object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-slate-950/30 px-4 py-3 text-white backdrop-blur-md">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-100">{t("Serving Somalia")}</p>
                                        <p className="mt-1 text-sm font-semibold sm:text-base">{t("Mogadishu & Adado")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            type="button"
                            onClick={() => setActiveVideo(aboutVideo)}
                            aria-haspopup="dialog"
                            aria-label={t("Play our hospital video")}
                            title={t("Play our hospital video")}
                            animate={
                                !prefersReducedMotion
                                    ? { scale: [1, 1.06, 1] }
                                    : undefined
                            }
                            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                            className="group absolute left-1/2 top-[43%] z-10 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[7px] border-white bg-[#1E40AF] text-white shadow-[0_18px_45px_rgba(30,64,175,0.38)] transition-colors hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:size-24"
                        >
                            <span className="absolute inset-1 rounded-full border border-white/25" aria-hidden="true" />
                            <Play className="ml-1 size-8 fill-current transition-transform group-hover:scale-110 sm:size-10" aria-hidden="true" />
                        </motion.button>
                    </motion.div>

                    <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, x: 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col justify-center"
                    >
                        <motion.p
                            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600"
                        >
                            {t("About Albirri Hospital")}
                        </motion.p>

                        <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                            {t("Modern healthcare,")}
                            <span className="block text-[#1E40AF]">{t("built around you.")}</span>
                        </h2>

                        <div className="mt-6 space-y-4 text-base leading-8 text-slate-600 sm:text-lg">
                            <p>
                                <strong className="font-semibold text-slate-900">{t("Albirri Hospitals")}</strong>{" "}
                                {t("are modern health facilities located at KM14 Afgoi Road, Mogadishu, and in Adado Town, Galgaduud Region. Established on April 14, 2013, Albirri is a Somali-owned hospital registered under the Somali Federal Government and follows Ministry of Health guidelines.")}
                            </p>
                            <p>
                                {t("With advanced equipment and skilled staff, we offer quality care in diagnostics, treatment, and surgery. Every patient is treated with respect, privacy, and dignity under our motto:")}
                                <em className="font-semibold text-[#1E40AF]"> {t("We care.")}</em>
                            </p>
                        </div>

                        <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
                            {highlights.map((item, index) => {
                                const Icon = item.icon
                                return (
                                    <motion.div
                                        key={item.label}
                                        initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                                        whileHover={prefersReducedMotion ? undefined : { y: -5 }}
                                        className="rounded-2xl border border-blue-100 bg-blue-50/60 p-3 transition-colors hover:bg-blue-50 sm:p-4"
                                    >
                                        <Icon aria-hidden="true" className="size-5 text-emerald-600" />
                                        <p className="mt-3 text-base font-bold text-[#1E40AF] sm:text-lg">{t(item.value)}</p>
                                        <p className="mt-0.5 text-[11px] leading-4 text-slate-500 sm:text-xs">{t(item.label)}</p>
                                    </motion.div>
                                )
                            })}
                        </div>

                        <motion.div
                            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.55, duration: 0.55 }}
                            className="mt-8"
                        >
                            <Link
                                href="/about/us"
                                className="group inline-flex items-center gap-2 rounded-full bg-[#1E40AF] px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-900/15 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-600 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                            >
                                {t("Discover our story")}
                                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {activeVideo ? (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={t(activeVideo.title)}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) setActiveVideo(null)
                    }}
                >
                    <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-black shadow-2xl"
                    >
                        <button
                            type="button"
                            onClick={() => setActiveVideo(null)}
                            aria-label={t("Close video")}
                            autoFocus
                            className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full bg-black/70 text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
                        >
                            <X className="size-5" aria-hidden="true" />
                        </button>
                        <div className="aspect-video">
                            {activeYoutubeId ? (
                                <iframe
                                    className="h-full w-full"
                                    src={`https://www.youtube-nocookie.com/embed/${activeYoutubeId}?autoplay=1&rel=0`}
                                    title={t(activeVideo.title)}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            ) : (
                                <video
                                    className="h-full w-full"
                                    src={activeVideo.youtubeUrl}
                                    title={t(activeVideo.title)}
                                    controls
                                    autoPlay
                                />
                            )}
                        </div>
                        {activeYoutubeId && (
                            <div className="flex justify-end px-4 py-2">
                                <a
                                    href={`https://www.youtube.com/watch?v=${encodeURIComponent(activeYoutubeId)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex min-h-9 items-center gap-2 rounded px-2 text-sm font-semibold text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    {t("Watch on YouTube")}
                                    <ArrowUpRight className="size-4" aria-hidden="true" />
                                </a>
                            </div>
                        )}
                    </motion.div>
                </div>
            ) : null}
        </>
    )
}

export default About
