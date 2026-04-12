/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import os from "os";
import path from "path";

const URL_FILE = path.join(os.tmpdir(), "integration-db-url");

export default async function globalTeardown() {
  const container = (global as any).__PG_CONTAINER__;
  if (container) {
    await container.stop();
  }
  if (fs.existsSync(URL_FILE)) {
    fs.unlinkSync(URL_FILE);
  }
}
