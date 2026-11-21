const emptyProgress = { version: 1, sessions: [], wrongIds: [], drafts: [] };
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}/api${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json', ...options.headers }, ...options });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body.error || 'Koneksi ke database gagal.');
  return body;
}

export async function loadAuth() { try { return (await request('/auth')).user || null; } catch { return null; } }
export async function loginUser(email, password) { return (await request('/auth', { method: 'POST', body: JSON.stringify({ action: 'login', email, password }) })).user; }
export async function registerUser(user) { return (await request('/auth', { method: 'POST', body: JSON.stringify({ action: 'register', ...user }) })).user; }
export async function logoutUser() { await request('/auth', { method: 'DELETE' }); }
export async function loadProgress() { try { return (await request('/progress')).progress || emptyProgress; } catch { return emptyProgress; } }
export async function saveSession(result) { return (await request('/progress', { method: 'PUT', body: JSON.stringify({ action: 'session', result }) })).progress; }
export async function saveDraft(draft) { return (await request('/progress', { method: 'PUT', body: JSON.stringify({ action: 'draft', draft }) })).progress; }
export async function deleteDraft(sectionId, topic) { return (await request('/progress', { method: 'PUT', body: JSON.stringify({ action: 'deleteDraft', sectionId, topic }) })).progress; }
export async function clearProgress() { return (await request('/progress', { method: 'DELETE' })).progress; }
export { emptyProgress };
