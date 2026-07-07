import { createId } from "@paralleldrive/cuid2";
import { renderOtpEmail } from "@walletko/email";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { eq } from "drizzle-orm";
import { ProvisionNewUserService } from "src/server/application/user/provision-new-user.service";
import { db } from "src/server/infrastructure/db/client";
// Both imports from the same module are intentional and required:
// `schema` is passed to drizzleAdapter; `userTable` is the aliased named
// export used in the compensation delete (avoids collision with the `user`
// hook parameter). Do NOT collapse these into one import.
import * as schema from "src/server/infrastructure/db/schema";
import { user as userTable } from "src/server/infrastructure/db/schema";
import { mailer } from "src/server/infrastructure/email/mailer";
import { DrizzlePotRepository } from "src/server/infrastructure/pot-collection/drizzle-pot.repository";
import { DrizzleUnitOfWork } from "src/server/infrastructure/shared/drizzle-unit-of-work";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  advanced: {
    database: {
      generateId: () => createId(),
    },
  },
  rateLimit: {
    // Enabled in every environment (better-auth only enables it in production by
    // default). Default storage is in-memory, which is per-instance — for a
    // multi-instance / serverless deployment switch to { storage: "database" }
    // (adds a rateLimit table: run db:generate + db:migrate) or a Redis-backed
    // secondaryStorage so limits hold across instances.
    enabled: true,
    customRules: {
      // OTP send is the abuse surface (email bombing, SMTP-quota burn). The
      // 30s resend cooldown in verify-page.tsx is client-side only.
      "/email-otp/send-verification-otp": { window: 60, max: 3 },
      "/sign-in/email-otp": { window: 60, max: 5 },
    },
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      async sendVerificationOTP({ email, otp }) {
        const html = await renderOtpEmail(otp, email);
        // Not awaited — avoids timing attacks
        mailer.sendMail({
          to: email,
          subject: "Your Walletko sign-in code",
          html,
        });
      },
    }),
    tanstackStartCookies(), // must be last
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const uow = new DrizzleUnitOfWork();
          const potRepo = new DrizzlePotRepository(uow);
          try {
            await new ProvisionNewUserService({ potRepo, uow }).execute({
              userId: user.id,
            });
          } catch (err) {
            try {
              await db.delete(userTable).where(eq(userTable.id, user.id));
            } catch {
              // compensation failed — user row may be orphaned; original error still propagates
            }
            throw err;
          }
        },
      },
    },
  },
});
