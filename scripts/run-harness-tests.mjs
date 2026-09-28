#!/usr/bin/env node
/** 単体テストの一覧はここだけ。CI と pnpm test は同じコマンドを呼ぶ。 */
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * scripts 直下の *.test.mjs。OPA 突合（*.opa.test.mjs）は feature-gate の後段だけ。
 * @param {string} [root]
 */
export function harnessTestFiles(root = ROOT) {
	return readdirSync(join(root, 'scripts'))
		.filter((name) => name.endsWith('.test.mjs') && !name.endsWith('.opa.test.mjs'))
		.sort()
		.map((name) => `scripts/${name}`);
}

function main() {
	const files = harnessTestFiles(ROOT);
	if (files.length === 0) {
		console.error('[run-harness-tests] 単体テストが無い');
		process.exit(1);
	}
	const ran = spawnSync(process.execPath, ['--test', ...files], { cwd: ROOT, stdio: 'inherit' });
	process.exit(ran.status === null ? 1 : ran.status);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	main();
}
