"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import {
  PiGearSixLight,
  PiGiftLight,
  PiPackageLight,
  PiSquaresFourLight,
} from "react-icons/pi";
import { cn } from "@/lib/cn";

const items: { href: string; label: string; icon: IconType; exact?: boolean }[] = [
  { href: "/admin", label: "Dashboard", icon: PiSquaresFourLight, exact: true },
  { href: "/admin/products", label: "Products", icon: PiPackageLight },
  { href: "/admin/bundles", label: "Bundles", icon: PiGiftLight },
  { href: "/admin/settings", label: "Settings", icon: PiGearSixLight },
];

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() ?? "";

  return (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "focus-ring flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors duration-200 md:py-2",
              active
                ? "bg-blush-100 text-ink"
                : "text-ink-soft hover:bg-blush-50 hover:text-ink"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}