import { ensureSchema, json, normalizeEmail, query } from './_db.js';

const DEMO = { name: 'Peserta Demo', email: 'demo@mumti.study', password: 'demo123', role: 'participant' };

export default async function handler(request, response) {
  if (request.method !== 'POST') return json(response, { error: 'Method tidak didukung.' }, 405);
  try {
    await ensureSchema();
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : (request.body || {});
    const email = normalizeEmail(body.email);
    if (body.action === 'demo') {
      await query('DELETE FROM users WHERE email = $1', [DEMO.email]);
      await query('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)', [DEMO.name, DEMO.email, DEMO.password, DEMO.role]);
      return json(response, { user: { name: DEMO.name, email: DEMO.email, role: DEMO.role } });
    }
    if (!email || !body.password) return json(response, { error: 'Email dan kata sandi wajib diisi.' }, 400);
    if (body.action === 'register') {
      if (!body.name?.trim()) return json(response, { error: 'Nama wajib diisi.' }, 400);
      const result = await query("INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'participant') RETURNING name, email, role", [body.name.trim(), email, body.password]);
      return json(response, { user: result.rows[0] }, 201);
    }
    const result = await query('SELECT name, email, role FROM users WHERE email = $1 AND password = $2', [email, body.password]);
    if (!result.rows[0]) return json(response, { error: 'Email atau kata sandi salah.' }, 401);
    return json(response, { user: result.rows[0] });
  } catch (error) {
    console.error('Account API error:', error.code || error.name);
    return json(response, { error: error.code === '23505' ? 'Email tersebut sudah terdaftar.' : 'Database query gagal.', code: error.code || error.name }, 500);
  }
}