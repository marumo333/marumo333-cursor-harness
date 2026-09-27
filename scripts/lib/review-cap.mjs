/** 初回3体と、差し戻した項目の再確認1回。 */
export const REVIEW_CAP = 4;

const REVIEW_NODE = 'skill:adversarial-review';

function counts(events) {
	const map = new Map();
	for (const ev of events) {
		if (ev?.type !== 'dispatch' || ev.node !== REVIEW_NODE || !ev.cycle) continue;
		map.set(ev.cycle, (map.get(ev.cycle) || 0) + 1);
	}
	return map;
}

/**
 * 新しい周は REVIEW_CAP まで。merge-base に既にある周は、その回数を超えて増やせない。
 * @param {unknown[]} head
 * @param {unknown[]} base
 */
export function reviewExcess(head, base, cap = REVIEW_CAP) {
	const baseCounts = counts(base);
	const headCounts = counts(head);
	/** @type {{ cycle: string, n: number, limit: number }[]} */
	const excess = [];
	for (const [cycle, n] of headCounts) {
		const prev = baseCounts.get(cycle) || 0;
		const limit = Math.max(prev, cap);
		if (n > limit) excess.push({ cycle, n, limit });
	}
	return excess;
}
