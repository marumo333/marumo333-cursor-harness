/** 人が明示したレビューは1回。検証と内省の subagent は新しい周では 0。 */
export const REVIEW_CAP = 1;

export const DISPATCH_CAP = {
	'skill:adversarial-review': REVIEW_CAP,
	'skill:verify': 0,
	'skill:reflect': 0
};

function counts(events) {
	const map = new Map();
	for (const ev of events) {
		if (ev?.type !== 'dispatch' || !ev.node || !ev.cycle) continue;
		if (!(ev.node in DISPATCH_CAP)) continue;
		const key = `${ev.cycle}\0${ev.node}`;
		map.set(key, (map.get(key) || 0) + 1);
	}
	return map;
}

/**
 * 新しい周は DISPATCH_CAP まで。merge-base に既にある周は、その回数を超えて増やせない。
 * @param {unknown[]} head
 * @param {unknown[]} base
 */
export function reviewExcess(head, base, caps = DISPATCH_CAP) {
	const baseCounts = counts(base);
	const headCounts = counts(head);
	/** @type {{ cycle: string, node: string, n: number, limit: number }[]} */
	const excess = [];
	for (const [key, n] of headCounts) {
		const sep = key.indexOf('\0');
		const cycle = key.slice(0, sep);
		const node = key.slice(sep + 1);
		const prev = baseCounts.get(key) || 0;
		const cap = caps[node] ?? 0;
		const limit = Math.max(prev, cap);
		if (n > limit) excess.push({ cycle, node, n, limit });
	}
	return excess;
}
