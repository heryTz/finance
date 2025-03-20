"use server";

import { createInvoiceSchema, sendInvoiceMailInputSchema } from "./invoice-dto";
import { revalidatePath } from "next/cache";
import {
  createInvoice,
  deleteInvoice,
  sendInvoiceMail,
  updateInvoice,
} from "./invoice-service";
import { routes } from "@/app/routes";
import { authActionClient } from "@/lib/safe-action";
import { z } from "zod";

export const createInvoiceAction = authActionClient
  .schema(createInvoiceSchema)
  .action(async ({ parsedInput, ctx }) => {
    await createInvoice(ctx.user.id, parsedInput);
    revalidatePath(routes.invoice());
    return { error: null };
  });

export const updateInvoiceAction = authActionClient
  .schema(createInvoiceSchema)
  .bindArgsSchemas([z.string()])
  .action(async ({ parsedInput, ctx, bindArgsParsedInputs: [id] }) => {
    await updateInvoice(ctx.user.id, id, parsedInput);
    revalidatePath(routes.invoice());
    return { error: null };
  });

export const deleteInvoiceAction = authActionClient
  .schema(z.string())
  .action(async ({ parsedInput, ctx }) => {
    await deleteInvoice(ctx.user.id, parsedInput);
    revalidatePath(routes.invoice());
    return { error: null };
  });

export const sendInvoiceMailAction = authActionClient
  .schema(sendInvoiceMailInputSchema)
  .bindArgsSchemas([z.string()])
  .action(async ({ parsedInput, ctx, bindArgsParsedInputs: [id] }) => {
    await sendInvoiceMail(ctx.user.id, id, parsedInput);
    return { error: null };
  });
