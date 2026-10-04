"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
  Building2,
  BedDouble,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Activity,
  Award,
  Phone,
  Calendar,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

export function HospitalOverview() {
  const prefersReducedMotion = useReducedMotion()
  const { t } = useLanguage()

  const stats = [
    { label: "Total Bed Capacity", value: "120 Beds", sub: "KM14 (90) + Adado (30)", icon: BedDouble },
    { label: "Emergency & Trauma", value: "24/7", sub: "Rapid response unit", icon: HeartPulse },
    { label: "Operating Theatres", value: "2 Theatres", sub: "Major & Maternity OT", icon: Activity },
    { label: "Active Specialists", value: "20+ Doctors", sub: "Multidisciplinary team", icon: Stethoscope },
  ]

  const campuses = [
    {
      name: "KM14 Main Hospital (Mogadishu)",
      city: "Mogadishu, Banadir",
      address: "KM14 Afgoi Road, Mogadishu, Somalia",
      beds: "90 Beds",
      image: "/images/1.png",
      tag: "Main Campus & Referral Center",
      tagColor: "bg-blue-600 text-white",
      description:
        "The flagship referral hospital featuring comprehensive inpatient wards, high-level obstetrical and general surgery theatres, modern neonatal intensive care (NICU), fully automated pathology lab, and 24/7 emergency trauma care.",
      highlights: [
        "90 Inpatient Beds (VIP Suites & General Wards)",
        "2 Major 24/7 Operating Theatres",
        "Neonatal Intensive Care Unit (NICU)",
        "Digital X-Ray & High-Resolution 4D Ultrasound",
        "Automated Laboratory & Blood Typing/Transfusion",
        "24/7 Inpatient & Outpatient Pharmacy",
      ],
      tel: "4446",
    },
    {
      name: "Adado Regional Branch",
      city: "Adado, Galmudug",
      address: "Main Street, Adado District, Galmudug, Somalia",
      beds: "30 Beds",
      image: "/images/2.png",
      tag: "Regional Health Center",
      tagColor: "bg-emerald-600 text-white",
      description:
        "Serving the communities of Galmudug with high-standard outpatient consultations, maternal-child health services, emergency stabilization, minor surgical procedures, and reliable pharmaceutical supply.",
      highlights: [
        "30 Inpatient Beds & Maternity Ward",
        "Maternal & Delivery Care Suites",
        "Outpatient Specialty Clinics",
        "Onsite Diagnostic Lab & Blood Testing",
        "Emergency Stabilization & Ambulance Services",
        "Fully Stocked Hospital Pharmacy",
      ],
      tel: "4446",
    },
  ]

  const facilities = [
    {
      title: "Inpatient Wards & Patient Suites",
      desc: "Thoughtfully designed patient rooms prioritizing hygiene, rapid recovery, and patient comfort. Equipped with continuous multi-parameter vital sign monitoring.",
      img: "/images/inpatient_room.png",
    },
    {
      title: "Advanced Surgical Theatres",
      desc: "Ultra-clean positive-pressure laminar airflow operating rooms equipped with modern anesthesia workstations and laparoscopic surgical instruments.",
      img: "/images/operating_theatre.png",
    },
    {
      title: "Diagnostic Imaging & Radiology",
      desc: "Low-radiation digital radiography and high-resolution ultrasound machines providing fast, clear diagnostic scans for precise clinical decisions.",
      img: "/images/3.png",
    },
    {
      title: "Automated Diagnostic Laboratory",
      desc: "Fully automated biochemistry and hematology analyzers delivering fast turnaround times and accurate pathology results around the clock.",
      img: "/images/outpatient_clinic.png",
    },
  ]

  return (
    <div className="bg-white">
      {/* Intro Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Text */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1e40af] border border-blue-200/80">
                <Building2 className="size-3.5 text-[#1e40af]" />
                {t("Hospital Infrastructure & Facilities")}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-tight">
                Modern Healthcare Designed for{" "}
                <span className="text-[#1e40af]">Healing & Quality Care</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Albirri Hospital is a premier modern healthcare institution dedicated to providing compassionate, evidence-based medical treatment. With strategically located facilities in Mogadishu (KM14) and Adado, we combine world-class medical specialists with cutting-edge medical technology.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/appointment">
                  <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-6 text-sm shadow-lg shadow-emerald-950/15">
                    <Calendar className="size-4 mr-2" />
                    {t("Book an Appointment")}
                  </Button>
                </Link>
                <a href="tel:4446">
                  <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-50 font-bold px-6 py-6 text-sm text-slate-800">
                    <Phone className="size-4 mr-2 text-[#1e40af]" />
                    {t("Emergency Line: 4446")}
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Right Card / Graphic */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-slate-100 shadow-2xl">
                <Image
                  src="/images/1.png"
                  alt="Albirri Hospital Main Building"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                    Referral Hospital
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-white">Albirri Hospital KM14 Campus</h3>
                  <p className="text-xs text-blue-100/90 mt-1 flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-emerald-400 shrink-0" />
                    KM14 Afgoi Road, Mogadishu, Somalia
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Numerical Stats Grid */}
      <section className="py-12 bg-slate-900 text-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, idx) => {
              const Icon = s.icon
              return (
                <div key={idx} className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="size-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                    <Icon className="size-6" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">{s.value}</span>
                  <span className="text-sm font-semibold text-blue-200 mt-1">{s.label}</span>
                  <span className="text-xs text-slate-400 mt-0.5">{s.sub}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Hospital Campus Showcase (KM14 vs Adado) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1e40af] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200/60">
            Multi-Campus Network
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4">
            Our Hospital Locations & Facilities
          </h2>
          <p className="text-slate-600 mt-3 text-base sm:text-lg">
            Strategically positioned across Somalia to offer primary, specialty, and critical referral healthcare services.
          </p>
        </div>

        <div className="space-y-12">
          {campuses.map((campus, idx) => (
            <motion.div
              key={campus.name}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden grid lg:grid-cols-12 gap-8 items-center ${
                idx % 2 === 1 ? "lg:grid-flow-dense" : ""
              }`}
            >
              {/* Campus Image */}
              <div className={`relative min-h-[300px] sm:min-h-[380px] lg:col-span-5 h-full ${
                idx % 2 === 1 ? "lg:col-start-8" : ""
              }`}>
                <Image
                  src={campus.image}
                  alt={campus.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={`rounded-full px-3.5 py-1 text-xs font-bold shadow-md ${campus.tagColor}`}>
                    {campus.tag}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold mb-1">
                    <MapPin className="size-3.5" />
                    {campus.city}
                  </div>
                  <h3 className="text-xl font-bold text-white">{campus.name}</h3>
                </div>
              </div>

              {/* Campus Details */}
              <div className={`p-6 sm:p-10 lg:col-span-7 space-y-6 ${
                idx % 2 === 1 ? "lg:col-start-1" : ""
              }`}>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      <BedDouble className="size-3.5" />
                      {campus.beds}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <Clock className="size-3.5" />
                      24/7 Service
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">{campus.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="size-3 text-slate-400" />
                    {campus.address}
                  </p>
                </div>

                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {campus.description}
                </p>

                {/* Highlights */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Key Campus Capabilities
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {campus.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-wrap gap-3">
                  <Link href="/appointment">
                    <Button className="rounded-xl bg-[#1e40af] hover:bg-blue-800 text-white font-semibold text-xs px-5 py-2.5">
                      <Calendar className="size-3.5 mr-1.5" />
                      Book Consultation Here
                    </Button>
                  </Link>
                  <a href={`tel:${campus.tel}`}>
                    <Button variant="outline" className="rounded-xl text-xs font-semibold px-4 py-2.5">
                      <Phone className="size-3.5 mr-1.5 text-emerald-600" />
                      Call Hotline 4446
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Facilities & Diagnostic Capabilities Showcase */}
      <section className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              Clinical Quality & Equipment
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-4">
              State-of-the-Art Medical Facilities
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Engineered to meet international clinical safety, infection control, and diagnostic precision benchmarks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((f, i) => (
              <div key={i} className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={f.img}
                    alt={f.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                  <h3 className="font-bold text-slate-900 text-base">{f.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Standards & Accreditations banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-[#0d245f] to-[#1e40af] p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <Award className="size-3.5" />
              Commitment to Patient Safety
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Your Health & Safety Are Our Highest Priority
            </h3>
            <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed">
              We uphold strict medical hygiene, automated digital verification for pharmacy dispensing, and 24/7 backup power systems with pure medical oxygen support.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/appointment">
              <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-6 text-sm shadow-md">
                Schedule a Visit
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="rounded-xl border-white/30 text-black hover:bg-white/10 font-bold px-6 py-6 text-sm">
                Contact Hospital Desk
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HospitalOverview
