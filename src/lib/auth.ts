import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import { prisma } from "./prisma";
import { sendEmail } from "./mailer";
import { routes } from "@/app/routes";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmail({
          to: email,
          subject: "Sign in to Finance",
          content: `<a href="${url}">Click here to sign in</a>`,
        });
      },
    }),
  ],
});

export async function fetchSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function guard() {
  const session = await fetchSession();
  if (!session) redirect(routes.authLogin());
  return session;
}
