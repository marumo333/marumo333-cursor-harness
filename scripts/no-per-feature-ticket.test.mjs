import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('機能ごとの ADR と proposed と admitted を作る手順が残っていない', () => {
	const template = readFileSync(join(ROOT, 'TEMPLATE.md'), 'utf8');
	assert.match(template, /機能ごとに ADR、レビュー、proposed、admitted は作らない/);
	assert.doesNotMatch(template, /status: proposed/);
	assert.doesNotMatch(template, /status を `admitted`/);
	const merge = readFileSync(join(ROOT, 'scripts/cycle-after-merge.mjs'), 'utf8');
	assert.doesNotMatch(merge, /status: proposed/);
	assert.match(merge, /Feature は起票しない/);
	const workflow = readFileSync(join(ROOT, '.github/workflows/harness-cycle.yml'), 'utf8');
	assert.doesNotMatch(workflow, /knowledge\/features/);
	assert.doesNotMatch(workflow, /gh pr create/);
	const names = readdirSync(join(ROOT, 'knowledge/features')).filter((name) => name.endsWith('.yaml'));
	assert.deepEqual(names, ['F-0001-feature-canon-opa-grow.yaml']);
	for (const name of names) {
		const text = readFileSync(join(ROOT, 'knowledge/features', name), 'utf8');
		assert.doesNotMatch(text, /status:\s*proposed/);
		assert.doesNotMatch(text, /status:\s*admitted/);
	}
});
