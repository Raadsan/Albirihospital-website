"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight, Play, Quote, Video as VideoIcon, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import api from "@/app/api/api"

type TestimonialVideo = {
  id: string
  title: string
  doctor: string
  youtubeUrl: string
  description?: string | null
}

function getYouTubeId(url: string) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^?&/]+)/,
  )
  return match?.[1] ?? ""
}

function TestimonialCard({
  video,
  onPlay,
}: {
  video: TestimonialVideo
  onPlay: (video: TestimonialVideo) => void
}) {
  const youtubeId = getYouTubeId(video.youtubeUrl)
  const thumbnail = youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : ""

  return (
    <article className="relative grid overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_50px_-32px_rgba(15,23,42,0.4)] sm:grid-cols-[0.92fr_1.08fr]">
      <div className="relative min-h-56 overflow-hidden bg-[#0b245f] sm:min-h-64">
        {thumbnail ? (
          <div
            role="img"
            aria-label={`${video.title} video thumbnail`}
            className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${thumbnail})` }}
          />
        ) : (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={video.youtubeUrl}
            preload="metadata"
            muted
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#071a47]/55 via-transparent to-black/10" />
        <button
          type="button"
          onClick={() => onPlay(video)}
          aria-label={`Play ${video.title}`}
          className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl bg-red-600 text-white shadow-xl transition hover:scale-105 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
        >
          <Play className="ml-1 size-7 fill-current" aria-hidden="true" />
        </button>
      </div>

      <div className="relative flex min-w-0 flex-col justify-center p-6 sm:p-7">
        <Quote className="absolute right-5 top-4 size-10 fill-slate-100 text-slate-200" aria-hidden="true" />
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
          {video.doctor || "Patient story"}
        </p>
        <h3 className="mt-2 line-clamp-3 text-xl font-bold leading-snug text-slate-950">
          {video.title}
        </h3>
        {video.description ? (
          <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">{video.description}</p>
        ) : (
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Watch this patient experience from Al-Birri Hospital.
          </p>
        )}
      </div>
    </article>
  )
}

export function DepartmentTestimonials({
  department,
  departmentName,
}: {
  department: string
  departmentName: string
}) {
  const [videos, setVideos] = useState<TestimonialVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(2)
  const [activeVideo, setActiveVideo] = useState<TestimonialVideo | null>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api.get(`/videos?department=${encodeURIComponent(department)}`)
      .then((response) => {
        if (cancelled) return
        const list = response.data?.data || (Array.isArray(response.data) ? response.data : [])
        setVideos(list)
      })
      .catch((error) => {
        console.warn(`Could not load ${department} testimonial videos:`, error)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [department])

  useEffect(() => {
    const updateItemsPerPage = () => setItemsPerPage(window.innerWidth >= 1024 ? 2 : 1)
    updateItemsPerPage()
    window.addEventListener("resize", updateItemsPerPage)
    return () => window.removeEventListener("resize", updateItemsPerPage)
  }, [])

  useEffect(() => {
    if (!activeVideo) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveVideo(null)
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activeVideo])

  const pageCount = Math.max(1, Math.ceil(videos.length / itemsPerPage))
  const activePage = Math.min(page, pageCount - 1)
  const visibleVideos = useMemo(() => {
    const start = activePage * itemsPerPage
    return videos.slice(start, start + itemsPerPage)
  }, [activePage, itemsPerPage, videos])

  useEffect(() => {
    if (prefersReducedMotion || pageCount <= 1 || activeVideo) return
    const timer = window.setInterval(() => setPage((current) => (current + 1) % pageCount), 8000)
    return () => window.clearInterval(timer)
  }, [activeVideo, pageCount, prefersReducedMotion])

  if (!loading && videos.length === 0) return null

  const activeYoutubeId = activeVideo ? getYouTubeId(activeVideo.youtubeUrl) : ""

  return (
    <>
      <section className="overflow-hidden bg-slate-100/70 py-16 sm:py-20" aria-labelledby={`${department}-stories-title`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-9 max-w-3xl text-center">
            <div className="mx-auto mb-3 grid size-11 place-items-center rounded-2xl bg-red-50 text-red-600">
              <VideoIcon className="size-5" aria-hidden="true" />
            </div>
            <h2 id={`${department}-stories-title`} className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Patient Reviews &amp; Success Stories
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Hear from patients about their experience with our {departmentName} team.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {[1, 2].map((item) => (
                <div key={item} className="h-64 animate-pulse rounded-3xl bg-slate-200" />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${itemsPerPage}-${activePage}`}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 45 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -45 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-6 lg:grid-cols-2"
              >
                {visibleVideos.map((video) => (
                  <TestimonialCard key={video.id} video={video} onPlay={setActiveVideo} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!loading && pageCount > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setPage((current) => (current - 1 + pageCount) % pageCount)}
                aria-label="Previous patient stories"
                className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#12368f] hover:text-[#12368f]"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
              </button>
              <div className="flex items-center gap-2" aria-label="Patient story pages">
                {Array.from({ length: pageCount }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setPage(index)}
                    aria-label={`Show patient story page ${index + 1}`}
                    aria-current={index === activePage ? "page" : undefined}
                    className={`h-2.5 rounded-full transition-all ${index === activePage ? "w-8 bg-emerald-500" : "w-2.5 bg-slate-300 hover:bg-slate-400"}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPage((current) => (current + 1) % pageCount)}
                aria-label="Next patient stories"
                className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#12368f] hover:text-[#12368f]"
              >
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
      </section>

      {activeVideo ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveVideo(null)
          }}
        >
          <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-black shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              aria-label="Close video"
              autoFocus
              className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-black/65 text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            <div className="aspect-video">
              {activeYoutubeId ? (
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${activeYoutubeId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  className="h-full w-full"
                  src={activeVideo.youtubeUrl}
                  title={activeVideo.title}
                  controls
                  autoPlay
                />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
