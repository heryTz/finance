"use server";

import { createServerFn } from "@tanstack/react-start";
import { UpdateUserNameService } from "src/server/application/user/update-user-name.service";
import { authMiddleware } from "src/server/auth/middleware";
import { DrizzleUserRepository } from "src/server/infrastructure/user/drizzle-user.repository";
import { z } from "zod";

export const updateUserNameFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ name: z.string().trim().min(1) }))
  .handler(async ({ data, context }) => {
    await new UpdateUserNameService({
      userRepo: new DrizzleUserRepository(),
    }).execute({ userId: context.session.user.id, name: data.name });
  });
