import { Session, getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// TODO: to improve
export async function apiGuard(): Promise<{
  session: Session;
  resp: NextResponse | null;
}> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      session: null as any,
      resp: NextResponse.json({ message: "unauthorized" }, { status: 401 }),
    };
  }

  return { session, resp: null };
}
