"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight, Play, Video as VideoIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import api from "@/app/api/api"

type Video = {
    title: string
    doctor: string
    youtubeUrl: string
}

function getYouTubeId(url: string) {
    const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^?&/]+)/,
    )
    return match?.[1] ?? ""
}

function VideoCard({ video }: { video: Video }) {
    const videoId = getYouTubeId(video.youtubeUrl)
    const { t } = useLanguage()
    return (
        <article className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_55px_-30px_rgba(15,23,42,0.35)]">
            <div className="relative aspect-video overflow-hidden bg-slate-950">
                {videoId ? (
                    <iframe
                        className="h-full w-full"
                        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
                        title={video.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                ) : video.youtubeUrl ? (
                    <video
                        className="h-full w-full object-cover"
                        src={video.youtubeUrl}
                        title={video.title}
                        controls
                        preload="metadata"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <VideoIcon className="size-12 opacity-50" />
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
                    <Play className="size-3.5 fill-current" aria-hidden="true" />
                    {t("Watch & Learn")}
                </div>
                <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-900">
                    {t(video.title)}
                </h3>
                <p className="mt-2 text-sm text-slate-500">{t(video.doctor)}</p>
            </div>
        </article>
    )
}

export function Watch() {
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [direction, setDirection] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(3)
    const prefersReducedMotion = useReducedMotion()
    const { t } = useLanguage()

    useEffect(() => {
        api.get("/videos")
            .then((res) => {
                const list = res.data?.data || (Array.isArray(res.data) ? res.data : [])
                setVideos(list)
            })
            .catch((err) => {
                console.warn("Could not load dynamic videos:", err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        const updateItemsPerPage = () => {
            setItemsPerPage(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1)
        }

        updateItemsPerPage()
        window.addEventListener("resize", updateItemsPerPage)
        return () => window.removeEventListener("resize", updateItemsPerPage)
    }, [])

    const pageCount = Math.max(1, Math.ceil(videos.length / itemsPerPage))
    const activePage = page % pageCount
    const visibleVideos = useMemo(() => {
        const start = activePage * itemsPerPage
        return videos.slice(start, start + itemsPerPage)
    }, [activePage, itemsPerPage, videos])

    useEffect(() => {
        if (prefersReducedMotion || pageCount <= 1) return
        const timer = window.setInterval(() => {
            setDirection(1)
            setPage((current) => (current + 1) % pageCount)
        }, 7000)
        return () => window.clearInterval(timer)
    }, [pageCount, prefersReducedMotion])

    const changePage = (nextDirection: number) => {
        setDirection(nextDirection)
        setPage((current) => (current + nextDirection + pageCount) % pageCount)
    }

    return (
        <section className="overflow-hidden bg-slate-50 py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    className="mx-auto mb-12 max-w-3xl text-center"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.65 }}
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600">
                        <VideoIcon className="size-5" aria-hidden="true" />
                        {t("Health Videos")}
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                        {t("Trusted Medical Insights from")}{" "}
                        <span className="text-emerald-600">{t("Al-Birri Hospital Experts")}</span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                        {t("Your Health Matters: Watch & Learn")}
                    </p>
                </motion.div>

                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-video min-h-[260px] rounded-3xl bg-slate-200 animate-pulse border border-slate-300" />
                        ))}
                    </div>
                ) : videos.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center max-w-xl mx-auto shadow-sm">
                        <VideoIcon className="size-12 text-emerald-600 mx-auto mb-3 opacity-50" />
                        <h3 className="text-xl font-bold text-slate-800">{t("Health Videos Updating")}</h3>
                        <p className="mt-2 text-sm text-slate-600">
                            {t("Educational medical videos published in the admin dashboard will appear here.")}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="relative min-h-[370px]">
                            <AnimatePresence mode="wait" initial={false} custom={direction}>
                                <motion.div
                                    key={`${itemsPerPage}-${activePage}`}
                                    custom={direction}
                                    initial={
                                        prefersReducedMotion
                                            ? { opacity: 0 }
                                            : { opacity: 0, x: direction * 70 }
                                    }
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={
                                        prefersReducedMotion
                                            ? { opacity: 0 }
                                            : { opacity: 0, x: direction * -70 }
                                    }
                                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                                >
                                    {visibleVideos.map((video) => (
                                        <VideoCard key={video.youtubeUrl} video={video} />
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {pageCount > 1 && (
                            <div className="mt-9 flex items-center justify-center gap-5">
                                <button
                                    type="button"
                                    onClick={() => changePage(-1)}
                                    aria-label={t("Previous videos")}
                                    className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-500 hover:text-white"
                                >
                                    <ArrowLeft className="size-5" aria-hidden="true" />
                                </button>

                                <div className="flex gap-2" aria-label={t("Video pages")}>
                                    {Array.from({ length: pageCount }, (_, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => {
                                                setDirection(index > activePage ? 1 : -1)
                                                setPage(index)
                                            }}
                                            aria-label={t(`Go to video page ${index + 1}`)}
                                            aria-current={index === activePage}
                                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                                index === activePage
                                                    ? "w-8 bg-emerald-500"
                                                    : "w-2.5 bg-slate-300 hover:bg-slate-400"
                                            }`}
                                        />
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => changePage(1)}
                                    aria-label={t("Next videos")}
                                    className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-500 hover:text-white"
                                >
                                    <ArrowRight className="size-5" aria-hidden="true" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    )
}
