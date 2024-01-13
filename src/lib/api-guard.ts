import { getServerSession } from "next-auth";
import { User } from "@prisma/client";
import { authOptions } from "../app/api/auth/[...nextauth]/options";
import { UnauthorizedException } from "./exception";

export async function apiGuard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new UnauthorizedException();
  }
  return { session, user: session.user as User };
}
