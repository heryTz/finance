"use server";

import { apiGuard } from "@/lib/api-guard";
import { CreatePaymentModeInput } from "./payment-mode-dto";
import { revalidatePath } from "next/cache";
import {
  createPaymentMode,
  deletePaymentMode,
  updatePaymentMode,
} from "./payment-mode-service";

export async function createPaymentModeAction(input: CreatePaymentModeInput) {
  const { user } = await apiGuard();
  const payment = await createPaymentMode(user.id, input);
  revalidatePath("/invoice");
  return payment;
}

export async function updatePaymentModeAction(
  id: string,
  input: CreatePaymentModeInput
) {
  const { user } = await apiGuard();
  const payment = await updatePaymentMode(user.id, id, input);
  revalidatePath("/invoice");
  return payment;
}

export async function deletePaymentModeAction(id: string) {
  const { user } = await apiGuard();
  const payment = await deletePaymentMode(user.id, id);
  revalidatePath("/invoice");
  return payment;
}
