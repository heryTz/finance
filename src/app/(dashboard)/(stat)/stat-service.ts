import { OperationType } from "@/entity/operation";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { getMonthLabel, getMonthRange } from "./stat-util";
import { z } from "zod";
import { getStatsQuerySchema } from "./stat-dto";
import "dayjs/locale/fr";

dayjs.locale("fr");
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export async function getStats(
  userId: string,
  { range }: z.input<typeof getStatsQuerySchema>,
) {
  const { from, to } = range;
  const operations = await prisma.operation.findMany({
    where: {
      userId,
      createdAt: {
        lte: to,
        gte: from,
      },
    },
  });

  const monthRange = getMonthRange({ from, to });
  let lastMonthOfOperation = 0;

  const data: {
    month: string;
    income: number;
    expense: number;
    retainedEarnings: number;
  }[] = [];

  for (const months of monthRange) {
    const monthDayjs = dayjs(from).startOf("year").add(months, "month");
    data[months] = {
      month: getMonthLabel({ monthIndex: months, from, to }),
      income: 0,
      expense: 0,
      retainedEarnings: 0,
    };
    for (const operation of operations) {
      const createdAtDayjs = dayjs(operation.createdAt);
      if (
        createdAtDayjs.isSameOrAfter(monthDayjs.startOf("month")) &&
        createdAtDayjs.isSameOrBefore(monthDayjs.endOf("month"))
      ) {
        lastMonthOfOperation = months;
        if (operation.type === OperationType.depense) {
          data[months].expense += operation.amount.toNumber();
        } else {
          data[months].income += operation.amount.toNumber();
        }
      }
    }
  }

  const prevAmount = await prisma.operation.groupBy({
    by: ["type"],
    where: {
      userId,
      createdAt: {
        lte: dayjs(from).add(-1, "year").endOf("year").toDate(),
      },
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

  // Calculate retained earnings
  for (const month of monthRange) {
    if (month === 0) {
      data[0].retainedEarnings =
        prevIncome + data[month].income - (prevExpense + data[month].expense);
    } else if (month <= lastMonthOfOperation) {
      data[month].retainedEarnings =
        data[month - 1].retainedEarnings +
        (data[month].income - data[month].expense);
    } else {
      data[month].retainedEarnings = 0;
    }
  }

  return {
    results: data,
  };
}

export type GetStats = Awaited<ReturnType<typeof getStats>>;
