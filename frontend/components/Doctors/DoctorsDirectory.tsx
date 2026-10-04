"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
  Search,
  CalendarDays,
  BadgeCheck,
  Stethoscope,
  Briefcase,
  Building,
  ArrowRight,
  Filter,
  UserCheck,
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import api from "@/app/api/api"

export interface Doctor {
  id: string
  name: string
  title: string
  specialty: string
  badge: string
  image: string
  details?: string | null
  department?: string | null
  experience?: string | null
  available: boolean
  featured: boolean
}

const DEPARTMENTS = [
  "ALL",
  "General Medicine",
  "Cardiology",
  "Pediatrics",
  "Surgery",
  "Gynecology",
  "Dental Care",
  "Neurology",
] as const

export function DoctorsDirectory() {
  const prefersReducedMotion = useReducedMotion()
  const { t } = useLanguage()
  const [doctors, setDoctors] = React.useState<Doctor[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedDept, setSelectedDept] = React.useState<string>("ALL")
  const [filterDuty, setFilterDuty] = React.useState<"ALL" | "DUTY">("ALL")

  React.useEffect(() => {
    api.get("/doctors")
      .then((res) => {
        const list = res.data?.data || (Array.isArray(res.data) ? res.data : [])
        setDoctors(list)
      })
      .catch((err) => {
        console.warn("Could not load doctors:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.department && doc.department.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesDept =
      selectedDept === "ALL" ||
      (doc.department && doc.department.toLowerCase() === selectedDept.toLowerCase())

    const matchesDuty = filterDuty === "ALL" || doc.available === true

    return matchesSearch && matchesDept && matchesDuty
  })

  return (
    <section className="relative overflow-hidden bg-slate-50/60 py-16 px-4 sm:px-6 lg:px-8">
      {/* Background blurs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
            <Stethoscope className="size-3.5 text-emerald-600" />
            {t("Medical Excellence")}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t("Meet Our Specialist")} <span className="text-[#1e40af]">{t("Doctors")}</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {t("Explore our world-class medical specialists and physicians at Albirri Hospital. Find your doctor and schedule your appointment today.")}
          </p>
        </motion.div>

        {/* Filter Toolbar */}
        <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("Search doctor by name, specialty, or department...")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-[#1e40af] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Duty toggle */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant={filterDuty === "ALL" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterDuty("ALL")}
                className={`rounded-xl text-xs font-semibold ${
                  filterDuty === "ALL" ? "bg-[#1e40af] text-white hover:bg-blue-800" : ""
                }`}
              >
                {t("All Doctors")}
              </Button>
              <Button
                variant={filterDuty === "DUTY" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterDuty("DUTY")}
                className={`rounded-xl text-xs font-semibold gap-1.5 ${
                  filterDuty === "DUTY" ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""
                }`}
              >
                <UserCheck className="size-3.5" />
                {t("On Duty Now")}
              </Button>
            </div>
          </div>

          {/* Department Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter className="size-3" />
              {t("Dept")}:
            </span>
            {DEPARTMENTS.map((dept) => {
              const isSelected = selectedDept === dept
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-[#1e40af] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {t(dept === "ALL" ? "All Departments" : dept)}
                </button>
              )
            })}
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-3xl bg-slate-200/70 animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center max-w-lg mx-auto">
            <Stethoscope className="size-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">{t("No Doctors Found")}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {t("No doctor matches your search criteria. Try selecting another department or clearing search.")}
            </p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedDept("ALL")
                setFilterDuty("ALL")
              }}
              className="mt-5 rounded-full bg-[#1e40af] text-xs font-bold"
            >
              {t("Reset Filters")}
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDoctors.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                className="h-full"
              >
                <Card className="group relative flex h-full flex-col overflow-hidden rounded-3xl border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-200">
                  {/* Doctor Image Container */}
                  <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={doc.image || "/images/doctor1.png"}
                      alt={doc.name}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-xs">
                      <BadgeCheck className="size-3.5 text-emerald-600" />
                      {doc.badge || "Specialist"}
                    </div>

                    {/* Status Pill */}
                    <div className="absolute top-3.5 right-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur-md shadow-xs ${
                          doc.available
                            ? "bg-emerald-500/90 text-white"
                            : "bg-slate-700/80 text-slate-200"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            doc.available ? "bg-white animate-pulse" : "bg-slate-400"
                          }`}
                        />
                        {doc.available ? t("On Duty") : t("Off Duty")}
                      </span>
                    </div>

                    {/* Overlay info on image bottom */}
                    <div className="absolute bottom-3 inset-x-3 text-white">
                      <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wide">
                        {doc.specialty}
                      </p>
                      <h3 className="text-lg font-extrabold text-white leading-snug drop-shadow-xs">
                        {doc.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Building className="size-3.5 text-blue-600 shrink-0" />
                        <span className="font-medium text-slate-700">
                          {doc.department || "General Medicine"}
                        </span>
                      </div>
                      {doc.experience && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="size-3.5 text-emerald-600 shrink-0" />
                          <span>{doc.experience}</span>
                        </div>
                      )}
                      {doc.details && (
                        <p className="line-clamp-2 text-xs text-slate-500 mt-2 leading-relaxed">
                          {doc.details}
                        </p>
                      )}
                    </div>

                    {/* Book button */}
                    <div className="pt-2 border-t border-slate-100">
                      <Link
                        href={`/appointment?doctor=${encodeURIComponent(
                          doc.name
                        )}&dept=${encodeURIComponent(doc.department || "general")}`}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e40af] py-2.5 px-4 text-xs font-bold text-white shadow-xs transition-colors hover:bg-emerald-600 active:scale-98"
                      >
                        <CalendarDays className="size-3.5" />
                        {t("Book Appointment")}
                        <ArrowRight className="size-3 ml-auto transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default DoctorsDirectory
