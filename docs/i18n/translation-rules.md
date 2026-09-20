# Translation rules

English | [العربية](translation-rules.ar.md)

How to translate between the two sides of a documentation pair in this repo. Both languages carry equal authority ([README.md](README.md)): a change is authored in either language, and that side is the source for that update — these rules govern producing or updating the counterpart. They bind humans and agents equally. Routine agent work translates the changed content directly in one terminology-guided pass; the extended [.agents/skills/dsh-translate-docs](../../.agents/skills/dsh-translate-docs/SKILL.md) workflow runs only when the user explicitly invokes it. Rule levels follow RFC 2119 usage: **MUST** / **MUST NOT** are gate- or review-blocking; **SHOULD** needs a stated reason to deviate; **MAY** is discretionary.

## Faithfulness

- The counterpart *MUST* say what the authored side says — no added behavior, prerequisites, warnings, version claims, or examples, and no dropped ones. If the pair disagrees on substance, neither language wins by default: fix the side that is wrong, then bring the other along in the same change.
- The counterpart *SHOULD* read as natural technical writing in its own language, not word-by-word gloss. Translate meaning, restructure sentences where the target grammar wants it, and keep the author's register — terse stays terse.
- Do not translate the untranslatable: if a sentence resists natural rendering because it leans on an idiom of the source language, translate the idea, not the idiom.

## Voice

- The register is calibrated by [style-samples.md](style-samples.md) — human-approved gold pairs, one per document genre. The counterpart MUST match the target-language side of the nearest sample; where its voice and a prose voice rule disagree, the sample wins. Arabic targets use institutional technical Arabic; English targets use concise professional developer prose.
- Write as a native technical author restating the content, not as a translator transposing sentences, while preserving every source clause: nothing added, nothing dropped — fluency never justifies losing a clause.
- Give sentences an explicit actor when the target language would otherwise obscure it; for Arabic, replace vague passives or abstract subjects with the actual actor (نظام، بوابة، مراجعة شخص).
- Prefer established target-language engineering idiom over calques (إنذار كاذب/سلبية فائتة for false positive/negative, حدّ الإلزام for enforcement frontier); localize metaphors instead of transplanting them, and unpack noun chains where the target language requires it.
- Split long paragraphs by semantic unit — one idea per paragraph. Paragraph boundaries MAY differ from the source; the structural signature does not count paragraphs.
- When translating into Arabic, category nouns use Arabic with a first-mention English annotation (دليل عملي (cookbook)); when translating into English, use the conventional English category name. Literal directory or file references stay code-formatted English.

## Structure preservation

The pairing gate checks heading depths, fenced code blocks, table row and column counts, list kinds, ordered-list starts, list item counts, link locale, and semantic targets. Preserve the rest of the frame manually; the paired files MUST match one to one in:

