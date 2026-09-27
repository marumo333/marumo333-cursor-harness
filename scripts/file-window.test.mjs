import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sliceWindow } from './lib/file-window.mjs';

function lines(n) {
	return Array.from({ length: n }, (_, i) => `L${i + 1}`);
}

test('指定行を中心に 100 行を残し、行番号を付ける', () => {
	const got = sliceWindow(lines(388), 262);
	assert.equal(got.start, 213);
	assert.equal(got.end, 312);
	assert.match(got.text, /^ 213\|L213/);
	assert.match(got.text, /262\|L262/);
	assert.match(got.text, /312\|L312/);
	assert.equal(got.text.split('\n').length, 100);
});

test('末尾近くでは窓をファイル内に収める', () => {
	const got = sliceWindow(lines(388), 380);
	assert.equal(got.end, 388);
	assert.equal(got.start, 289);
	assert.equal(got.text.split('\n').length, 100);
	assert.match(got.text, /380\|L380/);
});

test('100 行以下は全文を行番号付きで返す', () => {
	const got = sliceWindow(lines(76), 7);
	assert.equal(got.start, 1);
	assert.equal(got.end, 76);
	assert.match(got.text, /7\|L7/);
});

test('範囲外の行は失敗する', () => {
	assert.throws(() => sliceWindow(lines(10), 11), /行/);
	assert.throws(() => sliceWindow(lines(10), 0), /行/);
});
