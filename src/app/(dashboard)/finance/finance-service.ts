import { FinanceType } from "@/entity";
import { prisma } from "@/lib/prisma";
import { SaveFinanceInput, GetFinancesQuery } from "./finance-dto";
import { Tag } from "@prisma/client";
import { NotFoundException } from "@/lib/exception";

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

export type GetFinances = Awaited<ReturnType<typeof getFinances>>;

export async function createFinance(userId: string, input: SaveFinanceInput) {
  let tags: Tag[] = [];
  if (input.tags.length) {
    await Promise.all(
      input.tags.map((el) =>
        prisma.tag.upsert({
          create: { name: el, userId },
          update: {},
          where: { name_userId: { name: el, userId } },
        }),
      ),
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

export type CreateFinance = Awaited<ReturnType<typeof createFinance>>;

export async function getFinanceById(userId: string, id: string) {
  const finance = await prisma.finance.findUnique({
    where: { id, userId },
    include: { tags: true },
  });
  if (!finance) throw new NotFoundException();
  return finance;
}

export type GetFinanceById = Awaited<ReturnType<typeof getFinanceById>>;

export async function updateFinance(
  userId: string,
  id: string,
  input: SaveFinanceInput,
) {
  const finance = await prisma.finance.findUnique({
    where: { id, userId },
    include: { tags: true },
  });
  if (!finance) {
    throw new NotFoundException();
  }

  const tagToConnect: Tag[] = [];
  const tagToDisconnect: Tag[] = [];

  for (const tag of finance.tags) {
    if (input.tags.includes(tag.name)) tagToConnect.push(tag);
    else tagToDisconnect.push(tag);
  }

  for (const tag of input.tags) {
    if (!finance.tags.some((el) => el.name === tag)) {
      const newTag = await prisma.tag.upsert({
        where: { name_userId: { name: tag, userId } },
        create: { name: tag, userId },
        update: {},
      });
      tagToConnect.push(newTag);
    }
  }

  const financeUpdated = await prisma.finance.update({
    where: { id, userId },
    data: {
      amount: input.amount,
      label: input.label,
      type: input.type,
      createdAt: input.createdAt,
      tags: {
        connect: tagToConnect.map((el) => ({ id: el.id })),
        disconnect: tagToDisconnect.map((el) => ({ id: el.id })),
      },
    },
    include: {
      tags: true,
    },
  });

  return financeUpdated;
}

export type UpdateFinance = Awaited<ReturnType<typeof updateFinance>>;

export async function deleteFinance(userId: string, id: string) {
  return await prisma.finance.delete({ where: { id, userId } });
}

export type DeleteFinance = Awaited<ReturnType<typeof deleteFinance>>;
