import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dispositionErrors } from './lib/review-disposition.mjs';

test('直すだけを適用し、緑の noEmit を不正解にしない', () => {
	assert.deepEqual(
		dispositionErrors({
			noEmit: 'green',
			pass: 1,
			findings: [
				{ bucket: '直す', applied: true },
				{ bucket: '検討' },
				{ bucket: '記録' },
				{ bucket: '却下' }
			]
		}),
		[]
	);
});

test('検討をコードに反映すると拒否する', () => {
	const errors = dispositionErrors({
		noEmit: 'green',
		pass: 1,
		findings: [{ bucket: '検討', applied: true }]
	});
	assert.equal(errors.length, 1);
	assert.match(errors[0], /直す以外はコードを変えない/);
});

test('二周目と、緑を不正解と呼ぶ指摘は拒否する', () => {
	const errors = dispositionErrors({
		noEmit: 'green',
		pass: 2,
		findings: [{ bucket: '直す', claimsIncorrect: true }]
	});
	assert.ok(errors.some((e) => e === '二周目は開かない'));
	assert.ok(errors.some((e) => e.includes('不正解にしない')));
});
