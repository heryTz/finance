"use server";

import { saveProviderInputSchema } from "./provider-dto";
import {
  createProvider,
  deleteProvider,
  updateProvider,
} from "./provider-service";
import { revalidatePath } from "next/cache";
import { routes } from "@/app/routes";
import { authActionClient } from "@/lib/safe-action";
import { z } from "zod";

export const createProviderAction = authActionClient
  .schema(saveProviderInputSchema)
  .action(async ({ parsedInput, ctx }) => {
    const provider = await createProvider(ctx.user.id, parsedInput);
    revalidatePath(routes.invoice());
    return provider;
  });

export const updateProviderAction = authActionClient
  .schema(saveProviderInputSchema)
  .bindArgsSchemas([z.string()])
  .action(async ({ parsedInput, ctx, bindArgsParsedInputs: [id] }) => {
    const provider = await updateProvider(ctx.user.id, id, parsedInput);
    revalidatePath(routes.invoice());
    return provider;
  });

export const deleteProviderAction = authActionClient
  .schema(z.string())
  .action(async ({ parsedInput, ctx }) => {
    const provider = await deleteProvider(ctx.user.id, parsedInput);
    revalidatePath(routes.invoice());
    return provider;
  });
