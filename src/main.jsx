import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, CircleHelp, Flame, History, LayoutDashboard, LogOut, Menu, RotateCcw, ShieldCheck, Sparkles, Target, Trophy, Users, UserRound, X } from 'lucide-react';
import { ALL_SECTION_ID, getQuestionCount, getQuestionsForSection, getTopics, sections } from './data';
import { clearAuth, clearProgress, loadAuth, loadProgress, loadUsers, registerUser, saveAuth, saveDraft, saveSession } from './storage';
import './styles.css';

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
const pct = (n, total) => total ? Math.round((n / total) * 100) : 0;
const DEMO_ACCOUNT = { name: 'Peserta Demo', email: 'demo@mumti.study', password: 'demo123' };

function App() {
  const [screen, setScreen] = useState(loadAuth() ? 'home' : 'login');
  const [user, setUser] = useState(loadAuth);
  const [sectionId, setSectionId] = useState(null);
  const [topic, setTopic] = useState(null);
  const [session, setSession] = useState(null);
  const [progress, setProgress] = useState(loadProgress);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    if (screen === 'quiz' && session) setProgress(saveDraft(session));
  }, [screen, session]);

  const startSelection = (id) => {
    setSectionId(id); setTopic(null); setScreen('topics');
  };
  const startQuiz = (selectedTopic) => {
    if (!selectedTopic) return;
    const savedDraft = progress.drafts?.find((draft) => draft.sectionId === sectionId && draft.topic === selectedTopic);
    if (savedDraft) { setTopic(selectedTopic); setSession(savedDraft); setScreen('quiz'); return; }
    const pool = getQuestionsForSection(sectionId).filter((q) => q.topic === selectedTopic);
    const nextSession = { sectionId, topic: selectedTopic, questions: shuffle(pool), index: 0, answers: [], selected: null, submitted: false };
    setSession(nextSession); setProgress(saveDraft(nextSession));
    setTopic(selectedTopic); setScreen('quiz');
  };
  const finishQuiz = (answers, quizQuestions) => {
    const correct = answers.filter((answer, i) => answer === quizQuestions[i].answer).length;
    const result = { id: Date.now(), date: new Date().toISOString(), section: sectionId, topic, correct, total: quizQuestions.length, wrongIds: quizQuestions.filter((q, i) => answers[i] !== q.answer).map((q) => q.id) };
    const next = saveSession(result); setProgress(next); setSession({ ...session, result, correct }); setScreen('result');
  };
  const resumeDraft = (draft) => {
    setSectionId(draft.sectionId); setTopic(draft.topic); setSession(draft); setScreen('quiz');
  };
  const answer = (value) => setSession((s) => ({ ...s, selected: value }));
  const submitAnswer = () => {
    if (session.selected === null) return;
    setSession((s) => ({ ...s, submitted: true }));
  };
  const nextQuestion = () => {
    const answers = [...session.answers, session.selected];
    if (session.index === session.questions.length - 1) finishQuiz(answers, session.questions);
    else setSession((s) => ({ ...s, index: s.index + 1, answers, selected: null, submitted: false }));
  };
  const reset = () => { setProgress(clearProgress()); setScreen('home'); };
  const login = (nextUser) => { setUser(saveAuth(nextUser)); setScreen(nextUser.role === 'admin' ? 'admin' : 'home'); };
  const logout = () => { clearAuth(); setUser(null); setScreen('login'); };

  const goHome = () => { setScreen(user?.role === 'admin' ? 'admin' : 'home'); setSidebarOpen(false); };
  return <div className={`app-shell ${screen === 'login' ? 'auth-shell' : ''}`}>
    {screen !== 'login' && <Sidebar open={sidebarOpen} user={user} onClose={() => setSidebarOpen(false)} onHome={goHome} onProgress={() => { setScreen('home'); setSidebarOpen(false); }} onProfile={() => { setScreen('profile'); setSidebarOpen(false); }} onAdmin={() => { setScreen('admin'); setSidebarOpen(false); }} onLogout={() => setConfirmLogout(true)} />}
    {screen !== 'login' && <button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Buka menu"><Menu size={20} /></button>}
    <main className={screen !== 'login' ? 'workspace' : ''}>
      {screen === 'login' && <Login onLogin={login} />}
      {screen === 'login' && <DemoLoginButton onLogin={login} />}
      {screen === 'home' && <Home progress={progress} onSelect={startSelection} onReset={reset} onResume={resumeDraft} />}
      {screen === 'profile' && <Profile user={user} progress={progress} onHome={goHome} />}
      {screen === 'admin' && <Admin onBack={() => setScreen('home')} />}
      {screen === 'topics' && <Topics sectionId={sectionId} onBack={() => setScreen('home')} onStart={startQuiz} />}
      {screen === 'quiz' && <Quiz session={session} onAnswer={answer} onSubmit={submitAnswer} onNext={nextQuestion} onBack={() => setConfirmExit(true)} />}
      {screen === 'result' && <Result session={session} onHome={() => setScreen('home')} onRetry={() => startQuiz(topic)} />}
    </main>
    {confirmExit && <div className="confirm-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirmExit(false); }}><section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-exit-title" aria-describedby="confirm-exit-description"><span className="confirm-icon"><LogOut size={20} /></span><h2 id="confirm-exit-title">Keluar dari latihan?</h2><p id="confirm-exit-description">Progres latihanmu akan disimpan. Kamu bisa melanjutkan lagi nanti.</p><div className="confirm-actions"><button className="secondary-button" onClick={() => setConfirmExit(false)}>Tetap belajar</button><button className="exit-confirm-button" onClick={() => { setConfirmExit(false); setScreen('home'); setSidebarOpen(false); }}>Keluar</button></div></section></div>}
    {confirmLogout && <div className="confirm-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirmLogout(false); }}><section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-logout-title" aria-describedby="confirm-logout-description"><span className="confirm-icon"><LogOut size={20} /></span><h2 id="confirm-logout-title">Keluar dari akun?</h2><p id="confirm-logout-description">Kamu perlu masuk kembali untuk melanjutkan belajar.</p><div className="confirm-actions"><button className="secondary-button" onClick={() => setConfirmLogout(false)}>Batal</button><button className="exit-confirm-button" onClick={() => { setConfirmLogout(false); logout(); }}>Keluar</button></div></section></div>}
  </div>;
}

