import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function read(rel) {
	return readFileSync(join(ROOT, rel), 'utf8');
}

test('敵対レビューは指摘を3種に分け、再レビューは項目と修正差分の1回', () => {
	const skill = read('.claude/skills/adversarial-review/SKILL.md');
	assert.match(skill, /差し戻す指摘/);
	assert.match(skill, /記録だけ/);
	assert.match(skill, /確認できない指摘/);
	assert.match(skill, /差し戻した項目と修正差分だけ/);
	assert.match(skill, /3体のやり直しはしない/);
	assert.match(skill, /同じ指摘が2回/);
	assert.doesNotMatch(skill, /問題が見つからない場合のみ承認/);
	assert.doesNotMatch(skill, /同じ手順で新しい文脈/);
});

test('席ルーティングは文書を Task にせず、小さい修正は Fable 1回', () => {
	const budget = read('.claude/skills/harness-api-budget/SKILL.md');
	assert.match(budget, /議論・文書・用語/);
	assert.match(budget, /コード差分が無い/);
	assert.match(budget, /canon 以外の小さい修正/);
	assert.match(budget, /3体のやり直しはしない/);
});

test('security-reviewer の出力は3種で、不確実を差し戻しにしない', () => {
	const agent = read('.claude/agents/security-reviewer.md');
	assert.match(agent, /差し戻す指摘/);
	assert.match(agent, /記録だけ/);
	assert.match(agent, /確認できない指摘/);
	assert.doesNotMatch(agent, /不確実は承認にしない/);
});
