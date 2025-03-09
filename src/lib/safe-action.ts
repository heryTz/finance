import { createSafeActionClient } from "next-safe-action";
import { fetchSession } from "./auth";
import { UnauthorizedError } from "./exception";

export const actionClient = createSafeActionClient({});

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await fetchSession();
  if (session == null) {
    throw new UnauthorizedError();
  }
  return next({ ctx: session });
});
