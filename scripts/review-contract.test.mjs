import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function read(rel) {
	return readFileSync(join(ROOT, rel), 'utf8');
}

test('親は4分類を1回行い、直すだけコードを変える', () => {
	const skill = read('.claude/skills/adversarial-review/SKILL.md');
	assert.match(skill, /tsc --noEmit/);
	assert.match(skill, /検証用の subagent は起動しない/);
	assert.match(skill, /直す/);
	assert.match(skill, /検討/);
	assert.match(skill, /記録/);
	assert.match(skill, /却下/);
	assert.match(skill, /二周目は開かない/);
	assert.doesNotMatch(skill, /3体/);
	assert.doesNotMatch(skill, /モード2/);
});

test('feature-gate の CI は契約テストを実行する', () => {
	const workflow = read('.github/workflows/feature-gate.yml');
	assert.match(workflow, /scripts\/review-contract\.test\.mjs/);
});

test('席ルーティングは検証 subagent を出さない', () => {
	const budget = read('.claude/skills/harness-api-budget/SKILL.md');
	assert.match(budget, /verifier \/ reflector \/ 3体は起動しない/);
	assert.match(budget, /新しい周で1回まで/);
	assert.match(budget, /新しい周で0回/);
});

test('security-reviewer は毎タスクでは起動しない', () => {
	const agent = read('.claude/agents/security-reviewer.md');
	assert.match(agent, /毎タスクでは起動しない/);
	assert.match(agent, /直す以外はコードを変えない/);
	assert.doesNotMatch(agent, /必ず使う/);
});
