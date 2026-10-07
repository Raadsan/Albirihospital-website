"use client"

import { FormEvent, useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  Bot,
  CalendarDays,
  ExternalLink,
  MessageCircleMore,
  PhoneCall,
  Send,
  Sparkles,
  X,
} from "lucide-react"

import { useLanguage } from "@/components/language-provider"
import type { Language } from "@/lib/i18n/translations"

const WHATSAPP_NUMBER = "252610331166"
const EMERGENCY_NUMBER = "4446"

type LocalizedText = Record<Language, string>

type ChatAction = {
  label: string
  href: string
  kind: "primary" | "whatsapp" | "emergency"
  external?: boolean
}

type ChatMessage = {
  id: string
  role: "assistant" | "user"
  content: string
  action?: ChatAction
}

type SupportIntent = {
  keywords: string[]
  answer: LocalizedText
  action?: {
    label: LocalizedText
    href: string
    kind: ChatAction["kind"]
    external?: boolean
  }
}

const copy: Record<
  Language,
  {
    openLabel: string
    closeLabel: string
    title: string
    status: string
    welcome: string
    prompt: string
    placeholder: string
    send: string
    disclaimer: string
    fallback: string
    whatsappLabel: string
    whatsappPrefix: string
  }
> = {
  en: {
    openLabel: "Open Albirri AI support",
    closeLabel: "Close support chat",
    title: "Albirri Assistant",
    status: "AI Support · Online",
    welcome:
      "Hi! I can help with appointments, services, doctors, directions, and emergency contacts. How can I help you?",
    prompt: "Common questions",
    placeholder: "Type your question...",
    send: "Send message",
    disclaimer: "General support only · Emergency: 4446",
    fallback:
      "I’m sorry, I didn’t fully understand that question. Please send it to our hospital team on WhatsApp for direct help.",
    whatsappLabel: "Ask on WhatsApp",
    whatsappPrefix: "Hello Albirri Hospital, I need help with this question: ",
  },
  so: {
    openLabel: "Fur taageerada AI ee Albirri",
    closeLabel: "Xir wada hadalka taageerada",
    title: "Kaaliyaha Albirri",
    status: "Taageero AI · Online",
    welcome:
      "Salaan! Waxaan kaa caawin karaa ballamaha, adeegyada, dhakhaatiirta, goobta iyo gurmadka. Maxaan kaa caawiyaa?",
    prompt: "Su’aalaha caanka ah",
    placeholder: "Qor su’aashaada...",
    send: "Dir fariinta",
    disclaimer: "Macluumaad guud oo keliya · Gurmad: 4446",
    fallback:
      "Waan ka xumahay, su’aashaas si fiican uma fahmin. Fadlan kooxda isbitaalka si toos ah ugala hadal WhatsApp.",
    whatsappLabel: "Ku weydii WhatsApp",
    whatsappPrefix: "Salaan Albirri Hospital, waxaan caawimaad ka rabaa su’aashan: ",
  },
  ar: {
    openLabel: "افتح دعم البِرّي الذكي",
    closeLabel: "إغلاق محادثة الدعم",
    title: "مساعد البِرّي",
    status: "دعم ذكي · متصل",
    welcome:
      "مرحباً! يمكنني مساعدتك في المواعيد والخدمات والأطباء والموقع وأرقام الطوارئ. كيف يمكنني مساعدتك؟",
    prompt: "أسئلة شائعة",
    placeholder: "اكتب سؤالك...",
    send: "إرسال الرسالة",
    disclaimer: "معلومات عامة فقط · الطوارئ: 4446",
    fallback:
      "عذراً، لم أفهم سؤالك بالكامل. يرجى إرساله إلى فريق المستشفى عبر واتساب للحصول على مساعدة مباشرة.",
    whatsappLabel: "اسأل عبر واتساب",
    whatsappPrefix: "مرحباً مستشفى البِرّي، أحتاج إلى مساعدة بخصوص هذا السؤال: ",
  },
}

