---
name: harness-audit
description: ハーネス健全性を決定的にスコア化し履歴に記録。実行するほど成長しているかを可視化する。
---

# harness-audit skill

## スコア項目（決定的・0-100）

- ルール網羅: CLAUDE.md の禁止が hooks/agent で強制されているか。
- knowledge 充足: ADR に未解決の重要判断が残っていないか・criteria が最新か。
- **席割当の整合（[[0033]] / [[0049]] / [[0051]]）**: `model-routing.yaml` の chat_orchestrator=Grok。検証用 subagent は空。AGENTS / skills が verifier や 3体の起動を必須にしていないか。
- **ハーネス制約（[[0039]] / [[0051]]）**: 席は親 Grok。検証は契約と feature-gate。機能ごとに ADR、レビュー、proposed、admitted は作らない。
- **cycle 整合（[[0039]]）**: required-cycle の必須ノードが記録され、3指標が出せるか。
- セキュリティ: security-policy.yaml 各項目（OWASP LLM/Agentic Top10）。
- 学習: learnings が更新されているか。機能ごとの票は増えていないか。
- **feature/OPA 整合**: `opa test policy/` 緑、`knowledge/features/` が型を満たす、canon 差分が票で被覆されているか。

## 実行席

監査の集計・文書突合は親 Grok で可。判定に迷う項目は Opus Task。

## 出力

合計スコア＋内訳を `knowledge/benchmarks/audit-<n>.json` に追記（`Date.now` は使わずカウンタ連番）。
前回比の増減を報告。**下降時は原因（劣化した項目）を明示**。
