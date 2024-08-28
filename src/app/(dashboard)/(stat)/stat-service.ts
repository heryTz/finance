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
  const { customActualDate } = range;
  // We base only by month (not by date)
  const from = dayjs(range.from).startOf("month").toDate();
  const to = dayjs(range.to).endOf("month").toDate();

  const operations = await prisma.operation.findMany({
    where: {
      userId,
      createdAt: {
        lte: to,
        gte: from,
      },
    },
  });

  const monthRange = getMonthRange({ from, to, customActualDate });
  let lastMonthOfOperation = 0;

  const data: {
    month: string;
    income: number;
    expense: number;
    retainedEarnings: number;
  }[] = [];

  for (let i = 0; i < monthRange.length; i++) {
    const months = monthRange[i];
    const monthDayjs = dayjs(from).startOf("year").add(months, "month");
    data[i] = {
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
          data[i].expense += operation.amount.toNumber();
        } else {
          data[i].income += operation.amount.toNumber();
        }
      }
    }
  }

  const prevAmount = await prisma.operation.groupBy({
    by: ["type"],
    where: {
      userId,
      createdAt: {
        lte: dayjs(from).add(-1, "month").endOf("month").toDate(),
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
  for (let i = 0; i < monthRange.length; i++) {
    if (i === 0) {
      data[0].retainedEarnings =
        prevIncome + data[i].income - (prevExpense + data[i].expense);
    } else if (i <= lastMonthOfOperation) {
      data[i].retainedEarnings =
        data[i - 1].retainedEarnings + (data[i].income - data[i].expense);
    } else {
      data[i].retainedEarnings = data[i - 1].retainedEarnings;
    }
  }

  return {
    results: data,
  };
}

export type GetStats = Awaited<ReturnType<typeof getStats>>;
