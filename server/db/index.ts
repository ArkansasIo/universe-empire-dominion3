import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log('🔌 Connecting to database...');

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

// Test connection and log status
pool.connect()
  .then(client => {
    console.log('✅ Database connection established');
    client.release();
  })
  .catch(error => {
    console.error('❌ Database connection failed:', error.message);
    console.error('⚠️  Server will start but database operations will fail');
    console.error('💡 Make sure PostgreSQL is running or update DATABASE_URL');
  });

export const db = drizzle({ client: pool, schema });
