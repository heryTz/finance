import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/options";
import { prisma } from "./prisma";
import { routes } from "@/app/routes";
import { redirect } from "next/navigation";

export async function fetchSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return null;
  }
  // Sometimes! session.user is not the full user data
  const user = await prisma.user.findFirst({
    where: { email: session.user.email! },
  });
  if (!user) {
    return null;
  }
  return { session, user };
}

export async function guard() {
  const session = await fetchSession();
  if (session === null) {
    redirect(routes.authLogin());
  }
  return session;
}
