"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { X, Check, HelpCircle, Calendar, ArrowRight, Stethoscope } from "lucide-react"

interface InvestigationCategory {
  category: string
  items: string[]
}

interface CheckupPackage {
  id: string
  title: string
  summary: string
  investigationCount: number
  consultationCount: number
  description: string
  image: string
  price: string
  categories: InvestigationCategory[]
  consultations: string[]
}

const packages: CheckupPackage[] = [
  {
    id: "whole-body-male",
    title: "Whole Body Checkup Male",
    summary: "This package comprises 49 Investigations + 5 Specialist Consultations.",
    investigationCount: 49,
    consultationCount: 5,
    price: "$180",
    image: "/images/specialties_consultation.png",
    description: "Comprehensive health evaluation designed specifically for men to assess overall physiological health, detect early signs of chronic diseases, and optimize wellness.",
    categories: [
      {
        category: "Laboratory Investigations",
        items: [
          "Complete Blood Count (CBC) - 16 Parameters",
          "Fasting Blood Sugar & HbA1c (Three-month average sugar)",
          "Lipid Profile (Total Cholesterol, HDL, LDL, Triglycerides)",
          "Renal/Kidney Function (Urea, Creatinine, Uric Acid)",
          "Liver Function Tests (SGOT, SGPT, Bilirubin, Alkaline Phosphatase)",
          "Thyroid Panel (TSH, Free T3, Free T4)",
          "PSA (Prostate Specific Antigen for male cancer screening)",
          "Urine Routine Analysis & Stool Routine Test"
        ]
      },
      {
        category: "Imaging & Cardiology Diagnostics",
        items: [
          "Electrocardiogram (ECG) to monitor heart rhythm",
          "Chest X-Ray (PA View) for lung & cardiac outline",
          "Ultrasound Abdomen & Pelvis (liver, kidneys, prostate, bladder)"
        ]
      }
    ],
    consultations: [
      "Consultant Physician (General Medicine)",
      "Consultant Cardiologist",
      "Consultant Urologist",
      "Dental Examination & Hygiene consultation",
      "Ophthalmology (Eye Specialist) visual check"
    ]
  },
  {
    id: "whole-body-female",
    title: "Whole Body Checkup Female",
    summary: "This package comprises 44 Investigations + 5 Specialist Consultations.",
    investigationCount: 44,
    consultationCount: 5,
    price: "$185",
    image: "/images/1.png",
    description: "Complete medical checkup designed for women to evaluate vital organs, reproductive health, hormonal balance, and screen for common female health risks.",
    categories: [
      {
        category: "Laboratory Investigations",
        items: [
          "Complete Blood Count (CBC) - 16 Parameters",
          "Fasting Blood Sugar & HbA1c (Diabetic screening)",
          "Lipid Profile (Cholesterol fractions & Triglycerides)",
          "Renal/Kidney Function (Urea, Serum Creatinine)",
          "Liver Function Tests (SGOT, SGPT, Albumin)",
          "Thyroid Stimulating Hormone (TSH) screening",
          "CA-125 (Ovarian cancer biomarker screening)",
          "Pap Smear (Cervical health screening)",
          "Urine Routine Analysis"
        ]
      },
      {
        category: "Imaging & Diagnostic Tests",
        items: [
          "Electrocardiogram (ECG)",
          "Chest X-Ray (PA View)",
          "Ultrasound Pelvis & Lower Abdomen (Uterus, Ovaries)",
          "Bilateral Mammography (Breast health screening)"
        ]
      }
    ],
    consultations: [
      "Consultant Physician (General Health)",
      "Consultant Gynecologist",
      "Consultant Cardiologist",
      "Dental Examination & Cleaning check",
      "Eye Specialist (Optician/Ophthalmologist)"
    ]
  },
  {
    id: "basic-male",
    title: "Basic Male Checkup",
    summary: "This package comprises 23 Investigations + 3 Specialist Consultations.",
    investigationCount: 23,
    consultationCount: 3,
    price: "$95",
    image: "/images/3.png",
    description: "Essential preventive checkup to monitor key health parameters and catch common health issues in men before they escalate.",
    categories: [
      {
        category: "Laboratory Investigations",
        items: [
          "Complete Blood Count (CBC)",
          "Fasting Blood Sugar",
          "Serum Cholesterol (Basic lipid check)",
          "Serum Creatinine (Kidney health index)",
          "SGPT (Liver enzyme check)",
          "Urine Routine & Microscopy"
        ]
      },
      {
        category: "Diagnostics & Vitals",
        items: [
          "Electrocardiogram (ECG)",
          "Blood Pressure and Body Mass Index (BMI) assessment"
        ]
      }
    ],
    consultations: [
      "General Practitioner / Family Physician",
      "Dental Practitioner",
      "Ophthalmologist Checkup"
    ]
  },
  {
    id: "basic-female",
    title: "Basic Female Checkup",
    summary: "This package comprises 23 Investigations + 3 Specialist Consultations.",
    investigationCount: 23,
    consultationCount: 3,
    price: "$95",
    image: "/images/outpatient_clinic.png",
    description: "Essential screening for women of all age groups to review primary wellness indicators and ensure peace of mind.",
    categories: [
      {
        category: "Laboratory Investigations",
        items: [
          "Complete Blood Count (CBC)",
          "Fasting Blood Sugar",
          "Serum Cholesterol (Basic lipid check)",
          "Serum Creatinine (Kidney health index)",
          "Thyroid Stimulating Hormone (TSH)",
          "Urine Routine Analysis"
        ]
      },
      {
        category: "Diagnostics & Vitals",
        items: [
          "Electrocardiogram (ECG)",
          "Blood Pressure & Body Mass Index (BMI) calculation"
        ]
      }
    ],
    consultations: [
      "General Practitioner / Family Physician",
      "Consultant Gynecologist",
      "Dental Practitioner"
    ]
  },
  {
    id: "pregnancy-checkup",
    title: "Health Checkups for Pregnancy",
    summary: "This package comprises 32 Investigations.",
    investigationCount: 32,
    consultationCount: 2,
    price: "$120",
    image: "/images/maternity_room.png",
    description: "Carefully designed health checks to ensure the absolute well-being of both mother and baby throughout the gestational period.",
    categories: [
      {
        category: "Laboratory Investigations",
        items: [
          "Complete Blood Count (CBC) with Platelets",
          "Blood Grouping & Rh Factor Typing",
          "Rubella Antibody IgG (German Measles immunity check)",
          "Infectious Screen (HIV, HBsAg, VDRL/Syphilis)",
          "Oral Glucose Tolerance Test (Gestational Diabetes)",
          "Urine Analysis & Urine Culture/Sensitivity"
        ]
      },
      {
        category: "Obstetric Diagnostics",
        items: [
          "Routine Fetal Ultrasound Scan (growth, heartbeat, position)",
          "Fetal Doppler assessment"
        ]
      }
    ],
    consultations: [
      "Consultant Obstetrician & Gynecologist",
      "Dietician & Clinical Nutritionist consultation"
    ]
  }
]

