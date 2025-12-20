/// File: prisma.config.ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Reads from your .env / .env.local DATABASE_URL
    url: env('DATABASE_URL'),
  },
});
