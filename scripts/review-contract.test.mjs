import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function read(rel) {
	return readFileSync(join(ROOT, rel), 'utf8');
}

test('レビュー subagent は起動せず、人が明示した1回だけ残す', () => {
	const skill = read('.claude/skills/adversarial-review/SKILL.md');
	assert.match(skill, /正解は契約である/);
	assert.match(skill, /検証用の subagent は起動しない/);
	assert.match(skill, /人がレビューを明示したときだけ/);
	assert.match(skill, /差し戻す指摘/);
	assert.match(skill, /記録だけ/);
	assert.match(skill, /確認できない指摘/);
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
	assert.match(agent, /差し戻すのは、見た差分で再現できる1種/);
	assert.doesNotMatch(agent, /必ず使う/);
});
