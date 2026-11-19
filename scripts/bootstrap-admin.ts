import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({ connectionString: process.env.DIRECT_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
    process.exit(1);
  }

  if (password.length < 15) {
    console.error("❌ ADMIN_PASSWORD must be at least 15 characters long.");
    process.exit(1);
  }

  const normalizedEmail = email.toLowerCase().trim();
  console.log(`Checking for admin account: ${normalizedEmail}...`);

  // Check if the user already exists
  const existing = await db.adminUser.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    console.log("⚠️ Admin account already exists in the database.");
    console.log(`Email: ${existing.email}`);
    console.log("If you want to reset the password, delete the user in Prisma Studio and run this script again.");
    process.exit(0); // Exit without making changes
  }

  console.log("Creating new admin account...");
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await db.adminUser.create({
    data: {
      email: normalizedEmail,
      name: "Denise",
      passwordHash,
      emailVerified: true,
      role: "admin",
      isActive: true,
    },
  });

  console.log("✅ Admin account seeded successfully!");
  console.log(`Email: ${admin.email}`);
  console.log(`Role: ${admin.role}`);
}

main()
  .catch((e) => {
    console.error("Bootstrap failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });