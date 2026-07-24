import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Cache the connection globally in development to prevent connection exhaustion from Next.js HMR
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// Disable prefetch and set max to 1 to respect Supabase transaction pool limits
const conn = globalForDb.conn ?? postgres(connectionString, { prepare: false, max: 1 });
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });

export type Database = typeof db;