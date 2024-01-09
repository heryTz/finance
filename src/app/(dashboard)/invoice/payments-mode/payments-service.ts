import { prisma } from "@/app/helper/prisma";

export async function getPaymentsMode() {
  const payments = await prisma.paymentMode.findMany({
    orderBy: { name: "asc" },
  });
  return {
    results: payments,
  };
}

export type GetPaymentsMode = Awaited<ReturnType<typeof getPaymentsMode>>;
