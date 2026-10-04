# 振る舞いと名詞・動詞で進める

調査日: 2026-10-04。正本ではない。毎回の ADR と Feature 起票は、このリポジトリの製品開発には使わない。

## 判定

個人のアプリは、機能ごとの振る舞いと、そのアプリの名詞・動詞で進める。Foundry の製品、権限基盤、オブジェクトDB、Connect / Understand / Analyze / Act / Automate を失敗の分類名にすることは採らない。文書を、テストとツールの代わりにはしない。

## ファイル

アプリごとに常時置くのは短い `AGENTS.md` だけにする。機能が自明なら `design.md` は書かない。

機能が説明を要するときだけ、次を置く。

| ファイル | 中身 | 出典の対応 |
| --- | --- | --- |
| `requirements.md` | `WHEN` 条件 `THE SYSTEM SHALL` 振る舞い。または Given / When / Then | Kiro の EARS。Spec Kit と OpenSpec のシナリオ |
| `design.md` | 構成、データの流れ、失敗時に何が残るか | Kiro の `design.md`。自明なら省略（OpenSpec は条件付き） |
| `tasks.md` | その機能の作業だけ | Kiro / Spec Kit |
| `GLOSSARY.md` | Object type、Property、Link type | Foundry の名詞（objects, properties, links） |
| `ACTIONS.md` | Parameters、Submission criteria、Ontology edits、Side effects | Foundry の動詞（actions）。Logic の Function は動詞に混ぜない |

失敗は3つに書く。

1. 提出前に基準を満たさず、状態は変わらない。
2. 書き戻しが失敗し、状態は変わらない。
3. 状態は変わったあと、通知や外部の副作用だけが失敗する。

Connect から Automate の5語は、Ontology の定義ではなく、2023年の Process Mining ホワイトペーパーの工程である。公式の決定の構成は Data、Logic、Action、Security である。

## 根拠

- [Why create an Ontology?](https://palantir.com/docs/foundry/ontology/why-ontology/) は、データ要素を名詞、actions を動詞と書く。Logic と Security は別項である。2026-10-04 に本文を確認した。
- [Kiro Feature Specs](https://kiro.dev/docs/specs/feature-specs/)（ページ更新 2026-08-04）は `requirements.md`、`design.md`、`tasks.md`。振る舞いは EARS。探索的なコーディングとバグには向かないと公式が書く。
- [OaK](https://arxiv.org/abs/2608.22974) は、もっともらしいだけのオントロジーは決定に必要な関係を欠く、と要約で書く。スキーマと型付き関数を判定で直すときだけ成績が上がる。
- エージェントハーネスの利得はツール、ファイル窓、テストにある。散文の指示を増やすと遵守は落ちる。ADR の件数そのものがリードタイムを伸ばす計測は無い。

## このリポジトリとの境界

席・正本・ゲートの記録は、Next.js のアプリへコピーしない。アプリ側で ADR を足す操作はしない。