- heading hierarchy (same levels, same order — heading TEXT is translated),
- list shape and numbering,
- tables (same columns, same row order; header cells translated per terminology),
- fenced code blocks — **byte-identical, including comments**; the pairing signature compares their info strings and contents, and ` ```ts ` blocks compile under `doc-typecheck`,
- inline code spans (commands, flags, config keys, file paths, event names, API names, version numbers) — verbatim, never translated or reformatted,
- links and anchors: every relative document link MUST keep the same semantic target and exact query/fragment suffix. When the target belongs to the active bilingual corpus, the English side uses its `.md` path and the Arabic side uses its `.ar.md` path; a missing counterpart in that corpus is an error, while targets outside it keep the original path. External URLs, images, and pure in-page fragments stay unchanged. The language switcher remains the explicit cross-locale exception, and a README rendered outside GitHub MAY use the canonical public repository URL to its exact counterpart as documented in [README.md](README.md). Link TEXT is translated.

The repo's Markdown conventions apply to `.ar.md` files unchanged: one physical line per paragraph (`verify-md-wrap`), resolving relative links (`verify-md-links`), exactly one trailing newline.

## Terminology

- [terminology.md](terminology.md) is the source of truth in both directions. Before translating, load it; every listed term MUST follow its row and its "لا يلزم ترجمة عمل" prohibitions. An Arabic target uses the "العربية" column and its "أول مرة ظهور" annotation; an English target uses the "English" column without adding a Arabic gloss.
- For an Arabic target, an unlisted technical term MAY use an established rendering from a major Arabic-language OSS or vendor source (K8s/Vue/MDN Arabic docs, big-tech project docs), cited in the PR. Without such precedent it MUST stay in English and be listed under «مصطلحات معلّقة» (pending terms) with a suggested rendering.
- For an English target, use the established English technical term. If the source term has no unambiguous established equivalent, preserve it with a short explanatory gloss and list it under pending terms. Neither direction may invent a rendering inline; a decided term enters [terminology.md](terminology.md) in the same PR or a follow-up.

## Typography

These rules govern the Arabic side; the English side follows the repo's normal Markdown conventions (root `AGENTS.md`). The bidirectional and punctuation rules below follow [W3C alreq](https://www.w3.org/TR/alreq/), [Unicode UAX #9](https://www.unicode.org/reports/tr9/), and the [Microsoft Arabic style guide](https://learn.microsoft.com/en-us/globalization/reference/microsoft-style-guides):

- Arabic prose runs right-to-left while code spans, identifiers, links, and numerals inside it run left-to-right. MUST NOT add Unicode directional control characters to the Markdown source; renderers apply the bidirectional algorithm.
- MUST put one space between Arabic text and an adjacent Latin word or numeral: `كل plugin يسجل 3 أدوات`. No space separates a punctuation mark from the text it attaches to.
- MUST use Arabic punctuation in Arabic prose: comma `،`, semicolon `؛`, question mark `؟`. Period, colon, exclamation mark, and parentheses keep their ASCII forms. ASCII punctuation also stays inside code spans, inside complete English sentences quoted as-is, and in numbers (`3.5`, `1,024`).
- Arabic prose *SHOULD* prefer colons, periods, commas, or parentheses over em dashes. Keep an em dash only when no other punctuation preserves the sentence naturally.
- Enumeration: a list of parallel items separates them with the Arabic comma `،`, not the ASCII comma.
- MUST use Western Arabic numerals (`123`), never Eastern Arabic-Indic digits (`١٢٣`), so figures match the English side and the code they describe.
- Proper nouns keep their canonical casing: GitHub, TypeScript, DeepSeek — never `github`/`Github` unless quoting code.
- Second person is the singular أنت, matching this repo's direct voice.
- Emphasis markers (`**bold**`, `*italic*`) stay on the same spans as the source; Arabic has no italic forms, so the rendered emphasis may look identical — do not substitute quotation marks or other decoration.

## Quality bar

- A pair is done when a bilingual engineer reading either file alone gets everything a reader of the other gets — same facts, same caveats, same tone — and nothing extra.
- Run `pnpm run verify-translation-pairing` and the rest of `doc-sync` for records, switchers, heading depths, code blocks, table row and column counts, list kinds, ordered-list starts, list item counts, links, and repository Markdown rules. Human review owns list and table order, noncanonical list numbering, inline code, emphasis, meaning, terminology, and tone.

## References

Authorities cited by these rules, for humans and agents who want the underlying reasoning:

- [W3C alreq](https://www.w3.org/TR/alreq/) — Arabic Layout Requirements: script behaviour, justification, punctuation, and digit conventions.
- [Unicode UAX #9](https://www.unicode.org/reports/tr9/) — the bidirectional algorithm that decides how Latin identifiers and numerals sit inside Arabic prose.
- [Microsoft Arabic style guide](https://learn.microsoft.com/en-us/globalization/reference/microsoft-style-guides) — the vendor-localization baseline for register, terminology, and second person.
- [Unicode CLDR](https://cldr.unicode.org/) — the locale data behind numbering systems, list separators, and date formats for `ar`.
