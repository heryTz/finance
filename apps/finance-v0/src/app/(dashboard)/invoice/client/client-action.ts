"use server";

import { saveClientInputSchema } from "./client-dto";
import { createClient, deleteClient, updateClient } from "./client-service";
import { revalidatePath } from "next/cache";
import { routes } from "@/app/routes";
import { authActionClient } from "@/lib/safe-action";
import { z } from "zod/v4";

export const createClientAction = authActionClient
  .inputSchema(saveClientInputSchema)
  .action(async ({ parsedInput, ctx }) => {
    const client = await createClient(ctx.user.id, parsedInput);
    revalidatePath(routes.invoice());
    return client;
  });

export const updateClientAction = authActionClient
  .inputSchema(saveClientInputSchema)
  .bindArgsSchemas([z.string()])
  .action(async ({ parsedInput, ctx, bindArgsParsedInputs: [id] }) => {
    const client = await updateClient(ctx.user.id, id, parsedInput);
    revalidatePath(routes.invoice());
    return client;
  });

export const deleteClientAction = authActionClient
  .inputSchema(z.string())
  .action(async ({ parsedInput, ctx }) => {
    const client = await deleteClient(ctx.user.id, parsedInput);
    revalidatePath(routes.invoice());
    return client;
  });
