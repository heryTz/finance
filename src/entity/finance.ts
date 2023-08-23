import { Prisma } from "@prisma/client";

export type FinanceWithTag = Prisma.FinanceGetPayload<{
  include: { tags: true };
}>;
