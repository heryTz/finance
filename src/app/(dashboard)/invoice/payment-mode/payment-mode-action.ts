"use server";

import { apiGuard } from "@/lib/api-guard";
import {
  CreatePaymentModeInput,
  createPaymentModeSchema,
} from "./payment-mode-dto";
import { revalidatePath } from "next/cache";
import {
  createPaymentMode,
  deletePaymentMode,
  updatePaymentMode,
} from "./payment-mode-service";
import { routes } from "@/app/routes";

export async function createPaymentModeAction(input: CreatePaymentModeInput) {
  const { user } = await apiGuard();
  const data = createPaymentModeSchema.parse(input);
  const payment = await createPaymentMode(user.id, data);
  revalidatePath(routes.invoice());
  return payment;
}

export async function updatePaymentModeAction(
  id: string,
  input: CreatePaymentModeInput,
) {
  const { user } = await apiGuard();
  const data = createPaymentModeSchema.parse(input);
  const payment = await updatePaymentMode(user.id, id, data);
  revalidatePath(routes.invoice());
  return payment;
}

export async function deletePaymentModeAction(id: string) {
  const { user } = await apiGuard();
  const payment = await deletePaymentMode(user.id, id);
  revalidatePath(routes.invoice());
  return payment;
}
