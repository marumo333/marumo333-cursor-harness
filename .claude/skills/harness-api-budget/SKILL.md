---
name: harness-api-budget
description: 親は Grok。検証は契約と feature-gate を親が実行する。検証用 subagent は出さない。照会は code-mode、子へは packet。
---

# harness-api-budget skill（[[0033]] / [[0037]] / [[0039]] / [[0040]] / [[0045]] / [[0046]] / [[0047]] / [[0048]] / [[0049]] / [[0050]]）

## 席の要約

| 席                   | いつ                                                                 |
| -------------------- | -------------------------------------------------------------------- |
| 親チャット **Grok 4.7 high** | 常時。壁打ち・調査・実装・契約とゲートの実行・cycle 記録           |
| Task **Fable 5.1 high** | 並列展開前の plan-confirm、または人が明示したレビュー1回、grow 前の設計 |
| Task **Grok 4.7 high**  | ファイルが重ならない実装の並列展開                                 |
| Task **Opus 5.5** / **Muse** | 起動しない。検証と内省は親が行う                                   |

## budget_guards（必ず守る）

1. 親を Opus/Fable にピッカー切替しない。
2. ゲート Task 入力は**成果物のみ**（計画 md / diff / 失敗ログ / ADR パス）。会話履歴の丸投げ禁止。
3. Muse / Opus の検証 subagent は起動しない。Sol / Terra / Luna も使わない。
4. 3体のレビューは起動しない。人が明示したレビューは Fable 1回で止める（[[0050]] / [[0051]]）。
5. plan-confirm は並列展開の前だけ。単独の修正では出さない。
6. 完了判定は `node scripts/feature-gate.mjs` の出口コード。名前付き agent に判定させない。
7. 人が明示した Fable の実効モデルが `claude-fable-5-1-thinking-high` でなければ、その起動は failed。
8. **1周の再注入**: 各席に渡すのは goal / feature / diff / 関連 ADR パス / 今周の事実だけ。
   `learnings.md` 全文と `decisions/` 全件を親と各 Task が読み直さない（同じ本文は1周1席）。
   これは入力トークン削減。pre-commit（[[0042]]）は回避防止であり、トークンは減らさない。
9. **code-mode（[[0048]]）**: 照会 bash が2本以上なら `scripts/code-mode.mjs` 1回。
    中間出力は文脈に載せない。生の `&&` 照会連鎖は hook が deny。Ultra でも省略しない。
10. **packet（[[0045]]）**: 子には `scripts/harness-query.mjs` が書いた JSON だけ。
    会話・learnings 全文・ADR 全件は継がない。effort / escalate は親が cycle の dispatch 行に書く。
    子を出すときは packet。会話 fork は置かない。
11. 正解は契約の型と振る舞い（[[0051]]）。親が `node scripts/contract-check.mjs` と `node scripts/feature-gate.mjs` を実行する。verifier / reflector / 3体は起動しない。人が明示した `skill:adversarial-review` は新しい周で1回まで。`skill:verify` と `skill:reflect` は新しい周で0回。過去の周は記録済み回数を超えて増やせない。超えたら feature-gate が拒否する。

## superpowers 接続

`brainstorming`(親 Grok) → `writing-plans`(親 Grok) →
`plan-confirm`(並列展開のときだけ) → 実装 → 契約と feature-gate（親が実行）。

使ったら `cycle` skill で node/edge を記録する。
