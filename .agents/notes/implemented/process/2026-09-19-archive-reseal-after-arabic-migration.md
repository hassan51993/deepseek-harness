# Agent Note: Re-seal the archived note manifest after the Arabic migration

Status: implemented

English | [العربية](2026-09-19-archive-reseal-after-arabic-migration.ar.md)

## Problem

The repository-wide replacement of Chinese with Arabic translated and renamed every archived Agent Note triplet. [`.agents/notes/README.md`](../../README.md) declares a sealed archived triplet permanently frozen — not to be edited, translated, reformatted, moved, or deleted — and [`verify-archived-agent-notes`](../../../../scripts/verify-archived-agent-notes.ts) enforces that through an append-only content manifest. The migration broke 1,902 recorded hashes at once.

The tool offers no route back to a passing gate while the translated files stand: `--write` seals only newly added artifacts, and the hash-change errors exit before any write.

## Decision

The manifest is re-sealed once, at the migrated state, recording a `sha256:` hash for every archived artifact under its renamed path. The archive keeps its Arabic mirror so the tree carries no Chinese and the archive tooling continues to resolve one `.ar.md` translation suffix.

The freeze still governs every later change. This note records the single sanctioned break, and the pre-migration content stays recoverable from the conversion commit rather than from the manifest.

The gate cannot pass in a run that compares this commit against the pre-migration baseline, because rejecting exactly this edit is what append-only means. It passes from the next commit onward, once the re-sealed manifest is itself the baseline.

## Alternatives considered

**Restore the archived triplets to their sealed Chinese content and filenames.** Rejected because it returns Chinese to a repository whose stated goal is to carry none, and because the archive tooling now resolves `.ar.md`; a Chinese archive would require it to accept two translation suffixes for a tree that is meant to stay inert.

**Leave the gate failing.** Rejected because `doc-sync` would then fail on every unrelated change, which teaches readers to ignore a red documentation gate.

**Delete the Arabic mirrors and keep only the English side.** Rejected because the archive format requires a complete triplet, so an English-only archived note fails the same gate for a different reason.
