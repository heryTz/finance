import { FinanceType } from "@/entity";
import { profitEvo } from "@/lib";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export async function getStats(userId: string) {
  const finances = await prisma.finance.findMany({
    where: {
      userId,
      createdAt: {
        lte: dayjs().endOf("year").toDate(),
        gte: dayjs().startOf("year").toDate(),
      },
    },
  });

  const monthsOfYear = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const expense: number[] = [];
  const income: number[] = [];

  for (const months of monthsOfYear) {
    expense[months] = 0;
    income[months] = 0;
    const monthDayjs = dayjs().startOf("year").add(months, "month");
    for (const finance of finances) {
      const createdAtDayjs = dayjs(finance.createdAt);
      if (
        createdAtDayjs.isSameOrAfter(monthDayjs.startOf("month")) &&
        createdAtDayjs.isSameOrBefore(monthDayjs.endOf("month"))
      ) {
        if (finance.type === FinanceType.depense) {
          expense[months] = expense[months] + finance.amount.toNumber();
        } else {
          income[months] = income[months] + finance.amount.toNumber();
        }
      }
    }
  }

  const prevAmount = await prisma.finance.groupBy({
    by: ["type"],
    where: {
      userId,
      createdAt: { lte: dayjs().add(-1, "year").endOf("year").toDate() },
    },
    _sum: { amount: true },
  });

  expense[0] +=
    prevAmount
      .find((el) => el.type === FinanceType.depense)
      ?._sum.amount?.toNumber() ?? 0;
  income[0] +=
    prevAmount
      .find((el) => el.type === FinanceType.revenue)
      ?._sum.amount?.toNumber() ?? 0;
  const profit = profitEvo(income, expense);

  return {
    datasets: [
      { label: "Revenu", data: income },
      { label: "Dépense", data: expense },
      { label: "Bénéfice", data: profit },
    ],
  };
}

export type GetStats = Awaited<ReturnType<typeof getStats>>;
