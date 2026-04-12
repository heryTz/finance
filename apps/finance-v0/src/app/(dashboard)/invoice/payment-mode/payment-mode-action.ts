"use server";

import { createPaymentModeSchema } from "./payment-mode-dto";
import { revalidatePath } from "next/cache";
import {
  createPaymentMode,
  deletePaymentMode,
  updatePaymentMode,
} from "./payment-mode-service";
import { routes } from "@/app/routes";
import { authActionClient } from "@/lib/safe-action";
import { z } from "zod/v4";

export const createPaymentModeAction = authActionClient
  .inputSchema(createPaymentModeSchema)
  .action(async ({ parsedInput, ctx }) => {
    const payment = await createPaymentMode(ctx.user.id, parsedInput);
    revalidatePath(routes.invoice());
    return payment;
  });

export const updatePaymentModeAction = authActionClient
  .inputSchema(createPaymentModeSchema)
  .bindArgsSchemas([z.string()])
  .action(async ({ parsedInput, ctx, bindArgsParsedInputs: [id] }) => {
    const payment = await updatePaymentMode(ctx.user.id, id, parsedInput);
    revalidatePath(routes.invoice());
    return payment;
  });

export const deletePaymentModeAction = authActionClient
  .inputSchema(z.string())
  .action(async ({ parsedInput, ctx }) => {
    const payment = await deletePaymentMode(ctx.user.id, parsedInput);
    revalidatePath(routes.invoice());
    return payment;
  });
