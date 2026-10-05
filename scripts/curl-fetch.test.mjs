import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { curlArgs } from './lib/curl-fetch.mjs';

test('ピン留め取得は HTTP 500 を再試行する', () => {
	const args = curlArgs('https://example.invalid/asset', '/tmp/asset');
	assert.deepEqual(args, [
		'-fsSL',
		'--retry',
		'5',
		'--retry-delay',
		'2',
		'--retry-all-errors',
		'-o',
		'/tmp/asset',
		'https://example.invalid/asset'
	]);
	for (const name of ['ensure-rg.mjs', 'ensure-opa.mjs']) {
		const text = readFileSync(new URL(`./${name}`, import.meta.url), 'utf8');
		assert.match(text, /curlFetch\(/);
		assert.equal(text.includes("execFileSync('curl'"), false);
	}
});
