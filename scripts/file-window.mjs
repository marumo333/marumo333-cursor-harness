#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { sliceWindow } from './lib/file-window.mjs';
import { isBlockedDependencyPath } from './lib/read-guard.mjs';

function arg(name) {
	const i = process.argv.indexOf(name);
	return i >= 0 ? process.argv[i + 1] : '';
}

const file = arg('--file');
const line = Number(arg('--line'));
if (!file || !Number.isInteger(line)) {
	console.error('使い方: node scripts/file-window.mjs --file PATH --line N');
	process.exit(2);
}
if (isBlockedDependencyPath(file)) {
	console.error('node_modules と .tools は読まない');
	process.exit(2);
}
const text = readFileSync(file, 'utf8');
const got = sliceWindow(text.split('\n'), line);
process.stdout.write(`${got.text}\n`);
