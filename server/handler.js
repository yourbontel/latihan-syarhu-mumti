import pg from 'pg';
import { randomUUID, randomBytes, createHash, scryptSync, timingSafeEqual } from 'node:crypto';

export const emptyProgress = () => ({ version: 1, sessions: [], wrongIds: [], drafts: [] });
let pool, ready;
const hash = (s) => createHash('sha256').update(s).digest('hex');
const fail = (message, status = 400) => { throw Object.assign(new Error(message), { status }); };
const safeUser = ({ id, name, email, role }) => ({ id, name, email, role });
async function database() {
  const connectionString = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) fail('Database belum dikonfigurasi. Isi DATABASE_URL pada server.', 503);
  pool ||= new pg.Pool({ connectionString, max: 3, connectionTimeoutMillis: 10000, idleTimeoutMillis: 10000 });
  ready ||= (async () => {
    await pool.query(`CREATE TABLE IF NOT EXISTS mumti_users (id UUID PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'participant')`);
    await pool.query(`CREATE TABLE IF NOT EXISTS mumti_auth_sessions (token_hash TEXT PRIMARY KEY, user_id UUID NOT NULL REFERENCES mumti_users(id) ON DELETE CASCADE, expires_at TIMESTAMPTZ NOT NULL)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS mumti_progress (user_id UUID PRIMARY KEY REFERENCES mumti_users(id) ON DELETE CASCADE, data JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  })().catch((e) => { ready = undefined; throw e; });
  await ready;
  return pool;
}
async function readBody(req) {
  if (req.body) return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  let text = '';
  for await (const chunk of req) { text += chunk; if (Buffer.byteLength(text) > 1048576) fail('Data terlalu besar.', 413); }
  try { return JSON.parse(text || '{}'); } catch { fail('Data tidak valid.'); }
}
export function mutateProgress(current, action, value) {
  if (action === 'reset') return emptyProgress();
  if (action === 'draft') {
    if (!value || typeof value.sectionId !== 'string' || typeof value.topic !== 'string' || !Array.isArray(value.questions) || !value.questions.length || !Array.isArray(value.answers) || !Number.isInteger(value.index) || value.index < 0 || value.index >= value.questions.length) fail('Sesi latihan tidak valid.');
    return { ...current, drafts: [value, ...current.drafts.filter((d) => d.sectionId !== value.sectionId || d.topic !== value.topic)].slice(0, 3) };
  }
  if (action === 'deleteDraft') {
    if (!value || typeof value.sectionId !== 'string' || typeof value.topic !== 'string') fail('Sesi latihan tidak valid.');
    return { ...current, drafts: current.drafts.filter((d) => d.sectionId !== value.sectionId || d.topic !== value.topic) };
  }
  if (action === 'session') {
    if (!value || !value.id || typeof value.section !== 'string' || typeof value.topic !== 'string' || !Array.isArray(value.wrongIds) || !Number.isInteger(value.total) || !Number.isInteger(value.correct) || value.total < 1 || value.correct < 0 || value.correct > value.total || (value.items !== undefined && (!Array.isArray(value.items) || value.items.some((item) => !item || typeof item.id !== 'string')))) fail('Hasil latihan tidak valid.');
    return { ...current, sessions: [value, ...current.sessions.filter((s) => s.id !== value.id)].slice(0, 30), wrongIds: [...new Set([...current.wrongIds, ...value.wrongIds])], drafts: current.drafts.filter((d) => d.sectionId !== value.section || d.topic !== value.topic) };
  }
  fail('Operasi progres tidak valid.');
}
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  const send = (data, status = 200) => { res.statusCode = status; res.end(JSON.stringify(data)); };
  const token = /(?:^|;\s*)mumti_session=([a-f0-9]+)/.exec(req.headers.cookie || '')?.[1];
  const setCookie = (value, age) => res.setHeader('Set-Cookie', `mumti_session=${value}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${age}${process.env.VERCEL || req.headers['x-forwarded-proto'] === 'https' ? '; Secure' : ''}`);
  try {
    if (!['GET', 'POST'].includes(req.method)) return send({ error: 'Metode tidak diizinkan.' }, 405);
    if (req.method === 'POST' && req.headers.origin && new URL(req.headers.origin).host !== (req.headers['x-forwarded-host'] || req.headers.host)) fail('Asal permintaan tidak diizinkan.', 403);
    const db = await database();
    const route = new URL(req.url, 'http://localhost').pathname;
    if (route === '/api/health' && req.method === 'GET') return send({ ok: true });
    if (route === '/api/auth' && req.method === 'POST') {
      const input = await readBody(req);
      if (input.action === 'logout') {
        if (token) await db.query('DELETE FROM mumti_auth_sessions WHERE token_hash=$1', [hash(token)]);
        setCookie('', 0); return send({ user: null });
      }
      const email = String(input.email || '').trim().toLowerCase();
      const password = String(input.password || '');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || password.length < 6 || password.length > 256) fail('Masukkan email dan kata sandi yang valid (6–256 karakter).');
      let user;
      if (input.action === 'register') {
        const name = String(input.name || '').trim();
        if (!name || name.length > 120) fail('Nama tidak valid.');
        const salt = randomBytes(16).toString('hex');
        const passwordHash = `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
        try { user = (await db.query('INSERT INTO mumti_users (id,email,name,password_hash) VALUES ($1,$2,$3,$4) RETURNING *', [randomUUID(), email, name, passwordHash])).rows[0]; }
        catch (e) { if (e.code === '23505') fail('Email tersebut sudah terdaftar.', 409); throw e; }
      } else if (input.action === 'login') {
        user = (await db.query('SELECT * FROM mumti_users WHERE email=$1', [email])).rows[0];
        const [salt, key] = (user?.password_hash || `missing:${'00'.repeat(64)}`).split(':');
        const valid = timingSafeEqual(Buffer.from(key, 'hex'), scryptSync(password, salt, 64));
        if (!user || !valid) fail('Email atau kata sandi salah.', 401);
      } else fail('Operasi akun tidak valid.');
      const nextToken = randomBytes(32).toString('hex');
      await db.query("INSERT INTO mumti_auth_sessions VALUES ($1,$2,NOW()+INTERVAL '30 days')", [hash(nextToken), user.id]);
      setCookie(nextToken, 2592000); return send({ user: safeUser(user) });
    }
    const user = token ? (await db.query('SELECT u.* FROM mumti_users u JOIN mumti_auth_sessions s ON s.user_id=u.id WHERE s.token_hash=$1 AND s.expires_at>NOW()', [hash(token)])).rows[0] : null;
    if (route === '/api/auth') return send({ user: user ? safeUser(user) : null });
    if (route === '/api/admin' && req.method === 'GET') {
      if (!user) fail('Silakan masuk kembali untuk mengakses halaman ini.', 401);
      if (user.role !== 'admin') fail('Akses ditolak. Hanya superadmin yang dapat melihat data peserta.', 403);
      const rows = (await db.query(`SELECT u.id, u.name, u.email, u.role, p.data AS progress, p.updated_at FROM mumti_users u LEFT JOIN mumti_progress p ON p.user_id = u.id WHERE u.role != 'admin' ORDER BY p.updated_at DESC NULLS LAST, u.name ASC`)).rows;
      return send({ participants: rows.map((r) => ({ id: r.id, name: r.name, email: r.email, role: r.role, updatedAt: r.updated_at, progress: r.progress || emptyProgress() })) });
    }
    if (route !== '/api/progress') return send({ error: 'Tidak ditemukan.' }, 404);
    if (!user) fail('Silakan masuk kembali untuk menyimpan progres.', 401);
    if (req.method === 'GET') return send({ progress: (await db.query('SELECT data FROM mumti_progress WHERE user_id=$1', [user.id])).rows[0]?.data || emptyProgress() });
    const { action, value } = await readBody(req);
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      await client.query('INSERT INTO mumti_progress (user_id,data) VALUES ($1,$2) ON CONFLICT DO NOTHING', [user.id, JSON.stringify(emptyProgress())]);
      const current = (await client.query('SELECT data FROM mumti_progress WHERE user_id=$1 FOR UPDATE', [user.id])).rows[0].data;
      const progress = mutateProgress(current, action, value);
      await client.query('UPDATE mumti_progress SET data=$2,updated_at=NOW() WHERE user_id=$1', [user.id, JSON.stringify(progress)]);
      await client.query('COMMIT'); return send({ progress });
    } catch (e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
  } catch (e) { send({ error: e.status ? e.message : 'Koneksi database gagal. Coba kembali sebentar lagi.' }, e.status || 503); }
}