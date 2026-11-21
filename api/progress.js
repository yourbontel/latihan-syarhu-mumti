import { sql } from '@vercel/postgres';
import { ensureSchema, json, normalizeEmail } from './_db.js';

export default async function handler(request) {
  const email = normalizeEmail(new URL(request.url).searchParams.get('email'));
  if (!email) return json({ error: 'Email wajib diisi.' }, 400);
  try {
    await ensureSchema();
    if (request.method === 'GET') {
      const result = await sql`SELECT payload FROM progress WHERE email = ${email}`;
      return json({ progress: result.rows[0]?.payload || { version: 1, sessions: [], wrongIds: [], drafts: [] } });
    }
    if (request.method === 'PUT') {
      const payload = await request.json();
      await sql`INSERT INTO progress (email, payload) VALUES (${email}, ${JSON.stringify(payload)}::jsonb)
        ON CONFLICT (email) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`;
      return json({ progress: payload });
    }
    return json({ error: 'Method tidak didukung.' }, 405);
  } catch {
    return json({ error: 'Database belum terhubung di Vercel.' }, 500);
  }
}