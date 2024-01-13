import { FinanceType } from "@/entity";
import { prisma } from "@/lib/prisma";
import { CreateFinanceInput, GetFinancesQuery } from "./finance-dto";
import { Tag } from "@prisma/client";

export async function getFinances(userId: string, query: GetFinancesQuery) {
  const { distinct, q } = query;

  const finances = await prisma.finance.findMany({
    where: {
      userId,
      ...(q ? { label: { contains: q } } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { tags: true },
    distinct: distinct ? ["label"] : undefined,
  });

  const amounts = await prisma.finance.groupBy({
    by: ["type"],
    _sum: { amount: true },
    where: {
      userId,
    },
  });

  const expense =
    amounts
      .find((el) => el.type === FinanceType.depense)
      ?._sum.amount?.toNumber() ?? 0;

  const income =
    amounts
      .find((el) => el.type === FinanceType.revenue)
      ?._sum.amount?.toNumber() ?? 0;

  return {
    results: finances,
    stats: {
      expense,
      income,
    },
  };
}

export async function createFinance(userId: string, input: CreateFinanceInput) {
  let tags: Tag[] = [];
  if (input.tags.length) {
    await Promise.all(
      input.tags.map((el) =>
        prisma.tag.upsert({
          create: { name: el, userId },
          update: {},
          where: { name_userId: { name: el, userId } },
        })
      )
    );
    tags = await prisma.tag.findMany({
      where: { name: { in: input.tags } },
    });
  }

  const finance = await prisma.finance.create({
    data: {
      amount: input.amount,
      label: input.label,
      type: input.type,
      createdAt: input.createdAt,
      tags: { connect: tags.map((el) => ({ id: el.id })) },
      userId,
    },
    include: {
      tags: true,
    },
  });

  return finance;
}
