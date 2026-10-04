#!/usr/bin/env node
// Stop: 内省を促す（非ブロック。Task は起動しない）。
console.error(
	'[post_task_reflect] 内省は親が docs/learnings.md に書く。リポジトリ全体の判断は docs/decisions/、機能の判断は features/<slug>/design.md。' +
		'機能ごとに Feature 票は作らない。次の cycle は人間のマージ後に開く。' +
		'（hooks から Task は起動しない）'
);
process.exit(0);
