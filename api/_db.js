import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL_POOLED || process.env.POSTGRES_URL || process.env.DATABASE_URL;
export const sql = neon(connectionString);
export const query = async (text, values = []) => ({ rows: await sql.query(text, values) });

export async function ensureSchema() {
  await query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'participant'
  )`);
  await query(`CREATE TABLE IF NOT EXISTS progress (
    email TEXT PRIMARY KEY REFERENCES users(email) ON DELETE CASCADE,
    payload JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
}

export const json = (response, body, status = 200) => response.status(status).json(body);

export const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
export const safeDatabaseError = (error) => ({
  code: error.code || error.name,
  detail: String(error.message || 'Unknown database error')
    .replace(/postgres(?:ql)?:\/\/[^\s'"<>]+/gi, '[database-url-redacted]')
    .replace(/password\s*[=:]\s*[^\s,;]+/gi, 'password=[redacted]')
    .slice(0, 240),
});