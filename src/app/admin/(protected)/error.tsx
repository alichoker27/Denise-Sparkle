"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-200 max-w-md w-full">
        <h2 className="text-2xl font-display mb-2">Something went wrong</h2>
        <p className="text-sm mb-6">
          We encountered an error while loading the admin panel. Please try again.
        </p>
        <Button onClick={() => reset()} className="w-full">
          Try Again
        </Button>
      </div>
    </div>
  );
}