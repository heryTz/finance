import { FinanceType } from "@/entity";
import { prisma } from "@/lib/prisma";
import { GetFinancesQuery } from "./finance-dto";

export async function getFinances(userId: string, query: GetFinancesQuery) {
  const { distinct, q } = query;

  const finances = await prisma.finance.findMany({
    where: {
      userId,
      ...(q ? { label: { contains: q } } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { tags: true },
    distinct: distinct ? ["label"] : undefined,
  });

  const amounts = await prisma.finance.groupBy({
    by: ["type"],
    _sum: { amount: true },
    where: {
      userId,
    },
  });

  const expense =
    amounts
      .find((el) => el.type === FinanceType.depense)
      ?._sum.amount?.toNumber() ?? 0;

  const income =
    amounts
      .find((el) => el.type === FinanceType.revenue)
      ?._sum.amount?.toNumber() ?? 0;

  return {
    results: finances,
    stats: {
      expense,
      income,
    },
  };
}
