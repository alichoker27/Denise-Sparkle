import { requireAdmin } from "@/lib/auth/require-admin";
import { connection } from "next/server";
import Link from "next/link";
import { PiSignOutLight, PiStorefrontLight } from "react-icons/pi";
import { logoutAction } from "./actions";
import { AdminNav } from "./AdminNav";
import { AdminMobileBar } from "./AdminMobileBar";

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-surface-soft md:flex-row">
      {/* Mobile: top bar with menu icon */}
      <AdminMobileBar adminName={admin.name} logout={logoutAction} />

      {/* Desktop: sidebar */}
      <aside className="hidden border-r border-border bg-white p-6 md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col md:overflow-y-auto">
        <div className="mb-8">
          <p className="font-display text-xl leading-none text-ink">Admin panel</p>
          <p className="mt-1.5 truncate text-xs text-ink-muted">Logged in as {admin.name}</p>
        </div>

        <div className="flex-1">
          <AdminNav />
        </div>

        <div className="mt-auto flex flex-col gap-1 border-t border-border pt-6">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-blush-50 hover:text-ink"
          >
            <PiStorefrontLight className="h-5 w-5" aria-hidden="true" />
            View store
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
            >
              <PiSignOutLight className="h-5 w-5" aria-hidden="true" />
              Log out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-10">{children}</main>
    </div>
  );
}