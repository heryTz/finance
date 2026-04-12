/* eslint-disable @typescript-eslint/no-explicit-any */
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import fs from "fs";
import os from "os";
import path from "path";

export const URL_FILE = path.join(os.tmpdir(), "integration-db-url");

export default async function globalSetup() {
  const container = await new PostgreSqlContainer("postgres:16-alpine").start();
  (global as any).__PG_CONTAINER__ = container;
  fs.writeFileSync(URL_FILE, container.getConnectionUri());
}
