import { requireAdmin } from "@/lib/auth/require-admin";
import { Button } from "@/components/ui/Button";
import { connection } from "next/server";
import { PiPlusLight, PiShieldCheckLight } from "react-icons/pi";

export const instant = false;

export default async function AdminDashboard() {
  await connection();
  const admin = await requireAdmin();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-display leading-tight text-ink md:text-4xl">
          Welcome back, {admin.name}
        </h1>
        <p className="mt-2 text-ink-muted">Here is a quick overview of your store.</p>
      </header>

      {/* Overview */}
      <section
        aria-label="Store overview"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6"
      >
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-ink-muted">Active sessions</p>
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blush-100 text-ink"
              aria-hidden="true"
            >
              <PiShieldCheckLight className="h-5 w-5" />
            </span>
          </div>
          <p className="text-3xl font-display text-ink">1</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section
        aria-labelledby="quick-actions"
        className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6"
      >
        <h2 id="quick-actions" className="mb-5 text-xl font-display text-ink">
          Quick actions
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button href="/admin/products/new" className="w-full sm:w-auto">
            <span className="inline-flex items-center justify-center gap-2">
              <PiPlusLight className="h-4 w-4" aria-hidden="true" />
              Add new product
            </span>
          </Button>
          <Button href="/admin/bundles" variant="outline" className="w-full sm:w-auto">
            Manage bundles
          </Button>
        </div>
      </section>
    </div>
  );
}