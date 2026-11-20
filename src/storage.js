const KEY = 'mumti-study-progress-v1';
const AUTH_KEY = 'mumti-study-auth-v1';
const USERS_KEY = 'mumti-study-users-v1';

const emptyProgress = { version: 1, sessions: [], wrongIds: [], drafts: [] };

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
