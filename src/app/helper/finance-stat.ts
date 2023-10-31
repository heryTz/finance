import { FinanceType } from "@/entity";
import { Finance } from "@prisma/client";

export function bilanGlobal(finances: Finance[]) {
  return {
    revenue: finances
      .filter((el) => el.type === FinanceType.revenue)
      .map((el) => +el.amount)
      .reduce((prev, acc) => prev + acc, 0),
    depense: finances
      .filter((el) => el.type === FinanceType.depense)
      .map((el) => +el.amount)
      .reduce((prev, acc) => prev + acc, 0),
  };
}

export function profitEvo(income: number[], expense: number[]) {
  const profit: number[] = [];

  income.forEach((el, i) => {
    if (i === 0) {
      profit.push(el - expense[i]);
    } else {
      const curProfit = income[i] - expense[i];
      profit.push(profit[i - 1] + curProfit);
    }
  });

  return profit;
}
