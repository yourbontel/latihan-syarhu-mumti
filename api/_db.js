import { sql } from '@vercel/postgres';

export async function ensureSchema() {
  await sql`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'participant'
  )`;
  await sql`CREATE TABLE IF NOT EXISTS progress (
    email TEXT PRIMARY KEY REFERENCES users(email) ON DELETE CASCADE,
    payload JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
}

export const json = (response, body, status = 200) => response.status(status).json(body);

export const normalizeEmail = (email) => String(email || '').trim().toLowerCase();