#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertAdrPaths, buildPacket, nextDispatchSeq, writePacket } from './lib/harness-query.mjs';
import { knownNodes, loadRequiredCycle, requiredModeFor } from './lib/packet-policy.mjs';

const ROOT = process.env.HARNESS_ROOT || join(dirname(fileURLToPath(import.meta.url)), '..');

function arg(name, fallback) {
	const i = process.argv.indexOf(`--${name}`);
	return i >= 0 ? process.argv[i + 1] : fallback;
}

function listArgs(name) {
	const out = [];
	for (let i = 0; i < process.argv.length; i++) {
		if (process.argv[i] === `--${name}` && process.argv[i + 1]) out.push(process.argv[++i]);
	}
	return out;
}

function gitDiffStat() {
	try {
		return execFileSync('git', ['-c', 'core.quotePath=false', 'diff', '--stat'], {
			encoding: 'utf8',
			cwd: ROOT
		}).trim();
	} catch {
		return '';
	}
}

function loadEvents() {
	const abs = join(ROOT, 'cycle', 'events.jsonl');
	if (!existsSync(abs)) return [];
	return readFileSync(abs, 'utf8')
		.split('\n')
		.filter(Boolean)
		.map((l) => JSON.parse(l));
}

const cycle = arg('cycle');
const node = arg('node');
const feature = arg('feature', null);
const context_mode = arg('context-mode');
const adr_paths = listArgs('adr');
let seq = arg('seq');
let diff_stat = arg('diff-stat');

try {
	const graph = loadRequiredCycle(ROOT);
	if (!knownNodes(graph).has(node)) throw new Error(`未知のノード ${node}`);
	const required = requiredModeFor(graph, node);
	if (context_mode !== required) throw new Error(`context_mode は ${required}`);
	assertAdrPaths(ROOT, adr_paths);
	const events = loadEvents();
	seq = String(seq ? nextDispatchSeq(events, cycle, node, Number(seq)) : nextDispatchSeq(events, cycle, node));
	if (diff_stat == null) diff_stat = gitDiffStat();
	const catalog_hits = [];
	const packet = buildPacket({
		cycle,
		node,
		seq: Number(seq),
		context_mode,
		feature,
		diff_stat,
		catalog_hits,
		adr_paths
	});
	const written = writePacket({ root: ROOT, packet });
	process.stdout.write(`${JSON.stringify(written)}\n`);
} catch (e) {
	process.stderr.write(`${e.message}\n`);
	process.exit(1);
}
