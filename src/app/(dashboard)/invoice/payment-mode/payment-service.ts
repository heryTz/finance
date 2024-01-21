import { prisma } from "@/lib/prisma";

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
