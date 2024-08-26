import { OperationType } from "@/entity";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { statData } from "./stat-util";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export async function getStats(userId: string) {
  const operations = await prisma.operation.findMany({
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
  let lastMonthOfOperation = 0;

  for (const months of monthsOfYear) {
    expense[months] = 0;
    income[months] = 0;
    const monthDayjs = dayjs().startOf("year").add(months, "month");
    for (const operation of operations) {
      const createdAtDayjs = dayjs(operation.createdAt);
      if (
        createdAtDayjs.isSameOrAfter(monthDayjs.startOf("month")) &&
        createdAtDayjs.isSameOrBefore(monthDayjs.endOf("month"))
      ) {
        lastMonthOfOperation = months;
        if (operation.type === OperationType.depense) {
          expense[months] = expense[months] + operation.amount.toNumber();
        } else {
          income[months] = income[months] + operation.amount.toNumber();
        }
      }
    }
  }

  const prevAmount = await prisma.operation.groupBy({
    by: ["type"],
    where: {
      userId,
      createdAt: { lte: dayjs().add(-1, "year").endOf("year").toDate() },
    },
    _sum: { amount: true },
  });

  const prevExpense =
    prevAmount
      .find((el) => el.type === OperationType.depense)
      ?._sum.amount?.toNumber() ?? 0;
  const prevIncome =
    prevAmount
      .find((el) => el.type === OperationType.revenue)
      ?._sum.amount?.toNumber() ?? 0;

  const profit: number[] = [];
  for (const month of monthsOfYear) {
    if (month === 0) {
      profit[0] = prevIncome + income[month] - (prevExpense + expense[month]);
    } else if (month <= lastMonthOfOperation) {
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
