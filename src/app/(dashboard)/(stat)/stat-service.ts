import { OperationType } from "@/entity/operation";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { getMonthLabel, getMonthRange } from "./stat-util";
import { z } from "zod";
import { getStatsQuerySchema } from "./stat-dto";
import "dayjs/locale/fr";
import { variationPercentage } from "@/lib/operation-stat";

dayjs.locale("fr");
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// TODO: Allow other xAxis label than month
// TODO: Extract expenses and revenues calculation to a function
// TODO: Extract retained earnings calculation to a function

export async function getStats(
  userId: string,
  query: z.input<typeof getStatsQuerySchema>,
) {
  const results = await getOverviewStat(userId, query);
  const countStat = await getCountStat(userId, query);

  return {
    results,
    countStat,
  };
}

async function getOverviewStat(
  userId: string,
  { range, tags, label }: z.infer<typeof getStatsQuerySchema>,
) {
  const { from, customActualDate } = range;
  const to = range.to || dayjs(from).endOf("month").toDate();

  const operations = await prisma.operation.findMany({
    where: {
      userId,
      createdAt: {
        lte: to,
        gte: from,
      },
      label: label ? { contains: label } : undefined,
      tags: tags.length > 0 ? { some: { name: { in: tags } } } : undefined,
    },
  });

  const monthRange = getMonthRange({ from, to, customActualDate });
  let lastMonthOfOperation = 0;

  const data: {
    month: string;
    income: number;
    expense: number;
    balance: number;
  }[] = [];

  for (let i = 0; i < monthRange.length; i++) {
    const months = monthRange[i];
    const monthDayjs = dayjs(from).startOf("year").add(months, "month");
    data[i] = {
      month: getMonthLabel({ monthIndex: months, from, to }),
      income: 0,
      expense: 0,
      balance: 0,
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
      label: label ? { contains: label } : undefined,
      tags: tags.length > 0 ? { some: { name: { in: tags } } } : undefined,
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
      data[0].balance =
        prevIncome + data[i].income - (prevExpense + data[i].expense);
    } else if (i <= lastMonthOfOperation) {
      data[i].balance =
        data[i - 1].balance + (data[i].income - data[i].expense);
    } else {
      data[i].balance = data[i - 1].balance;
    }
  }

  return data;
}

async function getCountStat(
  userId: string,
  { label, tags }: Omit<z.infer<typeof getStatsQuerySchema>, "range">,
) {
  const sumAmount = await prisma.operation.groupBy({
    by: ["type"],
    where: {
      userId,
      label: label ? { contains: label } : undefined,
      tags: tags.length > 0 ? { some: { name: { in: tags } } } : undefined,
    },
    _sum: { amount: true },
  });
  const currentExpense =
    sumAmount
      .find((el) => el.type === OperationType.depense)
      ?._sum.amount?.toNumber() ?? 0;
  const currentIncome =
    sumAmount
      .find((el) => el.type === OperationType.revenue)
      ?._sum.amount?.toNumber() ?? 0;

  const previousSumAmount = await prisma.operation.groupBy({
    by: ["type"],
    where: {
      userId,
      label: label ? { contains: label } : undefined,
      tags: tags.length > 0 ? { some: { name: { in: tags } } } : undefined,
      createdAt: {
        lte: dayjs().add(-1, "month").endOf("month").toDate(),
      },
    },
    _sum: { amount: true },
  });
  const previousExpense =
    previousSumAmount
      .find((el) => el.type === OperationType.depense)
      ?._sum.amount?.toNumber() ?? 0;
  const previousIncome =
    previousSumAmount
      .find((el) => el.type === OperationType.revenue)
      ?._sum.amount?.toNumber() ?? 0;

  const currentBalance = currentIncome - currentExpense;
  const previousBalance = previousIncome - previousExpense;

  const currentMonthSumAmount = await prisma.operation.groupBy({
    by: ["type"],
    where: {
      userId,
      label: label ? { contains: label } : undefined,
      tags: tags.length > 0 ? { some: { name: { in: tags } } } : undefined,
      createdAt: {
        gte: dayjs().startOf("month").toDate(),
      },
    },
    _sum: { amount: true },
  });
  const currentMonthExpense =
    currentMonthSumAmount
      .find((el) => el.type === OperationType.depense)
      ?._sum.amount?.toNumber() ?? 0;
  const currentMonthIncome =
    currentMonthSumAmount
      .find((el) => el.type === OperationType.revenue)
      ?._sum.amount?.toNumber() ?? 0;

  const previousMonthSumAmount = await prisma.operation.groupBy({
    by: ["type"],
    where: {
      userId,
      label: label ? { contains: label } : undefined,
      tags: tags.length > 0 ? { some: { name: { in: tags } } } : undefined,
      createdAt: {
        gte: dayjs().add(-1, "month").startOf("month").toDate(),
        lte: dayjs().add(-1, "month").endOf("month").toDate(),
      },
    },
    _sum: { amount: true },
  });
  const previousMonthExpense =
    previousMonthSumAmount
      .find((el) => el.type === OperationType.depense)
      ?._sum.amount?.toNumber() ?? 0;
  const previousMonthIncome =
    previousMonthSumAmount
      .find((el) => el.type === OperationType.revenue)
      ?._sum.amount?.toNumber() ?? 0;

  return {
    currentIncome: {
      value: currentMonthIncome,
      fromPreviousMonthInPercent: variationPercentage(
        currentMonthIncome,
        previousMonthIncome,
      ),
    },
    currentExpense: {
      value: currentMonthExpense,
      fromPreviousMonthInPercent: variationPercentage(
        currentMonthExpense,
        previousMonthExpense,
      ),
    },
    currentBalance: {
      value: currentBalance,
      fromPreviousMonthInPercent: variationPercentage(
        currentBalance,
        previousBalance,
      ),
    },
    totalIncome: {
      value: currentIncome,
      fromPreviousMonthInPercent: variationPercentage(
        currentIncome,
        previousIncome,
      ),
    },
    totalExpense: {
      value: currentExpense,
      fromPreviousMonthInPercent: variationPercentage(
        currentExpense,
        previousExpense,
      ),
    },
  };
}

export type GetStats = Awaited<ReturnType<typeof getStats>>;
