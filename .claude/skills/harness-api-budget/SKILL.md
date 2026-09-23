---
name: harness-api-budget
description: Ultraでもトークン効率と精度を同時に取る席ルーティング（Grok親・計画/レビューはFable・検証はOpus・Museは3体・照会はcode-mode・子へはpacket）。壁打ち〜検証の席判断で使う。
---

# harness-api-budget skill（[[0033]] / [[0037]] / [[0039]] / [[0040]] / [[0045]] / [[0046]] / [[0047]] / [[0048]] / [[0049]] / [[0050]]）

## 席の要約

| 席                   | いつ                                                                 |
| -------------------- | -------------------------------------------------------------------- |
| 親チャット **Grok 4.7 high** | 常時。壁打ち・調査・下書き・ディスパッチ操作・統合・cycle 記録    |
| Task **Fable 5.1 high** | plan-confirm / 敵対レビュー（モード1を1回・trio 体1を1周） / 設計 / grow 前 |
| Task **Opus 5.5 high**  | verifier / reflector                                                 |
| Task **Grok 4.7 high**  | 明文化済みの実装並列展開 / 複数試行                                 |
| Task **Muse Spark 1.3** | **高リスク3体の第3レンズのみ**（secret）。他では使わない。effort は medium |

## budget_guards（必ず守る）

1. 親を Opus/Fable にピッカー切替しない。
2. ゲート Task 入力は**成果物のみ**（計画 md / diff / 失敗ログ / ADR パス）。会話履歴の丸投げ禁止。
3. Muse は `review_trio`（モード2）以外で起動しない。Sol / Terra / Luna は使わない。
4. 3体多数決は高リスク（セキュリティ/入場/再起/アーキ、および席・正本・ゲート）の **1周** だけ。再レビューで 3体のやり直しはしない（[[0050]]）。
5. plan-confirm は **並列展開前のみ**必須（単独小修正は省略可）。コード差分がある変更の敵対レビューは省略不可。議論・文書・用語だけでコード差分が無いときは Task を出さない。
6. ゲートは **名前付き agent 必須**。model 未指定の汎用 Task でゲート代替禁止。
7. Fable と Opus を trio に同居させない（Claude 席は1系統・[[0037]]）。
8. Fable のガードフォールバック（実効モデルが `fable_pin` でない）は failed。天井は extra-high / max の追加だけ。
9. **1周の再注入**: 各席に渡すのは goal / feature / diff / 関連 ADR パス / 今周の事実だけ。
   `learnings.md` 全文と `decisions/` 全件を親と各 Task が読み直さない（同じ本文は1周1席）。
   これは入力トークン削減。pre-commit（[[0042]]）は回避防止であり、トークンは減らさない。
10. **code-mode（[[0048]]）**: 照会 bash が2本以上なら `scripts/code-mode.mjs` 1回。
    中間出力は文脈に載せない。生の `&&` 照会連鎖は hook が deny。Ultra でも省略しない。
11. **packet（[[0045]]）**: 子には `scripts/harness-query.mjs` が書いた JSON だけ。
    会話・learnings 全文・ADR 全件は継がない。effort / escalate は親が cycle の dispatch 行に書く。
    ゲートは isolated、Worker / reflector は packet。会話 fork は置かない。
12. **作業分類を Task の前に1行で書く。** 議論・文書・用語（コード差分が無い）は親 Grok のみ。canon 以外の小さい修正は親が実装し、Fable の単独レビューを1回（plan-confirm と 3体は出さない）。差し戻す指摘の再レビューは、その項目と修正差分の1回で止める。

## superpowers 接続

`brainstorming`(親 Grok) → `writing-plans`(親 Grok) →
`plan-confirm`(Fable Task, 並列展開時) → `parallel-dispatch` → `adversarial-review` → `verify` → `reflect`。

使ったら `cycle` skill で node/edge を記録する。
