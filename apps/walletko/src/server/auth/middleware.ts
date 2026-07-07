"use server";

import { createMiddleware } from "@tanstack/react-start";
import { ensureSession } from "src/server/auth/session";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await ensureSession();
  return next({ context: { session } });
});
