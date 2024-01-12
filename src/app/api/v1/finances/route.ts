import { NextRequest, NextResponse } from "next/server";
import { FinanceType, FinanceWithTag } from "@/entity";
import { Tag } from "@prisma/client";
import { apiGuard } from "@/lib/api-guard";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { resp, user } = await apiGuard();
  if (resp) return resp;

  const query = req.nextUrl.searchParams;
  const q = query.get("q");
  const distinct = query.get("distinct") === "true";

  const finances = await prisma.finance.findMany({
    where: {
      userId: user!.id,
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
      userId: user!.id,
    },
  });

  return NextResponse.json<GetFinanceResponse>({
    results: finances,
    stats: {
      expense:
        amounts
          .find((el) => el.type === FinanceType.depense)
          ?._sum.amount?.toNumber() ?? 0,
      income:
        amounts
          .find((el) => el.type === FinanceType.revenue)
          ?._sum.amount?.toNumber() ?? 0,
    },
  });
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
