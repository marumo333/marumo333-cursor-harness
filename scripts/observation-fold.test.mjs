import { test } from 'node:test';
import assert from 'node:assert/strict';
import { foldObservations } from './lib/observation-fold.mjs';

function search(cmd, text) {
	return { kind: 'search', rerunnable: true, cmd, text };
}

function file(cmd, text) {
	return { kind: 'file', rerunnable: false, cmd, text };
}

test('古い再実行できる検索だけを 1 行にし、ファイルは残す', () => {
	const items = [
		search('rg -n 32768', 'export const PACKET_MAX_BYTES = 32768;\n'),
		file('read scripts/lib/harness-query.mjs', 'export const PACKET_MAX_BYTES = 32768;\n'),
		search('rg -n alpha', 'alpha\n'),
		search('rg -n beta', 'beta\n'),
		search('rg -n gamma', 'gamma\n'),
		search('rg -n delta', 'delta\n'),
		search('rg -n epsilon', 'epsilon\n')
	];
	const got = foldObservations(items, 5);
	assert.equal(got[0].folded, true);
	assert.match(got[0].text, /省略: rg -n 32768/);
	assert.match(got[0].text, /再実行可/);
	assert.equal(got[1].folded, false);
	assert.match(got[1].text, /PACKET_MAX_BYTES = 32768/);
	assert.equal(got.filter((x) => x.folded).length, 1);
	assert.match(got[6].text, /epsilon/);
});

test('再実行できない検索とファイルは畳まない', () => {
	const items = [
		{ kind: 'search', rerunnable: false, cmd: 'curl https://example.test', text: 'body' },
		file('read knowledge/criteria/model-routing.yaml', 'chat_orchestrator: grok-4.7-high\n')
	];
	const got = foldObservations(items, 5);
	assert.equal(got[0].folded, false);
	assert.equal(got[0].text, 'body');
	assert.match(got[1].text, /grok-4\.7-high/);
});
