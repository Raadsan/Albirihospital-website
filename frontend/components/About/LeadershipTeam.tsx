"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { BriefcaseBusiness, GraduationCap } from "lucide-react"

const leaders = [
  {
    name: "Mr. Nur Ahmed Dirie",
    role: "Chief Executive Officer (CEO)",
    image: "/images/Mr. Nur Ahmed Dirie.png",
    experience:
      "Mr. Nur Ahmed Dirie is the Chief Executive Officer of Albirri Hospital. He brings more than nine years of hospital management experience and over 13 years of experience at Dahabshiil Bank, where he worked across banking, money transfer, and foreign exchange departments.",
    education:
      "He holds a degree in Business Administration from Jamhuriya University of Science and Technology in Somalia, as well as a Higher Diploma in Research and Statistics from the same university.",
  },
  {
    name: "Mr. Galad Ahmed Farah",
    role: "Deputy Manager",
    image: "/images/Mr. Galad Ahmed Farah.png",
    experience:
      "Mr. Galad Ahmed Farah is a healthcare management professional with more than 15 years of experience in hospital administration and leadership across various sectors. He also brings four years of international experience with the Danish Refugee Council (DRC), where he contributed to humanitarian healthcare initiatives.",
    education:
      "He holds a Bachelor of Arts in Business Administration from the University of Somalia (UNISO). His areas of expertise include healthcare operations, strategic planning, and organizational leadership.",
  },
  {
    name: "Dr. Abdullahi Hussein Abdi",
    role: "Medical Director & Emergency Doctor",
    image: "/images/Dr. Abdullahi Hussein Abdi.png",
    experience:
      "Dr. Abdullahi Hussein Abdi is a healthcare and strategic management expert with more than 10 years of experience in clinical leadership. He has served in several hospitals and has a proven record of improving patient outcomes and healthcare efficiency.",
    education:
      "He earned his MBBS from the International University of Africa, a Master’s degree in Health System Management from Banadir University, and a Diploma in Ultrasound Imaging from Golden Institute.",
  },
  {
    name: "Mr. Abdirashid Adam",
    role: "Chief Human Resources Officer (CHRO)",
    image: "/images/Mr. Abdirashid Adam.png",
    experience:
      "Mr. Abdirashid Adam is a seasoned healthcare professional with nearly 10 years of experience across sales, customer service, operations, and human resources. Fluent in Somali, English, and Arabic, he works effectively in diverse, multicultural environments.",
    education:
      "He holds a Bachelor’s degree in Business Administration and a Diploma in Information Technology. His expertise is further strengthened by professional seminars in customer service, team management, and organizational development.",
  },
] as const

export function LeadershipTeam() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute -left-32 top-20 size-96 rounded-full bg-blue-100/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-32 bottom-20 size-96 rounded-full bg-emerald-100/60 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            The people guiding our mission
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Our Leadership <span className="text-[#1E40AF]">Team</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Meet the experienced professionals leading Albirri Hospital with
            integrity, expertise, and a shared commitment to excellent patient care.
          </p>
        </motion.div>

        <div className="space-y-10 lg:space-y-14">
          {leaders.map((leader, index) => (
            <motion.article
              key={leader.name}
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }
              }
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="group grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(30,64,175,0.14)] lg:grid-cols-5"
            >
              <div
                className={`relative min-h-[24rem] overflow-hidden bg-slate-100 sm:min-h-[28rem] lg:col-span-2 lg:min-h-full ${
                  index % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <Image
                  src={leader.image}
                  alt=""
                  fill
                  aria-hidden="true"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="scale-110 object-cover opacity-30 blur-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-slate-900/10" />
                <Image
                  src={leader.image}
                  alt={`${leader.name}, ${leader.role} at Albirri Hospital`}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="z-10 object-contain object-bottom transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950/15 via-transparent to-transparent" />
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-10 lg:col-span-3 lg:p-14">
                <span className="mb-5 h-1 w-16 rounded-full bg-emerald-500" />
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {leader.name}
                </h3>
                <p className="mt-2 text-base font-bold text-[#1E40AF]">
                  {leader.role} <span className="font-medium text-slate-400">| Albirri Hospital</span>
                </p>

                <div className="mt-7 space-y-6">
                  <div className="flex gap-4">
                    <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E40AF]">
                      <BriefcaseBusiness aria-hidden="true" className="size-5" />
                    </span>
                    <p className="leading-7 text-slate-600">{leader.experience}</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <GraduationCap aria-hidden="true" className="size-5" />
                    </span>
                    <p className="leading-7 text-slate-600">{leader.education}</p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
