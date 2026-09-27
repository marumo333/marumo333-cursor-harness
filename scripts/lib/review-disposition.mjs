/** 親の1回分類。直すだけがコードを変える。noEmit が緑なら不正解にしない。 */

export const BUCKETS = ['直す', '検討', '記録', '却下'];

/**
 * @param {{ noEmit: 'green' | 'red', pass: number, findings: { bucket: string, applied?: boolean, claimsIncorrect?: boolean }[] }} record
 */
export function dispositionErrors(record) {
	/** @type {string[]} */
	const errors = [];
	if (record.pass !== 1) errors.push('二周目は開かない');
	if (record.noEmit !== 'green' && record.noEmit !== 'red') errors.push('noEmit は green か red');
	for (const finding of record.findings ?? []) {
		if (!BUCKETS.includes(finding.bucket)) errors.push(`分類が不正: ${finding.bucket}`);
		if (finding.applied && finding.bucket !== '直す') errors.push('直す以外はコードを変えない');
		if (record.noEmit === 'green' && finding.claimsIncorrect) errors.push('noEmit が緑の変更を不正解にしない');
	}
	return errors;
}
