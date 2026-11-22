"use client";

import { useEffect, useState, type ComponentProps } from "react";
import Link from "next/link";
import { PiListLight, PiSignOutLight, PiStorefrontLight, PiXLight } from "react-icons/pi";
import { AdminNav } from "./AdminNav";

export function AdminMobileBar({
  adminName,
  logout,
}: {
  adminName: string;
  logout: ComponentProps<"form">["action"];
}) {
  const [open, setOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white md:hidden">
      <div className="flex h-16 items-center justify-between gap-4 px-4">
        <div className="min-w-0">
          <p className="font-display text-lg leading-none text-ink">Admin panel</p>
          <p className="mt-1 truncate text-xs text-ink-muted">Logged in as {adminName}</p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="admin-mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-strong text-ink transition-colors hover:bg-blush-50"
        >
          {open ? (
            <PiXLight className="h-6 w-6" aria-hidden="true" />
          ) : (
            <PiListLight className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {open && (
        <>
          {/* Backdrop: tap outside to close */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="fixed inset-x-0 bottom-0 top-16 bg-black/20"
          />

          <div
            id="admin-mobile-menu"
            className="absolute inset-x-0 top-full border-b border-border bg-white px-4 pb-4 pt-3 shadow-card"
          >
            <AdminNav onNavigate={() => setOpen(false)} />

            <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="focus-ring flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-blush-50 hover:text-ink"
              >
                <PiStorefrontLight className="h-5 w-5" aria-hidden="true" />
                View store
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                >
                  <PiSignOutLight className="h-5 w-5" aria-hidden="true" />
                  Log out
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </header>
  );
}