import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";
import { Logo } from "@/components/layout/Logo";

function ResetPasswordSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="w-full max-w-md animate-pulse rounded-3xl border border-border bg-white p-6 shadow-card sm:p-10"
    >
      <div className="mx-auto mb-6 h-14 w-14 rounded-full bg-blush-50" />
      <div className="mx-auto mb-4 h-8 w-48 rounded-lg bg-blush-50" />
      <div className="mx-auto mb-8 h-4 w-64 max-w-full rounded bg-blush-50" />
      <div className="mb-5 h-12 w-full rounded-xl bg-blush-50" />
      <div className="h-12 w-full rounded-pill bg-blush-50" />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface-soft px-4 py-12">
      {/* Brand */}
      <div className="mb-10 flex justify-center">
        <Logo />
      </div>

      <Suspense fallback={<ResetPasswordSkeleton />}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}