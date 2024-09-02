import { OperationType } from "@/entity/operation";
import { Operation } from "@prisma/client";

export function bilanGlobal(operations: Operation[]) {
  return {
    revenue: operations
      .filter((el) => el.type === OperationType.revenue)
      .map((el) => +el.amount)
      .reduce((prev, acc) => prev + acc, 0),
    depense: operations
      .filter((el) => el.type === OperationType.depense)
      .map((el) => +el.amount)
      .reduce((prev, acc) => prev + acc, 0),
  };
}

export function variationPercentage(value1: number, value0: number) {
  return ((value1 - value0) / (value0 || 1)) * 100;
}
