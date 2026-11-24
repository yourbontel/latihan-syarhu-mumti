export const emptyProgress = () => ({ version: 1, sessions: [], wrongIds: [], drafts: [] });
async function request(path, input) {
  let response;
  try {
    response = await fetch(`/api/${path}`, { method: input ? 'POST' : 'GET', credentials: 'same-origin', headers: input ? { 'Content-Type': 'application/json' } : {}, body: input ? JSON.stringify(input) : undefined });
  } catch { throw new Error('Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.'); }
  let data;
  try { data = await response.json(); } catch { throw new Error('Server database tidak tersedia. Jalankan aplikasi dengan npm run dev.'); }
  if (!response.ok) throw new Error(data.error || 'Permintaan gagal.');
  return data;
}
export const loadAuth = async () => (await request('auth')).user;
export const authenticate = async (input) => (await request('auth', input)).user;
export const clearAuth = () => request('auth', { action: 'logout' });
export const loadProgress = async () => (await request('progress')).progress;
export const updateProgress = async (action, value) => (await request('progress', { action, value })).progress;
export const loadAdminParticipants = async () => (await request('admin')).participants;
