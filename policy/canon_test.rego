package harness.canon_test

import rego.v1

import data.harness.canon

test_scripts_and_hooks_are_canon if {
	canon.canon_path("scripts/feature-gate.mjs")
	canon.canon_path(".claude/hooks/block_secret_write.mjs")
	canon.canon_path(".claude/settings.json")
	canon.canon_path("package.json")
	canon.canon_path("pnpm-lock.yaml")
	canon.canon_path("README.md")
	canon.canon_path("TEMPLATE.md")
	canon.canon_path(".cursor/hooks.json")
	canon.canon_path(".cursor/hooks/block-env-read.mjs")
	canon.canon_path("cycle/required-cycle.json")
	canon.canon_path("cycle/model-routing.yaml")
	canon.canon_path("cycle/code-quality.yaml")
	canon.canon_path(".github/workflows/feature-gate.yml")
}

test_learnings_and_benchmarks_are_not_canon if {
	not canon.canon_path("knowledge/learnings.md")
	not canon.canon_path("knowledge/features/F-0001.yaml")
	not canon.canon_path("docs/learnings.md")
	not canon.canon_path("cycle/events.jsonl")
	not canon.canon_path(".claude/CLAUDE.md")
}

test_living_decisions_are_canon if {
	canon.canon_path("docs/decisions/0016-definition-of-done.md")
}
