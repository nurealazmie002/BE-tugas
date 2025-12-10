import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv"

export default defineConfig({
  schema: "src/prisma",
  migrations: {
    path: "src/prisma/migrations",
  },
  datasource: {
    url: "process.env.DATABASE_URL",
  },
});