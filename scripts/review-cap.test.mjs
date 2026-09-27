import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reviewExcess, REVIEW_CAP } from './lib/review-cap.mjs';

function dispatch(cycle, n) {
	return Array.from({ length: n }, (_, i) => ({
		type: 'dispatch',
		cycle,
		node: 'skill:adversarial-review',
		seq: i + 1
	}));
}

test('新しい周は初回3体と再確認1回まで', () => {
	assert.equal(REVIEW_CAP, 4);
	const excess = reviewExcess(dispatch('C-0099', 4), []);
	assert.deepEqual(excess, []);
});

test('5回目のレビュー起動は拒否する', () => {
	const excess = reviewExcess(dispatch('C-0099', 5), []);
	assert.equal(excess.length, 1);
	assert.equal(excess[0].cycle, 'C-0099');
	assert.equal(excess[0].n, 5);
	assert.equal(excess[0].limit, 4);
});

test('過去の周は今の回数を超えて増やせない', () => {
	const base = dispatch('C-0012', 15);
	assert.deepEqual(reviewExcess(base, base), []);
	const grown = dispatch('C-0012', 16);
	const excess = reviewExcess(grown, base);
	assert.equal(excess.length, 1);
	assert.equal(excess[0].limit, 15);
});

test('検証や内省の起動はレビュー回数に数えない', () => {
	const events = [
		...dispatch('C-0099', 4),
		{ type: 'dispatch', cycle: 'C-0099', node: 'skill:verify', seq: 1 }
	];
	assert.deepEqual(reviewExcess(events, []), []);
});
