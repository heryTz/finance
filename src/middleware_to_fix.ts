import { PrismaClient } from "@prisma/client";
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    async authorized({ req }) {
      const prisma = new PrismaClient();
      // - the default middleware of "next-auth" not working
      // - wtf! "getServerSession(authOptions)" always null in the middleware
      // - the code below make also an error
      const sessionToken = req.cookies.get("next-auth.session-token")?.value;
      if (!sessionToken) return false;
      const session = await prisma.session.findUnique({
        where: { sessionToken },
      });
      if (!session) return false;
      if (new Date().getTime() > new Date(session.expires).getTime())
        return false;
      return true;
    },
  },
});

export const config = {
  matcher: "/api/v1/:path*",
};
