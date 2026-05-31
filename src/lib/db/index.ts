import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
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

function resolveMigrationsFolder(): string {
  const candidates = [
    path.join(process.cwd(), "drizzle"),
    path.join(process.cwd(), "..", "drizzle"),
  ];
  for (const folder of candidates) {
    if (fs.existsSync(path.join(folder, "meta", "_journal.json"))) {
      return folder;
    }
  }
  throw new Error(
    "Drizzle migrations not found. Run from the 0ERO project root (npm run dev:clean).",
  );
}

function runMigrations(db: ReturnType<typeof drizzle>, sqlite: Database.Database): void {
  const migrationsFolder = resolveMigrationsFolder();
  try {
    migrate(db, { migrationsFolder });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const hasMigrationTable = sqlite
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='__drizzle_migrations'",
      )
      .get();

    if (hasMigrationTable && message.includes("already exists")) {
      return;
    }

    throw new Error(
      `Database migration failed: ${message}. If upgrading, try: rm data/ledger.db && npm run dev:clean`,
    );
  }
}

let sqlite: Database.Database | null = null;
let migrated = false;

export function getDb() {
  if (!sqlite) {
    const dbPath = resolveDbPath();
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    sqlite = new Database(dbPath);
    sqlite.pragma("journal_mode = WAL");
  }

  const db = drizzle(sqlite, { schema });

  if (!migrated) {
    runMigrations(db, sqlite);
    migrated = true;
  }

  return db;
}

export type Db = ReturnType<typeof getDb>;
export { schema };
