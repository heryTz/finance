import { PrismaClient, Tag } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json<GetTagResponse>({ results: tags });
}

export type GetTagResponse = {
  results: Tag[];
};
