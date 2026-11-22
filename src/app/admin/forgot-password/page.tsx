"use client";

import { useState } from "react";
import Link from "next/link";
import { PiArrowLeftLight, PiEnvelopeSimpleLight } from "react-icons/pi";
import { sendPasswordResetEmail } from "./actions";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handleSubmit(formData: FormData) {
    setStatus("loading");
    await sendPasswordResetEmail(formData.get("email") as string);
    setStatus("success");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface-soft px-4 py-12">
      {/* Brand */}
      <div className="mb-10 flex justify-center">
        <Logo />
      </div>

      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-6 shadow-card sm:p-10">
        <span
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blush-100 text-ink"
          aria-hidden="true"
        >
          <PiEnvelopeSimpleLight className="h-7 w-7" />
        </span>

        <h1 className="mb-2 text-center text-3xl font-display text-ink">Reset password</h1>

        {status === "success" ? (
          <div role="status" className="space-y-8 text-center">
            <p className="text-sm leading-relaxed text-ink-soft">
              If an account exists, a reset link has been sent.
            </p>
            <Button href="/admin/login" variant="outline" className="w-full">
              Back to login
            </Button>
          </div>
        ) : (
          <>
            <p className="mb-8 text-center text-sm leading-relaxed text-ink-muted">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
            <form action={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  disabled={status === "loading"}
                  className="w-full rounded-xl border border-border-strong bg-white px-4 py-3 text-ink placeholder:text-ink-muted transition-colors focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 disabled:opacity-60"
                />
              </div>
              <Button type="submit" size="lg" disabled={status === "loading"} className="w-full">
                {status === "loading" ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          </>
        )}
      </div>

      {status !== "success" && (
        <Link
          href="/admin/login"
          className="mt-8 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink focus:outline-none focus-visible:underline"
        >
          <PiArrowLeftLight className="h-4 w-4" aria-hidden="true" />
          Back to login
        </Link>
      )}
    </main>
  );
}