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
    <div>
      <h1 className="text-2xl font-display text-ink mb-6">Settings</h1>
      <SettingsClient admin={admin} offer={offer} />
    </div>
  );
}