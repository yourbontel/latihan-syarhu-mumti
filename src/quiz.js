export const isAnswered = (answer) => Number.isInteger(answer);

export function restoreQuizSession(session) {
  const answers = session.questions.map((_, index) => session.answers[index] ?? null);
  if (session.submitted && isAnswered(session.selected)) answers[session.index] = session.selected;
  const selections = session.questions.map((_, index) => session.selections?.[index] ?? answers[index]);
  if (isAnswered(session.selected)) selections[session.index] = session.selected;
  return { ...session, answers, selections, selected: selections[session.index], submitted: isAnswered(answers[session.index]) };
}

export function selectQuizAnswer(session, value) {
  if (session.submitted) return session;
  const selections = [...session.selections];
  selections[session.index] = value;
  return { ...session, selections, selected: value };
}

export function submitQuizAnswer(session) {
  if (!isAnswered(session.selected) || session.submitted) return session;
  const answers = [...session.answers];
  answers[session.index] = session.selected;
  return { ...session, answers, submitted: true };
}

export function goToQuestion(session, index) {
  if (!Number.isInteger(index) || index < 0 || index >= session.questions.length) return session;
  return { ...session, index, selected: session.selections[index], submitted: isAnswered(session.answers[index]) };
}

export function nextUnansweredIndex(session) {
  for (let offset = 1; offset <= session.questions.length; offset += 1) {
    const index = (session.index + offset) % session.questions.length;
    if (!isAnswered(session.answers[index])) return index;
  }
  return -1;
}