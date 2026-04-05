import path from 'node:path';
import { defineConfig, env } from 'prisma/config';
import "dotenv/config";

export default defineConfig({
  engine: "classic",
  earlyAccess: true,
  schema: path.join('prisma', 'schema.prisma'),

  datasource: {
     url: env('DATABASE_URL'),
  },
});
