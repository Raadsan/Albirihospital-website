"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { ArrowLeft, CalendarDays, User, Tag, Clock, Share2, Check } from "lucide-react"
import { AboutBanner } from "@/components/About/AboutBanner"
import api from "@/app/api/api"
import { Button } from "@/components/ui/button"

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  category: string
  author: string
  views: number
  createdAt: string
}

export default function ArticleDetailPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [article, setArticle] = React.useState<Article | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!slug) return

    api.get(`/blogs/${slug}`)
      .then((res) => {
        if (res.data?.data) {
          setArticle(res.data.data)
        }
      })
      .catch((err) => {
        console.warn("Could not load blog article:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [slug])

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="size-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="py-24 text-center bg-slate-50 min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-800">Maqaalka Lama Helin</h2>
        <p className="text-slate-500 mt-2">The requested news article could not be found.</p>
        <Link href="/news" className="mt-6 inline-flex items-center gap-2 text-emerald-600 font-semibold hover:underline">
          <ArrowLeft className="size-4" />
          Ku noqo Maqaalada (Back to News)
        </Link>
      </div>
    )
  }

  const formattedDate = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recent"

  return (
    <>
      <AboutBanner title={article.title} breadcrumbPage="News Article" />

      <article className="bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl bg-white rounded-3xl p-6 sm:p-12 shadow-sm border border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="size-4" />
              Ku noqo Dhammaan Maqaalada
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="size-3.5" />
                  <span>Share Article</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-700">
              <Tag className="size-3" />
              {article.category}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5 text-slate-400" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="size-3.5 text-slate-400" />
              {article.author || "Al-Birri Medical Team"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed mb-8 border-l-4 border-emerald-500 pl-4 italic">
              {article.excerpt}
            </p>
          )}

          {article.image && (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-10 shadow-md">
              <Image
                src={article.image}
                alt={article.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          <div className="prose prose-slate max-w-none text-base sm:text-lg leading-relaxed text-slate-700 space-y-6">
            {article.content ? (
              article.content.split("\n\n").map((para, idx) => (
                <p key={idx} className="whitespace-pre-line">
                  {para}
                </p>
              ))
            ) : (
              <p>{article.excerpt}</p>
            )}
          </div>

          {/* Quick CTA */}
          <div className="mt-14 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-bold">Ma U Baahan Tahay La Tashi Dhakhtar?</h4>
              <p className="text-sm text-blue-100/80 mt-1">
                Kala hadal dhaqaatiirteena khibrada leh adoo ballan qabsanaya hadda.
              </p>
            </div>
            <Link href="/appointment">
              <Button className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 whitespace-nowrap">
                Qabso Ballan (Book Appointment)
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
