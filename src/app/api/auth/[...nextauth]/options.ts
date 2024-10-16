import EmailProvider from "next-auth/providers/email";
import { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { routes } from "@/app/routes";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  pages: {
    signIn: routes.authLogin(),
    verifyRequest: routes.authVerifyRequest(),
  },
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: +(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE !== "false",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async signIn() {
      return true;
    },
  },
};
