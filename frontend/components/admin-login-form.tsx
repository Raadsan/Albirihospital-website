"use client";

import { FormEvent, useState } from "react";
import { LockKeyholeIcon, Loader2Icon } from "lucide-react";
import { toast } from "react-toastify";

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
import { adminApi } from "@/app/api/api";
import { getApiErrorMessage } from "@/lib/api-error";

export function AdminLoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").toLowerCase().trim();
    const password = String(formData.get("password") ?? "");

    try {
      await adminApi.post("/session", { email, password });
    } catch (err: unknown) {
      const apiError = getApiErrorMessage(err, "Sign-in failed. Please try again.");
      setError(apiError);
      toast.error(apiError);
      setLoading(false);
      return;
    }

    try {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("albiri_admin_user");
    } catch {
      // Some browsers block web storage. The session cookie is already set.
    }
    window.location.replace("/admin/dashboard");
  }

  return (
    <Card className="border-blue-100 shadow-xl shadow-blue-950/5">
      <CardHeader className="space-y-3 pb-2 text-center sm:text-left">
        <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground sm:mx-0">
          <LockKeyholeIcon className="size-5" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl">Admin & Staff Portal</CardTitle>
          <CardDescription>
            Enter your credentials to manage appointments, doctors, and website content.
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
              autoComplete="username"
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
              autoComplete="current-password"
              className="h-10"
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

          <Button
            type="submit"
            disabled={loading}
            className="h-10 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading && <Loader2Icon className="size-4 animate-spin" />}
            {loading ? "Signing in..." : "Login to Dashboard"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