const quickQuestions: Array<{ label: LocalizedText; query: LocalizedText }> = [
  {
    label: {
      en: "Book an appointment",
      so: "Qabso ballan",
      ar: "حجز موعد",
    },
    query: {
      en: "How can I book an appointment?",
      so: "Sideen ballan u qabsan karaa?",
      ar: "كيف يمكنني حجز موعد؟",
    },
  },
  {
    label: {
      en: "Hospital services",
      so: "Adeegyada isbitaalka",
      ar: "خدمات المستشفى",
    },
    query: {
      en: "What services does the hospital provide?",
      so: "Adeegyo noocee ah ayuu isbitaalku bixiyaa?",
      ar: "ما الخدمات التي يقدمها المستشفى؟",
    },
  },
  {
    label: {
      en: "Emergency help",
      so: "Gargaar degdeg ah",
      ar: "مساعدة طارئة",
    },
    query: {
      en: "How do I contact emergency care?",
      so: "Sideen ula xiriiraa gurmadka?",
      ar: "كيف أتواصل مع قسم الطوارئ؟",
    },
  },
  {
    label: {
      en: "Hospital location",
      so: "Goobta isbitaalka",
      ar: "موقع المستشفى",
    },
    query: {
      en: "Where is Albirri Hospital located?",
      so: "Xaggee ayuu ku yaal Isbitaalka Albirri?",
      ar: "أين يقع مستشفى البِرّي؟",
    },
  },
]

