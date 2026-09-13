"use client"

import React from 'react'
import { MapPin, Phone, Globe, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { getLanguageLabel, useLanguage } from "@/components/language-provider"
import type { Language } from "@/lib/i18n/translations"

const languageOptions: Language[] = ["en", "so", "ar"]

export function Tobbar() {
    const { language, setLanguage, t } = useLanguage()

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full bg-[#1e40af] text-white py-2 text-sm font-medium shadow-md border-b border-white/10 z-50 relative"
        >
            <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto px-4 md:px-8 w-full gap-3">

                {/* Left Side: Contact & Location */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="bg-white/10 p-1.5 rounded-full group-hover:bg-black/10 transition-colors">
                            <Phone className="w-3.5 h-3.5 text-white group-hover:text-[#10B981] transition-colors" />
                        </div>
                        <span className="text-white/90 group-hover:text-[#10B981] transition-colors tracking-wide text-xs sm:text-sm">4446</span>
                    </div>

                    <div className="hidden md:block w-px h-4 bg-white/20"></div>

                    <div className="hidden md:flex items-center gap-2 group cursor-pointer">
                        <div className="bg-white/10 p-1.5 rounded-full group-hover:bg-black/10 transition-colors">
                            <MapPin className="w-3.5 h-3.5 text-white group-hover:text-[#10B981] transition-colors" />
                        </div>
                        <span className="text-white/90 group-hover:text-[#10B981] transition-colors tracking-wide text-xs sm:text-sm">{t("Albiri, Mogadishu, Somalia")}</span>
                    </div>
                </div>

                {/* Right Side: Language Switcher */}
                <div className="flex items-center">
                    <label className="relative flex h-8 items-center rounded-full border border-white/25 bg-white/10 transition-colors hover:bg-black/20">
                        <Globe className="pointer-events-none absolute left-3 size-4" />
                        <select
                            aria-label={t("Select language")}
                            value={language}
                            onChange={(event) => setLanguage(event.target.value as Language)}
                            className="h-full min-w-32 cursor-pointer appearance-none bg-transparent py-1 pl-9 pr-8 text-sm font-semibold text-white outline-none"
                        >
                            {languageOptions.map((option) => (
                                <option key={option} value={option} className="bg-white text-slate-900">
                                    {t(getLanguageLabel(option))}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 size-3 opacity-70" />
                    </label>
                </div>

            </div>
        </motion.div>
    )
}
