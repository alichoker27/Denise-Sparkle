"use client";

import { useState } from "react";
import Link from "next/link";
import { loginAction } from "./actions";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-surface-soft p-4">
      <div className="bg-white p-8 rounded-3xl shadow-card w-full max-w-md border border-border">
        <h1 className="text-2xl font-display text-ink mb-2 text-center">Admin Login</h1>
        <p className="text-ink-muted text-sm text-center mb-6">Sign in to manage your store.</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 text-center border border-red-200">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl border border-border focus:ring-rose-500 focus:border-rose-500" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Password</label>
              {/* <Link href="/admin/forgot-password" className="text-xs text-rose-500 hover:underline">Forgot?</Link> */}
            </div>
            <input name="password" type="password" required className="w-full px-4 py-3 rounded-xl border border-border focus:ring-rose-500 focus:border-rose-500" />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Authenticating..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}