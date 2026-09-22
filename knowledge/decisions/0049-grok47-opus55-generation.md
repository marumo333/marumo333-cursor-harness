# ADR 0049: 世代ピン＝Grok 4.7 high / Opus 5.5 high（席は動かさない）

- 状態: 受理（改正対象: [[0026]] [[0031]] [[0033]] [[0037]] [[0040]] [[0044]] [[0047]]。廃止ではない）
- 日付: 2026-09-22
- 背景:
  親の実体は `grok-4.7`。Opus 5.5 は Cursor 上で Opus 5 の後継として出た。
  [[0040]] の次世代条件は、GA、Task スラッグの実在（allowlist + 実起動）、席の役割を変えないこと。
  Grok には加えて、長時間エージェントの公式根拠が要る。文書だけ先に書き換えない。
- 調査（2026-09-22）:
  - 親の `originalModelName` は `grok-4.7`（cursor-cloud run-info、`bc-64e2a7c4-c8ac-492b-9861-c4ce88108d2f`）。
  - Task allowlist に `grok-4.7-high` / `grok-4.7-high-fast` / `grok-4.7-xhigh` / `grok-4.7-medium` がある。
    `cursor-` 接頭辞は無い。裸の `grok-4.7` は Task スラッグに無い。
  - Opus の Task スラッグは `claude-opus-5-5-high`。`thinking` 中置辞は無い。`-high` が high thinking。
    fast / max / xhigh もある。
  - スラッグ実在（席ではない。generalPurpose）:
    - `grok-4.7-high` 完走。自己名は Grok 4.7。agent `bc-042db141-d286-5d4d-9510-d95317b24124`。
    - `claude-opus-5-5-high` 完走。自己名は Claude Opus 5.5。agent `bc-8b11a21d-33a1-535f-84f8-90dc5b81c03c`。
  - 席の実起動（[[0047]] 決定7の水準。generalPurpose では足りない）:
    - trio 体2 / `grok_task`: （本 PR のモード2完走後に追記）
    - verifier: （本 PR の named agent 完走後に追記）
  - Grok の採用根拠は次の5点だけ。
    1. GA（https://x.ai/news/grok-4-7 、2026-09-21、Cursor で利用可）。
    2. Task スラッグ `grok-4.7-high` の allowlist + 実起動。
    3. 公式文: 何時間もの課題に寄せた長い RL、自己検証、長文脈。同価格・同速度。
    4. DeepSWE v1.1 は 71.0%（high）対 Grok 4.6 の 65.2%（High）。努力段が揃う。
    5. 親の実体が既に 4.7 で、文書だけ 4.6 のままなのは [[0040]] が禁じた陳腐化。
  - 不採用: CursorBench 4.0 の 46.3%（xHigh）対 40.4%（High）、Terminal-Bench 4.0 の 38.0% 対 20.3%。
    列が xHigh 対 High で努力段が揃わない。Fable 5.1 Max は CursorBench 51.8%、Terminal-Bench 57.9%。
    ベンチだけではレビュー席を動かさない（[[0040]]）。
  - Opus の一次資料は Cursor docs https://cursor.com/docs/models/claude-opus-5-5 。
    Opus 5 を置き換え、high thinking を推奨、単価は $4/$20（旧 $5/$25）、cache read は $0.20/M。
    Anthropic の記事 URL 直取得は 2026-09-22 に 404。ニュース一覧の一文は数値根拠にしない。
    Claude の世代上げは「GA + Task スラッグ + 役割不変」で足り、優越ベンチは [[0040]] が要求していない。
  - 設計判定: `backend-architect`（`claude-fable-5-1-thinking-high`）が A–E を承認。
    agent `bc-b6e88385-0c91-59a2-bd1e-72fa8c4e5c44`。実装はこの承認のあと。
- 決定:
  1. **親 / `grok_task` / trio 体2 = `grok-4.7-high`。**
     fast / xhigh / 裸の `grok-4.7` はピンにも予備にも書かない。
     fast は 2倍価格で、席の基準に壁時計は無い。非 fast の high が実在し実起動したので、
     [[0044]] 決定7の「high-fast しか無いときはスラッグを変えない」は消滅する。
  2. **verifier / reflector = `claude-opus-5-5-high`。** fast / max / xhigh はピンにしない。
  3. **plan-confirm と敵対レビューは `claude-fable-5-1-thinking-high` のまま。**
     CursorBench で Opus 5.5 が Fable 5.1 より上でも席は動かさない。
     CursorBench は長いコーディングであり、短文の計画破壊と敵対レビューではない。
     席を分けたのは人間の指示（[[0047]]）。世代上げで役割は変えない（[[0040]]）。
     trio は Fable / Grok 4.7 / Muse。Opus を trio に戻さない。
  4. **effort 既定の親と実装を high にする。これは方針判断である。**
     [[0044]] 決定7の概念既定は medium だった。medium スラッグが実在する今、
     high を選ぶのは「世代ピンだけ」では説明できない。根拠は、公式の同段比較が high、
     Cursor の Grok 4.7 既定が high、`effort_allow` が親と実装の high を既に許すこと。
     medium は `effort_allow` に残し、ピンにはしない。
  5. **Fable のガードフォールバックは、実効モデルが `fable_pin` でなければ failed。**
     「Opus に落ちた」だけを見ない。Opus 5.5 への落下も failed。
  6. **旧 ADR は廃止しない。** 決定本文は履歴。改正注記と criteria / skill / agent の
     `model:` だけを現行ピンにする。`supersedes` に載せない。
  7. **適用経路。** F-0013 は `proposed`（出生規則）。同一 PR の canon 適用は
     F-0001（`in_progress` / `supersede_adr: true`）の被覆。F-0003 / F-0009 と同じ。
- 結果: 席の役割は [[0047]] のまま。世代ピンだけ Grok 4.7 high と Opus 5.5 high。
- 関連: [[0026]] [[0031]] [[0033]] [[0037]] [[0040]] [[0044]] [[0047]]
