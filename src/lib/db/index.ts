import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import * as schema from "./schema";

const defaultPath = path.join(process.cwd(), "data", "ledger.db");

function resolveDbPath(): string {
  const fromEnv = process.env.DATABASE_PATH;
  if (fromEnv) {
    return path.isAbsolute(fromEnv) ? fromEnv : path.join(process.cwd(), fromEnv);
  }
  return defaultPath;
}

let sqlite: Database.Database | null = null;

export function getDb() {
  if (!sqlite) {
    const dbPath = resolveDbPath();
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    sqlite = new Database(dbPath);
    sqlite.pragma("journal_mode = WAL");
  }
  return drizzle(sqlite, { schema });
}

export type Db = ReturnType<typeof getDb>;
export { schema };
