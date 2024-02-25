import { FinanceType } from "@/entity";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { statData } from "./stat-util";

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
  let lastMonthOfFinance = 0;

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
        lastMonthOfFinance = months;
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

  const prevExpense =
    prevAmount
      .find((el) => el.type === FinanceType.depense)
      ?._sum.amount?.toNumber() ?? 0;
  const prevIncome =
    prevAmount
      .find((el) => el.type === FinanceType.revenue)
      ?._sum.amount?.toNumber() ?? 0;

  const profit: number[] = [];
  for (const month of monthsOfYear) {
    if (month === 0) {
      profit[0] = prevIncome + income[month] - (prevExpense + expense[month]);
    } else if (month <= lastMonthOfFinance) {
      profit[month] = profit[month - 1] + (income[month] - expense[month]);
    } else {
      profit[month] = 0;
    }
  }

  return {
    datasets: [
      { label: statData.incomePerMonth.label, data: income },
      { label: statData.expensePerMonth.label, data: expense },
      { label: statData.totalProfit.label, data: profit },
    ],
  };
}

export type GetStats = Awaited<ReturnType<typeof getStats>>;
