import { prisma } from "@/app/helper/prisma";

export async function getClients() {
  const clients = await prisma.client.findMany({ orderBy: { name: "asc" } });
  return {
    results: clients,
  };
}

export type GetClients = Awaited<ReturnType<typeof getClients>>;
