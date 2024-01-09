import { Session, getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "../helper/prisma";
import { User } from "@prisma/client";
import { authOptions } from "../api/auth/[...nextauth]/options";

// TODO: to improve
export async function apiGuard(): Promise<{
  session: Session;
  resp: NextResponse | null;
  user: User | null;
}> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      session: null as any,
      resp: NextResponse.json({ message: "unauthorized" }, { status: 401 }),
      user: null,
    };
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { email: session?.user?.email! },
  });

  return { session, resp: null, user };
}
