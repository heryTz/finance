import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/options";
import { UnauthorizedException } from "./exception";
import { prisma } from "./prisma";

export async function apiGuard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new UnauthorizedException();
  }
  // Sometimes! session.user is not the full user data
  const user = await prisma.user.findFirst({
    where: { email: session.user.email! },
  });
  if (!user) {
    throw new UnauthorizedException();
  }
  return { session, user };
}
