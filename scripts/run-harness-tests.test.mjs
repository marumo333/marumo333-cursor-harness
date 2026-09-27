import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { harnessTestFiles } from './run-harness-tests.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('単体テストは scripts 直下の *.test.mjs で、OPA 突合は含めない', () => {
	const onDisk = readdirSync(join(ROOT, 'scripts'))
		.filter((name) => name.endsWith('.test.mjs') && !name.endsWith('.opa.test.mjs'))
		.sort()
		.map((name) => `scripts/${name}`);
	assert.deepEqual(harnessTestFiles(ROOT), onDisk);
	assert.ok(onDisk.includes('scripts/review-contract.test.mjs'));
	assert.equal(onDisk.includes('scripts/knowledge-catalog.opa.test.mjs'), false);
});

test('package.json と CI は同じ単体テストコマンドを使う', () => {
	const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
	const workflow = readFileSync(join(ROOT, '.github/workflows/feature-gate.yml'), 'utf8');
	const cmd = 'node scripts/run-harness-tests.mjs';
	assert.equal(pkg.scripts.test, cmd);
	assert.match(workflow, /node scripts\/run-harness-tests\.mjs/);
	assert.equal(workflow.includes('node --test scripts/'), false);
});
