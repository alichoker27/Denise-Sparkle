"use client";

import { useState } from "react";
import Link from "next/link";
import { PiArrowLeftLight, PiEyeLight, PiEyeSlashLight, PiWarningCircleLight } from "react-icons/pi";
import { loginAction } from "./actions";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

const inputClass =
  "w-full rounded-xl border border-border-strong bg-white px-4 py-3 text-ink placeholder:text-ink-muted transition-colors focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 disabled:opacity-60";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    // The action will either redirect or return an error
    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface-soft px-4 py-12">
      {/* Brand */}
      <div className="mb-10 flex justify-center">
        <Logo />
      </div>

      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-6 shadow-card sm:p-10">
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-display text-ink">Admin login</h1>
          <p className="text-sm text-ink-muted">Sign in to manage your store.</p>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-600"
          >
            <PiWarningCircleLight className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

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
              disabled={loading}
              className={inputClass}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-ink">
                Password
              </label>
              <Link
                href="/admin/forgot-password"
                className="text-xs text-rose-500 underline-offset-4 hover:underline focus:outline-none focus-visible:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                disabled={loading}
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                {showPassword ? (
                  <PiEyeSlashLight className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <PiEyeLight className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" size="lg" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink focus:outline-none focus-visible:underline"
      >
        <PiArrowLeftLight className="h-4 w-4" aria-hidden="true" />
        Back to store
      </Link>
    </main>
  );
}