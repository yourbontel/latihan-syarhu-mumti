import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import handler, { emptyProgress, mutateProgress } from '../server/handler.js';

const draft = { sectionId: 'all', topic: 'Nahwu', questions: [{ id: 'q1', answer: 0 }], index: 0, answers: [], selected: 0, submitted: true };
test('draft preserves question order, selection, and submission for resume', () => {
  const saved = mutateProgress(emptyProgress(), 'draft', draft);
  assert.deepEqual(JSON.parse(JSON.stringify(saved)).drafts[0], draft);
  assert.equal(mutateProgress(saved, 'draft', { ...draft, selected: 1 }).drafts.length, 1);
});
test('delete only the selected topic and cap drafts at three', () => {
  let saved = emptyProgress();
  for (const topic of ['A', 'B', 'C', 'D']) saved = mutateProgress(saved, 'draft', { ...draft, topic });
  assert.deepEqual(saved.drafts.map((d) => d.topic), ['D', 'C', 'B']);
  assert.deepEqual(mutateProgress(saved, 'deleteDraft', { sectionId: 'all', topic: 'C' }).drafts.map((d) => d.topic), ['D', 'B']);
});
test('finish removes matching draft, deduplicates result retries and wrong IDs', () => {
  const result = { id: 1, section: 'all', topic: 'Nahwu', total: 1, correct: 0, wrongIds: ['q1'] };
  let saved = mutateProgress(emptyProgress(), 'draft', draft);
  saved = mutateProgress(saved, 'session', result);
  saved = mutateProgress(saved, 'session', result);
  assert.equal(saved.sessions.length, 1);
  assert.deepEqual(saved.wrongIds, ['q1']);
  assert.deepEqual(saved.drafts, []);
  assert.deepEqual(mutateProgress(saved, 'reset'), emptyProgress());
});
test('invalid operations and malformed progress are rejected', () => {
  for (const [action, value] of [['invalid', {}], ['draft', {}], ['draft', { ...draft, index: 9 }], ['deleteDraft', null], ['session', { id: 1, total: 1, correct: 2 }]]) {
    assert.throws(() => mutateProgress(emptyProgress(), action, value), { status: 400 });
  }
});
test('missing database produces an explicit error instead of pretending progress is saved', async () => {
  const keys = ['DATABASE_URL', 'DATABASE_URL_POOLED', 'POSTGRES_URL'];
  const original = keys.map((key) => process.env[key]);
  keys.forEach((key) => delete process.env[key]);
  const server = createServer(handler);
  try {
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/progress`);
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.match((await response.json()).error, /DATABASE_URL/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    keys.forEach((key, i) => { if (original[i] !== undefined) process.env[key] = original[i]; });
  }
});