import { prisma } from "@/lib/prisma";

export async function getTags(userId: string) {
  const tags = await prisma.tag.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
  return { results: tags };
}

export type GetTags = Awaited<ReturnType<typeof getTags>>;