function Sidebar({ open, user, onClose, onHome, onProgress, onProfile, onAdmin, onLogout }) {
  return <><aside className={`sidebar ${open ? 'open' : ''}`}>
    <div className="sidebar-brand"><span className="brand-mark"><BookOpen size={18} /></span><span><b>Mumti</b> <em>Study</em></span><button className="sidebar-close" onClick={onClose} aria-label="Tutup menu"><X size={18} /></button></div>
    <div className="sidebar-label">Workspace</div>
    <nav className="sidebar-nav"><button onClick={onHome}><LayoutDashboard size={17} /> Beranda</button><button onClick={onProgress}><History size={17} /> Progres belajar</button><button onClick={onProfile}><UserRound size={17} /> Profil pelajar</button>{user?.role === 'admin' && <button onClick={onAdmin}><ShieldCheck size={17} /> Superadmin</button>}</nav>
    <div className="sidebar-spacer" />
    <div className="sidebar-user"><span className="avatar">{(user?.name || 'P').slice(0, 1).toUpperCase()}</span><span><b>{user?.name || 'Peserta'}</b><small>{user?.role === 'admin' ? 'Administrator' : 'Peserta belajar'}</small></span></div>
    <button className="sidebar-logout" onClick={onLogout}><LogOut size={16} /> Keluar</button>
  </aside>{open && <button className="sidebar-overlay" onClick={onClose} aria-label="Tutup menu" />}</>;
}

