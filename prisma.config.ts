import path from "node:path";
import { readFileSync } from "node:fs";
import { defineConfig } from "prisma/config";

// Manually load .env since Prisma CLI reads this config before processing .env
function loadEnv() {
  try {
    const envFile = readFileSync(path.join(process.cwd(), ".env"), "utf-8");
    for (const line of envFile.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      const value = rest.join("=").replace(/^"|"$/g, "");
      if (key && !(key in process.env)) process.env[key] = value;
    }
  } catch {}
}

loadEnv();

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
