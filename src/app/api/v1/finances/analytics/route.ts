import { apiGuard } from "@/app/guards/api-guard";
import { prisma } from "@/app/helper/prisma";
import { FinanceType } from "@/entity";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { profitEvo } from "@/app/helper";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export async function GET() {
  const { resp, user } = await apiGuard();
  if (resp) return resp;

  const finances = await prisma.finance.findMany({
    where: {
      userId: user!.id,
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
      userId: user!.id,
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

  return NextResponse.json<FinanceAnalytics>({
    datasets: [
      { label: "Revenu", data: income },
      { label: "Dépense", data: expense },
      { label: "Bénéfice", data: profit },
    ],
  });
}

export type FinanceAnalytics = {
  datasets: { label: "Dépense" | "Revenu" | "Bénéfice"; data: number[] }[];
};
