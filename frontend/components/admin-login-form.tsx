"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyholeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEMO_EMAIL = "admin@albiri.so";
const DEMO_PASSWORD = "admin123";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").toLowerCase().trim();
    const password = String(formData.get("password") ?? "");

    if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError("Demo email-ka ama password-ka ayaa khaldan.");
      return;
    }

    window.localStorage.setItem(
      "albiri_admin_user",
      JSON.stringify({
        id: "demo-admin-1",
        name: "Albiri Admin",
        email: DEMO_EMAIL,
        role: "ADMIN",
      }),
    );
    document.cookie =
      "albiri_demo_admin=1; path=/; max-age=604800; samesite=lax";

    router.replace("/admin/dashboard");
    router.refresh();
  }

  return (
    <Card className="border-border/70 shadow-xl shadow-emerald-950/5">
      <CardHeader className="space-y-3 pb-2 text-center sm:text-left">
        <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-emerald-600 text-white sm:mx-0">
          <LockKeyholeIcon className="size-5" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Geli email-ka iyo password-ka maamulka.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@albirihospital.com"
              defaultValue={DEMO_EMAIL}
              autoComplete="email"
              className="h-10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              defaultValue={DEMO_PASSWORD}
              autoComplete="current-password"
              className="h-10"
              minLength={6}
              required
            />
          </div>

          {error ? (
            <p
              role="alert"
              className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          ) : null}

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs leading-5 text-emerald-950">
            <p className="font-semibold">Demo login</p>
            <p>Email: {DEMO_EMAIL}</p>
            <p>Password: {DEMO_PASSWORD}</p>
          </div>

          <Button
            type="submit"
            className="h-10 w-full bg-emerald-700 hover:bg-emerald-800"
          >
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
