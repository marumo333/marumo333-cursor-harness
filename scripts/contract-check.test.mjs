import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkContracts } from './contract-check.mjs';

test('リポジトリの契約は型検査と振る舞いが緑', async () => {
	const result = await checkContracts(new URL('..', import.meta.url).pathname);
	assert.equal(result.ok, true, JSON.stringify(result.errors));
});

test('戻り値の型が契約と違う実装は型検査で落ちる', async () => {
	const root = fixture({
		'scripts/lib/bad.ts': `import type { Bad } from '../../contracts/bad.contract.ts'\nexport const bad: Bad = () => 'no'\n`,
		'contracts/bad.contract.ts': `export type Bad = () => number\nimport { bad } from '../scripts/lib/bad.ts'\nconst _checked: Bad = bad\nvoid _checked\nexport const target = { module: '../scripts/lib/bad.ts', exportName: 'bad' } as const\nexport const behaviors = [{ args: [], returns: 1 }]\n`,
		'contracts/tsconfig.json': tsconfig()
	});
	const result = await checkContracts(root);
	assert.equal(result.ok, false);
	assert.match(result.errors.join('\n'), /not assignable/);
});

test('型が合っても振る舞いの出力が違えば落ちる', async () => {
	const root = fixture({
		'scripts/lib/bad.ts': `import type { Bad } from '../../contracts/bad.contract.ts'\nexport const bad: Bad = () => 2\n`,
		'contracts/bad.contract.ts': `export type Bad = () => number\nimport { bad } from '../scripts/lib/bad.ts'\nconst _checked: Bad = bad\nvoid _checked\nexport const target = { module: '../scripts/lib/bad.ts', exportName: 'bad' } as const\nexport const behaviors = [{ args: [], returns: 1 }]\n`,
		'contracts/tsconfig.json': tsconfig()
	});
	const result = await checkContracts(root);
	assert.equal(result.ok, false);
	assert.match(result.errors.join('\n'), /振る舞い/);
});

function tsconfig() {
	return JSON.stringify(
		{
			compilerOptions: {
				strict: true,
				noEmit: true,
				module: 'nodenext',
				moduleResolution: 'nodenext',
				target: 'es2022',
				verbatimModuleSyntax: true,
				allowImportingTsExtensions: true,
				skipLibCheck: true
			},
			files: ['bad.contract.ts', '../scripts/lib/bad.ts']
		},
		null,
		2
	);
}

function fixture(files) {
	const root = mkdtempSync(join(tmpdir(), 'contract-'));
	writeFileSync(join(root, 'package.json'), JSON.stringify({ type: 'module' }));
	for (const [rel, body] of Object.entries(files)) {
		const abs = join(root, rel);
		mkdirSync(join(abs, '..'), { recursive: true });
		writeFileSync(abs, body);
	}
	return root;
}
