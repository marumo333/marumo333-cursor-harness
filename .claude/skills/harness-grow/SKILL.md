---
name: harness-grow
description: 機能ごとに ADR、レビュー、proposed、admitted を作らない。
---

# harness-grow skill

機能ごとに ADR、レビュー、proposed、admitted は作らない。`knowledge/features/` に新しい票を足さない。`feature-gate --admit` で status を進めない。

プロダクトの機能は次で進める。

```bash
node scripts/init.mjs
node scripts/start-feature.mjs <slug>
node scripts/check-behavior.mjs
```

`start-feature` は `features/<slug>/` に振る舞いと作業と、失敗するテストだけを置く。
