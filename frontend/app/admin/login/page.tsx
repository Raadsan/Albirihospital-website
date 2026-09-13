import type { Metadata } from "next";
import Image from "next/image";
import { HeartPulseIcon, ShieldCheckIcon } from "lucide-react";

import { AdminLoginForm } from "@/components/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login | Albiri Hospital",
  description: "Sign in to the Albiri Hospital administration portal.",
};

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-svh flex-1 bg-muted/30 lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-emerald-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.35),transparent_42%)]" />
        <div className="relative flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <HeartPulseIcon className="size-6" />
          </div>
          <div>
            <p className="text-lg font-semibold">Albiri Hospital</p>
            <p className="text-sm text-emerald-100/75">Admin Portal</p>
          </div>
        </div>

        <div className="relative max-w-lg space-y-5">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20">
            <ShieldCheckIcon className="size-7 text-emerald-200" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight xl:text-5xl">
            Maamulka isbitaalka oo hal meel ah.
          </h1>
          <p className="text-base leading-7 text-emerald-100/75">
            Si ammaan ah u maamul xogta, adeegyada, iyo hawlaha maalinlaha
            ah ee Albiri Hospital.
          </p>
        </div>

        <p className="relative text-sm text-emerald-100/60">
          © {new Date().getFullYear()} Albiri Hospital. All rights reserved.
        </p>
      </section>

      <section className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <Image
              src="/images/LOGO2-01.png"
              alt="Albiri Hospital"
              width={180}
              height={72}
              className="h-16 w-auto object-contain"
              priority
            />
          </div>
          <AdminLoginForm />
        </div>
      </section>
    </main>
  );
}
