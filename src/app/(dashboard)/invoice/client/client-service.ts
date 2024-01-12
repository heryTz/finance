import { apiGuard } from "@/lib/api-guard";
import { prisma } from "@/lib/prisma";

export async function getClients() {
  const { user } = await apiGuard();
  const clients = await prisma.client.findMany({
    where: { ownerId: user!.id },
    orderBy: { name: "asc" },
  });
  return {
    results: clients,
  };
}

export type GetClients = Awaited<ReturnType<typeof getClients>>;
