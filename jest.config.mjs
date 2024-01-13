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
  // setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/*.spec.ts?(x)"],
};

/** @type {import('jest').Config} */
const config = {
  projects: [
    await createJestConfig(clientConfig)(),
    await createJestConfig(serverConfig)(),
  ],
};

export default config;
