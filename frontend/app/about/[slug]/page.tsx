import { notFound } from "next/navigation"

const pages = {
  us: {
    title: "About Us",
    description: "Learn more about our hospital, our mission, and the care we provide.",
  },
  doctors: {
    title: "Doctors",
    description: "Meet the experienced doctors and specialists who care for our patients.",
  },
  leadership: {
    title: "Leadership Team",
    description: "Meet the leadership team guiding our hospital and its services.",
  },
  overview: {
    title: "Hospital Overview",
    description: "Explore an overview of our hospital, facilities, and patient care.",
  },
} as const

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }))
}

export default async function AboutDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = pages[slug as keyof typeof pages]

  if (!page) notFound()

  return (
    <section className="mx-auto min-h-[calc(100vh-4rem)] max-w-5xl px-6 py-20">
      <p className="mb-3 font-semibold uppercase tracking-wider text-blue-700">About</p>
      <h1 className="text-4xl font-bold text-slate-900">{page.title}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{page.description}</p>
    </section>
  )
}
