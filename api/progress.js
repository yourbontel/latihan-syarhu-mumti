import { ensureSchema, json, normalizeEmail, query, safeDatabaseError } from './_db.js';

export default async function handler(request, response) {
  const email = normalizeEmail(new URL(request.url, `https://${request.headers.host || 'localhost'}`).searchParams.get('email'));
  if (!email) return json(response, { error: 'Email wajib diisi.' }, 400);
  try {
    await ensureSchema();
    if (request.method === 'GET') {
      const result = await query('SELECT payload FROM progress WHERE email = $1', [email]);
      return json(response, { progress: result.rows[0]?.payload || { version: 1, sessions: [], wrongIds: [], drafts: [] } });
    }
    if (request.method === 'PUT') {
      const payload = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
      await query(`INSERT INTO progress (email, payload) VALUES ($1, $2::jsonb)
        ON CONFLICT (email) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`, [email, JSON.stringify(payload)]);
      return json(response, { progress: payload });
    }
    return json(response, { error: 'Method tidak didukung.' }, 405);
  } catch (error) {
    const diagnostic = safeDatabaseError(error);
    console.error('Progress API error:', diagnostic);
    return json(response, { error: 'Database query gagal.', ...diagnostic }, 500);
  }
}