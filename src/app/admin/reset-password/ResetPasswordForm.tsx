"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  PiCheckLight,
  PiEyeLight,
  PiEyeSlashLight,
  PiLockKeyLight,
  PiWarningCircleLight,
} from "react-icons/pi";
import { Button } from "@/components/ui/Button";
import { resetPasswordAction } from "./actions";

const cardClass =
  "w-full max-w-md rounded-3xl border border-border bg-white p-6 shadow-card sm:p-10";
const iconBadge =
  "mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blush-100 text-ink";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(formData: FormData) {
    if (!token) return setError("Invalid token.");
    setLoading(true);
    formData.append("token", token);
    const result = await resetPasswordAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/admin/login"), 3000);
    }
  }

  if (!token) {
    return (
      <div className={`${cardClass} text-center`} role="alert">
        <span className={`${iconBadge} text-red-600`} aria-hidden="true">
          <PiWarningCircleLight className="h-7 w-7" />
        </span>
        <h1 className="mb-2 text-3xl font-display text-ink">Invalid reset link</h1>
        <p className="mb-8 text-sm leading-relaxed text-ink-muted">
          This link is incomplete or has expired. Request a new one to continue.
        </p>
        <Button href="/admin/forgot-password" variant="outline" className="w-full">
          Request a new link
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className={`${cardClass} text-center`} role="status">
        <span className={iconBadge} aria-hidden="true">
          <PiCheckLight className="h-7 w-7" />
        </span>
        <h1 className="mb-2 text-3xl font-display text-ink">Password reset</h1>
        <p className="mb-8 text-sm leading-relaxed text-ink-muted">
          Your password has been updated. Redirecting you to login...
        </p>
        <Link
          href="/admin/login"
          className="text-sm text-rose-500 underline-offset-4 hover:underline focus:outline-none focus-visible:underline"
        >
          Go to login now
        </Link>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <span className={iconBadge} aria-hidden="true">
        <PiLockKeyLight className="h-7 w-7" />
      </span>
      <h1 className="mb-2 text-center text-3xl font-display text-ink">Set new password</h1>
      <p className="mb-8 text-center text-sm leading-relaxed text-ink-muted">
        Choose a strong password to secure your admin account.
      </p>

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
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
            New password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={15}
              autoComplete="new-password"
              aria-describedby="password-hint"
              disabled={loading}
              className="w-full rounded-xl border border-border-strong bg-white py-3 pl-4 pr-12 text-ink transition-colors focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 disabled:opacity-60"
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
          <p id="password-hint" className="mt-2 text-xs text-ink-muted">
            Minimum 15 characters.
          </p>
        </div>

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Reset password"}
        </Button>
      </form>
    </div>
  );
}