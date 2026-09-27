---
name: adversarial-review
description: 正解は契約と feature-gate。レビュー subagent は起動しない。人が明示したときだけ Fable を1回。
---

# adversarial-review skill（[[0050]] / [[0051]]）

正解は契約である。型と、入力に対する出力を `node scripts/contract-check.mjs` が見る。正本の被覆・秘密・再起は `node scripts/feature-gate.mjs` が見る。LLM が「問題が無い」と言うことは正解ではない。

検証用の subagent は起動しない。複数モデルの同時レビューも、再確認の周も、起動しない。Opus 5 は頼まれなくても自分の作業を確認する。確認用の subagent を足すと、同じ差分を読み直して新しい指摘を足す。

人がレビューを明示したときだけ、Fable 5.1 を1回起動できる。見るのは席・正本・ゲート・秘密のうち、契約と OPA が赤にできないものだけ。契約が緑の振る舞いには差し戻さない。指摘は3種（差し戻す指摘 / 記録だけ / 確認できない指摘）で、差し戻すのは再現できる1種だけ。2回目は `node scripts/review-cap-check.mjs` が拒否する。過去の周は、記録済みの回数を超えて増やせない。

`skill:verify` と `skill:reflect` は、新しい周では 0 回。1回でも feature-gate が失敗する。
