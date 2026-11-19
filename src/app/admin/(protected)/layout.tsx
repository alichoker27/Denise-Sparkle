import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth/require-admin";
import Link from "next/link";
import { logoutAction } from "./actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-soft" />}>
      <AuthenticatedAdminLayout>{children}</AuthenticatedAdminLayout>
    </Suspense>
  );
}

async function AuthenticatedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-surface-soft flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-border p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="font-display text-xl text-ink">Admin Panel</h1>
          <p className="text-xs text-ink-muted mt-1">Logged in as {admin.name}</p>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          <Link href="/admin" className="text-sm font-medium text-ink-soft hover:text-ink p-2 rounded-lg hover:bg-blush-50 transition-colors">Dashboard</Link>
          <Link href="/admin/products" className="text-sm font-medium text-ink-soft hover:text-ink p-2 rounded-lg hover:bg-blush-50 transition-colors">Products</Link>
          <Link href="/admin/bundles" className="text-sm font-medium text-ink-soft hover:text-ink p-2 rounded-lg hover:bg-blush-50 transition-colors">Bundles</Link>
          <Link href="/admin/settings" className="text-sm font-medium text-ink-soft hover:text-ink p-2 rounded-lg hover:bg-blush-50 transition-colors">Settings</Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <form action={logoutAction}>
            <button type="submit" className="w-full text-left text-sm font-medium text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors">
              Log out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}