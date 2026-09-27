import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const root = process.argv[2];
if (!root) {
	console.error('[contract] root が必要');
	process.exit(1);
}

const dir = join(root, 'contracts');
const files = readdirSync(dir).filter((name) => name.endsWith('.contract.ts')).sort();
if (files.length === 0) {
	console.error('[contract] 振る舞いを書く契約が無い');
	process.exit(1);
}

for (const name of files) {
	const contractUrl = pathToFileURL(join(dir, name)).href;
	const mod = await import(contractUrl);
	const implUrl = new URL(mod.target.module, contractUrl);
	const impl = await import(implUrl.href);
	const fn = impl[mod.target.exportName];
	if (typeof fn !== 'function') {
		console.error(`[contract] 振る舞い ${name} に関数 ${mod.target.exportName} が無い`);
		process.exit(1);
	}
	for (const behavior of mod.behaviors) {
		try {
			const got = fn(...behavior.args);
			if (Object.hasOwn(behavior, 'throws')) {
				console.error(`[contract] 振る舞い ${name} は例外を期待したのに ${JSON.stringify(got)} を返した`);
				process.exit(1);
			}
			assert.deepEqual(got, behavior.returns);
		} catch (error) {
			if (Object.hasOwn(behavior, 'throws') && String(error?.message || error).includes(behavior.throws)) {
				continue;
			}
			const detail = error?.message || error;
			console.error(`[contract] 振る舞い不一致 ${name} ${JSON.stringify(behavior)} ${detail}`);
			process.exit(1);
		}
	}
}

console.log(`[contract] 振る舞い ${files.length} 件が一致`);
