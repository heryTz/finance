"use server";

import { saveOperationInputSchema } from "./operation-dto";
import {
  createOperation,
  deleteOperation,
  updateOperation,
} from "./operation-service";
import { revalidatePath } from "next/cache";
import { routes } from "@/app/routes";
import { authActionClient } from "@/lib/safe-action";
import { z } from "zod";

export const createOperationAction = authActionClient
  .schema(saveOperationInputSchema)
  .action(async ({ parsedInput, ctx }) => {
    await createOperation(ctx.user.id, parsedInput);
    revalidatePath(routes.operation());
    return { error: null };
  });

export const updateOperationAction = authActionClient
  .schema(saveOperationInputSchema)
  .bindArgsSchemas([z.string()])
  .action(async ({ parsedInput, ctx, bindArgsParsedInputs: [id] }) => {
    await updateOperation(ctx.user.id, id, parsedInput);
    revalidatePath(routes.operation());
    return { error: null };
  });

export const deleteOperationAction = authActionClient
  .schema(z.string())
  .action(async ({ parsedInput, ctx }) => {
    await deleteOperation(ctx.user.id, parsedInput);
    revalidatePath(routes.operation());
    return { error: null };
  });
