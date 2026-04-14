import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import fs from "fs";
import path from "path";
import { Pool } from "pg";
import * as schema from "src/server/infrastructure/db/schema";
import { URL_FILE } from "../setup";

export type TestDb = ReturnType<typeof drizzle<typeof schema>>;

export async function createTestDb(
  name: string,
): Promise<{ db: TestDb; cleanup: () => Promise<void> }> {
  const baseUrl = fs.readFileSync(URL_FILE, "utf-8").trim();

  const adminPool = new Pool({ connectionString: baseUrl });
  try {
    await adminPool.query(`CREATE DATABASE "${name}"`);
  } finally {
    await adminPool.end();
  }

  const testUrl = baseUrl.replace(/\/[^/?]+(\?.*)?$/, `/${name}$1`);
  const testPool = new Pool({ connectionString: testUrl });
  const db = drizzle(testPool, { schema });

  try {
    await migrate(db, {
      migrationsFolder: path.join(
        process.cwd(),
        "src/server/infrastructure/db/migrations",
      ),
    });
  } catch (error) {
    await testPool.end();
    throw error;
  }

  const cleanup = async () => {
    await testPool.end();
    const dropPool = new Pool({ connectionString: baseUrl });
    await dropPool.query(`DROP DATABASE "${name}"`);
    await dropPool.end();
  };

  return { db, cleanup };
}
