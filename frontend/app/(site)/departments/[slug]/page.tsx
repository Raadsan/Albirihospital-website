import { Suspense } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowDown, ArrowRight, ArrowUpRight, Building2, CalendarDays, CheckCircle2, MapPin, MessageCircle, Phone, Plus } from "lucide-react"
import { DepartmentAppointmentHero } from "@/components/Departments/DepartmentAppointmentHero"
import { DepartmentDoctors } from "@/components/Departments/DepartmentDoctors"
import { DepartmentTestimonials } from "@/components/Departments/DepartmentTestimonials"
import { departments, type DepartmentSlug } from "@/lib/departments"

const campuses = {
  km14: {
    name: "KM14 Main Hospital",
    address: "KM14 Afgoi Road, Mogadishu",
    map: "https://www.google.com/maps/search/?api=1&query=Albirri+Hospital+KM14+Afgoi+Road+Mogadishu+Somalia",
  },
  adado: {
    name: "Adado Regional Branch",
    address: "Main Street, Adado, Galmudug",
    map: "https://www.google.com/maps/search/?api=1&query=Albirri+Hospital+Adado+Somalia",
  },
}

const sectionLinks = [
  { id: "overview", label: "Overview" },
  { id: "why-choose", label: "Why Choose Al-Birri" },
  { id: "locations", label: "Locations" },
  { id: "services", label: "Services & facilities" },
  { id: "questions", label: "FAQs" },
]

const container = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
const sectionHeading = "text-2xl font-bold tracking-tight text-[#0b245f] sm:text-3xl"

