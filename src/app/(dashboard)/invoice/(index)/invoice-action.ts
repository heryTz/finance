"use server";

import {
  CreateInvoiceInput,
  SendInvoiceMailInput,
  createInvoiceSchema,
  sendInvoiceMailInputSchema,
} from "./invoice-dto";
import { apiGuard } from "@/lib/api-guard";
import { revalidatePath } from "next/cache";
import {
  createInvoice,
  deleteInvoice,
  sendInvoiceMail,
  updateInvoice,
} from "./invoice-service";
import { routes } from "@/app/routes";

export async function createInvoiceAction(input: CreateInvoiceInput) {
  const { user } = await apiGuard();
  const data = createInvoiceSchema.parse(input);
  await createInvoice(user.id, data);
  revalidatePath(routes.invoice());
}

export async function updateInvoiceAction(
  id: string,
  input: CreateInvoiceInput,
) {
  const { user } = await apiGuard();
  const data = createInvoiceSchema.parse(input);
  await updateInvoice(user.id, id, data);
  revalidatePath(routes.invoice());
}

export async function deleteInvoiceAction(id: string) {
  const { user } = await apiGuard();
  await deleteInvoice(user.id, id);
  revalidatePath(routes.invoice());
}

export async function sendInvoiceMailAction(
  id: string,
  input: SendInvoiceMailInput,
) {
  const { user } = await apiGuard();
  const data = sendInvoiceMailInputSchema.parse(input);
  await sendInvoiceMail(user.id, id, data);
}
