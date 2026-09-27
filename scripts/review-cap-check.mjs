#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { reviewExcess } from './lib/review-cap.mjs';

const ROOT = process.env.HARNESS_ROOT || join(dirname(fileURLToPath(import.meta.url)), '..');
const GIT = ['-c', 'core.quotePath=false'];

function parseJsonl(text) {
	return text
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => JSON.parse(line));
}

function mergeBase() {
	for (const base of ['origin/main', 'main']) {
		try {
			const mb = execFileSync('git', [...GIT, 'merge-base', base, 'HEAD'], {
				encoding: 'utf8',
				cwd: ROOT
			}).trim();
			if (mb) return mb;
		} catch {
			// 次の基準
		}
	}
	return null;
}

function baseEvents(mb) {
	try {
		const text = execFileSync('git', [...GIT, 'show', `${mb}:knowledge/graph/events.jsonl`], {
			encoding: 'utf8',
			cwd: ROOT
		});
		return parseJsonl(text);
	} catch {
		return [];
	}
}

const mb = mergeBase();
if (!mb) {
	console.error('[review-cap] merge-base が解けない。欠落で通すことを拒否する');
	process.exit(1);
}

const headPath = join(ROOT, 'knowledge/graph/events.jsonl');
const head = existsSync(headPath) ? parseJsonl(readFileSync(headPath, 'utf8')) : [];
const excess = reviewExcess(head, baseEvents(mb));
if (excess.length) {
	console.error(`[review-cap] レビュー起動が上限を超えた ${JSON.stringify(excess)}`);
	process.exit(1);
}
console.log('[review-cap] レビュー起動は上限内');
