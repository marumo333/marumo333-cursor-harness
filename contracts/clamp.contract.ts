import { clamp } from '../scripts/lib/clamp.ts';

export type Clamp = (value: number, lo: number, hi: number) => number;

const _checked: Clamp = clamp;
void _checked;

export const target = {
	module: '../scripts/lib/clamp.ts',
	exportName: 'clamp'
} as const;

export const behaviors: Array<
	{ args: [number, number, number]; returns: number } | { args: [number, number, number]; throws: string }
> = [
	{ args: [5, 0, 10], returns: 5 },
	{ args: [-1, 0, 10], returns: 0 },
	{ args: [11, 0, 10], returns: 10 },
	{ args: [3, 4, 1], throws: 'lo > hi' }
];
