/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",

  testEnvironment: "node",

  roots: ["<rootDir>/src/tests"],

  moduleFileExtensions: ["ts", "js", "json"],

  testMatch: ["**/*.test.ts"],

  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],

  clearMocks: true,

  verbose: true,

  testTimeout: 30000,

  collectCoverage: true,

  collectCoverageFrom: ["src/**/*.ts", "!src/server.ts", "!src/tests/**"],

  coverageDirectory: "coverage",
};
