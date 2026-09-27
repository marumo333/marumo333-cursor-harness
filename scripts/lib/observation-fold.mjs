export function foldObservations(items, keepSearch = 5) {
	if (!Array.isArray(items)) throw new Error('observations は配列');
	const keep = Number.isInteger(keepSearch) && keepSearch >= 0 ? keepSearch : 5;
	const searchIndexes = [];
	items.forEach((it, i) => {
		if (it?.kind === 'search' && it.rerunnable === true) searchIndexes.push(i);
	});
	const drop = new Set(searchIndexes.slice(0, Math.max(0, searchIndexes.length - keep)));
	return items.map((it, i) => {
		if (!drop.has(i)) return { ...it, folded: false, text: String(it?.text ?? '') };
		const lines = String(it.text ?? '').split('\n').length;
		return {
			...it,
			folded: true,
			text: `省略: ${it.cmd} （${lines} 行、再実行可）`
		};
	});
}
