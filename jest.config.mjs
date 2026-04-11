/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const clientConfig = {
  displayName: "client",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/*.test.ts?(x)"],
};

/** @type {import('jest').Config} */
const serverConfig = {
  displayName: "server",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest-server.setup.ts"],
  testMatch: ["**/*.spec.ts?(x)"],
};

/** @type {import('jest').Config} */
const serverUnitConfig = {
  displayName: "serverUnit",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: [],
  testMatch: ["**/*/server/**/*.spec.ts?(x)"],
};

const resolvedServerUnitConfig = await createJestConfig(serverUnitConfig)();

const resolvedIntegrationConfig = await createJestConfig({
  displayName: "integration",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/*.integration.ts"],
  globalSetup: "<rootDir>/tests/integration/setup.ts",
  globalTeardown: "<rootDir>/tests/integration/teardown.ts",
})();

const integrationConfig = {
  ...resolvedIntegrationConfig,
  transformIgnorePatterns: [
    "/node_modules/(?!\\.pnpm)(?!(@paralleldrive/cuid2|@noble/hashes|geist)/)",
    "/node_modules/.pnpm/(?!(@paralleldrive\\+cuid2|@noble\\+hashes|geist)@)",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
};

/** @type {import('jest').Config} */
const config = {
  projects: [
    await createJestConfig(clientConfig)(),
    await createJestConfig(serverConfig)(),
    {
      ...resolvedServerUnitConfig,
      transformIgnorePatterns: [
        "/node_modules/(?!\\.pnpm)(?!(@paralleldrive/cuid2|@noble/hashes|geist)/)",
        "/node_modules/.pnpm/(?!(@paralleldrive\\+cuid2|@noble\\+hashes|geist)@)",
        "^.+\\.module\\.(css|sass|scss)$",
      ],
    },
    integrationConfig,
  ],
};

export default config;
