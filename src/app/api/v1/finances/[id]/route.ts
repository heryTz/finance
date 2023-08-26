import { FinanceType, FinanceWithTag } from "@/entity";
import { PrismaClient, Tag } from "@prisma/client";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request, params: { id: string }) {
  const finance = await prisma.finance.findUnique({
    where: { id: params.id },
    include: { tags: true },
  });
  if (!finance) notFound();
  return NextResponse.json<FinanceWithTag>(finance);
}

export async function PUT(request: Request, params: { id: string }) {
  const input = (await request.json()) as UpdateFinanceInput;

  let tags: Tag[] = [];
  if (input.tags.length) {
    await Promise.all(
      input.tags.map((el) =>
        prisma.tag.upsert({
          create: { name: el },
          update: {},
          where: { name: el },
        })
      )
    );
    tags = await prisma.tag.findMany({
      where: { name: { in: input.tags } },
    });
  }

  const finance = await prisma.finance.update({
    where: { id: params.id },
    data: {
      amount: input.amount,
      label: input.label,
      type: input.type,
      createdAt: input.createdAt,
      tags: { connect: tags.map((el) => ({ id: el.id })) },
    },
    include: {
      tags: true,
    },
  });

  return NextResponse.json<FinanceWithTag>(finance);
}

export async function DELETE(request: Request, params: { id: string }) {
  await prisma.finance.delete({ where: { id: params.id } });
  return NextResponse.json<DeleteFinanceResponse>({ message: "ok" });
}

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