export function generateStaticParams() {
  return Object.keys(departments).map((slug) => ({ slug }))
}

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (!Object.hasOwn(departments, slug)) notFound()

  const page = departments[slug as DepartmentSlug]

  return (
    <>
      <div id="department-appointment" tabIndex={-1}>
        <DepartmentAppointmentHero
          title={page.title}
          department={slug}
          departmentName={page.breadcrumb}
          image={page.aboutImage}
          imageAlt={`Albirri Hospital ${page.breadcrumb} Department`}
        />
      </div>

      <nav aria-label="On this page" className="border-b border-slate-200 bg-white">
        <div className={container}>
          <ul className="flex flex-wrap gap-x-5 sm:gap-x-8">
            {sectionLinks.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} className="inline-flex min-h-12 items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-[#16449c] hover:underline">
                  {label} <ArrowDown className="size-3 text-emerald-700" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <section id="overview" aria-labelledby="overview-title" className="scroll-mt-28 border-b border-slate-100 bg-[#f4f8f7]">
        <div className={`${container} grid items-center gap-6 py-12 sm:py-16 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-8 lg:gap-12`}>
          <div>
            <h2 id="overview-title" className={sectionHeading}>About {page.breadcrumb}</h2>
            <div className="mt-4 max-w-prose space-y-4 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
              {page.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-200 md:order-first">
            <Image
              src={page.aboutImage}
              alt=""
              fill
              sizes="(min-width: 1280px) 500px, (min-width: 768px) 42vw, calc(100vw - 2rem)"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section id="why-choose" aria-labelledby="why-choose-title" className="scroll-mt-28 border-b border-slate-200 bg-[#f2f7fb]">
        <div className={`${container} py-12 sm:py-16`}>
          <h2 id="why-choose-title" className={sectionHeading}>
            Why Choose Al-Birri for {page.whyChoose.care}?
          </h2>
          <p className="mt-3 max-w-4xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
            {page.whyChoose.introduction}
          </p>
          <ol role="list" className="mt-8 grid list-none gap-x-10 gap-y-5 md:grid-cols-2 lg:gap-x-14">
            {page.whyChoose.reasons.map(({ title, description }, index) => (
              <li key={title} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 border-t border-slate-200 pt-5 sm:gap-5">
                <span aria-hidden="true" className="min-w-8 text-2xl font-bold leading-none text-[#19716b] tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-bold leading-snug text-[#0b245f]">{title}</h3>
                  <p className="mt-1.5 text-base leading-7 text-slate-700">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Suspense fallback={null}>
        <DepartmentDoctors departments={page.doctorDepartments} />
      </Suspense>

      <section id="locations" aria-labelledby="locations-title" className="scroll-mt-28 border-b border-slate-100 bg-slate-50">
        <div className={`${container} py-12 sm:py-16`}>
          <h2 id="locations-title" className={sectionHeading}>Where to find {page.breadcrumb} services</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {page.locations.map(({ campus, description }) => (
              <article key={campus} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#2449aa]">
                  <Building2 className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-[#0b245f]">{campuses[campus].name}</h3>
                  <p className="mt-1.5 flex gap-1.5 text-sm text-slate-600">
                    <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    {campuses[campus].address}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{description}</p>
                  <a href={campuses[campus].map} className="mt-2 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-[#2449aa] hover:underline">
                    Get directions <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="services" aria-labelledby="services-title" className="scroll-mt-28 bg-white">
        <div className={`${container} grid items-start gap-8 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-14`}>
          <div>
            <h2 id="services-title" className={sectionHeading}>Services and procedures</h2>
            <div className="mt-5 divide-y divide-slate-200">
              {page.services.map(({ title, description }) => (
                <div key={title} className="py-4 first:pt-2 last:pb-0">
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">{title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">{description}</p>
                </div>
              ))}
            </div>
          </div>
          <aside aria-labelledby="facilities-title" className="rounded-2xl bg-[#edf4ff] p-6 sm:p-8">
            <h3 id="facilities-title" className="text-xl font-bold tracking-tight text-[#0b245f]">Facilities and support</h3>
            <ul className="mt-5 space-y-4">
              {page.facilities.map((facility) => (
                <li key={facility} className="flex items-start gap-3 text-sm leading-6 text-slate-800 sm:text-base">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-700" aria-hidden="true" />
                  {facility}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <DepartmentTestimonials key={slug} department={slug} departmentName={page.breadcrumb} />

      <section aria-labelledby="help-title" className="bg-[#12368f] text-white">
        <div className={`${container} flex flex-wrap items-center justify-between gap-x-8 gap-y-5 py-9 sm:py-12`}>
          <div>
            <h2 id="help-title" className="text-2xl font-bold tracking-tight sm:text-3xl">Need help planning your visit?</h2>
            <p className="mt-2 text-sm leading-6 text-blue-100 sm:text-base">Ask our team about appointments, services, or the right branch to visit.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#department-appointment" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 font-semibold text-[#12368f] hover:bg-blue-50">
              <CalendarDays className="size-4" aria-hidden="true" /> Request an appointment
            </a>
            <a href="tel:4446" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/40 px-4 font-semibold hover:bg-white/10">
              <Phone className="size-4" aria-hidden="true" /> Call 4446
            </a>
            <Link href="/contact" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/40 px-4 font-semibold hover:bg-white/10">
              <MessageCircle className="size-4" aria-hidden="true" /> Contact us
            </Link>
          </div>
        </div>
      </section>

      <section id="questions" aria-labelledby="questions-title" className="scroll-mt-28 bg-white">
        <div className={`${container} py-12 sm:py-16`}>
          <h2 id="questions-title" className={sectionHeading}>Frequently asked questions</h2>
          <div className="mt-6 space-y-3">
            {page.questions.map(({ question, answer }) => (
              <details key={question} className="group rounded-xl border border-slate-200 bg-white open:bg-slate-50">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-4 py-3.5 font-semibold text-[#0b245f] hover:bg-slate-50 sm:px-5 [&::-webkit-details-marker]:hidden">
                  {question}
                  <Plus className="size-5 shrink-0 text-[#2449aa] transition-transform group-open:rotate-45" aria-hidden="true" />
                </summary>
                <p className="max-w-4xl px-4 pb-4 text-sm leading-6 text-slate-700 sm:px-5 sm:text-base sm:leading-7">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <nav aria-labelledby="other-departments-title" className="border-t border-slate-200 bg-slate-50">
        <div className={`${container} py-8 sm:py-10`}>
          <h2 id="other-departments-title" className="text-lg font-bold text-[#0b245f]">Explore other departments</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {Object.entries(departments).filter(([key]) => key !== slug).map(([key, department]) => (
              <li key={key}>
                <Link href={`/departments/${key}`} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-[#2449aa] hover:border-blue-300 hover:bg-blue-50">
                  {department.breadcrumb} <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  )
}