export function HealthCheckupsList() {
  const prefersReducedMotion = useReducedMotion()
  const [selectedPkg, setSelectedPkg] = useState<CheckupPackage | null>(null)

  return (
    <section className="relative overflow-hidden bg-slate-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      {/* Visual background accents */}
      <div aria-hidden="true" className="absolute left-0 top-0 size-96 -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl" />
      <div aria-hidden="true" className="absolute bottom-0 right-0 size-96 translate-x-1/2 rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        
        {/* Section Title */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Preventive Care</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1E40AF] sm:text-4xl lg:text-5xl">
            Choose Your Checkup Package
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            Investing in early checkups helps prevent health complications. Select a package below to inspect the details and book a screening.
          </p>
        </motion.div>

        {/* 5-Card Grid Layout */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.55 }}
              whileHover={prefersReducedMotion ? undefined : { y: -8 }}
              onClick={() => setSelectedPkg(pkg)}
              className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition-all duration-500 hover:border-blue-200 hover:shadow-[0_24px_55px_rgba(30,64,175,0.14)]"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/10 to-transparent" />
              </div>

              {/* White Overlay Box (overlapping the bottom slightly) */}
              <div className="mx-4 -mt-8 mb-4 relative rounded-2xl bg-white p-5 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 group-hover:border-blue-100 group-hover:shadow-[0_15px_30px_rgba(30,64,175,0.08)]">
                <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-[#1E40AF] transition-colors">
                  {pkg.title}
                </h3>
                <p className="mt-2 text-xs font-semibold text-[#1e40af] leading-relaxed flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  {pkg.summary}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-[#1E40AF]">{pkg.price}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                    Read Details
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Details Dialog Modal */}
      <AnimatePresence>
        {selectedPkg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPkg(null)}
              className="absolute inset-0 bg-[#071a47]/65 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedPkg(null)}
                aria-label="Close details"
                className="absolute right-6 top-6 z-10 flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-[#1E40AF] hover:text-white transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <X className="size-5" />
              </button>

              {/* Two-Column Scrollable Content */}
              <div className="grid lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
                
                {/* Left Column (Branding & Description) */}
                <div className="lg:col-span-5 bg-[#0d245f] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
                  <div aria-hidden="true" className="absolute -left-20 -bottom-20 size-60 rounded-full bg-blue-500/10 blur-3xl" />
                  <div aria-hidden="true" className="absolute -right-20 -top-20 size-60 rounded-full bg-emerald-400/10 blur-3xl" />
                  
                  <div className="relative z-10">
                    <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 border border-white/10 backdrop-blur-sm">
                      Checkup Plan
                    </span>
                    <h3 className="mt-6 text-3xl font-extrabold leading-tight text-white font-sans">
                      {selectedPkg.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-blue-100/80">
                      {selectedPkg.description}
                    </p>
                  </div>

                  <div className="mt-12 relative z-10">
                    <div className="border-t border-white/10 pt-6">
                      <p className="text-xs text-blue-200/60 uppercase tracking-widest font-bold">Package Price</p>
                      <p className="mt-1 text-4xl font-extrabold text-white">{selectedPkg.price}</p>
                    </div>

                    <Link
                      href={`/appointment?package=${selectedPkg.id}`}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:bg-emerald-600 hover:-translate-y-0.5"
                    >
                      <Calendar className="w-4 h-4" />
                      Book Package Screening
                    </Link>
                  </div>
                </div>

                {/* Right Column (List of Investigations & Consults) */}
                <div className="lg:col-span-7 p-8 md:p-12 overflow-y-auto">
                  <h4 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-4 mb-6">
                    What is Included?
                  </h4>

                  {/* Laboratory / Diagnostic categories */}
                  <div className="space-y-8">
                    {selectedPkg.categories.map((cat, cIdx) => (
                      <div key={cIdx}>
                        <h5 className="text-sm font-bold text-[#1E40AF] uppercase tracking-wider mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {cat.category}
                        </h5>
                        <ul className="grid gap-3 sm:grid-cols-1">
                          {cat.items.map((item, iIdx) => (
                            <li key={iIdx} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                              <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                                <Check className="size-3" strokeWidth={3} />
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {/* Specialist Consultations */}
                    {selectedPkg.consultations.length > 0 && (
                      <div>
                        <h5 className="text-sm font-bold text-[#1E40AF] uppercase tracking-wider mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Specialist Consultations
                        </h5>
                        <ul className="grid gap-3 sm:grid-cols-1">
                          {selectedPkg.consultations.map((item, iIdx) => (
                            <li key={iIdx} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                              <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                <Check className="size-3" strokeWidth={3} />
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default HealthCheckupsList
