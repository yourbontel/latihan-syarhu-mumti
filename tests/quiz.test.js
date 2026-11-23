import test from 'node:test';
import assert from 'node:assert/strict';
import { goToQuestion, isAnswered, nextUnansweredIndex, restoreQuizSession, selectQuizAnswer, submitQuizAnswer } from '../src/quiz.js';
import { emptyProgress, mutateProgress } from '../server/handler.js';

const createSession = () => restoreQuizSession({ sectionId: 'all', topic: 'Nahwu', questions: [{ id: 'q1', answer: 0 }, { id: 'q2', answer: 1 }, { id: 'q3', answer: 2 }], index: 0, answers: [], selected: null, submitted: false });

test('jumping between questions retains unchecked choices without marking them answered', () => {
  let session = selectQuizAnswer(createSession(), 0);
  session = selectQuizAnswer(goToQuestion(session, 2), 2);
  session = goToQuestion(session, 0);
  assert.equal(session.selected, 0);
  assert.equal(session.submitted, false);
  assert.equal(session.answers.filter(isAnswered).length, 0);
  assert.equal(goToQuestion(session, 2).selected, 2);
});

test('out-of-order answers stay aligned with questions and reviewed answers remain locked', () => {
  let session = submitQuizAnswer(selectQuizAnswer(goToQuestion(createSession(), 2), 2));
  assert.deepEqual(session.answers, [null, null, 2]);
  assert.equal(nextUnansweredIndex(session), 0);
  session = submitQuizAnswer(selectQuizAnswer(goToQuestion(session, 0), 0));
  assert.equal(nextUnansweredIndex(session), 1);
  session = goToQuestion(session, 2);
  assert.equal(session.submitted, true);
  assert.equal(selectQuizAnswer(session, 1).selected, 2);
  session = submitQuizAnswer(selectQuizAnswer(goToQuestion(session, 1), 1));
  assert.equal(nextUnansweredIndex(session), -1);
  assert.equal(session.questions.filter((question, index) => question.answer === session.answers[index]).length, 3);
});

test('draft round trip preserves skipped, selected, and checked answers and current position', () => {
  let session = submitQuizAnswer(selectQuizAnswer(goToQuestion(createSession(), 2), 1));
  session = selectQuizAnswer(goToQuestion(session, 0), 0);
  const progress = JSON.parse(JSON.stringify(mutateProgress(emptyProgress(), 'draft', session)));
  const restored = restoreQuizSession(progress.drafts[0]);
  assert.equal(restored.index, 0);
  assert.equal(restored.selected, 0);
  assert.equal(restored.submitted, false);
  assert.deepEqual(restored.answers, [null, null, 1]);
  assert.equal(goToQuestion(restored, 2).submitted, true);
  assert.equal(goToQuestion(restored, 1).selected, null);
});

test('legacy sequential drafts restore the current checked or unchecked question', () => {
  const legacy = { ...createSession(), selections: undefined, index: 1, answers: [0], selected: 2, submitted: true };
  const checked = restoreQuizSession(legacy);
  assert.deepEqual(checked.answers, [0, 2, null]);
  assert.equal(goToQuestion(checked, 0).submitted, true);
  const unchecked = restoreQuizSession({ ...legacy, submitted: false });
  assert.deepEqual(unchecked.answers, [0, null, null]);
  assert.equal(unchecked.selected, 2);
  assert.equal(unchecked.submitted, false);
});

test('navigation rejects invalid positions and unanswered questions cannot be submitted', () => {
  const session = createSession();
  for (const index of [-1, 3, 0.5, undefined]) assert.equal(goToQuestion(session, index), session);
  assert.equal(submitQuizAnswer(session), session);
  assert.equal(nextUnansweredIndex(session), 1);
});