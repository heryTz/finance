import { apiGuard } from "@/lib/api-guard";
import { prisma } from "@/lib/prisma";

export async function getProvider() {
  const { user } = await apiGuard();

  return await prisma.provider.findFirstOrThrow({
    where: { ownerId: user!.id },
  });
}

export type GetProvider = Awaited<ReturnType<typeof getProvider>>;
