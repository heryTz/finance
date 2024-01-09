import { apiGuard } from "@/app/guards/api-guard";
import { prisma } from "@/app/helper/prisma";
import { UnauthorizedException } from "@/util/http";

export async function getProvider() {
  const { user, resp } = await apiGuard();
  if (resp) throw new UnauthorizedException();

  return await prisma.provider.findFirstOrThrow({
    where: { ownerId: user!.id },
  });
}

export type getProvider = Awaited<ReturnType<typeof getProvider>>;
