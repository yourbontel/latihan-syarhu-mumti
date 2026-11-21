const KEY = 'mumti-study-progress-v1';
const AUTH_KEY = 'mumti-study-auth-v1';
const USERS_KEY = 'mumti-study-users-v1';

const emptyProgress = { version: 1, sessions: [], wrongIds: [], drafts: [] };

const api = async (path, options) => {
  const response = await fetch(path, { headers: { 'content-type': 'application/json' }, ...options });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || 'Permintaan gagal.');
  return body;
};
export async function loginAccount(email, password) { return (await api('/api/account', { method: 'POST', body: JSON.stringify({ action: 'login', email, password }) })).user; }
export async function registerAccount(user) { return (await api('/api/account', { method: 'POST', body: JSON.stringify({ action: 'register', ...user }) })).user; }
export async function loginDemoAccount() { return (await api('/api/account', { method: 'POST', body: JSON.stringify({ action: 'demo' }) })).user; }
export async function loadRemoteProgress(email) { return (await api(`/api/progress?email=${encodeURIComponent(email)}`)).progress; }
export async function saveRemoteProgress(email, progress) { return (await api(`/api/progress?email=${encodeURIComponent(email)}`, { method: 'PUT', body: JSON.stringify(progress) })).progress; }

export function loadProgress() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY));
    if (!parsed || parsed.version !== 1) return emptyProgress;
    const drafts = Array.isArray(parsed.drafts) ? parsed.drafts : parsed.draft ? [parsed.draft] : [];
    return { ...emptyProgress, ...parsed, drafts };
  } catch { return emptyProgress; }
}

export function saveSession(result) {
  const current = loadProgress();
  const sessions = [result, ...current.sessions].slice(0, 30);
  const wrongIds = [...new Set([...current.wrongIds, ...result.wrongIds])];
  const next = { ...current, version: 1, sessions, wrongIds, drafts: current.drafts.filter((draft) => draft.sectionId !== result.section || draft.topic !== result.topic) };
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* session still remains usable */ }
  return next;
}

export function saveDraft(draft) {
  const current = loadProgress();
  const drafts = current.drafts.filter((item) => item.sectionId !== draft.sectionId || item.topic !== draft.topic);
  const next = { ...current, drafts: [draft, ...drafts].slice(0, 3) };
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* session still remains usable */ }
  return next;
}

export function deleteDraft(sectionId, topic) {
  const current = loadProgress();
  const next = { ...current, drafts: current.drafts.filter((draft) => draft.sectionId !== sectionId || draft.topic !== topic) };
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* draft remains visible until reload */ }
  return next;
}

export function clearProgress() {
  try { localStorage.removeItem(KEY); } catch { /* storage may be unavailable */ }
  return emptyProgress;
}

export function loadAuth() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)) || null; } catch { return null; }
}

export function saveAuth(user) {
  try { localStorage.setItem(AUTH_KEY, JSON.stringify(user)); } catch { /* auth remains usable in memory */ }
  return user;
}

export function clearAuth() {
  try { localStorage.removeItem(AUTH_KEY); } catch { /* storage may be unavailable */ }
}

export function loadUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    return Array.isArray(users) ? users : [];
  } catch { return []; }
}

export function registerUser(user) {
  const users = loadUsers();
  const next = [...users, user];
  try { localStorage.setItem(USERS_KEY, JSON.stringify(next)); } catch { /* account remains usable in memory */ }
  return user;
}
