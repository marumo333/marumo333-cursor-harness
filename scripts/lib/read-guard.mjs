const DROP_FLAGS = new Set([
	'-l',
	'--files-with-matches',
	'--files',
	'--count',
	'--count-matches',
	'-c'
]);

export function isBlockedDependencyPath(p) {
	const norm = String(p ?? '')
		.replace(/\\/g, '/')
		.replace(/^\.\//, '');
	return /(^|\/)node_modules(\/|$)/.test(norm) || /(^|\/)\.tools(\/|$)/.test(norm);
}

function tokensOf(command) {
	const out = [];
	const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
	let m;
	while ((m = re.exec(String(command ?? '')))) out.push(m[1] ?? m[2] ?? m[3]);
	return out;
}

export function commandTouchesDependency(command) {
	for (const raw of tokensOf(command)) {
		if (raw.includes(' ') || raw.includes('\n')) {
			if (/(?:^|[\s'"`])(?:\.\/)?(?:[\w.-]+\/)*node_modules\//.test(raw)) return true;
			if (/(?:^|[\s'"`])(?:\.\/)?(?:[\w.-]+\/)*\.tools\//.test(raw)) return true;
			continue;
		}
		const t = raw.replace(/^[('"`]+|[)'"`,;]+$/g, '');
		if (t === 'node_modules' || t === '.tools' || isBlockedDependencyPath(t)) return true;
	}
	return false;
}

function dropsFlag(token) {
	if (DROP_FLAGS.has(token)) return true;
	if (token.startsWith('-') && !token.startsWith('--')) {
		return [...token.slice(1)].some((ch) => ch === 'l' || ch === 'c');
	}
	return false;
}

export function commandDropsSearchLines(command) {
	const segs = String(command ?? '').split(/\s*(?:&&|\|\||;)\s*/);
	for (const seg of segs) {
		const tokens = tokensOf(seg);
		const isRg = tokens.some((t) => t === 'rg' || t.endsWith('/rg'));
		if (!isRg) continue;
		if (tokens.some(dropsFlag)) return true;
	}
	return false;
}
