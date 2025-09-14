import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import Database from "better-sqlite3";

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

  const db = drizzle(process.env.DATABASE_URL);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const migrationsFolder = resolve(__dirname, "../../drizzle");

  // プログラムからマイグレーションを適用（初回のみ）
  migrate(db, { migrationsFolder });

  singleton = { db };
  return singleton;
}
