import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/infrastructure/db/schema/index.ts",
  out: "./src/server/infrastructure/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
