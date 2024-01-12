import { NextRequest, NextResponse } from "next/server";
import { FinanceType, FinanceWithTag } from "@/entity";
import { Tag } from "@prisma/client";
import { apiGuard } from "@/lib/api-guard";
import { prisma } from "@/lib/prisma";
import { getFinances } from "@/app/(dashboard)/finance/finance-service";
import { z } from "zod";
import { getFinancesQuerySchema } from "@/app/(dashboard)/finance/finance-dto";

export async function GET(req: NextRequest) {
  const { resp, user } = await apiGuard();
  if (resp) return resp;

  const searchParams = req.nextUrl.searchParams;

  try {
    const query = getFinancesQuerySchema.parse({
      q: searchParams.get("q"),
      distinct: searchParams.get("distinct"),
    });

    const finances = await getFinances(user!.id, query);
    return NextResponse.json(finances);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 400 });
    }
    return new Response(null, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { resp, user } = await apiGuard();
  if (resp) return resp;

  const input = (await request.json()) as SaveFinanceInput;

  let tags: Tag[] = [];
  if (input.tags.length) {
    await Promise.all(
      input.tags.map((el) =>
        prisma.tag.upsert({
          create: { name: el, userId: user!.id },
          update: {},
          where: { name_userId: { name: el, userId: user!.id } },
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
      userId: user!.id,
    },
    include: {
      tags: true,
    },
  });
  return NextResponse.json<FinanceWithTag>(finance);
}

export type GetFinanceQuery = {
  q?: string;
  distinct?: boolean;
};

export type GetFinanceResponse = {
  results: FinanceWithTag[];
  stats: {
    income: number;
    expense: number;
  };
};

export type SaveFinanceInput = {
  label: string;
  type: FinanceType;
  tags: string[];
  amount: number;
  createdAt: string;
};
