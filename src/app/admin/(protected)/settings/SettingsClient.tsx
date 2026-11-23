"use client";

import { useState } from "react";
import type { IconType } from "react-icons";
import {
  PiEyeLight,
  PiEyeSlashLight,
  PiLockKeyLight,
  PiTagLight,
  PiUserLight,
} from "react-icons/pi";
import { Button } from "@/components/ui/Button";
import { AdminUser, FirstPurchaseOffer } from "@/generated/prisma/client";
import { DEFAULT_FIRST_PURCHASE_OFFER } from "@/lib/offer-defaults";
import { updateNameAction, updatePasswordAction, updateOfferAction } from "./actions";

type ActionResult = { error?: string; success?: string };

const labelClass = "mb-1.5 block text-sm font-medium text-ink";
const inputClass =
  "w-full rounded-xl border border-border-strong bg-white px-4 py-3 text-ink transition-colors focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 disabled:opacity-60";
const cardClass = "rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6 lg:p-8";

function CardHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: IconType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blush-100 text-ink"
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <h2 className="font-display text-lg leading-tight text-ink">{title}</h2>
        <p className="mt-1 text-sm text-ink-muted">{description}</p>
      </div>
    </div>
  );
}

function PasswordField({
  id,
  name,
  label,
  autoComplete,
  minLength,
  hint,
}: {
  id: string;
  name: string;
  label: string;
  autoComplete: string;
  minLength?: number;
  hint?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`${inputClass} pr-12`}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={show}
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
        >
          {show ? (
            <PiEyeSlashLight className="h-5 w-5" aria-hidden="true" />
          ) : (
            <PiEyeLight className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-ink-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

export default function SettingsClient({ admin, offer }: { admin: AdminUser; offer: FirstPurchaseOffer | null }) {
  const [msg, setMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAction(action: (fd: FormData) => Promise<ActionResult>, formData: FormData) {
    setLoading(true);
    setMsg(null);
    const res = await action(formData);
    setLoading(false);
    if (res?.error) setMsg({ type: "error", text: res.error });
    if (res?.success) setMsg({ type: "success", text: res.success });
  }

  return (
    <div className="max-w-6xl space-y-6">
      {/* Feedback: sticky so it stays visible after submitting a form further down the page */}
      {msg && (
        <div
          role={msg.type === "error" ? "alert" : "status"}
          className={`sticky top-20 z-30 rounded-xl border p-3.5 text-sm shadow-sm md:top-4 ${
            msg.type === "error"
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Name Form */}
        <form
          action={(fd) => handleAction(updateNameAction, fd)}
          aria-busy={loading}
          className={`${cardClass} space-y-5 lg:col-start-1 lg:row-start-1`}
        >
          <CardHeader
            icon={PiUserLight}
            title="Profile"
            description="Your display name is shown in the admin panel."
          />
          <div>
            <label htmlFor="name" className={labelClass}>
              Display name
            </label>
            <input id="name" name="name" defaultValue={admin.name} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email <span className="font-normal text-ink-muted">(read-only)</span>
            </label>
            <input
              id="email"
              value={admin.email}
              disabled
              className="w-full rounded-xl border border-border bg-gray-50 px-4 py-3 text-gray-500"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            Update name
          </Button>
        </form>

        {/* First-Purchase Offer Form */}
        <form
          action={(fd) => handleAction(updateOfferAction, fd)}
          aria-busy={loading}
          className={`${cardClass} space-y-5 lg:col-span-2 lg:row-start-2`}
        >
          <CardHeader
            icon={PiTagLight}
            title="First-purchase banner"
            description="Control the promotional banner shown on the homepage."
          />
          <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-soft/60 p-4">
            <input
              id="isEnabled"
              type="checkbox"
              name="isEnabled"
              defaultChecked={offer?.isEnabled ?? DEFAULT_FIRST_PURCHASE_OFFER.isEnabled}
              className="mt-0.5 h-5 w-5 shrink-0 rounded accent-rose-500"
            />
            <label htmlFor="isEnabled" className="text-sm font-medium text-ink">
              Enable 10% offer banner on homepage
            </label>
          </div>
          <div>
            <label htmlFor="message" className={labelClass}>
              Banner message
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              defaultValue={offer?.message || DEFAULT_FIRST_PURCHASE_OFFER.message}
              className={inputClass}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            Save offer settings
          </Button>
        </form>

        {/* Password Form */}
        <form
          action={(fd) => handleAction(updatePasswordAction, fd)}
          aria-busy={loading}
          className={`${cardClass} space-y-5 lg:col-start-2 lg:row-start-1`}
        >
          <CardHeader
            icon={PiLockKeyLight}
            title="Change password"
            description="Enter your current password, then choose a new one."
          />
          <PasswordField
            id="currentPassword"
            name="currentPassword"
            label="Current password"
            autoComplete="current-password"
          />
          <PasswordField
            id="newPassword"
            name="newPassword"
            label="New password"
            autoComplete="new-password"
            minLength={15}
            hint="Minimum 15 characters."
          />
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            Update password
          </Button>
        </form>
      </div>
    </div>
  );
}