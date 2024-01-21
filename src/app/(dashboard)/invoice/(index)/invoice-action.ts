"use server";

import { CreateInvoiceInput } from "./invoice-dto";
import { apiGuard } from "@/lib/api-guard";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInvoice, deleteInvoice, updateInvoice } from "./invoice-service";

export async function createInvoiceAction(input: CreateInvoiceInput) {
  const { user } = await apiGuard();
  await createInvoice(user.id, input);
  revalidatePath("/invoice");
  redirect("/invoice");
}

export async function updateInvoiceAction(
  id: string,
  input: CreateInvoiceInput
) {
  const { user } = await apiGuard();
  await updateInvoice(user.id, id, input);
  revalidatePath("/invoice");
  redirect("/invoice");
}

export async function deleteInvoiceAction(id: string) {
  const { user } = await apiGuard();
  await deleteInvoice(user.id, id);
  revalidatePath("/invoice");
}
