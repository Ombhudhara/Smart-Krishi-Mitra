/**
 * seedUsers.js
 *
 * Standalone seed script for Smart Krishi Mitra.
 * Inserts:
 *   – 3 Farmers   : ombhudhara001 – ombhudhara003
 *   – 5 Vendors   : hemanshukacha001 – hemanshukacha005
 *   – 10 Customers: mayank001 – mayank010
 *
 * Default password for ALL users: 123456
 * Password is automatically hashed by User model's pre-save hook (bcryptjs, salt=10).
 *
 * Usage (run from the Backend/ directory):
 *   node seedUsers.js
 *
 * The script will SKIP any user whose email already exists in the DB.
 */

import "./src/db/loadEnv.js";          // loads .env via dotenv
import mongoose from "mongoose";
import { DB_NAME } from "./src/db/constants.js";
import User from "./src/models/User.js";

// ─── Connection ───────────────────────────────────────────────────────────────

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌  MONGO_URI is not set in .env");
  process.exit(1);
}

// ─── User Definitions ─────────────────────────────────────────────────────────

const DEFAULT_PASSWORD = "123456";

/** Helper – pad a number to 3 digits: 1 → "001" */
const pad = (n) => String(n).padStart(3, "0");

// 3 Farmers ─ ombhudhara001 … ombhudhara003
const farmers = Array.from({ length: 3 }, (_, i) => {
  const idx = pad(i + 1);
  return {
    fullName: `Om Bhudhara ${idx}`,
    email: `ombhudhara${idx}@krishimitra.com`,
    phone: `9000000${100 + i}`,          // 9000000100 – 9000000102
    password: DEFAULT_PASSWORD,
    role: "Farmer",
    state: "Gujarat",
    district: "Surat",
    village: `Village ${idx}`,
    farmName: `Om Farm ${idx}`,
    farmSize: "4 Acres",
    soilType: "Alluvial",
    cropsGrown: ["Wheat", "Cotton"],
    accountStatus: "Active",
    preferredLanguage: "Gujarati",
  };
});

// 5 Vendors ─ hemanshukacha001 … hemanshukacha005
const vendors = Array.from({ length: 5 }, (_, i) => {
  const idx = pad(i + 1);
  return {
    fullName: `Hemanshu Kacha ${idx}`,
    email: `hemanshukacha${idx}@krishimitra.com`,
    phone: `9100000${100 + i}`,          // 9100000100 – 9100000104
    password: DEFAULT_PASSWORD,
    role: "Vendor",
    state: "Gujarat",
    district: "Ahmedabad",
    address: `${idx} Commerce Park, Ahmedabad`,
    accountStatus: "Active",
    preferredLanguage: "Gujarati",
  };
});

// 10 Customers ─ mayank001 … mayank010
const customers = Array.from({ length: 10 }, (_, i) => {
  const idx = pad(i + 1);
  return {
    fullName: `Mayank ${idx}`,
    email: `mayank${idx}@krishimitra.com`,
    phone: `9200000${100 + i}`,          // 9200000100 – 9200000109
    password: DEFAULT_PASSWORD,
    role: "Customer",
    state: "Rajasthan",
    district: "Jaipur",
    accountStatus: "Active",
    preferredLanguage: "Hindi",
  };
});

const ALL_USERS = [...farmers, ...vendors, ...customers];

// ─── Main ─────────────────────────────────────────────────────────────────────

(async () => {
  try {
    console.log("🔌  Connecting to MongoDB …");
    await mongoose.connect(`${MONGO_URI}/${DB_NAME}`);
    console.log(`✅  Connected → ${DB_NAME}\n`);

    let created = 0;
    let skipped = 0;

    for (const userData of ALL_USERS) {
      const exists = await User.findOne({ email: userData.email });

      if (exists) {
        console.log(`⚠️   SKIP  – ${userData.email} already exists`);
        skipped++;
        continue;
      }

      // User.create() triggers the pre-save hook → password is hashed automatically
      const newUser = await User.create(userData);
      console.log(
        `✅  CREATED [${newUser.role.padEnd(8)}] ${newUser.fullName.padEnd(25)} │ ${newUser.email}`
      );
      created++;
    }

    console.log("\n─────────────────────────────────────────────────");
    console.log(`  Total users processed : ${ALL_USERS.length}`);
    console.log(`  ✅ Created            : ${created}`);
    console.log(`  ⚠️  Skipped (exist)   : ${skipped}`);
    console.log("─────────────────────────────────────────────────");
    console.log("\n🌱  Seed complete. All passwords are hashed (bcrypt, salt=10).");
    console.log("🔑  Default login password for ALL seeded users: 123456\n");

  } catch (err) {
    console.error("❌  Seed script failed:", err.message || err);
  } finally {
    await mongoose.connection.close();
    console.log("🔌  MongoDB connection closed.");
    process.exit(0);
  }
})();
