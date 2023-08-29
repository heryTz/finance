import NextAuth from "next-auth/next";
import EmailProvider from "next-auth/providers/email";
import { PrismaClient } from "@prisma/client";
import { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
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
    async signIn({ user }) {
      const prisma = new PrismaClient();
      const userExists = await prisma.user.findUnique({
        where: { email: user.email ?? undefined },
      });
      if (userExists) {
        return true;
      } else {
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
