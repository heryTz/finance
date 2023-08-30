import { NextResponse } from "next/server";
import { FinanceType, FinanceWithTag } from "@/entity";
import { Tag } from "@prisma/client";
import { apiGuard } from "@/app/guards/api-guard";
import { prisma } from "@/app/helper/prisma";

export async function GET() {
  const { session, resp } = await apiGuard();
  if (resp) return resp;

  const finances = await prisma.finance.findMany({
    where: { User: { email: session?.user?.email! } },
    orderBy: { createdAt: "desc" },
    include: { tags: true },
  });
  return NextResponse.json<GetFinanceResponse>({ results: finances });
}

export async function POST(request: Request) {
  const { session, resp } = await apiGuard();
  if (resp) return resp;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email: session?.user?.email! },
  });
  const input = (await request.json()) as SaveFinanceInput;

  let tags: Tag[] = [];
  if (input.tags.length) {
    await Promise.all(
      input.tags.map((el) =>
        prisma.tag.upsert({
          create: { name: el, userId: user.id },
          update: {},
          where: { name: el },
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
      userId: user.id,
    },
    include: {
      tags: true,
    },
  });
  return NextResponse.json<FinanceWithTag>(finance);
}

export type GetFinanceResponse = {
  results: FinanceWithTag[];
};

export type SaveFinanceInput = {
  label: string;
  type: FinanceType;
  tags: string[];
  amount: number;
  createdAt: string;
};
