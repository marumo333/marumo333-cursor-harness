import { execFileSync } from 'node:child_process';

/**
 * ピン留めバイナリの取得。curl の --retry は 500 を含む一時失敗をやり直す。
 * @param {string} url
 * @param {string} dest
 */
export function curlArgs(url, dest) {
	return ['-fsSL', '--retry', '5', '--retry-delay', '2', '--retry-all-errors', '-o', dest, url];
}

/**
 * @param {string} url
 * @param {string} dest
 */
export function curlFetch(url, dest) {
	execFileSync('curl', curlArgs(url, dest), { stdio: 'inherit' });
}
