import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth/require-admin";

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-soft" />}>
      <AdminDashboardContent />
    </Suspense>
  );
}

async function AdminDashboardContent() {
  const admin = await requireAdmin();

  return (
    <div>
      <h1 className="text-3xl font-display text-ink mb-6">Welcome, {admin.name}</h1>
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
        <p className="text-ink-soft">
          This is your protected dashboard. Only you can see this page.
        </p>
      </div>
    </div>
  );
}
