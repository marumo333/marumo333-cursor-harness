#!/usr/bin/env node
/**
 * ピン留めした ripgrep を解決する。PATH の rg は使わない。
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
	chmodSync,
	copyFileSync,
	existsSync,
	mkdirSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	rmSync,
	unlinkSync,
	renameSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = process.env.HARNESS_ROOT || join(dirname(fileURLToPath(import.meta.url)), '..');
export const RG_VERSION = '15.2.0';
const TOOLS = join(ROOT, '.tools');
const ASSET = `ripgrep-${RG_VERSION}-x86_64-unknown-linux-musl.tar.gz`;
/** 公式 .sha256 と一致する tarball。展開後のバイナリも別 digest で固定する。 */
const TARBALL_DIGEST = '33e15bcf1624b25cdd2a55813a47a2f95dbe126268203e76aa6a585d1e7b149c';
const BINARY_DIGEST = 'e62198eb19b136b88c330af83647b5a962cb99b6b1f066758568f12de1974849';

function sha256(path) {
	return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function archKey() {
	if (process.platform !== 'linux') {
		throw new Error(`[ensure-rg] Linux のみ（実際は ${process.platform}）`);
	}
	if (process.arch === 'x64') return 'linux_amd64';
	throw new Error(`[ensure-rg] 未対応アーキ ${process.arch}。ピン留め digest が無い`);
}

/**
 * @param {string} bin
 */
export function evaluateRgBinary(bin) {
	const got = sha256(bin);
	if (got !== BINARY_DIGEST) {
		throw new Error(`[ensure-rg] digest 不一致: 実際 ${got} 期待 ${BINARY_DIGEST}`);
	}
	const ver = execFileSync(bin, ['--version'], { encoding: 'utf8' });
	if (!ver.includes(`ripgrep ${RG_VERSION}`)) {
		throw new Error(`[ensure-rg] バイナリを拒否（期待 ${RG_VERSION}）:\n${ver}`);
	}
	return bin;
}

function findBinary(dir) {
	for (const ent of readdirSync(dir, { withFileTypes: true })) {
		const child = join(dir, ent.name);
		if (ent.isDirectory()) {
			const found = findBinary(child);
			if (found) return found;
		} else if (ent.name === 'rg') {
			return child;
		}
	}
	return null;
}

function download(dest) {
	mkdirSync(TOOLS, { recursive: true });
	const tarPath = join(tmpdir(), `rg-${process.pid}.tar.gz`);
	const extract = mkdtempSync(join(tmpdir(), 'rg-extract-'));
	const staging = join(TOOLS, `rg.${process.pid}`);
	try {
		const url = `https://github.com/BurntSushi/ripgrep/releases/download/${RG_VERSION}/${ASSET}`;
		execFileSync('curl', ['-fsSL', '-o', tarPath, url], { stdio: 'inherit' });
		const tarDigest = sha256(tarPath);
		if (tarDigest !== TARBALL_DIGEST) {
			throw new Error(`[ensure-rg] tarball digest 不一致: 実際 ${tarDigest} 期待 ${TARBALL_DIGEST}`);
		}
		execFileSync('tar', ['-xzf', tarPath, '-C', extract]);
		const extracted = findBinary(extract);
		if (!extracted) throw new Error('[ensure-rg] tarball に rg が無い');
		copyFileSync(extracted, staging);
		chmodSync(staging, 0o755);
		evaluateRgBinary(staging);
		renameSync(staging, dest);
	} finally {
		if (existsSync(tarPath)) unlinkSync(tarPath);
		if (existsSync(staging)) unlinkSync(staging);
		rmSync(extract, { recursive: true, force: true });
	}
}

export function ensureRg() {
	archKey();
	if (process.env.RG_BIN) {
		throw new Error('[ensure-rg] RG_BIN は受け付けない。ピン留めした .tools/rg を使う');
	}
	const local = join(TOOLS, 'rg');
	if (existsSync(local)) {
		try {
			return evaluateRgBinary(local);
		} catch {
			unlinkSync(local);
		}
	}
	download(local);
	return evaluateRgBinary(local);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	console.log(ensureRg());
}
