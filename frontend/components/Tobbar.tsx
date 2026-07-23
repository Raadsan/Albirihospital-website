"use client"

import React, { useState } from 'react'
import { MapPin, Phone, Globe, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Tobbar() {
    const [language, setLanguage] = useState("English")

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
                        <span className="text-white/90 group-hover:text-[#10B981] transition-colors tracking-wide text-xs sm:text-sm">Albiri, Mogadishu, Somalia</span>
                    </div>
                </div>

                {/* Right Side: Language Switcher */}
                <div className="flex items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 gap-2 bg-white/10 hover:bg-black hover:text-white border border-white/20 hover:border-black rounded-full px-4 transition-all duration-300"
                                />
                            }
                        >
                            <Globe className="w-4 h-4" />
                            <span className="font-semibold">{language}</span>
                            <ChevronDown className="w-3 h-3 opacity-70" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-[#0f172a] rounded-xl shadow-xl border-white/10 z-50">
                            <DropdownMenuItem
                                onClick={() => setLanguage("English")}
                                className={`cursor-pointer rounded-lg font-medium my-1 transition-colors ${language === "English" ? "bg-[#1e40af]/10 text-[#1e40af] dark:text-blue-400" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                            >
                                English
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setLanguage("Somali")}
                                className={`cursor-pointer rounded-lg font-medium my-1 transition-colors ${language === "Somali" ? "bg-[#1e40af]/10 text-[#1e40af] dark:text-blue-400" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                            >
                                Somali
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setLanguage("Arabic")}
                                className={`cursor-pointer rounded-lg font-medium my-1 transition-colors ${language === "Arabic" ? "bg-[#1e40af]/10 text-[#1e40af] dark:text-blue-400" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                            >
                                Arabic
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>
        </motion.div>
    )
}