const intents: SupportIntent[] = [
  {
    keywords: [
      "emergency",
      "urgent",
      "ambulance",
      "accident",
      "bleeding",
      "unconscious",
      "gurmad",
      "degdeg",
      "ambalaas",
      "shil",
      "dhiig bax",
      "miyir dabool",
      "طوارئ",
      "اسعاف",
      "إسعاف",
      "حادث",
      "عاجل",
    ],
    answer: {
      en: `For urgent medical help or an ambulance, call ${EMERGENCY_NUMBER} now. Albirri Hospital’s emergency service is available 24/7.`,
      so: `Gargaar caafimaad oo degdeg ah ama ambalaas, hadda wac ${EMERGENCY_NUMBER}. Gurmadka Isbitaalka Albirri wuxuu shaqeeyaa 24/7.`,
      ar: `للمساعدة الطبية العاجلة أو سيارة الإسعاف، اتصل الآن بالرقم ${EMERGENCY_NUMBER}. قسم الطوارئ في مستشفى البِرّي متاح على مدار الساعة.`,
    },
    action: {
      label: {
        en: `Call emergency ${EMERGENCY_NUMBER}`,
        so: `Wac gurmadka ${EMERGENCY_NUMBER}`,
        ar: `اتصل بالطوارئ ${EMERGENCY_NUMBER}`,
      },
      href: `tel:${EMERGENCY_NUMBER}`,
      kind: "emergency",
    },
  },
  {
    keywords: [
      "appointment",
      "book",
      "booking",
      "schedule",
      "see a doctor",
      "ballan",
      "balan",
      "qabsado",
      "qabsan",
      "dhakhtar arko",
      "موعد",
      "حجز",
      "طبيب",
    ],
    answer: {
      en: "You can request an appointment through our online appointment form. Choose your preferred date and time, and our team will contact you to confirm.",
      so: "Waxaad ballan ka codsan kartaa foomka ballanta ee website-ka. Dooro taariikhda iyo waqtiga kugu habboon, kooxdayaduna way kula soo xiriiri doontaa si loo xaqiijiyo.",
      ar: "يمكنك طلب موعد عبر نموذج المواعيد في الموقع. اختر التاريخ والوقت المناسبين وسيتواصل معك فريقنا للتأكيد.",
    },
    action: {
      label: {
        en: "Book an appointment",
        so: "Qabso ballan",
        ar: "احجز موعداً",
      },
      href: "/appointment",
      kind: "primary",
    },
  },
  {
    keywords: [
      "services",
      "departments",
      "what do you provide",
      "adeeg",
      "adeegyo",
      "waax",
      "waaxyaha",
      "maxaad bixisaan",
      "خدمات",
      "اقسام",
      "أقسام",
    ],
    answer: {
      en: "Albirri Hospital provides maternity care, specialist consultations, pharmacy, laboratory testing, radiology, surgery, health checkups, ambulance support, and 24/7 emergency care.",
      so: "Isbitaalka Albirri wuxuu bixiyaa daryeelka hooyada, la-talinta takhasuska, farmashiye, shaybaar, raajo, qalliin, baaritaanno caafimaad, ambalaas iyo gurmad 24/7.",
      ar: "يقدم مستشفى البِرّي رعاية الأمومة والاستشارات التخصصية والصيدلة والمختبر والأشعة والجراحة والفحوصات الصحية والإسعاف والطوارئ على مدار الساعة.",
    },
    action: {
      label: {
        en: "Explore services",
        so: "Eeg adeegyada",
        ar: "استكشف الخدمات",
      },
      href: "/services",
      kind: "primary",
    },
  },
  {
    keywords: [
      "open",
      "opening hours",
      "working hours",
      "24 hours",
      "24/7",
      "saacad",
      "saacadaha",
      "furantahay",
      "furan",
      "waqtiga",
      "مفتوح",
      "ساعات العمل",
      "دوام",
    ],
    answer: {
      en: "Our emergency department is open 24 hours a day, seven days a week. For the hours of a specific clinic or department, please ask our team on WhatsApp.",
      so: "Waaxda gurmadku waxay furan tahay 24 saac maalintii, toddobada maalmood ee usbuuca. Saacadaha waax ama rug gaar ah, fadlan WhatsApp-ka ka weydii kooxdayada.",
      ar: "قسم الطوارئ مفتوح 24 ساعة يومياً طوال أيام الأسبوع. لمعرفة ساعات عيادة أو قسم محدد، يرجى سؤال فريقنا عبر واتساب.",
    },
    action: {
      label: {
        en: "Ask on WhatsApp",
        so: "Ku weydii WhatsApp",
        ar: "اسأل عبر واتساب",
      },
      href: `https://wa.me/${WHATSAPP_NUMBER}`,
      kind: "whatsapp",
      external: true,
    },
  },
  {
    keywords: [
      "where",
      "location",
      "address",
      "directions",
      "located",
      "xagee",
      "xaggee",
      "goob",
      "cinwaan",
      "meesha",
      "halkee",
      "اين",
      "أين",
      "موقع",
      "عنوان",
    ],
    answer: {
      en: "Albirri Hospital is located at KM14 Afgoi Road, Mogadishu, Somalia. We also serve patients in Adado Town, Galgaduud Region.",
      so: "Isbitaalka Albirri wuxuu ku yaal KM14 Wadada Afgooye, Muqdisho, Soomaaliya. Waxaan sidoo kale bukaanka ugu adeegnaa magaalada Cadaado ee gobolka Galgaduud.",
      ar: "يقع مستشفى البِرّي في الكيلو 14 بطريق أفجوي، مقديشو، الصومال. كما نخدم المرضى في مدينة عدادو بإقليم غلغدود.",
    },
  },
  {
    keywords: [
      "contact",
      "phone",
      "number",
      "whatsapp",
      "call",
      "xiriir",
      "telefoon",
      "lambarka",
      "wac",
      "اتصال",
      "هاتف",
      "رقم",
      "واتساب",
    ],
    answer: {
      en: `You can contact Albirri Hospital on WhatsApp at +252 61 0331166. For emergencies, call ${EMERGENCY_NUMBER}.`,
      so: `Isbitaalka Albirri waxaad WhatsApp kala xiriiri kartaa +252 61 0331166. Xaalad degdeg ah wac ${EMERGENCY_NUMBER}.`,
      ar: `يمكنك التواصل مع مستشفى البِرّي عبر واتساب على +252 61 0331166. وللطوارئ اتصل بالرقم ${EMERGENCY_NUMBER}.`,
    },
    action: {
      label: {
        en: "Open WhatsApp",
        so: "Fur WhatsApp",
        ar: "افتح واتساب",
      },
      href: `https://wa.me/${WHATSAPP_NUMBER}`,
      kind: "whatsapp",
      external: true,
    },
  },
  {
    keywords: [
      "doctor",
      "doctors",
      "specialist",
      "consultant",
      "physician",
      "dhakhtar",
      "dhakhaatiir",
      "takhasus",
      "طبيب",
      "اطباء",
      "أطباء",
      "اخصائي",
      "أخصائي",
    ],
    answer: {
      en: "Our medical team includes specialists across several departments. You can view available doctors and request an appointment from the doctors page.",
      so: "Kooxdayada caafimaadka waxaa ku jira dhakhaatiir takhasusyo kala duwan leh. Waxaad dhakhaatiirta ka arki kartaa bogga dhakhaatiirta, halkaasna ballan ayaad ka codsan kartaa.",
      ar: "يضم فريقنا الطبي أخصائيين في عدة أقسام. يمكنك الاطلاع على الأطباء المتاحين وطلب موعد من صفحة الأطباء.",
    },
    action: {
      label: {
        en: "View doctors",
        so: "Eeg dhakhaatiirta",
        ar: "عرض الأطباء",
      },
      href: "/doctors",
      kind: "primary",
    },
  },
  {
    keywords: [
      "maternity",
      "pregnant",
      "pregnancy",
      "delivery",
      "mother",
      "hooyo",
      "uur",
      "dhalmo",
      "umul",
      "امومة",
      "أمومة",
      "حامل",
      "ولادة",
    ],
    answer: {
      en: "Our maternity department supports mothers from prenatal care through delivery and postnatal care, with attention to the safety of both mother and baby.",
      so: "Waaxda hooyada iyo dhallaanku waxay bixisaa daryeelka uurka, dhalmada iyo dhalmada kadib, iyadoo mudnaan la siinayo badbaadada hooyada iyo ilmaha.",
      ar: "يقدم قسم الأمومة الرعاية قبل الولادة وأثناءها وبعدها، مع الاهتمام بسلامة الأم والطفل.",
    },
    action: {
      label: {
        en: "Maternity department",
        so: "Waaxda hooyada",
        ar: "قسم الأمومة",
      },
      href: "/departments/maternity",
      kind: "primary",
    },
  },
  {
    keywords: [
      "laboratory",
      "lab",
      "test",
      "blood test",
      "shaybaar",
      "baaritaan",
      "dhiig",
      "مختبر",
      "تحاليل",
      "فحص",
    ],
    answer: {
      en: "Our modern laboratory operates 24 hours and provides diagnostic testing, including biochemistry, serology, parasitology, hematology, and blood transfusion services.",
      so: "Shaybaarkayaga casriga ah wuxuu shaqeeyaa 24 saac, wuxuuna bixiyaa baaritaanno ay ka mid yihiin biochemistry, serology, parasitology, hematology iyo dhiig-shubid.",
      ar: "يعمل مختبرنا الحديث على مدار الساعة ويقدم فحوصات تشخيصية تشمل الكيمياء الحيوية والمناعة والطفيليات وأمراض الدم ونقل الدم.",
    },
    action: {
      label: {
        en: "Laboratory services",
        so: "Adeegyada shaybaarka",
        ar: "خدمات المختبر",
      },
      href: "/departments/laboratory",
      kind: "primary",
    },
  },
  {
    keywords: [
      "radiology",
      "x-ray",
      "xray",
      "ultrasound",
      "scan",
      "raajo",
      "sawir",
      "اشعة",
      "أشعة",
      "سونار",
    ],
    answer: {
      en: "Our radiology department provides digital X-rays and high-resolution ultrasound scans to support fast and accurate diagnosis.",
      so: "Waaxda raajadu waxay bixisaa raajo dijitaal ah iyo ultrasound tayo sare leh si loo helo ogaansho degdeg ah oo sax ah.",
      ar: "يقدم قسم الأشعة صور الأشعة السينية الرقمية وفحوصات الموجات فوق الصوتية عالية الدقة لدعم التشخيص السريع والدقيق.",
    },
    action: {
      label: {
        en: "Radiology services",
        so: "Adeegyada raajada",
        ar: "خدمات الأشعة",
      },
      href: "/departments/radiology",
      kind: "primary",
    },
  },
  {
    keywords: [
      "pharmacy",
      "medicine",
      "medication",
      "drug",
      "farmashiye",
      "daawo",
      "dawo",
      "صيدلية",
      "دواء",
      "ادوية",
      "أدوية",
    ],
    answer: {
      en: "Our pharmacy provides quality medicines and professional guidance for safe and effective treatment. Please contact the hospital to confirm a specific medicine’s availability.",
      so: "Farmashiyahayagu wuxuu bixiyaa daawooyin tayo leh iyo talo xirfadeed. Si aad u xaqiijiso in daawo gaar ah la hayo, fadlan la xiriir isbitaalka.",
      ar: "توفر صيدليتنا أدوية عالية الجودة وإرشادات مهنية للعلاج الآمن والفعال. يرجى التواصل مع المستشفى للتأكد من توفر دواء محدد.",
    },
    action: {
      label: {
        en: "Ask pharmacy on WhatsApp",
        so: "Farmashiyaha ku weydii WhatsApp",
        ar: "اسأل الصيدلية عبر واتساب",
      },
      href: `https://wa.me/${WHATSAPP_NUMBER}`,
      kind: "whatsapp",
      external: true,
    },
  },
  {
    keywords: [
      "price",
      "cost",
      "fee",
      "payment",
      "insurance",
      "qiime",
      "lacag",
      "kharash",
      "caymis",
      "سعر",
      "تكلفة",
      "تأمين",
    ],
    answer: {
      en: "Service prices can vary by consultation or test. Please tell our WhatsApp team which service you need so they can give you the correct current information.",
      so: "Qiimaha adeeggu wuxuu ku xiran yahay la-talinta ama baaritaanka aad u baahan tahay. Kooxda WhatsApp u sheeg adeegga aad rabto si ay kuu siiyaan xogta saxda ah ee hadda jirta.",
      ar: "تختلف الأسعار حسب الاستشارة أو الفحص المطلوب. أخبر فريقنا عبر واتساب بالخدمة التي تحتاجها للحصول على المعلومات الحالية الصحيحة.",
    },
    action: {
      label: {
        en: "Ask about pricing",
        so: "Weydii qiimaha",
        ar: "اسأل عن الأسعار",
      },
      href: `https://wa.me/${WHATSAPP_NUMBER}`,
      kind: "whatsapp",
      external: true,
    },
  },
  {
    keywords: [
      "hello",
      "hi",
      "hey",
      "good morning",
      "good evening",
      "salaan",
      "asc",
      "iska warran",
      "subax wanaagsan",
      "galab wanaagsan",
      "مرحبا",
      "السلام عليكم",
      "صباح الخير",
    ],
    answer: {
      en: "Hello! Welcome to Albirri Hospital. Ask me about appointments, services, doctors, directions, or emergency contacts.",
      so: "Salaan! Ku soo dhowow Isbitaalka Albirri. I weydii ballamaha, adeegyada, dhakhaatiirta, goobta ama lambarrada gurmadka.",
      ar: "مرحباً بك في مستشفى البِرّي. اسألني عن المواعيد أو الخدمات أو الأطباء أو الموقع أو أرقام الطوارئ.",
    },
  },
  {
    keywords: [
      "thank",
      "thanks",
      "mahadsanid",
      "mahadsan",
      "شكرا",
      "شكراً",
    ],
    answer: {
      en: "You’re welcome. I’m here whenever you need help with Albirri Hospital services.",
      so: "Adigaa mudan. Mar kasta waxaan diyaar u ahay inaan kaa caawiyo adeegyada Isbitaalka Albirri.",
      ar: "على الرحب والسعة. أنا هنا لمساعدتك في خدمات مستشفى البِرّي متى احتجت.",
    },
  },
]

