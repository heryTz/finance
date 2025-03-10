"use server";

import { saveClientInputSchema } from "./client-dto";
import { createClient, deleteClient, updateClient } from "./client-service";
import { revalidatePath } from "next/cache";
import { routes } from "@/app/routes";
import { authActionClient } from "@/lib/safe-action";
import { z } from "zod";

export const createClientAction = authActionClient
  .schema(saveClientInputSchema)
  .action(async ({ parsedInput, ctx }) => {
    const client = await createClient(ctx.user.id, parsedInput);
    revalidatePath(routes.invoice());
    return client;
  });

export const updateClientAction = authActionClient
  .schema(saveClientInputSchema)
  .bindArgsSchemas([z.string()])
  .action(async ({ parsedInput, ctx, bindArgsParsedInputs: [id] }) => {
    const client = await updateClient(ctx.user.id, id, parsedInput);
    revalidatePath(routes.invoice());
    return client;
  });

export const deleteClientAction = authActionClient
  .schema(z.string())
  .action(async ({ parsedInput, ctx }) => {
    const client = await deleteClient(ctx.user.id, parsedInput);
    revalidatePath(routes.invoice());
    return client;
  });
