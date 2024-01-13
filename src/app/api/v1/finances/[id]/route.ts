import { apiGuard } from "@/lib/api-guard";
import { prisma } from "@/lib/prisma";
import { FinanceType, FinanceWithTag } from "@/entity";
import { Tag } from "@prisma/client";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import { weh } from "@/lib/with-error-handler";

export const GET = weh(async (_, { params }: IdParams) => {
  const { user } = await apiGuard();
  const finance = await prisma.finance.findUnique({
    where: { id: params.id, userId: user.id },
    include: { tags: true },
  });
  if (!finance) notFound();
  return NextResponse.json<FinanceWithTag>(finance);
});

export const PUT = weh(async (request: Request, { params }: IdParams) => {
  const { user } = await apiGuard();

  const input = (await request.json()) as UpdateFinanceInput;
  const finance = await prisma.finance.findUnique({
    where: { id: params.id },
    include: { tags: true },
  });
  if (!finance) notFound();

  const tagToConnect: Tag[] = [];
  const tagToDisconnect: Tag[] = [];

  for (const tag of finance.tags) {
    if (input.tags.includes(tag.name)) tagToConnect.push(tag);
    else tagToDisconnect.push(tag);
  }

  for (const tag of input.tags) {
    if (!finance.tags.some((el) => el.name === tag)) {
      const newTag = await prisma.tag.upsert({
        where: { name_userId: { name: tag, userId: user.id } },
        create: { name: tag, userId: user.id },
        update: {},
      });
      tagToConnect.push(newTag);
    }
  }

  const financeUpdated = await prisma.finance.update({
    where: { id: params.id, userId: user.id },
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

  return NextResponse.json<FinanceWithTag>(financeUpdated);
});

export const DELETE = weh(async (_, { params }: IdParams) => {
  const { user } = await apiGuard();
  await prisma.finance.delete({ where: { id: params.id, userId: user.id } });
  return NextResponse.json<DeleteFinanceResponse>({ message: "ok" });
});

type IdParams = { params: { id: string } };

export type UpdateFinanceInput = {
  label: string;
  type: FinanceType;
  tags: string[];
  amount: number;
  createdAt: string;
};

export type DeleteFinanceResponse = {
  message: string;
};
