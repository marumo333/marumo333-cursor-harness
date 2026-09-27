import type { Clamp } from '../../contracts/clamp.contract.ts';

export const clamp: Clamp = (value, lo, hi) => {
	if (lo > hi) throw new Error('lo > hi');
	return Math.min(hi, Math.max(lo, value));
};
