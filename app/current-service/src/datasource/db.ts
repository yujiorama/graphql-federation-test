import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import path from "node:path";

export type DatabaseConnection = Database.Database;

export type Database = {
  db: ReturnType<typeof drizzle>;
};

let singleton: Database | null = null;

/**
 * SQLite の接続とマイグレーションを初期化します。
 * DATABASE_URL が未設定ならインメモリ (\":memory:\") で起動します。
 */
export async function initDb(): Promise<Database> {
  if (singleton) return singleton;

  const sqlite = new Database(process.env.DATABASE_URL)
  const db = drizzle(sqlite, {});

const migrationsFolder = path.resolve(process.cwd(), "drizzle");

    // プログラムからマイグレーションを適用（初回のみ）
  await migrate(db, { migrationsFolder });

  singleton = { db };
  return singleton;
}
