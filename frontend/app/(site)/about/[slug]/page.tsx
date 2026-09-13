import { notFound } from "next/navigation"
import { AboutBanner } from "@/components/About/AboutBanner"
import { About } from "@/components/Home/About"
import { MissionAndVision } from "@/components/About/MissionandVisison"
import { OurStory } from "@/components/About/ourStory"
import { CoreValues } from "@/components/About/CoreValues"
import { WhyChoose } from "@/components/About/Why Choose"
import { Watch } from "@/components/Home/Watch"
import { SpecialistDoctors } from "@/components/Home/Specialist Doctors"
import { LeadershipTeam } from "@/components/About/LeadershipTeam"

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
    <>
      <AboutBanner title={page.title} />
      {slug === "us" ? (
        <>
          <About />
          <OurStory />
          <MissionAndVision />
          <CoreValues />
          <WhyChoose />
          <Watch />
        </>
      ) : slug === "doctors" ? (
        <SpecialistDoctors />
      ) : slug === "leadership" ? (
        <LeadershipTeam />
      ) : (
        <section className="mx-auto min-h-96 max-w-5xl px-6 py-20">
          <p className="font-semibold uppercase tracking-wider text-emerald-600">About Albirri Hospital</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">{page.title}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{page.description}</p>
        </section>
      )}
    </>
  )
}