function Profile({ user, progress, onHome }) {
  const total = progress.sessions.reduce((sum, session) => sum + session.total, 0);
  const correct = progress.sessions.reduce((sum, session) => sum + session.correct, 0);
  const last = progress.sessions[0];
  const initials = (user?.name || 'Peserta').trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  return <div className="profile-page">
    <div className="profile-heading"><div><p className="eyebrow"><UserRound size={14} /> AKUN PELAJAR</p><h1>Profil pelajar</h1><p>Identitas akun dan perjalanan belajarmu di Mumti Study.</p></div><button className="secondary-button" onClick={onHome}><ArrowLeft size={15} /> Beranda</button></div>
    <section className="profile-card"><div className="profile-avatar">{initials}</div><div className="profile-identity"><h2>{user?.name || 'Peserta belajar'}</h2><p>{user?.email || 'Email tidak tersedia'}</p><span className="profile-role"><BookOpen size={13} /> {user?.role === 'admin' ? 'Administrator' : 'Peserta belajar'}</span></div></section>
    <section className="profile-progress"><div className="profile-section-title"><span className="icon-box"><Flame size={18} /></span><div><p className="eyebrow">PERJALANAN BELAJAR</p><h2>Ringkasan progres</h2></div></div><div className="profile-stats"><div><strong>{progress.sessions.length}</strong><span>Sesi selesai</span></div><div><strong>{total ? `${pct(correct, total)}%` : '—'}</strong><span>Rata-rata benar</span></div><div><strong>{progress.wrongIds.length || '—'}</strong><span>Soal perlu diulang</span></div><div><strong>{total}</strong><span>Total soal dijawab</span></div></div><div className="profile-last"><History size={16} /><span>{last ? <>Latihan terakhir: <b>{last.topic}</b> · {new Date(last.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</> : 'Belum ada sesi latihan. Mulai latihan pertamamu dari beranda.'}</span></div></section>
  </div>;
}

function DemoLoginButton({ onLogin }) {
  return <button className="demo-login-button" type="button" onClick={() => onLogin({ name: DEMO_ACCOUNT.name, email: DEMO_ACCOUNT.email, role: 'participant' })}>
    <Users size={16} /> Masuk sebagai peserta demo
  </button>;
}

function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [confirmPassword, setConfirmPassword] = useState(''); const [error, setError] = useState('');
  const isAdmin = mode === 'admin'; const isRegister = mode === 'register';
  const submit = (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password || (!isAdmin && !name.trim())) return setError('Lengkapi semua data untuk melanjutkan.');
    if (password.length < 6) return setError('Kata sandi harus memiliki minimal 6 karakter.');
    if (isRegister) {
      if (password !== confirmPassword) return setError('Konfirmasi kata sandi belum sama.');
      if (loadUsers().some((user) => user.email === normalizedEmail)) return setError('Email tersebut sudah terdaftar.');
      const newUser = { name: name.trim(), email: normalizedEmail, password, role: 'participant' };
      registerUser(newUser); onLogin({ name: newUser.name, email: newUser.email, role: newUser.role }); return;
    }
    if (isAdmin) { if (normalizedEmail !== 'admin@mumti.study' || password !== 'admin123') return setError('Email atau kata sandi superadmin salah.'); onLogin({ name: 'Superadmin', email: normalizedEmail, role: 'admin' }); return; }
    const existing = loadUsers().find((user) => user.email === normalizedEmail && user.password === password)
      || (normalizedEmail === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password ? DEMO_ACCOUNT : null);
    if (!existing) return setError('Email atau kata sandi salah. Daftar akun terlebih dahulu jika belum memiliki akun.');
    onLogin({ name: existing.name, email: existing.email, role: existing.role });
  };
  const loginDemo = () => onLogin({ name: DEMO_ACCOUNT.name, email: DEMO_ACCOUNT.email, role: 'participant' });
  const switchMode = (nextMode) => { setMode(nextMode); setError(''); setPassword(''); setConfirmPassword(''); };
  return <div className="auth-page"><div className="auth-visual"><span className="auth-mark"><BookOpen size={21} /></span><p className="kicker"><Sparkles size={14} /> RUANG BELAJAR</p><h1>Ilmu yang tumbuh<br /><i>setiap hari.</i></h1><p>{isRegister ? 'Buat akun untuk mulai latihan dan menjaga ritme belajarmu.' : 'Masuk untuk melanjutkan latihan dan menjaga ritme belajarmu.'}</p><div className="auth-quote">طَلَبُ الْعِلْمِ<br /><small>adalah perjalanan yang mulia</small></div></div><form className="auth-card" onSubmit={submit}><span className="eyebrow">{isRegister ? 'PESERTA BARU' : 'SELAMAT DATANG'}</span><h2>{isRegister ? 'Daftar sebagai peserta' : isAdmin ? 'Portal superadmin' : 'Masuk sebagai peserta'}</h2><p className="auth-muted">{isRegister ? 'Buat akun gratis untuk menyimpan progres latihan.' : isAdmin ? 'Kelola ruang belajar dari satu tempat.' : 'Gunakan akunmu untuk mengakses latihan.'}</p>{(!isAdmin || isRegister) && <label>Nama lengkap<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu" /></label>}<label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={isAdmin ? 'admin@mumti.study' : 'nama@email.com'} /></label><label>Kata sandi<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" /></label>{isRegister && <label>Konfirmasi kata sandi<input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Ulangi kata sandi" /></label>}{error && <p className="auth-error">{error}</p>}<button className="primary-button auth-submit" type="submit">{isRegister ? 'Buat akun' : 'Masuk'} <ArrowRight size={16} /></button>{!isAdmin && <button className="auth-switch" type="button" onClick={() => switchMode(isRegister ? 'login' : 'register')}>{isRegister ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar peserta'}</button>}<button className="auth-switch" type="button" onClick={() => switchMode(isAdmin ? 'login' : 'admin')}>{isAdmin ? 'Kembali ke login peserta' : 'Masuk sebagai superadmin'}</button><p className="demo-hint"><ShieldCheck size={14} /> Demo lokal: data tidak dikirim ke server.</p></form></div>;
}

function Admin({ onBack }) { const learners = [{ name: 'Ahmad Fauzan', email: 'ahmad@email.com', progress: '80%', status: 'Aktif' }, { name: 'Siti Rahmah', email: 'siti@email.com', progress: '65%', status: 'Aktif' }, { name: 'Muhammad Ali', email: 'm.ali@email.com', progress: '42%', status: 'Baru' }]; return <div className="admin-page"><div className="admin-heading"><div><p className="eyebrow"><ShieldCheck size={14} /> PANEL KONTROL</p><h1>Ringkasan kelas.</h1><p>Kelola peserta dan pantau perkembangan latihan dalam satu pandangan.</p></div><button className="secondary-button" onClick={onBack}><ArrowLeft size={15} /> Lihat ruang belajar</button></div><div className="admin-stats"><div><Users /><strong>24</strong><span>Total peserta</span></div><div><Target /><strong>18</strong><span>Aktif minggu ini</span></div><div><Trophy /><strong>76%</strong><span>Rata-rata nilai</span></div><div><BookOpen /><strong>8</strong><span>Modul tersedia</span></div></div><section className="admin-table"><div className="table-title"><div><p className="eyebrow">PESERTA TERBARU</p><h2>Daftar peserta</h2></div><button className="primary-button small-button">+ Tambah peserta</button></div><div className="table-wrap"><table><thead><tr><th>Peserta</th><th>Status</th><th>Progres</th><th>Nilai terakhir</th></tr></thead><tbody>{learners.map((learner) => <tr key={learner.email}><td><b>{learner.name}</b><small>{learner.email}</small></td><td><span className="status-badge">{learner.status}</span></td><td><div className="table-progress"><span style={{ width: learner.progress }} /></div><small>{learner.progress}</small></td><td><b>{learner.progress === '80%' ? '88%' : learner.progress === '65%' ? '76%' : '—'}</b></td></tr>)}</tbody></table></div></section></div>; }

function Home({ progress, onSelect, onReset, onResume }) {
  const last = progress.sessions[0]; const total = progress.sessions.reduce((a, s) => a + s.correct, 0); const attempted = progress.sessions.reduce((a, s) => a + s.total, 0);
  const mainSections = sections.filter((section) => section.id === ALL_SECTION_ID);
  return <div className="home-page"><section className="hero"><div className="hero-copy"><p className="kicker"><Sparkles size={15} /> LATIHAN TERARAH</p><h1>Menuntut ilmu,<br /><i>satu soal</i> setiap waktu.</h1><p className="hero-text">Latih pemahaman bahasa Arab dan Syarhu Mumti Zadul Mustaqni dengan cara yang tenang, terarah, dan konsisten.</p><div className="hero-meta"><span><Check size={15} /> Pilihan ganda</span><span><Target size={15} /> Progres tersimpan</span></div></div><div className="hero-art"><div className="arch"><div className="arch-inner"><span>طَلَبُ الْعِلْمِ</span><small>طَرِيقٌ إِلَى الْجَنَّةِ</small></div></div><div className="seal">م</div></div></section>
       <section className="section-heading"><div><p className="eyebrow">MULAI DARI SINI</p><h2>Pilih ruang latihan</h2></div><p className="muted">Semua latihan tersedia di halaman 5–24.</p></section>
      {progress.drafts?.length > 0 && <section className="resume-list"><div className="resume-heading"><p className="eyebrow">PROGRES TERSIMPAN</p><h2>Lanjutkan pelajaran</h2></div>{progress.drafts.map((draft) => <button className="resume-card" key={`${draft.sectionId}-${draft.topic}`} onClick={() => onResume(draft)}><span className="resume-icon"><RotateCcw size={18} /></span><span><b>Lanjutkan {draft.topic}</b><small>Soal {draft.index + 1} dari {draft.questions.length} · progres tersimpan</small></span><ArrowRight size={18} /></button>)}</section>}
    <div className="section-grid">{mainSections.map((item) => <button className="section-card" key={item.id} onClick={() => onSelect(item.id)}><div className="card-top"><span className="arabic-badge">{item.icon}</span><span className="card-number">{item.eyebrow}</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="card-bottom"><span>{getQuestionCount(item.id)} soal · {item.topics.length} topik</span><span className="circle-arrow"><ArrowRight size={17} /></span></div></button>)}</div>
    <section className="progress-panel"><div className="panel-title"><span className="icon-box"><Flame size={18} /></span><div><p className="eyebrow">RINGKASAN PROGRES</p><h2>Perjalananmu</h2></div><span className="streak">{progress.sessions.length ? `${progress.sessions.length} sesi` : 'Belum ada sesi'}</span></div><div className="stats"><div><strong>{progress.sessions.length}</strong><span>Sesi selesai</span></div><div><strong>{attempted ? `${pct(total, attempted)}%` : '—'}</strong><span>Rata-rata benar</span></div><div><strong>{progress.wrongIds.length || '—'}</strong><span>Perlu diulang</span></div><div className="last-session">{last ? <><span>Terakhir latihan</span><b>{last.topic} <small>{new Date(last.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</small></b></> : <><span>Tips hari ini</span><b>Mulai 5 soal pertama <ChevronRight size={15} /></b></>}</div></div>{progress.sessions.length > 0 && <button className="text-button" onClick={onReset}><RotateCcw size={14} /> Reset progres</button>}</section>
  </div>;
}

function Topics({ sectionId, onBack, onStart }) { const section = sections.find((s) => s.id === sectionId); const sectionQuestions = getQuestionsForSection(sectionId); const topics = getTopics(sectionId); return <div className="flow-page"><button className="back-button" onClick={onBack}><ArrowLeft size={16} /> Kembali ke beranda</button><div className="flow-intro"><p className="eyebrow">{section.eyebrow}</p><h1>{section.title}</h1><p>Pilih satu pelajaran untuk mulai. Kamu bebas menentukan urutannya.</p></div><div className="topic-list">{topics.map((t, index) => { const count = sectionQuestions.filter((q) => q.topic === t).length; return <button className="topic-card" key={t} onClick={() => onStart(t)}><span className="topic-index">0{index + 1}</span><span><b>{t}</b><small>{count} soal · latihan bertahap</small></span><ArrowRight /></button>; })}</div><div className="note-box"><CircleHelp size={18} /><p><b>Tips belajar</b><br />Kerjakan dengan tenang. Setelah menjawab, baca penjelasan agar setiap soal menjadi bekal baru.</p></div></div>; }

function Quiz({ session, onAnswer, onSubmit, onNext, onBack }) { const q = session.questions[session.index]; const isCorrect = session.selected === q.answer; return <div className="quiz-page"><div className="quiz-nav"><button className="back-button" onClick={onBack}><X size={17} /> Keluar</button><span className="quiz-label">{session.questions.length} soal · {q.topic}</span><span className="quiz-count">{String(session.index + 1).padStart(2, '0')} <small>/ {String(session.questions.length).padStart(2, '0')}</small></span></div><div className="progress-line"><span style={{ width: `${((session.index + (session.submitted ? 1 : 0)) / session.questions.length) * 100}%` }} /></div><div className="question-wrap"><div className="question-meta"><span className="pill">{q.title}</span>{q.chapter && <span className="chapter">{q.chapter}</span>}</div><h1>{q.prompt}</h1><div className="arabic-question" dir="rtl">{q.arabic}</div><div className="options">{q.options.map((option, i) => { let state = ''; if (session.submitted && i === q.answer) state = 'correct'; if (session.submitted && i === session.selected && i !== q.answer) state = 'wrong'; return <button className={`option ${state} ${session.selected === i ? 'selected' : ''}`} key={option} onClick={() => !session.submitted && onAnswer(i)} disabled={session.submitted}><span className="option-letter">{String.fromCharCode(65 + i)}</span><span>{option}</span>{state === 'correct' && <Check className="option-state" size={18} />}{state === 'wrong' && <X className="option-state" size={18} />}</button>; })}</div>{session.submitted ? <div className={`feedback ${isCorrect ? 'positive' : 'negative'}`}><span className="feedback-icon">{isCorrect ? <Check size={18} /> : <CircleHelp size={18} />}</span><div><b>{isCorrect ? 'Jawaban benar.' : 'Belum tepat.'}</b><p>{q.explanation}</p></div></div> : <p className="answer-hint">Pilih satu jawaban yang paling tepat.</p>}<div className="quiz-actions">{!session.submitted ? <button className="primary-button" disabled={session.selected === null} onClick={onSubmit}>Periksa jawaban <ArrowRight size={17} /></button> : <button className="primary-button" onClick={onNext}>{session.index === session.questions.length - 1 ? 'Lihat hasil' : 'Soal berikutnya'} <ArrowRight size={17} /></button>}</div></div></div>; }

function Result({ session, onHome, onRetry }) { const result = session.result; const score = pct(result.correct, result.total); return <div className="result-page"><div className="result-icon"><Trophy size={27} /></div><p className="eyebrow">SESI SELESAI</p><h1>Barakallahu fiik.</h1><p className="result-sub">Satu langkah kecil yang berarti dalam perjalanan belajar.</p><div className="score-card"><div className="score-ring" style={{ '--score': `${score * 3.6}deg` }}><div><strong>{score}</strong><small>%</small></div></div><div className="score-copy"><span>{result.topic}</span><h2>{result.correct} dari {result.total} jawaban benar</h2><p>{score >= 80 ? 'Pemahamanmu terlihat semakin kuat. Pertahankan ritmenya.' : 'Tidak apa-apa. Tinjau kembali penjelasan dan coba lagi.'}</p></div></div><div className="result-actions"><button className="primary-button" onClick={onRetry}><RotateCcw size={17} /> Ulangi latihan</button><button className="secondary-button" onClick={onHome}><History size={17} /> Kembali ke beranda</button></div></div>; }

createRoot(document.getElementById('root')).render(<App />);
