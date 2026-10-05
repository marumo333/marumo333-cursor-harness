import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.HARNESS_ROOT || join(dirname(fileURLToPath(import.meta.url)), '..');

test('knowledge フォルダと Feature 票は無い', () => {
	assert.equal(existsSync(join(ROOT, 'knowledge')), false);
	assert.equal(existsSync(join(ROOT, 'cycle/required-cycle.json')), true);
	assert.equal(existsSync(join(ROOT, 'cycle/model-routing.yaml')), true);
});
