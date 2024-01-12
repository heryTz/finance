"use server";

import { prisma } from "@/app/helper/prisma";
import { apiGuard } from "@/app/guards/api-guard";
import { UnauthorizedException } from "@/util/http";
import { CreatePaymentModeInput } from "./payment-mode-dto";
import { revalidatePath } from "next/cache";

export async function createPaymentMode(input: CreatePaymentModeInput) {
  const { user, resp } = await apiGuard();
  if (resp) throw new UnauthorizedException();
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
  const { user, resp } = await apiGuard();
  if (resp) throw new UnauthorizedException();
  const payment = await prisma.paymentMode.update({
    data: { ...input, onwerId: user!.id },
    where: { id },
  });
  revalidatePath("/invoice");
  return payment;
}

export async function deletePaymentMode(id: string) {
  const { resp } = await apiGuard();
  if (resp) throw new UnauthorizedException();
  const payment = await prisma.paymentMode.delete({
    where: { id },
  });
  revalidatePath("/invoice");
  return payment;
}
