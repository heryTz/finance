import { Tag } from "@prisma/client";
import { NextResponse } from "next/server";
import { apiGuard } from "@/app/guards/api-guard";
import { prisma } from "@/app/helper/prisma";

export async function GET() {
  const { session, resp } = await apiGuard();
  if (resp) return resp;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email: session?.user?.email! },
  });
  const tags = await prisma.tag.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });
  return NextResponse.json<GetTagResponse>({ results: tags });
}

export type GetTagResponse = {
  results: Tag[];
};
