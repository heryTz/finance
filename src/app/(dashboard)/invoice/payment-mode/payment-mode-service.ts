import { NotFoundException } from "@/lib/exception";
import { prisma } from "@/lib/prisma";
import { CreatePaymentModeInput } from "./payment-mode-dto";

export async function getPaymentModeById(userId: string, id: string) {
  const mode = await prisma.paymentMode.findFirst({
    where: { id, onwerId: userId },
  });
  if (!mode) throw new NotFoundException();
  return mode;
}

export type GetPaymentModeById = Awaited<ReturnType<typeof getPaymentModeById>>;

export async function deletePaymentMode(userId: string, id: string) {
  const payment = await prisma.paymentMode.delete({
    where: { id, onwerId: userId },
  });
  return payment;
}

export async function updatePaymentMode(
  userId: string,
  id: string,
  input: CreatePaymentModeInput
) {
  const payment = await prisma.paymentMode.update({
    data: { ...input },
    where: { id, onwerId: userId },
  });
  return payment;
}

export async function createPaymentMode(
  userId: string,
  input: CreatePaymentModeInput
) {
  const payment = await prisma.paymentMode.create({
    data: { ...input, onwerId: userId },
  });
  return payment;
}
