import { PostgreSqlContainer } from "@testcontainers/postgresql";
import fs from "fs";
import os from "os";
import path from "path";

export const URL_FILE = path.join(os.tmpdir(), "walletko-integration-db-url");

export default async function setup() {
  const container = await new PostgreSqlContainer("postgres:16-alpine").start();
  (global as unknown as { __PG_CONTAINER__: unknown }).__PG_CONTAINER__ =
    container;
  fs.writeFileSync(URL_FILE, container.getConnectionUri());
}

export async function teardown() {
  const container = (
    global as unknown as { __PG_CONTAINER__: { stop: () => Promise<void> } }
  ).__PG_CONTAINER__;
  if (container) {
    await container.stop();
  }
  if (fs.existsSync(URL_FILE)) {
    fs.unlinkSync(URL_FILE);
  }
}
