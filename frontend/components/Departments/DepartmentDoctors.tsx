import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Stethoscope, UserRound } from "lucide-react"
import api from "@/app/api/api"

type Doctor = {
  id: string
  name: string
  specialty: string
  title: string
  image: string
  department: string | null
  experience: string | null
}

export async function DepartmentDoctors({ departments }: { departments: readonly string[] }) {
  let doctors: Doctor[]

  try {
    const { data } = await api.get<{ data: Doctor[] }>("/doctors", {
      params: { available: true },
      timeout: 4000,
    })
    doctors = data.data
      .filter((doctor) => departments.some((department) => department === doctor.department?.trim().toLowerCase()))
      .slice(0, 3)
  } catch {
    return null
  }

  if (doctors.length === 0) return null

  return (
    <section aria-labelledby="department-doctors-title" className="bg-[#0b245f] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <h2 id="department-doctors-title" className="text-2xl font-bold tracking-tight sm:text-3xl">
            Meet our specialists
          </h2>
          <Link href="/about/doctors" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-emerald-200 hover:underline">
            View doctor directory <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <article key={doctor.id} className="flex flex-col rounded-2xl bg-white p-5 text-slate-900">
              <div className="flex items-center gap-4">
                <div className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-100 text-slate-500">
                  <UserRound className="size-7" aria-hidden="true" />
                  {(doctor.image?.startsWith("/") || /^https?:\/\//i.test(doctor.image)) && (
                    <Image src={doctor.image} alt="" fill sizes="64px" className="object-cover object-top" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[#0b245f]">{doctor.name}</h3>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{doctor.title}</p>
                </div>
              </div>
              <div className="mb-5 mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <span className="inline-flex items-center gap-2">
                  <Stethoscope className="size-4 text-emerald-700" aria-hidden="true" />
                  {doctor.specialty}
                </span>
                {doctor.experience && <span>{doctor.experience}</span>}
              </div>
              <Link
                href={{ pathname: "/appointment", query: { doctor: doctor.name, dept: doctor.department ?? "general" } }}
                aria-label={"Book an appointment with " + doctor.name}
                className="mt-auto flex min-h-11 items-center justify-center rounded-lg bg-[#2449aa] px-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#193783]"
              >
                Book appointment
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
