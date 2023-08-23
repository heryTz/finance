import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { FinanceWithTag } from "@/entity";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const finances = await prisma.finance.findMany({
    where: { User: { email: session?.user?.email! } },
    orderBy: { createdAt: "desc" },
    include: { tags: true },
  });
  return NextResponse.json<GetFinanceResponse>({ results: finances });
}

export type GetFinanceResponse = {
  results: FinanceWithTag[];
};
