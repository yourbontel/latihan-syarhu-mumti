import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

const databaseUrl = String(process.env.DATABASE_URL || '').trim().replace(/^['"]|['"]$/g, '');
const sql = postgres(databaseUrl, { prepare: false, max: 1 });
const SESSION_COOKIE = 'mumti_session';
const emptyProgress = { version: 1, sessions: [], wrongIds: [], drafts: [] };

async function ensureSchema() {
  await sql`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'participant', progress JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at TIMESTAMPTZ NOT NULL)`;
}
const send = (res, status, data) => res.status(status).json(data);
const cookie = (value, maxAge) => `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
function getToken(req) { return (req.headers.cookie || '').split(';').map((item) => item.trim()).find((item) => item.startsWith(`${SESSION_COOKIE}=`))?.split('=').slice(1).join('='); }
async function currentUser(req) {
  const token = getToken(req); if (!token) return null;
  const rows = await sql`SELECT u.id, u.name, u.email, u.role, u.progress FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ${token} AND s.expires_at > NOW()`;
  return rows[0] || null;
}
const publicUser = (user) => user && { name: user.name, email: user.email, role: user.role };
async function createSession(res, user) {
  const token = crypto.randomBytes(32).toString('hex');
  await sql`INSERT INTO sessions (token, user_id, expires_at) VALUES (${token}, ${user.id}, NOW() + INTERVAL '30 days')`;
  res.setHeader('Set-Cookie', cookie(token, 60 * 60 * 24 * 30));
}

export default async function handler(req, res) {
  try {
    if (!databaseUrl) return send(res, 500, { error: 'DATABASE_URL belum dikonfigurasi di Vercel.' });
    await ensureSchema();
    const path = new URL(req.url, 'http://localhost').pathname.replace(/^\/api\/?/, '').replace(/\/$/, '');
    if (path === 'health') return send(res, 200, { ok: true });
    if (path === 'auth') {
      if (req.method === 'GET') return send(res, 200, { user: publicUser(await currentUser(req)) });
      if (req.method === 'DELETE') { const token = getToken(req); if (token) await sql`DELETE FROM sessions WHERE token = ${token}`; res.setHeader('Set-Cookie', cookie('', 0)); return send(res, 200, { ok: true }); }
      if (req.method !== 'POST') return send(res, 405, { error: 'Method tidak didukung.' });
      const body = req.body || {}; const email = String(body.email || '').trim().toLowerCase();
      if (body.action === 'register') {
        if (!body.name?.trim() || !email || !body.password || body.password.length < 6) return send(res, 400, { error: 'Data pendaftaran belum lengkap.' });
        const hash = await bcrypt.hash(body.password, 12);
        try { const rows = await sql`INSERT INTO users (name, email, password_hash) VALUES (${body.name.trim()}, ${email}, ${hash}) RETURNING id, name, email, role, progress`; await createSession(res, rows[0]); return send(res, 201, { user: publicUser(rows[0]) }); }
        catch (error) { if (error.code === '23505') return send(res, 409, { error: 'Email tersebut sudah terdaftar.' }); throw error; }
      }
      const rows = await sql`SELECT id, name, email, role, password_hash, progress FROM users WHERE email = ${email}`;
      if (!rows[0] || !(await bcrypt.compare(body.password || '', rows[0].password_hash))) return send(res, 401, { error: 'Email atau kata sandi salah.' });
      await createSession(res, rows[0]); return send(res, 200, { user: publicUser(rows[0]) });
    }
    const user = await currentUser(req); if (!user) return send(res, 401, { error: 'Sesi login tidak ditemukan.' });
    if (path === 'progress') {
      const progress = { ...emptyProgress, ...(user.progress || {}) };
      if (req.method === 'GET') return send(res, 200, { progress });
      if (req.method === 'DELETE') { await sql`UPDATE users SET progress = ${JSON.stringify(emptyProgress)}::jsonb WHERE id = ${user.id}`; return send(res, 200, { progress: emptyProgress }); }
      if (req.method === 'PUT') {
        const body = req.body || {}; let next = progress;
        if (body.action === 'session') next = { ...progress, sessions: [body.result, ...progress.sessions].slice(0, 30), wrongIds: [...new Set([...progress.wrongIds, ...(body.result.wrongIds || [])])], drafts: progress.drafts.filter((draft) => draft.sectionId !== body.result.section || draft.topic !== body.result.topic) };
        if (body.action === 'draft') next = { ...progress, drafts: [body.draft, ...progress.drafts.filter((item) => item.sectionId !== body.draft.sectionId || item.topic !== body.draft.topic)].slice(0, 3) };
        if (body.action === 'deleteDraft') next = { ...progress, drafts: progress.drafts.filter((draft) => draft.sectionId !== body.sectionId || draft.topic !== body.topic) };
        await sql`UPDATE users SET progress = ${JSON.stringify(next)}::jsonb WHERE id = ${user.id}`; return send(res, 200, { progress: next });
      }
    }
    return send(res, 404, { error: 'Endpoint tidak ditemukan.' });
  } catch (error) { console.error(error); return send(res, 500, { error: 'Terjadi kesalahan pada server database.' }); }
}