import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { DepartmentBanner } from "@/components/Departments/DepartmentBanner"
import { CheckCircle2, Phone, Calendar, Clock, ArrowRight } from "lucide-react"

const pages = {
  inpatient: {
    title: "Inpatient Services",
    accent: "Services",
    bannerImage: "/images/1.png",
    aboutImage: "/images/inpatient_room.png",
    breadcrumb: "Inpatient",
    description: "The inpatient department is coordinated at the customer care desk located at the reception area of the hospital. The inpatient division consists of: Wards, Operating theatres and maternity.\n\nAlbirri Hospital has a 120 bed capacity allocated as follows:\n• KM14 has 90 beds.\n• Adado has 30 beds.",
    features: [
      "24/7 Specialist & Nursing Care",
      "Private & Shared Patient Rooms",
      "Advanced Patient Monitoring Systems",
      "Nutritious, Chef-Prepared Meals",
      "Comprehensive Post-Operative Care",
    ],
  },
  outpatient: {
    title: "Outpatient Clinic",
    accent: "Clinic",
    bannerImage: "/images/2.png",
    aboutImage: "/images/outpatient_clinic.png",
    breadcrumb: "Outpatient",
    description: "We provide high-quality outpatient consultations, diagnostic tests, and treatment services, allowing patients to return home the same day.\n\nOur outpatient department offers consultations across various specialist fields, including Cardiology, ENT (Ear, Nose, & Throat), Ophthalmology, Orthopedics, Neurosurgery, Dermatology, and Nephrology.",
    features: [
      "General & Specialist Consultations",
      "Same-day Diagnostic Testing",
      "ENT, Cardiology & Ophthalmology Clinics",
      "Orthopedics, Neurosurgery & Dermatology Clinics",
      "Nephrology Specialist Consultations",
    ],
  },
  theatre: {
    title: "Operating Theatre",
    accent: "Theatre",
    bannerImage: "/images/3.png",
    aboutImage: "/images/operating_theatre.png",
    breadcrumb: "Theatre (OT)",
    description: "Equipped with advanced surgical technology, our operating theatres ensure the highest standards of safety, sterility, and care for both major and minor surgeries.\n\nThe hospital operates major and obstetrical theatres 24/7, prioritizing emergency cases. Procedures include both emergency and planned caesarean sections, as well as minor surgeries such as gynecological procedures, orthopedic surgeries, and male circumcisions.",
    features: [
      "24/7 Major & Obstetrical Theatres",
      "Laparoscopic & Minimally Invasive Surgery",
      "Advanced Anesthesia Monitoring & Care",
      "Gynecological, Orthopedic & Minor Surgeries",
      "Strict Infection Control Protocols",
    ],
  },
  specialties: {
    title: "Medical Specialties",
    accent: "Specialties",
    bannerImage: "/images/1.png",
    aboutImage: "/images/specialties_consultation.png",
    breadcrumb: "Specialties",
    description: "Access a wide range of specialized medical care from expert physicians all under one roof.\n\nAl-Birri Hospital employs a dedicated team of doctors covering various specialties, including Dentistry, Pediatrics, Surgery, Gynecology/Obstetrics, Internal Medicine, and ENT (Ear, Nose, & Throat).",
    features: [
      "Comprehensive Cardiology Care",
      "Pediatrics & Neonatology Services",
      "Obstetrics & Gynecology Specialists",
      "General Surgery & Internal Medicine",
      "ENT (Ear, Nose, Throat) & Advanced Dentistry",
    ],
  },
  maternity: {
    title: "Maternity & Neonatal Care",
    accent: "Care",
    bannerImage: "/images/2.png",
    aboutImage: "/images/maternity_room.png",
    breadcrumb: "Maternity",
    description: "Celebrate new beginnings with our comprehensive maternity care. We provide support from prenatal stages through delivery and postpartum care.\n\nOur services include management of normal and high-risk pregnancies, natural and C-section deliveries, and 24/7 emergency obstetric care. We also feature a Neonatal Intensive Care Unit (NICU) for preterm babies and newborns requiring specialized monitoring.",
    features: [
      "24/7 Emergency Obstetric Care",
      "Normal & High-risk Pregnancy Management",
      "Neonatal Intensive Care Unit (NICU)",
      "Private Labor Rooms & Recovery Suites",
      "Dedicated Maternity Support Staff",
    ],
  },
  pharmacy: {
    title: "Hospital Pharmacy",
    accent: "Pharmacy",
    bannerImage: "/images/3.png",
    aboutImage: "/images/hospital_pharmacy.png",
    breadcrumb: "Pharmacy",
    description: "Our fully stocked pharmacy provides prescription medication, counseling, and over-the-counter pharmaceuticals for patients and the community.\n\nManaged by qualified personnel, the pharmacy provides medications for both inpatients and outpatients, along with patient support services such as drug information, toxicology/poison information, and comprehensive patient education.",
    features: [
      "24/7 Inpatient & Outpatient Pharmacy",
      "Prescription Dispensing & Double-Verification",
      "Toxicology & Poison Information Services",
      "Patient Medication Counseling",
      "Wide Selection of Quality OTC Products",
    ],
  },
  laboratory: {
    title: "Diagnostic Laboratory",
    accent: "Laboratory",
    bannerImage: "/images/1.png",
    aboutImage: "/images/3.png",
    breadcrumb: "Laboratory",
    description: "Our diagnostic laboratory is a modern, 24-hour facility equipped with automated, high-precision analyzers.\n\nWe offer comprehensive diagnostic testing services featuring dedicated sections for biochemistry, serology, parasitology, hematology, and blood transfusion to support precise clinical decisions.",
    features: [
      "24/7 Diagnostic & Lab Services",
      "Hematology & Biochemistry Testing",
      "Serology & Parasitology Sections",
      "Blood Transfusion & Typing Services",
      "Automated, High-Precision Analysers",
    ],
  },
  radiology: {
    title: "Radiology & Imaging",
    accent: "Imaging",
    bannerImage: "/images/2.png",
    aboutImage: "/images/2.png",
    breadcrumb: "Radiology",
    description: "Our radiology department is a modern diagnostic center equipped with state-of-the-art technology to provide accurate imaging.\n\nWe offer high-quality diagnostics including digital X-rays and high-resolution ultrasound scans, supporting fast and precise diagnosis.",
    features: [
      "Digital X-Ray & Fluoroscopy",
      "High-Resolution Ultrasound Imaging",
      "Safe, Modern Diagnostic Equipment",
      "Experienced Radiologists & Technicians",
      "Fast & Accurate Imaging Reports",
    ],
  },
} as const

