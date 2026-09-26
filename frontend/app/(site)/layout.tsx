import { cookies } from "next/headers";

import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/components/language-provider";
import { Navbar } from "@/components/Navbar";
import { Tobbar } from "@/components/Tobbar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import type { Language } from "@/lib/i18n/translations";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const savedLanguage = (await cookies()).get("albiri_language")?.value;
  const initialLanguage: Language =
    savedLanguage === "so" || savedLanguage === "ar" ? savedLanguage : "en";

  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <header className="sticky top-0 z-50 w-full">
        <Tobbar />
        <Navbar />
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </LanguageProvider>
  );
}
