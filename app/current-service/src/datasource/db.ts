import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

export type DbSqlite = import("better-sqlite3").Database;

type DbSingleton = {
  sqlite: DbSqlite;
  db: ReturnType<typeof drizzle>;
};

let singleton: DbSingleton | null = null;

/**
 * SQLite の接続とマイグレーションを初期化します。
 * SQLITE_PATH が未設定ならインメモリ (\":memory:\") で起動します。
 */
export async function initDb(): Promise<DbSingleton> {
  if (singleton) return singleton;

  const dbFile = process.env.SQLITE_PATH || ":memory:";
  const sqlite = new Database(dbFile);
  const db = drizzle(sqlite);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const migrationsFolder = resolve(__dirname, "../../drizzle");

  // プログラムからマイグレーションを適用（初回のみ）
  migrate(db, { migrationsFolder });

  singleton = { sqlite, db };
  return singleton;
}
