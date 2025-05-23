import { NotFoundError } from "@/lib/exception";
import { prisma } from "@/lib/prisma";
import { CreatePaymentModeInput } from "./payment-mode-dto";
import { PaymentMode } from "@prisma/client";

export async function getPaymentModeById(userId: string, id: string) {
  const mode = await prisma.paymentMode.findFirst({
    where: { id, onwerId: userId },
  });
  if (!mode) throw new NotFoundError();
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
  input: CreatePaymentModeInput,
): Promise<PaymentMode> {
  const payment = await prisma.paymentMode.update({
    data: { ...input },
    where: { id, onwerId: userId },
  });
  return payment;
}

export async function createPaymentMode(
  userId: string,
  input: CreatePaymentModeInput,
) {
  const payment = await prisma.paymentMode.create({
    data: { ...input, onwerId: userId },
  });
  return payment;
}

export async function getPaymentsMode(userId: string) {
  const payments = await prisma.paymentMode.findMany({
    orderBy: { name: "asc" },
    where: { onwerId: userId },
  });
  return {
    results: payments,
  };
}

export type GetPaymentsMode = Awaited<ReturnType<typeof getPaymentsMode>>;
