import { Prisma } from "@prisma/client";

export type FinanceWithTag = Prisma.FinanceGetPayload<{
  include: { tags: true };
}>;

export enum FinanceType {
  revenue = "revenue",
  depense = "depense",
}
