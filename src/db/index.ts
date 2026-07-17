import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  // We'll throw an error if DATABASE_URL is missing on execution, but during build or local simulation we should handle it gracefully
  console.warn("DATABASE_URL is not set. Database integrations will fall back to local client state.");
}

const connectionString = process.env.DATABASE_URL || "";
const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
export type DbClient = typeof db;
export * from "./schema";
