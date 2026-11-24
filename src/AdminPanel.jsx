import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, Check, ChevronRight, CircleHelp, Eye, History, LoaderCircle, RotateCcw, Search, ShieldCheck, Target, Trophy, Users, X } from 'lucide-react';
import { questions as allQuestions } from './data';
import { isAnswered } from './quiz';
import { loadAdminParticipants } from './storage';

const pct = (n, total) => (total ? Math.round((n / total) * 100) : 0);
const questionMap = new Map(allQuestions.map((q) => [q.id, q]));

function buildAttempts(progress) {
  const drafts = (progress?.drafts || []).map((draft) => {
    const rows = (draft.questions || []).map((rawQ, index) => {
      const q = questionMap.get(rawQ.id) || rawQ;
      const ans = draft.answers?.[index];
      const answered = isAnswered(ans);
      const correct = answered && ans === q.answer;
      return {
        id: q.id,
        number: index + 1,
        question: q,
        selected: answered ? ans : null,
        correct,
        status: answered ? (correct ? 'correct' : 'wrong') : 'unanswered',
      };
    });
    const answeredCount = rows.filter((r) => r.status !== 'unanswered').length;
    const correctCount = rows.filter((r) => r.correct).length;
    return {
      key: `draft-${draft.sectionId}-${draft.topic}`,
      kind: 'draft',
      topic: draft.topic,
      date: null,
      answeredCount,
      correct: correctCount,
      total: rows.length,
      hasDetails: true,
      rows,
    };
  });

  const sessions = (progress?.sessions || []).map((session) => {
    const hasDetails = Array.isArray(session.items) && session.items.length > 0;
    const rows = hasDetails
      ? session.items.map((item, index) => {
          const q = questionMap.get(item.id);
          const selected = isAnswered(item.selected) ? item.selected : null;
          const correct = Boolean(item.correct);
          return {
            id: item.id,
            number: index + 1,
            question: q,
            selected,
            correct,
            status: correct ? 'correct' : 'wrong',
          };
        })
      : (session.wrongIds || []).map((id, index) => ({
          id,
          number: index + 1,
          question: questionMap.get(id),
          selected: null,
          correct: false,
          status: 'wrong',
          legacy: true,
        }));

    return {
      key: `session-${session.id}`,
      kind: 'session',
      topic: session.topic,
      date: session.date,
      answeredCount: session.total,
      correct: session.correct,
      total: session.total,
      hasDetails,
      rows,
    };
  });

  return [...drafts, ...sessions];
}

