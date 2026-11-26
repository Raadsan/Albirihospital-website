"use client"

import Image from "next/image"
import { useLanguage } from "@/components/language-provider"

const careTopics = [
  {
    title: "Quality and Patient Safety",
    description:
      "Albirri Hospital follows clinical protocols and infection prevention practices to protect patients throughout their care. Our medical teams use modern equipment and work together from assessment to follow-up. We put safety, dignity, and clear communication at the center of each patient's visit.",
  },
  {
    title: "Security and Confidentiality",
    description:
      "Albirri Hospital maintains security measures to help protect patients, visitors, and staff. We treat patient information as confidential and handle medical records with care. Respect for privacy guides how our team discusses treatment and works with patients and their families.",
  },
  {
    title: "Social Responsibility",
    description:
      "Albirri Hospital supports community health through outreach, health education, and humanitarian initiatives. Our work in Mogadishu and Adado reflects our commitment to making healthcare more accessible and helping families learn about prevention and when to seek care.",
  },
  {
    title: "Hospital Environment",
    description:
      "Our hospital grounds and care areas are designed to provide a clean, calm, and welcoming environment. Well-organized facilities and green outdoor spaces support the comfort of patients, families, and visitors. We pay attention to cleanliness, privacy, and ease of movement throughout the hospital.",
  },
  {
    title: "Medical Equipment and Technology",
    description:
      "Albirri Hospital uses modern medical equipment to support diagnosis, treatment, and patient monitoring. Our teams use diagnostic imaging, laboratory equipment, and surgical technology across different areas of care. We continue to invest in technology that helps staff provide dependable services to patients.",
  },
] as const

export function CareStandards() {
  const { t } = useLanguage()

  return (
    <section
      id="care-standards"
      aria-label={t("Hospital care and facilities")}
      className="bg-slate-50 px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto grid max-w-6xl gap-12 sm:gap-16 lg:gap-20">
        {careTopics.map(({ title, description }, index) => (
          <article key={title} className="grid items-center gap-5 md:grid-cols-2 md:gap-10 lg:gap-16">
            <div className="min-w-0 md:max-w-md">
              <h2 className="text-balance text-2xl font-extrabold leading-tight tracking-tight text-[#1E40AF] sm:text-3xl lg:text-4xl">
                {t(title)}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:mt-4 sm:text-base">
                {t(description)}
              </p>
            </div>

            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-slate-200 shadow-sm md:aspect-[4/3]">
              <Image
                src="/images/2.png"
                alt={index === 0 ? t("Albirri Hospital Grounds and Medical Center") : ""}
                fill
                sizes="(min-width: 1216px) 544px, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
