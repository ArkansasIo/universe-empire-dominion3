import { spawn } from "node:child_process";

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const nodeEnv = process.env.NODE_ENV ?? "development";

const command = hasDatabaseUrl
  ? "npx tsx server/index.ts"
  : "npx vite dev --port 5000";

if (hasDatabaseUrl) {
  console.log("Starting full-stack development server...");
} else {
  console.log("DATABASE_URL not found. Starting client-only dev server.");
  console.log("Set DATABASE_URL to run backend + API routes.");
}

const child = spawn(command, {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: nodeEnv,
  },
});

child.on("exit", (code: number | null) => {
  process.exit(code ?? 0);
});

child.on("error", (error: Error) => {
  console.error("Failed to start development process:", error);
  process.exit(1);
});
