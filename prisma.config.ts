import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "src/prisma",
  migrations: {
    path: "src/prisma/migrations",
    // UBAH BARIS INI (tambahkan 'src/'):
    seed: "tsx src/prisma/seed.ts", 
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});