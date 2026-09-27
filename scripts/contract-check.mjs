#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const HARNESS = join(HERE, '..');
const TSC = join(HARNESS, 'node_modules/typescript/lib/tsc.js');

/**
 * 契約の正解。型は tsc、振る舞いは入力と出力の実行。
 * @param {string} root
 */
export async function checkContracts(root) {
	/** @type {string[]} */
	const errors = [];
	if (!existsSync(TSC)) {
		return { ok: false, errors: ['typescript が無い。pnpm install が必要'] };
	}
	const config = join(root, 'contracts/tsconfig.json');
	const typed = spawnSync(process.execPath, [TSC, '--noEmit', '--pretty', 'false', '-p', config], {
		encoding: 'utf8',
		cwd: root
	});
	if (typed.status !== 0) {
		errors.push(`${typed.stdout || ''}${typed.stderr || ''}`);
		return { ok: false, errors };
	}
	const runner = fileURLToPath(new URL('./run-contract-behaviors.mjs', import.meta.url));
	const ran = spawnSync(process.execPath, ['--experimental-strip-types', runner, root], {
		encoding: 'utf8',
		cwd: root
	});
	if (ran.status !== 0) {
		errors.push(`${ran.stdout || ''}${ran.stderr || ''}`);
		return { ok: false, errors };
	}
	return { ok: true, errors };
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
	const root = process.argv[2] || HARNESS;
	const result = await checkContracts(root);
	if (!result.ok) {
		console.error(`[contract] 失敗\n${result.errors.join('\n')}`);
		process.exit(1);
	}
	console.log('[contract] 型検査と振る舞いが緑');
}
