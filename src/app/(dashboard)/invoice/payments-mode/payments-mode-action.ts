"use server";

import { prisma } from "@/app/helper/prisma";
import { apiGuard } from "@/app/guards/api-guard";
import { UnauthorizedException } from "@/util/http";
import { CreatePaymentModeInput } from "./payments-mode-action-dto";

export async function createPaymentMode(input: CreatePaymentModeInput) {
  const { user, resp } = await apiGuard();
  if (resp) throw new UnauthorizedException();
  return await prisma.paymentMode.create({
    data: { ...input, onwerId: user!.id },
  });
}

export async function updatePaymentMode(
  id: string,
  input: CreatePaymentModeInput
) {
  const { user, resp } = await apiGuard();
  if (resp) throw new UnauthorizedException();
  return await prisma.paymentMode.update({
    data: { ...input, onwerId: user!.id },
    where: { id },
  });
}

export async function deletePaymentMode(id: string) {
  const { resp } = await apiGuard();
  if (resp) throw new UnauthorizedException();
  return await prisma.paymentMode.delete({
    where: { id },
  });
}
