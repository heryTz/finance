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
