import { PrismaClient, Tag } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
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
