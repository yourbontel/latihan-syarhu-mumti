import { ensureSchema, json, normalizeEmail, sql } from './_db.js';

export default async function handler(request, response) {
  const email = normalizeEmail(new URL(request.url, `https://${request.headers.host || 'localhost'}`).searchParams.get('email'));
  if (!email) return json(response, { error: 'Email wajib diisi.' }, 400);
  try {
    await ensureSchema();
    if (request.method === 'GET') {
      const result = await sql`SELECT payload FROM progress WHERE email = ${email}`;
      return json(response, { progress: result.rows[0]?.payload || { version: 1, sessions: [], wrongIds: [], drafts: [] } });
    }
    if (request.method === 'PUT') {
      const payload = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
      await sql`INSERT INTO progress (email, payload) VALUES (${email}, ${JSON.stringify(payload)}::jsonb)
        ON CONFLICT (email) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`;
      return json(response, { progress: payload });
    }
    return json(response, { error: 'Method tidak didukung.' }, 405);
  } catch {
    return json(response, { error: 'Database belum terhubung di Vercel.' }, 500);
  }
}