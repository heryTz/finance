import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globalSetup: "./tests/integration/setup.ts",
    projects: [
      {
        test: {
          name: "unit",
          environment: "node",
          globals: true,
          include: ["tests/server/**/*.spec.ts"],
        },
      },
      {
        test: {
          name: "integration",
          environment: "node",
          globals: true,
          include: ["tests/server/**/*.integration.ts"],
        },
      },
    ],
  },
});
