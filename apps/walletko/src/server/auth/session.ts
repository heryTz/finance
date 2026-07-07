"use server";

import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "src/server/auth/auth";

export const getSession = createServerFn({ method: "GET" }).handler(() =>
  auth.api.getSession({ headers: getRequestHeaders() }),
);

export const ensureSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await auth.api.getSession({ headers: getRequestHeaders() });
    if (!session) throw redirect({ to: "/login" });
    return session;
  },
);
