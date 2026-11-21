import { requireAdmin } from "@/lib/auth/require-admin";
//import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { connection } from "next/server";

export const instant = false;

export default async function AdminDashboard() {
  await connection();
  const admin = await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-ink">Welcome back, {admin.name}</h1>
        <p className="text-ink-muted mt-1">Here is a quick overview of your store.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Cards */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <p className="text-sm font-medium text-ink-muted mb-1">Total Products</p>
          <p className="text-3xl font-display text-ink">--</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <p className="text-sm font-medium text-ink-muted mb-1">Published Bundles</p>
          <p className="text-3xl font-display text-ink">--</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <p className="text-sm font-medium text-ink-muted mb-1">Active Sessions</p>
          <p className="text-3xl font-display text-ink">1</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
        <h2 className="text-xl font-display text-ink mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button href="/admin/products/new">Add New Product</Button>
          <Button href="/admin/bundles" variant="outline">Manage Bundles</Button>
        </div>
      </div>
    </div>
  );
}