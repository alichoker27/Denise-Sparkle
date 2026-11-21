"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AdminUser, FirstPurchaseOffer } from "@/generated/prisma/client";
import { updateNameAction, updatePasswordAction, updateOfferAction } from "./actions";

export default function SettingsClient({ admin, offer }: { admin: AdminUser; offer: FirstPurchaseOffer | null }) {
  const [msg, setMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAction(action: (fd: FormData) => Promise<any>, formData: FormData) {
    setLoading(true);
    setMsg(null);
    const res = await action(formData);
    setLoading(false);
    if (res?.error) setMsg({ type: "error", text: res.error });
    if (res?.success) setMsg({ type: "success", text: res.success });
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {msg && <div className={`p-3 rounded-xl text-sm border ${msg.type === "error" ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-green-600 border-green-200"}`}>{msg.text}</div>}

      {/* Name Form */}
      <form action={(fd) => handleAction(updateNameAction, fd)} className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
        <h2 className="font-display text-lg text-ink">Profile</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Display Name</label>
          <input name="name" defaultValue={admin.name} required className="w-full px-4 py-2 rounded-xl border border-border" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email (Read-Only)</label>
          <input value={admin.email} disabled className="w-full px-4 py-2 rounded-xl border border-border bg-gray-50 text-gray-500" />
        </div>
        <Button type="submit" disabled={loading}>Update Name</Button>
      </form>

      {/* First-Purchase Offer Form */}
      <form action={(fd) => handleAction(updateOfferAction, fd)} className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
        <h2 className="font-display text-lg text-ink">First-Purchase Banner</h2>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="isEnabled" defaultChecked={offer?.isEnabled ?? false} className="w-4 h-4 text-rose-500 rounded" />
          <label className="text-sm font-medium">Enable 10% offer banner on homepage</label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Banner Message</label>
          <textarea name="message" rows={2} defaultValue={offer?.message || "Get 10% off your first purchase."} className="w-full px-4 py-2 rounded-xl border border-border" />
        </div>
        <Button type="submit" disabled={loading}>Save Offer Settings</Button>
      </form>

      {/* Password Form */}
      <form action={(fd) => handleAction(updatePasswordAction, fd)} className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
        <h2 className="font-display text-lg text-ink">Change Password</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Current Password</label>
          <input name="currentPassword" type="password" required className="w-full px-4 py-2 rounded-xl border border-border" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">New Password (Min 15 chars)</label>
          <input name="newPassword" type="password" required minLength={15} className="w-full px-4 py-2 rounded-xl border border-border" />
        </div>
        <Button type="submit" disabled={loading}>Update Password</Button>
      </form>
    </div>
  );
}