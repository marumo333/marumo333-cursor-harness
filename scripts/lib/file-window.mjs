const SIZE = 100;

export function sliceWindow(lines, line, size = SIZE) {
	if (!Number.isInteger(line) || line < 1) throw new Error('行は 1 以上の整数');
	if (!Array.isArray(lines) || line > lines.length) throw new Error('行がファイル長を超えた');
	const width = Number.isInteger(size) && size > 0 ? size : SIZE;
	if (lines.length <= width) {
		return { start: 1, end: lines.length, text: format(lines, 1) };
	}
	let start = line - Math.floor((width - 1) / 2);
	let end = start + width - 1;
	if (start < 1) {
		start = 1;
		end = width;
	}
	if (end > lines.length) {
		end = lines.length;
		start = end - width + 1;
	}
	return { start, end, text: format(lines.slice(start - 1, end), start) };
}

function format(slice, start) {
	return slice.map((line, i) => `${String(start + i).padStart(4, ' ')}|${line}`).join('\n');
}
