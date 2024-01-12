import { apiGuard } from "@/lib/api-guard";
import { prisma } from "@/lib/prisma";

export async function getPaymentsMode() {
  const { user } = await apiGuard();
  const payments = await prisma.paymentMode.findMany({
    orderBy: { name: "asc" },
    where: { onwerId: user!.id },
  });
  return {
    results: payments,
  };
}

export type GetPaymentsMode = Awaited<ReturnType<typeof getPaymentsMode>>;
