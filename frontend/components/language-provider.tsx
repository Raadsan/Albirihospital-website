"use client"

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

import {
  languageLabels,
  translations,
  type Language,
} from "@/lib/i18n/translations"

type LanguageContextValue = {
  language: Language
  direction: "ltr" | "rtl"
  setLanguage: (language: Language) => void
  t: (text: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function normalizeText(text: string) {
  return text.replace(/\s+/g, " ").trim()
}

function translateDynamicText(text: string, language: Language) {
  if (language === "en") return text

  const dynamicPatterns: Array<{
    pattern: RegExp
    so: (match: RegExpMatchArray) => string
    ar: (match: RegExpMatchArray) => string
  }> = [
    {
      pattern: /^Show background image (\d+)$/,
      so: (match) => `Muuji sawirka dambe ${match[1]}`,
      ar: (match) => `اعرض صورة الخلفية ${match[1]}`,
    },
    {
      pattern: /^Show hospital image (\d+)$/,
      so: (match) => `Muuji sawirka isbitaalka ${match[1]}`,
      ar: (match) => `اعرض صورة المستشفى ${match[1]}`,
    },
    {
      pattern: /^Go to video page (\d+)$/,
      so: (match) => `Tag bogga muuqaalka ${match[1]}`,
      ar: (match) => `انتقل إلى صفحة الفيديو ${match[1]}`,
    },
    {
      pattern: /^About (.+)$/,
      so: (match) => `Ku saabsan ${match[1]}`,
      ar: (match) => `عن ${match[1]}`,
    },
    {
      pattern: /^Follow Albirri Hospital on (.+)$/,
      so: (match) => `Albirri Hospital kala soco ${match[1]}`,
      ar: (match) => `تابع مستشفى البِرّي على ${match[1]}`,
    },
  ]

  for (const item of dynamicPatterns) {
    const match = text.match(item.pattern)
    if (match) return item[language](match)
  }

  return text
}

export function translateText(text: string, language: Language) {
  const normalized = normalizeText(text)
  if (!normalized || language === "en") return normalized
  return translations[normalized]?.[language] ?? translateDynamicText(normalized, language)
}

export function LanguageProvider({
  children,
  initialLanguage = "en",
}: {
  children: ReactNode
  initialLanguage?: Language
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)
  const originalText = useRef(new WeakMap<Text, string>())
  const lastAppliedText = useRef(new WeakMap<Text, string>())
  const originalAttributes = useRef(new WeakMap<Element, Map<string, string>>())
  const lastAppliedAttributes = useRef(new WeakMap<Element, Map<string, string>>())

  const direction: "ltr" | "rtl" = language === "ar" ? "rtl" : "ltr"

  const t = useCallback(
    (text: string) => translateText(text, language),
    [language],
  )

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage)
    window.localStorage.setItem("albiri_language", nextLanguage)
    document.cookie = `albiri_language=${nextLanguage}; path=/; max-age=31536000; samesite=lax`
  }, [])

  useLayoutEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = direction

    const applyTextNode = (node: Text) => {
      const currentValue = node.nodeValue ?? ""
      const lastValue = lastAppliedText.current.get(node)

      if (!originalText.current.has(node) || currentValue !== lastValue) {
        originalText.current.set(node, currentValue)
      }

      const originalValue = originalText.current.get(node) ?? currentValue
      const normalized = normalizeText(originalValue)
      if (!normalized) return

      const translated = translateText(normalized, language)
      const leadingWhitespace = originalValue.match(/^\s*/)?.[0] ?? ""
      const trailingWhitespace = originalValue.match(/\s*$/)?.[0] ?? ""
      const nextValue = `${leadingWhitespace}${translated}${trailingWhitespace}`

      lastAppliedText.current.set(node, nextValue)
      if (currentValue !== nextValue) node.nodeValue = nextValue
    }

    const translatableAttributes = ["aria-label", "placeholder", "title", "alt"]

    const applyElementAttributes = (element: Element) => {
      let originals = originalAttributes.current.get(element)
      let applied = lastAppliedAttributes.current.get(element)

      if (!originals) {
        originals = new Map()
        originalAttributes.current.set(element, originals)
      }
      if (!applied) {
        applied = new Map()
        lastAppliedAttributes.current.set(element, applied)
      }

      for (const attribute of translatableAttributes) {
        const currentValue = element.getAttribute(attribute)
        if (!currentValue) continue

        if (!originals.has(attribute) || currentValue !== applied.get(attribute)) {
          originals.set(attribute, currentValue)
        }

        const originalValue = originals.get(attribute) ?? currentValue
        const nextValue = translateText(originalValue, language)
        applied.set(attribute, nextValue)
        if (currentValue !== nextValue) element.setAttribute(attribute, nextValue)
      }
    }

    const translateSubtree = (root: Node) => {
      if (root.nodeType === Node.TEXT_NODE) {
        applyTextNode(root as Text)
        return
      }

      if (root.nodeType !== Node.ELEMENT_NODE && root !== document.body) return

      if (root.nodeType === Node.ELEMENT_NODE) {
        const element = root as Element
        if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(element.tagName)) return
        applyElementAttributes(element)
      }

      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      )
      let node = walker.nextNode()

      while (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const parent = node.parentElement
          if (parent && !["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) {
            applyTextNode(node as Text)
          }
        } else {
          applyElementAttributes(node as Element)
        }
        node = walker.nextNode()
      }
    }

    translateSubtree(document.body)

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          applyTextNode(mutation.target as Text)
        }
        for (const node of mutation.addedNodes) translateSubtree(node)
      }
    })

    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [direction, language])

  const value = useMemo(
    () => ({ language, direction, setLanguage, t }),
    [direction, language, setLanguage, t],
  )

  return (
    <LanguageContext.Provider value={value}>
      <div className="contents" dir={direction} lang={language}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider")
  }
  return context
}

export function getLanguageLabel(language: Language) {
  return languageLabels[language]
}
