import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const MIT = [
	'MIT License',
	'',
	'Copyright (c) 2026 marumo333',
	'',
	'Permission is hereby granted, free of charge, to any person obtaining a copy',
	'of this software and associated documentation files (the "Software"), to deal',
	'in the Software without restriction, including without limitation the rights',
	'to use, copy, modify, merge, publish, distribute, sublicense, and/or sell',
	'copies of the Software, and to permit persons to whom the Software is',
	'furnished to do so, subject to the following conditions:',
	'',
	'The above copyright notice and this permission notice shall be included in all',
	'copies or substantial portions of the Software.',
	'',
	'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR',
	'IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,',
	'FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE',
	'AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER',
	'LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,',
	'OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE',
	'SOFTWARE.',
	''
].join('\n');

test('LICENSE は OSI MIT 全文と一致する', () => {
	const p = join(ROOT, 'LICENSE');
	assert.equal(existsSync(p), true, 'ルートに LICENSE が必要');
	assert.equal(readFileSync(p, 'utf8'), MIT);
});

test('package.json の license は MIT である', () => {
	const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
	assert.equal(pkg.license, 'MIT');
});

test('README は mermaid を編集の正にし、docs の画像を示す', () => {
	const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
	assert.match(readme, /### 監査/);
	assert.match(readme, /token効率化/);
	assert.match(readme, /### 再起的自己改善/);
	assert.doesNotMatch(readme, /ソフトウェア工場/);
	assert.doesNotMatch(readme, /工場長/);
	assert.doesNotMatch(readme, /治具/);
	assert.doesNotMatch(readme, /工場フロア/);
	assert.doesNotMatch(readme, /抜き取り/);
	assert.doesNotMatch(readme, /工程カード/);
	assert.doesNotMatch(readme, /正本倉庫/);
	assert.doesNotMatch(readme, /出荷/);
	assert.doesNotMatch(readme, /原料/);
	assert.match(readme, /docs\/architecture\/model-review\.png/);
	assert.match(readme, /docs\/architecture\/audit-flow\.png/);
	assert.match(readme, /docs\/architecture\/harness-runtime-architecture\.png/);
	assert.match(readme, /docs\/architecture\/harness-self-improve-architecture\.png/);
	assert.doesNotMatch(readme, /欠落 PNG/);
	assert.doesNotMatch(readme, /FG --> warehouse/);
	assert.doesNotMatch(readme, /Gate --> Feat/);
	assert.doesNotMatch(readme, /HK --> AR/);
	assert.doesNotMatch(readme, /HG --> CanonOut/);
	const fences = [...readme.matchAll(/```mermaid\n([\s\S]*?)```/g)].map((m) => m[1]);
	assert.equal(fences.length, 4, `mermaid 図は4つ: ${fences.length}`);
	assert.ok(
		fences.some((b) => /直す/.test(b) && /検討/.test(b) && /記録/.test(b) && /却下/.test(b) && /tsc --noEmit/.test(b)),
		'モデル図は4分類と noEmit を含む'
	);
	assert.ok(
		fences.some(
			(b) =>
				/監査/.test(b) &&
				/token効率化/.test(b) &&
				/契約と feature-gate/.test(b) &&
				/HM --> warehouse/.test(b) &&
				!/AR --> VR/.test(b)
		),
		'監査図は契約と人間マージを含み、レビュー周の辺を含まない'
	);
	assert.ok(
		fences.some((b) => /実装と検証は親/.test(b) && /IMP --> Hook/.test(b) && /判定のみ/.test(b)),
		'ランタイム図は親が hooks を踏み OPA は判定のみ'
	);
	assert.ok(
		fences.some((b) => /cycle-after-merge/.test(b) && /エージェントは自動起動しない/.test(b)),
		'自己改善図は cycle-after-merge と自動起動しないを含む'
	);
});