export default function AdminPanel({ onBack }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [activeAttemptKey, setActiveAttemptKey] = useState(null);
  const [questionFilter, setQuestionFilter] = useState('all');

  const fetchParticipants = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await loadAdminParticipants();
      setParticipants(list);
    } catch (err) {
      setError(err.message || 'Gagal memuat data peserta.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const stats = useMemo(() => {
    let activeCount = 0;
    let totalSessions = 0;
    let totalCorrect = 0;
    let totalAttempted = 0;
    for (const p of participants) {
      const sessions = p.progress?.sessions || [];
      const drafts = p.progress?.drafts || [];
      if (sessions.length > 0 || drafts.length > 0) activeCount += 1;
      totalSessions += sessions.length;
      for (const s of sessions) {
        totalCorrect += s.correct || 0;
        totalAttempted += s.total || 0;
      }
    }
    return {
      totalParticipants: participants.length,
      activeCount,
      avgScore: totalAttempted ? `${pct(totalCorrect, totalAttempted)}%` : '—',
      totalSessions,
    };
  }, [participants]);

  const filteredParticipants = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return participants;
    return participants.filter((p) => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q));
  }, [participants, search]);

  const selectedParticipant = useMemo(
    () => participants.find((p) => p.id === selectedId) || null,
    [participants, selectedId]
  );

  const attempts = useMemo(
    () => (selectedParticipant ? buildAttempts(selectedParticipant.progress) : []),
    [selectedParticipant]
  );

  const activeAttempt = useMemo(
    () => attempts.find((a) => a.key === activeAttemptKey) || attempts[0] || null,
    [attempts, activeAttemptKey]
  );

  const filteredRows = useMemo(() => {
    if (!activeAttempt) return [];
    if (questionFilter === 'all') return activeAttempt.rows;
    return activeAttempt.rows.filter((r) => r.status === questionFilter);
  }, [activeAttempt, questionFilter]);

  const openParticipant = (participant) => {
    setSelectedId(participant.id);
    setActiveAttemptKey(null);
    setQuestionFilter('all');
  };

  if (selectedParticipant) {
    const sessions = selectedParticipant.progress?.sessions || [];
    const totalAnswered = sessions.reduce((sum, s) => sum + (s.total || 0), 0);
    const totalCorrect = sessions.reduce((sum, s) => sum + (s.correct || 0), 0);

    return (
      <div className="admin-page">
        <div className="admin-heading">
          <div>
            <button className="back-button" onClick={() => setSelectedId(null)}>
              <ArrowLeft size={16} /> Kembali ke daftar peserta
            </button>
            <p className="eyebrow" style={{ marginTop: 14 }}><Users size={14} /> DETAIL PESERTA</p>
            <h1>{selectedParticipant.name}</h1>
            <p>{selectedParticipant.email} · {sessions.length} sesi selesai · Rata-rata {totalAnswered ? `${pct(totalCorrect, totalAnswered)}%` : '—'}</p>
          </div>
          <button className="secondary-button" onClick={fetchParticipants} disabled={loading}>
            <RotateCcw size={15} /> Muat ulang
          </button>
        </div>

        {attempts.length === 0 ? (
          <div className="admin-empty">
            <BookOpen size={24} />
            <b>Belum ada soal yang dikerjakan</b>
            <p>Peserta ini belum memulai atau menyelesaikan sesi latihan.</p>
          </div>
        ) : (
          <div className="admin-detail-layout">
            <aside className="admin-attempts">
              <div className="admin-panel-label">RIWAYAT & PROGRES LATIHAN ({attempts.length})</div>
              <div className="admin-attempt-list">
                {attempts.map((attempt) => {
                  const isActive = activeAttempt?.key === attempt.key;
                  return (
                    <button
                      key={attempt.key}
                      className={`admin-attempt-card ${isActive ? 'active' : ''}`}
                      onClick={() => { setActiveAttemptKey(attempt.key); setQuestionFilter('all'); }}
                    >
                      <div className="admin-attempt-top">
                        <span className={`status-badge ${attempt.kind === 'draft' ? 'status-draft' : ''}`}>
                          {attempt.kind === 'draft' ? 'Sedang dikerjakan' : 'Selesai'}
                        </span>
                        <span className="admin-attempt-score">
                          {attempt.kind === 'draft'
                            ? `${attempt.answeredCount}/${attempt.total} dijawab`
                            : `${pct(attempt.correct, attempt.total)}%`}
                        </span>
                      </div>
                      <b>{attempt.topic}</b>
                      <small>
                        {attempt.kind === 'draft'
                          ? `${attempt.correct} benar dari ${attempt.answeredCount} dijawab`
                          : `${attempt.correct}/${attempt.total} benar · ${new Date(attempt.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                      </small>
                    </button>
                  );
                })}
              </div>
            </aside>

            {activeAttempt && (
              <section className="admin-questions-panel">
                <div className="admin-questions-header">
                  <div>
                    <p className="eyebrow">
                      {activeAttempt.kind === 'draft' ? 'PROGRES BERLANGSUNG' : 'SESI SELESAI'}
                    </p>
                    <h2>{activeAttempt.topic}</h2>
                    <p className="muted">
                      {activeAttempt.correct} benar dari {activeAttempt.total} soal
                      {activeAttempt.kind === 'draft' ? ` (${activeAttempt.answeredCount} sudah diperiksa)` : ''}
                    </p>
                  </div>
                  <div className="admin-filter-pills">
                    <button className={questionFilter === 'all' ? 'active' : ''} onClick={() => setQuestionFilter('all')}>
                      Semua ({activeAttempt.rows.length})
                    </button>
                    <button className={questionFilter === 'correct' ? 'active' : ''} onClick={() => setQuestionFilter('correct')}>
                      Benar ({activeAttempt.rows.filter((r) => r.status === 'correct').length})
                    </button>
                    <button className={questionFilter === 'wrong' ? 'active' : ''} onClick={() => setQuestionFilter('wrong')}>
                      Salah ({activeAttempt.rows.filter((r) => r.status === 'wrong').length})
                    </button>
                    {activeAttempt.kind === 'draft' && (
                      <button className={questionFilter === 'unanswered' ? 'active' : ''} onClick={() => setQuestionFilter('unanswered')}>
                        Belum ({activeAttempt.rows.filter((r) => r.status === 'unanswered').length})
                      </button>
                    )}
                  </div>
                </div>

                {!activeAttempt.hasDetails && (
                  <div className="note-box" style={{ marginTop: 0, marginBottom: 16 }}>
                    <CircleHelp size={18} />
                    <p>
                      <b>Sesi versi lama</b><br />
                      Sesi ini diselesaikan sebelum pencatatan jawaban per soal diaktifkan, sehingga hanya daftar soal yang salah yang tersedia.
                    </p>
                  </div>
                )}

                {filteredRows.length === 0 ? (
                  <div className="admin-empty">
                    <Check size={22} />
                    <b>Tidak ada soal pada filter ini</b>
                    <p>Pilih filter lain untuk melihat soal yang dikerjakan peserta.</p>
                  </div>
                ) : (
                  <div className="admin-question-list">
                    {filteredRows.map((row) => {
                      const q = row.question;
                      if (!q) {
                        return (
                          <article key={`${row.id}-${row.number}`} className="admin-question-card">
                            <div className="admin-question-meta">
                              <span className="pill">Soal #{row.number}</span>
                              <span className="chapter">ID: {row.id}</span>
                            </div>
                            <p className="muted">Data soal tidak ditemukan di bank soal saat ini.</p>
                          </article>
                        );
                      }

                      return (
                        <article key={`${row.id}-${row.number}`} className={`admin-question-card ${row.status}`}>
                          <div className="admin-question-meta">
                            <span className="pill">#{row.number} · {q.title}</span>
                            <span className={`status-badge ${row.status === 'correct' ? '' : row.status === 'wrong' ? 'status-wrong' : 'status-draft'}`}>
                              {row.status === 'correct' ? 'Benar' : row.status === 'wrong' ? 'Salah' : 'Belum dijawab'}
                            </span>
                          </div>
                          <h3>{q.prompt}</h3>
                          {q.arabic && <div className="arabic-question admin-arabic" dir="rtl">{q.arabic}</div>}
                          <div className="admin-options">
                            {q.options.map((opt, idx) => {
                              const isChosen = row.selected === idx;
                              const isAnswer = q.answer === idx;
                              const cls = [
                                'admin-option',
                                isAnswer ? 'is-answer' : '',
                                isChosen && !isAnswer ? 'is-chosen-wrong' : '',
                                isChosen && isAnswer ? 'is-chosen-correct' : '',
                              ].filter(Boolean).join(' ');
                              return (
                                <div key={opt} className={cls}>
                                  <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                                  <span className="admin-option-text">{opt}</span>
                                  {isChosen && (
                                    <span className="admin-option-tag">
                                      {isAnswer ? <><Check size={13} /> Jawaban peserta</> : <><X size={13} /> Pilihan peserta</>}
                                    </span>
                                  )}
                                  {!isChosen && isAnswer && (
                                    <span className="admin-option-tag answer-tag">
                                      <Check size={13} /> Kunci jawaban
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow"><ShieldCheck size={14} /> PANEL SUPERADMIN</p>
          <h1>Ringkasan kelas.</h1>
          <p>Pantau peserta dan tinjau soal-soal yang dikerjakan beserta jawabannya.</p>
        </div>
        <div className="admin-heading-actions">
          <button className="secondary-button" onClick={fetchParticipants} disabled={loading}>
            {loading ? <LoaderCircle className="saving-spinner" size={15} /> : <RotateCcw size={15} />} Muat ulang
          </button>
          <button className="secondary-button" onClick={onBack}><ArrowLeft size={15} /> Lihat ruang belajar</button>
        </div>
      </div>

      <div className="admin-stats">
        <div><Users /><strong>{stats.totalParticipants}</strong><span>Total peserta</span></div>
        <div><Target /><strong>{stats.activeCount}</strong><span>Peserta aktif</span></div>
        <div><Trophy /><strong>{stats.avgScore}</strong><span>Rata-rata nilai</span></div>
        <div><BookOpen /><strong>{stats.totalSessions}</strong><span>Total sesi selesai</span></div>
      </div>

      {error && (
        <div className="database-status database-status-error" role="alert" style={{ marginTop: 22 }}>
          <CircleHelp size={18} aria-hidden="true" />
          <div><b>Gagal memuat data</b><p>{error}</p></div>
        </div>
      )}

      <section className="admin-table">
        <div className="table-title">
          <div>
            <p className="eyebrow">PESERTA TERDAFTAR</p>
            <h2>Daftar peserta</h2>
          </div>
          <label className="admin-search">
            <Search size={15} />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau email..."
              aria-label="Cari peserta"
            />
          </label>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="admin-empty">
              <LoaderCircle className="saving-spinner" size={22} />
              <b>Memuat data peserta…</b>
            </div>
          ) : filteredParticipants.length === 0 ? (
            <div className="admin-empty">
              <Users size={22} />
              <b>{search ? 'Peserta tidak ditemukan' : 'Belum ada peserta terdaftar'}</b>
              <p>{search ? 'Coba kata kunci pencarian lain.' : 'Peserta yang mendaftar akan muncul di sini.'}</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Peserta</th>
                  <th>Status</th>
                  <th>Soal dikerjakan</th>
                  <th>Rata-rata nilai</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((learner) => {
                  const sessions = learner.progress?.sessions || [];
                  const drafts = learner.progress?.drafts || [];
                  const totalQuestions = sessions.reduce((s, item) => s + (item.total || 0), 0);
                  const totalCorrect = sessions.reduce((s, item) => s + (item.correct || 0), 0);
                  const draftAnswered = drafts.reduce((s, d) => s + (d.answers?.filter(isAnswered).length || 0), 0);
                  const avg = totalQuestions ? pct(totalCorrect, totalQuestions) : null;
                  const statusLabel = sessions.length > 0
                    ? `${sessions.length} sesi selesai`
                    : drafts.length > 0
                    ? 'Sedang mengerjakan'
                    : 'Belum mulai';

                  return (
                    <tr key={learner.id} className="admin-row-clickable" onClick={() => openParticipant(learner)}>
                      <td><b>{learner.name}</b><small>{learner.email}</small></td>
                      <td>
                        <span className={`status-badge ${sessions.length === 0 && drafts.length > 0 ? 'status-draft' : sessions.length === 0 ? 'status-idle' : ''}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td>
                        <b>{totalQuestions + draftAnswered} soal</b>
                        <small>{drafts.length > 0 ? `${drafts.length} progres berlangsung` : sessions[0] ? `Terakhir: ${sessions[0].topic}` : 'Belum ada latihan'}</small>
                      </td>
                      <td>
                        {avg !== null ? (
                          <>
                            <div className="table-progress"><span style={{ width: `${avg}%` }} /></div>
                            <small>{avg}% ({totalCorrect}/{totalQuestions})</small>
                          </>
                        ) : (
                          <b>—</b>
                        )}
                      </td>
                      <td>
                        <button
                          className="secondary-button small-button"
                          onClick={(e) => { e.stopPropagation(); openParticipant(learner); }}
                        >
                          <Eye size={14} /> Lihat soal <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
