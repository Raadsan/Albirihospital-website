"use client"

import Image from "next/image"
import { FormEvent, useState } from "react"
import { ArrowRight, CheckCircle2, Loader2, Phone, ShieldCheck, UserRound } from "lucide-react"
import api from "@/app/api/api"
import { getApiErrorMessage } from "@/lib/api-error"

type DepartmentAppointmentHeroProps = {
  title: string
  department: string
  departmentName: string
  image: string
  imageAlt: string
}

export function DepartmentAppointmentHero({
  title,
  department,
  departmentName,
  image,
  imageAlt,
}: DepartmentAppointmentHeroProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setErrorMessage("")

    try {
      await api.post("/appointments", {
        name,
        phone,
        department,
        date: "To be confirmed",
        time: "To be confirmed",
        message: `Quick appointment request from the ${departmentName} department page.`,
      })
      setName("")
      setPhone("")
      setSubmitted(true)
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Your appointment request could not be sent. Please try again or call 4446.",
        ),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#0b245f]">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-30 object-cover object-center"
      />
      <div className="absolute inset-0 -z-20 bg-[#071a47]/78" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071a47]/95 via-[#12368f]/72 to-[#0f766e]/45" />

      <div className="mx-auto grid min-h-[440px] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-16">
        <div className="max-w-2xl text-white">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-50 backdrop-blur-sm">
            <ShieldCheck className="size-4 text-emerald-300" aria-hidden="true" />
            Expert care, available 24/7
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-sm sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">
            Speak with our {departmentName} team. Send your details and our appointment desk will call you to confirm the best available time.
          </p>
          <a
            href="tel:4446"
            className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-emerald-300"
          >
            <span className="grid size-9 place-items-center rounded-full bg-emerald-500">
              <Phone className="size-4" aria-hidden="true" />
            </span>
            Emergency & appointment line: 4446
          </a>
        </div>

        <div className="w-full rounded-3xl border border-white/40 bg-white p-5 shadow-[0_24px_70px_rgba(3,15,45,0.34)] sm:p-7">
          {submitted ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center" aria-live="polite">
              <span className="grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="size-8" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-2xl font-bold text-[#0b245f]">Request received</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                Our {departmentName} appointment team will call you shortly to confirm your visit.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-5 rounded-xl border border-[#12368f]/20 px-4 py-2 text-sm font-semibold text-[#12368f] transition hover:bg-blue-50"
              >
                Send another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-600">Quick booking</p>
              <h2 className="mt-2 text-2xl font-bold text-[#12368f] sm:text-3xl">
                Book Your <span className="text-[#0b245f]">Appointment</span>
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                No account is needed. Enter your name and mobile number.
              </p>

              {errorMessage ? (
                <div role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
                  {errorMessage}
                </div>
              ) : null}

              <label className="mt-5 block">
                <span className="sr-only">Full name</span>
                <span className="flex h-13 items-center gap-3 rounded-xl border border-slate-300 px-4 transition focus-within:border-[#12368f] focus-within:ring-4 focus-within:ring-blue-100">
                  <UserRound className="size-5 shrink-0 text-slate-400" aria-hidden="true" />
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter Name"
                    autoComplete="name"
                    required
                    className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </span>
              </label>

              <label className="mt-3 block">
                <span className="sr-only">Mobile number</span>
                <span className="flex h-13 items-center gap-3 rounded-xl border border-slate-300 px-4 transition focus-within:border-[#12368f] focus-within:ring-4 focus-within:ring-blue-100">
                  <Phone className="size-5 shrink-0 text-slate-400" aria-hidden="true" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Enter Mobile Number"
                    autoComplete="tel"
                    minLength={6}
                    required
                    className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="mt-4 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#2449aa] px-6 text-sm font-bold text-white shadow-lg shadow-blue-950/15 transition hover:bg-[#17398f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-65"
              >
                {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                {submitting ? "Sending..." : "Send appointment request"}
                {!submitting ? <ArrowRight className="size-4" aria-hidden="true" /> : null}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
