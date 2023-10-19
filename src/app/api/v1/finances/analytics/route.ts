import { apiGuard } from "@/app/guards/api-guard";
import { prisma } from "@/app/helper/prisma";
import { FinanceType } from "@/entity";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export async function GET() {
  const { session, resp } = await apiGuard();
  if (resp) return resp;

  const finances = await prisma.finance.findMany({
    where: {
      User: {
        email: session?.user?.email!,
      },
      // createdAt: {
      //   lte: dayjs().endOf("year").toDate(),
      //   gte: dayjs().startOf("year").toDate(),
      // },
    },
  });

  const monthsOfYear = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const depense: number[] = [];
  const revenu: number[] = [];

  for (const months of monthsOfYear) {
    depense[months] = 0;
    revenu[months] = 0;
    const monthDayjs = dayjs().startOf("year").add(months, "month");
    for (const finance of finances) {
      const createdAtDayjs = dayjs(finance.createdAt);
      if (
        createdAtDayjs.isSameOrAfter(monthDayjs.startOf("month")) &&
        createdAtDayjs.isSameOrBefore(monthDayjs.endOf("month"))
      ) {
        if (finance.type === FinanceType.depense) {
          depense[months] = depense[months] + finance.amount.toNumber();
        } else {
          revenu[months] = revenu[months] + finance.amount.toNumber();
        }
      }
    }
  }

  return NextResponse.json<FinanceAnalytics>({
    datasets: [
      { label: "Revenu", data: revenu },
      { label: "Dépense", data: depense },
    ],
  });
}

export type FinanceAnalytics = {
  datasets: { label: "Dépense" | "Revenu"; data: number[] }[];
};