function normalizeQuestion(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize("NFKD")
    .replace(/[\u064b-\u065f\u0670]/g, "")
    .replace(/[^\p{L}\p{N}\s/-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function whatsappQuestionUrl(question: string, language: Language) {
  const message = `${copy[language].whatsappPrefix}${question}`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

function findAnswer(question: string, language: Language) {
  const normalizedQuestion = normalizeQuestion(question)
  let bestMatch: SupportIntent | undefined
  let bestScore = 0

  for (const intent of intents) {
    const score = intent.keywords.reduce((total, keyword) => {
      const normalizedKeyword = normalizeQuestion(keyword)
      if (normalizedQuestion === normalizedKeyword) return total + 10
      if (!normalizedQuestion.includes(normalizedKeyword)) return total
      return total + (normalizedKeyword.includes(" ") ? 4 : 2)
    }, 0)

    if (score > bestScore) {
      bestScore = score
      bestMatch = intent
    }
  }

  if (!bestMatch || bestScore < 2) {
    return {
      content: copy[language].fallback,
      action: {
        label: copy[language].whatsappLabel,
        href: whatsappQuestionUrl(question, language),
        kind: "whatsapp" as const,
        external: true,
      },
    }
  }

  return {
    content: bestMatch.answer[language],
    action: bestMatch.action
      ? {
          label: bestMatch.action.label[language],
          href: bestMatch.action.href,
          kind: bestMatch.action.kind,
          external: bestMatch.action.external,
        }
      : undefined,
  }
}

function ActionLink({ action }: { action: ChatAction }) {
  const className =
    action.kind === "whatsapp"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      : action.kind === "emergency"
        ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
        : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"

  const content = (
    <>
      {action.kind === "emergency" ? (
        <PhoneCall aria-hidden="true" className="size-3.5" />
      ) : action.kind === "primary" ? (
        <CalendarDays aria-hidden="true" className="size-3.5" />
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      )}
      <span>{action.label}</span>
      {action.external ? <ExternalLink aria-hidden="true" className="size-3" /> : null}
    </>
  )

  const styles = `mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${className}`

  if (action.href.startsWith("/")) {
    return (
      <Link href={action.href} className={styles}>
        {content}
      </Link>
    )
  }

  return (
    <a
      href={action.href}
      target={action.external ? "_blank" : undefined}
      rel={action.external ? "noopener noreferrer" : undefined}
      className={styles}
    >
      {content}
    </a>
  )
}

function ChatbotPanel({ language }: { language: Language }) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: copy[language].welcome,
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageSequenceRef = useRef(0)
  const panelId = useId()
  const prefersReducedMotion = useReducedMotion()
  const currentCopy = copy[language]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" })
  }, [messages, prefersReducedMotion])

  function askQuestion(question: string) {
    const cleanQuestion = question.trim()
    if (!cleanQuestion) return

    const answer = findAnswer(cleanQuestion, language)
    messageSequenceRef.current += 1
    const messageId = messageSequenceRef.current.toString()

    setMessages((current) => [
      ...current,
      {
        id: `${messageId}-user`,
        role: "user",
        content: cleanQuestion,
      },
      {
        id: `${messageId}-assistant`,
        role: "assistant",
        content: answer.content,
        action: answer.action,
      },
    ])
    setInput("")
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    askQuestion(input)
  }

  return (
    <div
      className="fixed bottom-4 left-4 z-[70] sm:bottom-6 sm:left-6"
      dir={language === "ar" ? "rtl" : "ltr"}
      onKeyDown={(event) => {
        if (event.key === "Escape") setIsOpen(false)
      }}
    >
      <AnimatePresence>
        {isOpen ? (
          <motion.section
            id={panelId}
            role="dialog"
            aria-label={currentCopy.title}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: "easeOut" }}
            className="mb-3 flex h-[min(620px,calc(100dvh-7rem))] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.24)]"
          >
            <header className="relative overflow-hidden bg-gradient-to-br from-[#163a8a] via-[#1e40af] to-[#2459c4] px-5 py-4 text-white">
              <div
                aria-hidden="true"
                className="absolute -right-10 -top-12 size-32 rounded-full bg-emerald-300/20 blur-2xl"
              />
              <div className="relative flex items-center gap-3">
                <div className="relative flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                  <Bot aria-hidden="true" className="size-5.5" />
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[#1e40af] bg-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h2 className="truncate text-sm font-bold">{currentCopy.title}</h2>
                    <Sparkles aria-hidden="true" className="size-3.5 text-emerald-300" />
                  </div>
                  <p className="mt-0.5 text-xs text-blue-100">{currentCopy.status}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label={currentCopy.closeLabel}
                  className="flex size-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <X aria-hidden="true" className="size-4.5" />
                </button>
              </div>
            </header>

            <div
              className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-slate-50 to-white px-4 py-4"
              aria-live="polite"
              aria-relevant="additions"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" ? (
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <Bot aria-hidden="true" className="size-3.5" />
                    </span>
                  ) : null}
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-5 shadow-sm ${
                      message.role === "user"
                        ? "rounded-br-md bg-[#1e40af] text-white"
                        : "rounded-bl-md border border-slate-200/80 bg-white text-slate-700"
                    }`}
                  >
                    <p>{message.content}</p>
                    {message.action ? <ActionLink action={message.action} /> : null}
                  </div>
                </div>
              ))}

              {messages.length === 1 ? (
                <div className="pt-1">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {currentCopy.prompt}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question) => (
                      <button
                        key={question.label.en}
                        type="button"
                        onClick={() => askQuestion(question.query[language])}
                        className="rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                      >
                        {question.label[language]}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-slate-100 bg-white px-3.5 pb-3 pt-3">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <label htmlFor={`${panelId}-input`} className="sr-only">
                  {currentCopy.placeholder}
                </label>
                <input
                  id={`${panelId}-input`}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={currentCopy.placeholder}
                  autoComplete="off"
                  maxLength={500}
                  className="h-11 min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label={currentCopy.send}
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#1e40af] text-white shadow-md shadow-blue-900/20 transition-all hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send aria-hidden="true" className="size-4.5" />
                </button>
              </form>
              <p className="mt-2 text-center text-[10px] font-medium text-slate-400">
                {currentCopy.disclaimer}
              </p>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        aria-label={isOpen ? currentCopy.closeLabel : currentCopy.openLabel}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((current) => !current)}
        className="group flex items-center gap-2.5 rounded-full bg-[#1e40af] p-3.5 text-white shadow-[0_14px_34px_rgba(30,64,175,0.38)] ring-1 ring-white/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-[0_18px_40px_rgba(30,64,175,0.42)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:px-4"
      >
        <span className="relative flex size-6 items-center justify-center">
          {isOpen ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <MessageCircleMore aria-hidden="true" className="size-5" />
          )}
          {!isOpen ? (
            <span className="absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-[#1e40af] bg-emerald-400" />
          ) : null}
        </span>
        <span className="hidden text-sm font-semibold sm:inline">{currentCopy.title}</span>
      </button>
    </div>
  )
}

export function HospitalChatbot() {
  const { language } = useLanguage()

  return <ChatbotPanel key={language} language={language} />
}

export default HospitalChatbot
