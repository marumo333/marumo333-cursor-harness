#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { commandDropsSearchLines } from './lib/read-guard.mjs';

const argv = process.argv.slice(2);
if (argv.length === 0) {
	console.error('使い方: node scripts/search-lines.mjs [-- rgの追加引数] PATTERN');
	process.exit(2);
}
const pattern = argv[argv.length - 1];
const flags = argv.slice(0, -1);
if (commandDropsSearchLines(['rg', ...flags].join(' '))) {
	console.error('検索は一致行を残す。ファイル名だけと件数だけは使わない。');
	process.exit(2);
}
const r = spawnSync('rg', ['-n', '-F', ...flags, '--', pattern, '.'], {
	cwd: process.cwd(),
	encoding: 'utf8',
	stdio: ['ignore', 'pipe', 'pipe']
});
if (r.stdout) process.stdout.write(r.stdout);
if (r.stderr) process.stderr.write(r.stderr);
process.exit(r.status === 1 ? 0 : (r.status ?? 1));
