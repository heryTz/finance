import { apiGuard } from "@/lib/api-guard";
import { prisma } from "@/lib/prisma";
import { UnauthorizedException } from "@/lib/exception";

export async function getProvider() {
  const { user, resp } = await apiGuard();
  if (resp) throw new UnauthorizedException();

  return await prisma.provider.findFirstOrThrow({
    where: { ownerId: user!.id },
  });
}

export type GetProvider = Awaited<ReturnType<typeof getProvider>>;
