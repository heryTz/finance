"use server";

import { prisma } from "@/lib/prisma";
import { apiGuard } from "@/lib/api-guard";
import { CreatePaymentModeInput } from "./payment-mode-dto";
import { revalidatePath } from "next/cache";

export async function createPaymentMode(input: CreatePaymentModeInput) {
  const { user } = await apiGuard();
  const payment = await prisma.paymentMode.create({
    data: { ...input, onwerId: user!.id },
  });
  revalidatePath("/invoice");
  return payment;
}

export async function updatePaymentMode(
  id: string,
  input: CreatePaymentModeInput
) {
  const { user } = await apiGuard();
  const payment = await prisma.paymentMode.update({
    data: { ...input, onwerId: user!.id },
    where: { id },
  });
  revalidatePath("/invoice");
  return payment;
}

export async function deletePaymentMode(id: string) {
  await apiGuard();
  const payment = await prisma.paymentMode.delete({
    where: { id },
  });
  revalidatePath("/invoice");
  return payment;
}
