import React from 'react';
import { isAnswered } from './quiz';

export default function QuestionNavigation({ session, saving, onNavigate }) {
  const answered = session.answers.filter(isAnswered).length;
  return <nav className="question-navigation" aria-label="Navigasi soal">
    <div className="question-navigation-heading"><b>Pilih soal</b><span>{answered} dari {session.questions.length} soal diperiksa</span></div>
    <div className="question-number-grid">
      {session.questions.map((question, index) => {
        const checked = isAnswered(session.answers[index]);
        const selected = isAnswered(session.selections[index]);
        const status = checked ? 'Sudah diperiksa' : selected ? 'Belum diperiksa' : 'Belum dijawab';
        return <button
          key={question.id}
          type="button"
          className={`question-number ${checked ? 'answered' : selected ? 'pending' : ''}`}
          aria-label={`Soal ${index + 1}: ${status}`}
          aria-current={index === session.index ? 'step' : undefined}
          disabled={saving}
          onClick={() => onNavigate(index)}
        >{index + 1}</button>;
      })}
    </div>
    <div className="question-navigation-legend"><span><i className="legend-current" />Soal aktif</span><span><i className="legend-answered" />Sudah diperiksa</span><span><i className="legend-pending" />Belum diperiksa</span><span><i />Belum dijawab</span></div>
  </nav>;
}