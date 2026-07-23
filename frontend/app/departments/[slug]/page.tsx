import { notFound } from "next/navigation"

const pages = {
  inpatient: "Inpatient",
  outpatient: "Outpatient",
  theatre: "Theatre (OT)",
  specialties: "Specialties",
  maternity: "Maternity",
  pharmacy: "Pharmacy",
  laboratory: "Laboratory",
  radiology: "Radiology",
} as const

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }))
}

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const title = pages[slug as keyof typeof pages]

  if (!title) notFound()

  return (
    <section className="mx-auto min-h-[calc(100vh-4rem)] max-w-5xl px-6 py-20">
      <p className="mb-3 font-semibold uppercase tracking-wider text-blue-700">Departments</p>
      <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
        Learn more about our {title.toLowerCase()} department and the care it provides.
      </p>
    </section>
  )
}
