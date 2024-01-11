import { apiGuard } from "@/app/guards/api-guard";
import { prisma } from "@/app/helper/prisma";
import { FinanceType, FinanceWithTag } from "@/entity";
import { Tag } from "@prisma/client";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: IdParams) {
  const { resp } = await apiGuard();
  if (resp) return resp;

  const finance = await prisma.finance.findUnique({
    where: { id: params.id },
    include: { tags: true },
  });
  if (!finance) notFound();
  return NextResponse.json<FinanceWithTag>(finance);
}

export async function PUT(request: Request, { params }: IdParams) {
  const { session, resp } = await apiGuard();
  if (resp) return resp;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email: session?.user?.email! },
  });
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
        where: { name: tag },
        create: { name: tag, userId: user.id },
        update: {},
      });
      tagToConnect.push(newTag);
    }
  }

  const financeUpdated = await prisma.finance.update({
    where: { id: params.id, userId: user!.id },
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
}

export async function DELETE(request: Request, { params }: IdParams) {
  const { resp, user } = await apiGuard();
  if (resp) return resp;

  await prisma.finance.delete({ where: { id: params.id, userId: user!.id } });
  return NextResponse.json<DeleteFinanceResponse>({ message: "ok" });
}

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
