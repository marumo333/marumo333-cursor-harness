import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { evaluateRgBinary, ensureRg, RG_VERSION } from './ensure-rg.mjs';

test('digest が違う rg は拒否する', () => {
	const dir = mkdtempSync(join(tmpdir(), 'bad-rg-'));
	const bin = join(dir, 'rg');
	writeFileSync(bin, 'not-ripgrep');
	assert.throws(() => evaluateRgBinary(bin), /digest 不一致/);
});

test('ピン留めした rg はバージョンと digest が一致する', () => {
	const bin = ensureRg();
	assert.equal(evaluateRgBinary(bin), bin);
	const text = readFileSync(new URL('./search-lines.mjs', import.meta.url), 'utf8');
	assert.match(text, /ensureRg\(\)/);
	assert.equal(text.includes("spawnSync('rg'"), false);
	assert.match(RG_VERSION, /^\d+\.\d+\.\d+$/);
});
