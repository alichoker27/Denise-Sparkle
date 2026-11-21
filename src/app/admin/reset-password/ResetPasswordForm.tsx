"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { resetPasswordAction } from "./actions";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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

  if (!token) return <div className="text-red-500">Invalid reset link.</div>;
  if (success) return <div className="text-green-600 text-center">Password reset! Redirecting...</div>;

  return (
    <div className="bg-white p-8 rounded-3xl shadow-card w-full max-w-md border border-border">
      <h1 className="text-2xl font-display mb-6 text-center">Set New Password</h1>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <form action={handleSubmit} className="space-y-4">
        <input name="password" type="password" required minLength={15} placeholder="New Password (Min 15 chars)" className="w-full px-4 py-3 rounded-xl border border-border" />
        <Button type="submit" disabled={loading} className="w-full">{loading ? "Saving..." : "Reset Password"}</Button>
      </form>
    </div>
  );
}