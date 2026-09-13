import { notFound } from "next/navigation"
import {
  HealthCheckupBanner,
  HospitalServicesBanner,
} from "@/components/Services/HealthCheckupBanner"
import { Services } from "@/components/Home/Services"
import { HealthCheckupsList } from "@/components/Services/HealthCheckupsList"

const pages = {
  "health-checkups": {
    title: "Health Checkups",
    description: "Discover our health screening and routine checkup services.",
  },
  "hospital-services": {
    title: "Hospital Services",
    description: "Explore the hospital services available to patients and their families.",
  },
} as const

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }))
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = pages[slug as keyof typeof pages]

  if (!page) notFound()

  if (slug === "health-checkups") {
    return (
      <>
        <HealthCheckupBanner />
        <HealthCheckupsList />
      </>
    )
  }

  if (slug === "hospital-services") {
    return (
      <>
        <HospitalServicesBanner />
        <Services />
      </>
    )
  }

  return (
    <section className="mx-auto min-h-[calc(100vh-4rem)] max-w-5xl px-6 py-20">
      <p className="mb-3 font-semibold uppercase tracking-wider text-blue-700">Services</p>
      <h1 className="text-4xl font-bold text-slate-900">{page.title}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{page.description}</p>
    </section>
  )
}
