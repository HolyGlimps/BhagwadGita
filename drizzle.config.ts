import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import path from 'path';
import { config } from 'dotenv';

const envPath = path.resolve(process.cwd(), '.env.local');
config({ path: envPath });

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schemaFilter: ["gita"],
  verbose: true,
  strict: true,
});