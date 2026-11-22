"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { MenuIcon, CloseIcon } from "@/components/icons/Icons";

const navLinks = [
  { name: "Shop", href: "/shop" },
  { name: "Collections", href: "/collections" },
  { name: "ABOUT US", href: "/about", hasDropdown: false },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center">
     <button
  onClick={() => setIsOpen(!isOpen)}
  className="p-2 text-ink focus-ring rounded-md"
  aria-label={isOpen ? "Close menu" : "Open menu"}
  aria-expanded={isOpen}
  aria-controls="mobile-menu"
>
  {isOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
</button>

      {isOpen && createPortal(
        <div
          className="fixed inset-x-0 bottom-0 top-20 z-[60] bg-surface-soft/95 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <nav id="mobile-menu" aria-label="Mobile navigation" className="flex flex-col space-y-4 p-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-ink hover:text-rose-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>,
        document.body,
      )}
    </div>
  );
}