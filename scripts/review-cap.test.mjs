import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reviewExcess, REVIEW_CAP } from './lib/review-cap.mjs';

function dispatch(cycle, node, n) {
	return Array.from({ length: n }, (_, i) => ({
		type: 'dispatch',
		cycle,
		node,
		seq: i + 1
	}));
}

test('新しい周のレビューは人が明示した1回まで', () => {
	assert.equal(REVIEW_CAP, 1);
	assert.deepEqual(reviewExcess(dispatch('C-0099', 'skill:adversarial-review', 1), []), []);
});

test('2回目のレビュー起動は拒否する', () => {
	const excess = reviewExcess(dispatch('C-0099', 'skill:adversarial-review', 2), []);
	assert.equal(excess.length, 1);
	assert.equal(excess[0].cycle, 'C-0099');
	assert.equal(excess[0].node, 'skill:adversarial-review');
	assert.equal(excess[0].n, 2);
	assert.equal(excess[0].limit, 1);
});

test('過去の周は今の回数を超えて増やせない', () => {
	const base = dispatch('C-0012', 'skill:adversarial-review', 15);
	assert.deepEqual(reviewExcess(base, base), []);
	const excess = reviewExcess(dispatch('C-0012', 'skill:adversarial-review', 16), base);
	assert.equal(excess.length, 1);
	assert.equal(excess[0].limit, 15);
});

test('検証と内省の subagent は新しい周では拒否する', () => {
	for (const node of ['skill:verify', 'skill:reflect']) {
		const excess = reviewExcess(dispatch('C-0099', node, 1), []);
		assert.equal(excess.length, 1);
		assert.equal(excess[0].node, node);
		assert.equal(excess[0].limit, 0);
	}
});

test('過去の検証起動は今の回数を超えて増やせない', () => {
	const base = dispatch('C-0012', 'skill:verify', 2);
	assert.deepEqual(reviewExcess(base, base), []);
	const excess = reviewExcess(dispatch('C-0012', 'skill:verify', 3), base);
	assert.equal(excess[0].limit, 2);
});
