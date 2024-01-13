import { NextRequest, NextResponse } from "next/server";
import { FinanceType, FinanceWithTag } from "@/entity";
import { Tag } from "@prisma/client";
import { apiGuard } from "@/lib/api-guard";
import { prisma } from "@/lib/prisma";
import {
  createFinance,
  getFinances,
} from "@/app/(dashboard)/finance/finance-service";
import { z } from "zod";
import {
  createFinanceInputSchema,
  getFinancesQuerySchema,
} from "@/app/(dashboard)/finance/finance-dto";

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

  try {
    const input = createFinanceInputSchema.parse(await request.json());
    const finance = await createFinance(user!.id, input);
    return NextResponse.json(finance);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 400 });
    }
    return new Response(null, { status: 500 });
  }
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
