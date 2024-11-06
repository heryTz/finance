import { OperationType } from "@/entity/operation";
import { prisma } from "@/lib/prisma";
import { SaveOperationInput, GetOperationQuery } from "./operation-dto";
import { Tag } from "@prisma/client";
import { NotFoundException } from "@/lib/exception";

export async function getOperations(userId: string, query: GetOperationQuery) {
  const { distinct, q } = query;

  const operations = await prisma.operation.findMany({
    where: {
      userId,
      ...(q ? { label: { contains: q } } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { tags: true },
    distinct: distinct ? ["label"] : undefined,
  });

  const amounts = await prisma.operation.groupBy({
    by: ["type"],
    _sum: { amount: true },
    where: {
      userId,
    },
  });

  const expense =
    amounts
      .find((el) => el.type === OperationType.depense)
      ?._sum.amount?.toNumber() ?? 0;

  const income =
    amounts
      .find((el) => el.type === OperationType.revenue)
      ?._sum.amount?.toNumber() ?? 0;

  return {
    results: operations,
    stats: {
      expense,
      income,
    },
  };
}

export type GetOperations = Awaited<ReturnType<typeof getOperations>>;

export async function createOperation(
  userId: string,
  input: SaveOperationInput,
) {
  let tags: Tag[] = [];
  if (input.tags.length) {
    await Promise.all(
      input.tags.map((el) =>
        prisma.tag.upsert({
          create: { name: el, userId },
          update: { name: el, userId },
          where: { name_userId: { name: el, userId } },
        }),
      ),
    );
    tags = await prisma.tag.findMany({
      where: { userId, name: { in: input.tags } },
    });
  }

  const operation = await prisma.operation.create({
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

  return operation;
}

export type CreateOperation = Awaited<ReturnType<typeof createOperation>>;

export async function getOperationById(userId: string, id: string) {
  const operation = await prisma.operation.findUnique({
    where: { id, userId },
    include: { tags: true },
  });
  if (!operation) throw new NotFoundException();
  return operation;
}

export type GetOperationById = Awaited<ReturnType<typeof getOperationById>>;

export async function updateOperation(
  userId: string,
  id: string,
  input: SaveOperationInput,
) {
  const operation = await prisma.operation.findUnique({
    where: { id, userId },
    include: { tags: true },
  });
  if (!operation) {
    throw new NotFoundException();
  }

  const tagToConnect: Tag[] = [];
  const tagToDisconnect: Tag[] = [];

  for (const tag of operation.tags) {
    if (input.tags.includes(tag.name)) tagToConnect.push(tag);
    else tagToDisconnect.push(tag);
  }

  for (const tag of input.tags) {
    if (!operation.tags.some((el) => el.name === tag)) {
      const newTag = await prisma.tag.upsert({
        where: { name_userId: { name: tag, userId } },
        create: { name: tag, userId },
        update: {},
      });
      tagToConnect.push(newTag);
    }
  }

  const operationUpdated = await prisma.operation.update({
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

  return operationUpdated;
}

export type UpdateOperation = Awaited<ReturnType<typeof updateOperation>>;

export async function deleteOperation(userId: string, id: string) {
  return await prisma.operation.delete({ where: { id, userId } });
}

export type DeleteOperation = Awaited<ReturnType<typeof deleteOperation>>;