const navigationItems = [
  { slug: "inpatient", name: "Inpatient" },
  { slug: "outpatient", name: "Outpatient" },
  { slug: "theatre", name: "Theatre(OT)" },
  { slug: "specialties", name: "Specialties" },
  { slug: "maternity", name: "Maternity" },
  { slug: "pharmacy", name: "Pharmacy" },
  { slug: "laboratory", name: "Laboratory" },
  { slug: "radiology", name: "Radiology" },
]

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }))
}

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = pages[slug as keyof typeof pages]

  if (!page) notFound()

  return (
    <>
      <DepartmentBanner
        title={page.title}
        accent={page.accent}
        image={page.bannerImage}
        breadcrumb={page.breadcrumb}
      />

      <div className="bg-slate-50 py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            
            {/* Left Content Area (2/3 width) */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Overview (Side-by-Side Image and Text) */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100/80">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  {/* Left Column: Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-sm border border-gray-100">
                    <Image
                      src={page.aboutImage}
                      alt={`Albirri Hospital ${page.breadcrumb} Department`}
                      fill
                      priority
                      className="object-cover object-center transition-transform hover:scale-[1.03] duration-500"
                    />
                  </div>
                  {/* Right Column: Title and Details */}
                  <div className="space-y-4">
                    <h2 className="text-3xl font-extrabold text-[#0b245f] leading-tight">
                      About {page.breadcrumb}
                    </h2>
                    <p className="text-slate-600 text-base leading-relaxed whitespace-pre-line">
                      {page.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Features/Services */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100/80">
                <h3 className="text-2xl font-bold text-[#0b245f] mb-6">Key Services & Highlights</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {page.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 group">
                      <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-slate-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-[#0b245f] to-[#12368f] rounded-3xl p-8 text-white shadow-md relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 size-48 rounded-full border-[30px] border-white -mr-16 -mb-16" />
                <h3 className="text-2xl font-bold mb-2">Need Consultation or Have Questions?</h3>
                <p className="text-blue-100 mb-6 max-w-lg">
                  Get in touch with our experts or schedule an appointment with our department specialists today.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/appointment"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-3 font-semibold text-white transition-all shadow-md shadow-emerald-950/20 active:scale-95"
                  >
                    <Calendar className="size-4" />
                    Book Appointment
                  </Link>
                  <a
                    href="tel:4446"
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-6 py-3 font-semibold text-white transition-all border border-white/20 active:scale-95"
                  >
                    <Phone className="size-4" />
                    Call 4446
                  </a>
                </div>
              </div>
            </div>

            {/* Right Sidebar (1/3 width) */}
            <div className="space-y-8">
              {/* Department Directory */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80">
                <h3 className="text-xl font-bold text-[#0b245f] mb-4 pb-2 border-b border-gray-100">
                  Our Departments
                </h3>
                <nav className="flex flex-col gap-2">
                  {navigationItems.map((item) => {
                    const isActive = item.slug === slug
                    return (
                      <Link
                        key={item.slug}
                        href={`/departments/${item.slug}`}
                        className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold ${
                          isActive
                            ? "text-[#12368f] border-l-4 border-emerald-500 bg-[#12368f]/5 pl-3"
                            : "text-slate-600 hover:bg-slate-50 hover:text-[#12368f]"
                        }`}
                      >
                        <span>{item.name}</span>
                        <ArrowRight
                          className={`size-4 transition-transform group-hover:translate-x-1 ${
                            isActive ? "text-[#12368f]" : "text-slate-400 group-hover:text-[#12368f]"
                          }`}
                        />
                      </Link>
                    )
                  })}
                </nav>
              </div>

              {/* Quick Info Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80">
                <h3 className="text-xl font-bold text-[#0b245f] mb-4 pb-2 border-b border-gray-100">
                  Quick Information
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Clock className="size-5 text-[#12368f] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-800">Working Hours</h4>
                      <p className="text-sm text-slate-600">24 Hours / 7 Days</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="size-5 text-[#12368f] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-800">Emergency Line</h4>
                      <p className="text-sm text-slate-600">Call 4446 (Toll Free)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}


