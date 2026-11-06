import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectShuffle } from '../app/lib/projectShuffle.ts';

test('eight projects each appear once per tour, including every tour boundary', () => {
  const ids = Array.from({ length: 8 }, (_, i) => `project-${i}`);
  let seed = 719;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const tour = createProjectShuffle(ids, random);
  let last = null;
  const orders = new Set();
  for (let cycle = 0; cycle < 1000; cycle++) {
    const shown = ids.map(() => tour.next());
    assert.deepEqual([...shown].sort(), ids);
    assert.notEqual(shown[0], last);
    orders.add(shown.join(','));
    last = shown.at(-1);
  }
  assert.ok(orders.size > 900, 'each tour must be freshly shuffled');
});

test('forced boundary collision swaps the first entry without dropping a project', () => {
  const draws = [0.999, 0.999, 0, 0.999, 0];
  const tour = createProjectShuffle(['a', 'b', 'c'], () => draws.shift() ?? 0);
  assert.deepEqual(Array.from({ length: 6 }, () => tour.next()), ['a', 'b', 'c', 'b', 'c', 'a']);
  const pair = createProjectShuffle(['a', 'b'], () => 0.999);
  assert.deepEqual(Array.from({ length: 6 }, () => pair.next()), ['a', 'b', 'a', 'b', 'a', 'b']);
});

test('empty, singleton, duplicate IDs and separate districts remain safe', () => {
  assert.equal(createProjectShuffle([]).next(), null);
  const single = createProjectShuffle(['water-sort', 'water-sort']);
  assert.equal(single.next(), 'water-sort');
  assert.equal(single.next(), 'water-sort');
  const other = createProjectShuffle(['fruit-slot', 'miffy']);
  assert.deepEqual(new Set([other.next(), other.next()]), new Set(['fruit-slot', 'miffy']));
  assert.equal(single.next(), 'water-sort');
});
