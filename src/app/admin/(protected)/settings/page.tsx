import { connection } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { db } from "@/lib/db";
import SettingsClient from "./SettingsClient";

export const instant = false;

export default async function SettingsPage() {
  await connection();

  const admin = await requireAdmin();
  const offer = await db.firstPurchaseOffer.findFirst();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-display leading-tight text-ink md:text-4xl">Settings</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Manage your profile, the homepage offer and your password.
        </p>
      </header>
      <SettingsClient admin={admin} offer={offer} />
    </div>
  );
}