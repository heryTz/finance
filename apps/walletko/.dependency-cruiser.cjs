/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "frontend-only-touches-server-public",
      comment:
        "Frontend (features/shared/routes) may import only server/functions and server/contracts.",
      severity: "error",
      from: { path: "^src/(features|shared|routes)" },
      to: { path: "^src/server/(domain|application|infrastructure)" },
    },
    {
      name: "server-never-imports-frontend",
      comment: "Server must stay standalone.",
      severity: "error",
      from: { path: "^src/server" },
      to: { path: "^src/(features|shared|routes)" },
    },
    {
      name: "contracts-stay-pure",
      comment: "Contracts are plain types; no implementation leakage.",
      severity: "error",
      from: { path: "^src/server/contracts" },
      to: { path: "^src/server/(domain|application|infrastructure)" },
    },
    {
      name: "shared-never-imports-features",
      comment: "shared/ is foundational; it must not depend on any feature.",
      severity: "error",
      from: { path: "^src/shared" },
      to: { path: "^src/features" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: { exportsFields: ["exports"], conditionNames: ["import", "require"] },
  },
};
