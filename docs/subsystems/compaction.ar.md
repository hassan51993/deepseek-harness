# الضغط

[English](compaction.md) | العربية

seam الضغط — وهو [seam قدرة](../../.agents/notes/implemented/architecture/2026-06-13-capability-seams.ar.md) مقسومٌ مثل bash: تعريفُ الخدمة ([dsh-compaction](../../packages/compaction/compaction)، `ctx.compaction`)، ومزوّدُ الخدمة (خلفيةٌ مثل [dsh-compaction-basic](../../packages/compaction/compaction-basic))، والمستهلكُ البشري ([dsh-command-compact](../../packages/compaction/command-compact)). والضغطُ **قدرةٌ اختيارية واحدة**، لا جزءٌ من عمود agent loop — ولذلك تعيش مفرداتُه هنا لا في [core.md](core.ar.md). والخلفيةُ القائمة على مُرمِّز أو على قالب حزمةٌ شقيقة تنفّذ الواجهةَ نفسَها. وخلافًا لـbash، تعتمد الواجهةُ بالضرورة على `dsh-session` و`dsh-llm`: فأفعالُها تعمل على `Session` يملكها وكيل، ويستعمل حدثُ ملخصها الدائم مفرداتِ `ContentBlock` (انظر [ملاحظة الوكيل عن seam قدرة الضغط](../../.agents/notes/implemented/feature/2026-06-18-compaction-capability-seam.ar.md)).

المصدر: [`packages/compaction/compaction/src/types.ts`](../../packages/compaction/compaction/src/types.ts)

## أحداث الجلسة `compaction/*`

يوسّع الضغطُ [`SessionEventMap`](session.ar.md) بثلاثة أنواع أحداث عبر دمج التصريحات. والثلاثةُ **للسجل فقط** — تسجّل القفلَ والملخصَ والمدى المنتقى وأرقامَ تسلسل الأحداث المظلَّلة وعددَ الرموز ونداءَ النموذج بلا انضمام إلى السطح. ولا يُوسَّع `SurfaceEventType` عمدًا (فلا يصل النموذجَ إلا ما ينتج رسائل)، فيركب الملخصُ نفسُه رسالةَ `user/message` منفصلة تحمل `surfaceOp: { op: 'replace', startSeq, endSeq }` — وهي تغييرُ السطح الوحيد الذي يجريه ضغطُ الملخص. وتملك [ملاحظةُ الوكيل](../../.agents/notes/implemented/feature/2026-06-18-compaction-capability-seam.ar.md) مسوّغَ إعادة استعمال `user/message`.

| الحدث | الحمولة | الدور |
|---|---|---|
| `compaction/start` | `{ turn }` | يحصّل القفلَ المسجَّل في السجل؛ ويحدد العددُ الجولةَ التلقائية المفتوحة، بينما تحدد `null` محاولةً يدوية مستقلة |
| `compaction/summary` | `{ summary, rawOutput?, llmStreamCall?, shadowedRange, shadowedSeqs, shadowedTokenCount, provider, model, maxTokens?, usage? }` | إسقاطُ الملخص الآمن، وخرجُ المزوّد الكامل واستعمالُه اختياريًا، وواسمُ `llmStreamCall: true` حين استهلك إنتاجُ النتيجة نداءً واحدًا بالضبط عبر `ctx.llm.stream()` في هذا السياق (وهو يشترط `rawOutput` كاملًا)، وزوجُ حدّي السطح المظلَّلين (رقما تسلسل `start` و`end` — امتدادُ مواضع لا مجالٌ عددي)، وأرقامُ التسلسل المظلَّلة بترتيب السطح، وعددُ الرموز المقدَّر، ومغلّفُ نداء التلخيص (`provider` و`model`، مع سقف توليده إن سرى) — مسجَّلًا ليكون الطلبُ ذو اللقطة الواحدة قابلًا لإعادة البناء من السجل والشفرة (انظر ملاحظةَ الوكيل عن قابلية إعادة البناء)؛ و`rawOutput` بلا واسم لا يحدد مسارَ النداء |
| `compaction/end` | `{ turn, error? }` | يحرّر القفلَ بالمالك نفسِه عددًا أو `null` (ويسجّل `error` محاولةً غير ناجحة) |

ويحيط القفلُ بالعملية **كلها**: فيُلحق `compaction/start` أولًا، ثم يحطّ التلخيصُ وسجلُّ `compaction/summary` واستبدالُ `user/message`، وعندئذ فقط يُلحق `compaction/end`. وتحرير القفل أخيرًا يحوّل انهيارًا في منتصف العملية إلى قفل يتيم قابل للكشف (`compaction/start` بلا `compaction/end` مقابل) بدل `compaction/end` يزعم زورًا أن الضغطَ انتهى.

والواسمان نقطتا زمن للقفل لا حاويةٌ حصرية. فقد يظهر حقنُ خمول لا صلةَ له بين بداية يدوية مستقلة ونهايتها بينما التلخيصُ معلَّق. ولا يعيد المسارُ اليدوي التحققَ إلا من امتداد مواضعه المنتقى، فيبقى ذلك السياقُ المحقون بعد نقطة تفتيش الاستبدال. والبدايةُ الحية بلا مقابل تحجب كلَّ نقطة دخول؛ أما البدايةُ بلا مقابل قبل `session/end-seed` أحدثَ فدليلٌ قديم من دورة حياة سابقة ويُتجاهل.

وتُدمج هذه الأشكالُ داخل كتلة `declare module '@deepseek-ai/dsh-session/types'`، فهي — خلافًا للأنواع العليا في صفحات الأنظمة الأخرى — لا تُلصق كتلةَ ` ```ts type-equiv ` مفحوصةَ الانحراف (فمستخرِجُ `verify-type-equiv` لا يطابق إلا التصريحاتِ العليا بالاسم). وجدولُ الحمولات أعلاه هو مدخلُ الدليل؛ واتبع رابطَ المصدر للحقول المرجعية.

<a id="image-offload"></a>
## إزاحة الصور

تملك `compaction-image-offload` تصريحَ `image/offload` وإسقاطَ رسائله النقي. ويحدد كلُّ هدف عقدةَ مُدخَل حالية ومواضعَ صور بعينها بترتيب العمق أولًا. ويحفظ الحدثُ هوياتِ العقد والرسائل ولا يحمل `surfaceOp`. ويملك [README الحزمة](../../packages/compaction/compaction-image-offload/README.ar.md) سياسةَ التعافي والتسجيلَ وإعادةَ التشغيل المنفصلة.

```ts type-equiv
/** Exact input-image occurrences selected by one durable offload decision. */
interface ImageOffloadTarget {
  /** Current message-producing event containing these occurrences. */
  seq: SessionSeq
  /** Zero-based depth-first image indexes within the immutable message. */
  imageIndexes: number[]
}
```

## `CompactionResult`

ما يعيده ضغطٌ ناجح إلى مستدعيه: أرقامُ تسلسل أحداث مسك الدفاتر، وإسقاطُ الملخص الآمن، والمدى وأرقامُ التسلسل المظلَّلة، وعددُ الرموز المقدَّر.

```ts type-equiv
/** Result of a successful compaction operation. */
interface CompactionResult {
  /** Stable identity shared by this compaction's complete durable lifecycle. */
  compactionId: CompactionId
  /** Human command that initiated this compaction, when it was manual. */
  sourceCommandId?: CommandId
  /** The seq of the appended `compaction/start` event. */
  startSeq: SessionSeq
  /** The seq of the appended `compaction/summary` event. */
  summarySeq: SessionSeq
  /** The seq of the appended `compaction/end` event. */
  endSeq: SessionSeq
  /** The summary content blocks produced by the backend. */
  summary: ContentBlock[]
  /**
   * The surface-boundary pair that was shadowed: the seqs of the first
   * (`start`) and last (`end`) surface nodes of the replaced range. A
   * surface-POSITION span, not a numeric seq interval — after a prior replace
   * lands a fresh high-seq summary node at an older range's position, `start`
   * can be GREATER than `end`. {@link CompactionResult.shadowedSeqs} is the
   * authoritative set of shadowed nodes, in surface order.
   */
  shadowedRange: { start: SessionSeq; end: SessionSeq }
  /** The seqs of all shadowed surface nodes, in surface order. */
  shadowedSeqs: SessionSeq[]
  /** Estimated token count of the shadowed content. */
  shadowedTokenCount: number
}
```

## الخدمة

يذكر المستدعون التلقائيون سببَ عمل السياسة؛ وللتنفيذات أن تعامل الطفحَ المؤكد بحزم أشد من الضغط المعتاد.

```ts type-equiv
/** Why automatic policy is asking a backend to consider compaction. */
type CompactionTrigger = 'pressure' | 'context-overflow'
```

ويكشف `CompactionEngine` الدالةَ `compactIfNeeded(agent, trigger, signal)` لسياسة `pressure` أو `context-overflow` التلقائية، و`compactNow(agent, signal)` لتقليص واحد مفيد في جلسة خاملة ولو دون الضغط، و`compactRegion(...)` لمدى سطح شامل صريح. ويعمل `compactNow()` صيانةً للوكيل بين الجولات، ويعيد `null` بلا كتابة حين لا يوجد مدًى مفيد، ويسجّل قوسًا مستقلًا بـ`turn: null` قبل التلخيص، ويدفع محاولةً مغلقة قبل أن تشتق مطالباتٌ مصطفّة لاحقة من السطح الجديد. وتنشئ كلُّ خلفية مصدرَ `user/message` البديل بـ`compactCheckpointSource(compactionId, sourceCommandId?)`؛ ويستورد مستهلكو العميل والشبكة ذلك البانيَ و`CompactionCheckpointSource` و`isCompactCheckpointSource()` من المسار الفرعي `@deepseek-ai/dsh-compaction/checkpoint` الخالي من cordis، بينما يعيد جذرُ الحزمة تصديرَها لمستهلكي المضيف. وتربط هويةُ المعاملة المشترَطة نقطةَ تفتيش الاستبدال، بينما يُبقي المسنِدُ التعرفَ مستقلًا عن أي خلفية بعينها. وعلى التنفيذات أن تمرّر الإشارةَ المقدَّمة إلى التلخيص. ولا يملك الـseam واجهةَ تسعير: فـ[`ctx.tokenMeter`](token-meter.ar.md) المفردة تملك التقديرَ وإعادةَ التشغيل مباشرةً، بينما تملك `dsh-compaction-basic` الاحتفاظَ وترتيبَ الأحداث ونداءاتِ التلخيص المسلوكة وضبطَها.

وتستعمل الإخفاقاتُ اليدوية المتوقعة `ManualCompactionErrorCode`:

```ts type-equiv
/** Expected failure classes for an explicit idle-session compaction request. */
type ManualCompactionErrorCode =
  | 'busy'
  | 'cancelled'
  | 'changed'
  | 'summary'
  | 'commit'
  | 'persistence'
```

وتغلق `changed` و`summary` المحاولةَ الفاشلة وتحفظانها بلا استبدال ملخص؛ وتبقى إغفالاتُ الصور المسجَّلة أثناء التعافي سارية. وقد تأتي `commit` بعد تغيير جزئي؛ وتعني `persistence` أن القوسَ في الذاكرة أُغلق لكن دفعَه فشل. ويبقى الإلغاءُ منفصلًا ويرمي سببَ الإجهاض بعينه بعد التنظيف المشترَط.

ويعمل ضغطُ الضغط عند شلال `agent/pre-step` قبل اشتقاق الطلب. وحالما يتأهل الضغطُ أو الطفحُ المعياري، تستدعي compaction-basic الخدمةَ الاختيارية [`ctx.toolResultPruner`](../../packages/compaction/compaction-tool-result-pruner/README.ar.md) قبل انتقاء المدى، وتعيد القياسَ عبر `ctx.tokenMeter`، وتستطيع تقديمَ السطح بلا ملخص. ويعمل التعافي من طلب فاشل عبر `agent/request-error` بعد إغلاق الخطوة الفاشلة، ولا يعيد فعلَ إعادة محاولة إلا حين يتقدم جيلُ استبدال السطح، ولو رمى عملُ التلخيص اللاحق بعد التشذيب؛ ويبقى الإلغاءُ غالبًا. وتحفظ حدودُ المنطقة اقترانَ نداء الأداة بنتيجتها لكنها لا تحفظ الجولاتِ كاملة، فتستطيع خطواتٌ مغلقة مبكرة من جولة ضخمة أن تُضغط. وتملك `dsh-compaction-basic` العتباتِ وسياسةَ الذيل المحفوظ وسقوفَ الطفح ومعالجةَ الإخفاق.

ويصدّر تعريفُ الخدمة `toolPairingBalancedBefore(session, seq)` و`toolPairingBalancedAfter(session, seq)` لفحوص اقتران نداء الأداة بنتيجتها قبل رقم تسلسل وبعده. ويتحقق الاثنان من عضوية السطح الحالية ويرفضان أرقامَ التسلسل المفقودة والنتائجَ اليتيمة؛ ويعرّف [عقد الحزمة](../../packages/compaction/compaction/README.ar.md#tool-pairing-boundaries) سلوكَ تخزينهما.

## حصائل تشذيب نتائج الأدوات

تبلّغ خدمةُ تشذيب نتائج الأدوات الاختيارية عن كل استبدال محتوى دائم وعن مجموع النقص بوحدات Unicode. وتعيش أنواعُ نتائجها العلنية في [`compaction-tool-result-pruner/src/types.ts`](../../packages/compaction/compaction-tool-result-pruner/src/types.ts).

```ts type-equiv
/** Cited source event and size accounting for one landed surface replacement. */
interface PrunedEntry {
  /** Full-fidelity tool-result event shadowed by the replacement. */
  readonly originalSeq: SessionSeq
  /** Newly appended pruned tool-result event. */
  readonly replacementSeq: SessionSeq
  /** Tool call shared by the original and replacement. */
  readonly callId: ToolCallId
  /** Original text size in Unicode code points. */
  readonly charsBefore: number
  /** Replacement text size in Unicode code points. */
  readonly charsAfter: number
}
```

```ts type-equiv
/** Aggregate outcome of one stable-surface pruning pass. */
interface PruneResult {
  /** Replacements in the snapshotted surface order. */
  readonly pruned: readonly PrunedEntry[]
  /** Total Unicode code points removed across replacements. */
  readonly charsRemoved: number
}
```

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxcompaction--compactionengine-abstract-seam"></a>

### `ctx.compaction` — `CompactionEngine` (abstract seam)

Abstract compaction service. Implementations own trigger policy, retention, and summarization, and may consume a separate measurement service. A successful run replaces the selected surface span with one summary node and prevents concurrent compaction of the same session. The replacement user message uses compactCheckpointSource with the transaction identity so consumers recognize and correlate it independently of the backend. Load one implementation per context as `ctx.compaction`.

```ts cordis-catalog
/**
 * Consider automatic compaction for one explicit trigger. Pressure policy
 * uses the latest durable routed request, while context-overflow policy may
 * force a useful balanced reduction even below the normal threshold. Return
 * `null` when no safe range can be compacted. A single oversized retained
 * unit or request envelope cannot be repaired through surface compaction.
 *
 * @param agent - agent context owning the session surface and routing options.
 * @param trigger - normal pressure or provider-confirmed context overflow.
 * @param signal - cancellation signal; model-backed implementations must forward it.
 * @returns the compaction result, or `null` if no compaction was needed.
 */
abstract compactIfNeeded( agent: CompactionAgentContext, trigger: CompactionTrigger, signal: AbortSignal, ): Promise<CompactionResult | null>

/**
 * Explicitly compact useful history even below automatic pressure thresholds.
 * Implementations synchronously start an idle task before any asynchronous
 * work, select a useful range without writing on a no-op, then
 * append a standalone `compaction/start` before summarization. That durable
 * marker is the compaction lock until one `compaction/end` attempt. Later waking
 * prompts remain accepted in FIFO order and start only after the optional
 * durability checkpoint and idle-task settlement. Context injected while the
 * summary runs may sit between the marker pair; only the selected span must
 * remain stable.
 *
 * @param agent - idle agent whose durable history should be compacted.
 * @param signal - cancellation scoped to this compaction request.
 * @param sourceCommandId - initiating command identity for a manual compaction.
 * @returns the compaction result, or `null` when no safe useful range exists.
 * @throws {@link ManualCompactionError} for expected busy, agent-cancellation,
 * changed-span, summarization/shrink, commit-stage, or persistence failures;
 * an aborted request preserves its exact abort reason. Failed attempts remain
 * visible in the log.
 */
abstract compactNow( agent: ManualCompactAgentContext, signal: AbortSignal, sourceCommandId?: CommandId, ): Promise<CompactionResult | null>

/**
 * Forcibly compact a range of surface nodes into a single summary node.
 * `start` and `end` name an inclusive span by surface position, not numeric seq
 * order; replacements can make visible seqs non-monotonic. Both edges must be
 * balanced so assistant tool calls remain paired with their results. A model-
 * backed implementation forwards cancellation and rejects active, missing,
 * reversed, or unbalanced ranges. The target session is `agent.session`.
 * Its replacement user message must use {@link compactCheckpointSource} with
 * the transaction's `CompactionId`.
 * Use {@link toolPairingBalancedBefore} and {@link toolPairingBalancedAfter}
 * for the edge checks.
 *
 * @param start - first surface seq, inclusive.
 * @param end - last surface seq, inclusive.
 * @param agent - context whose session is mutated and whose routing options guide summarization.
 * @param signal - optional cancellation; model-backed implementations must forward it.
 * @throws when compaction is active or the range is missing, reversed, or unbalanced.
 * @returns the appended event seqs, summary, replaced range, and token accounting.
 */
abstract compactRegion( start: SessionSeq, end: SessionSeq, agent: CompactionAgentContext, signal?: AbortSignal, ): Promise<CompactionResult>
```

Types: [CommandId](commands.ar.md) · [SessionSeq](session.ar.md)

Source: [`packages/compaction/compaction/src/index.ts`](../../packages/compaction/compaction/src/index.ts)

<a id="ctxtoolresultpruner--toolresultpruner"></a>

### `ctx.toolResultPruner` — `ToolResultPruner`

Deterministic head/middle/tail pruning for current tool-result surface nodes.

```ts cordis-catalog
/**
 * Measure text content in Unicode code points; non-text blocks cost zero.
 * @param blocks - tool-result content to measure.
 * @returns total Unicode code points across text blocks.
 */
measureContent(blocks: readonly ContentBlock[]): number

/**
 * Replace an over-budget text middle while retaining rich-block order.
 * Text slicing is by Unicode code point, not UTF-16 code unit, so a retained
 * boundary cannot split a surrogate pair. Grapheme clusters may still split.
 * @param blocks - original tool-result content.
 * @returns pruned content, or `null` when the text is within budget.
 */
pruneContent(blocks: readonly ContentBlock[]): ContentBlock[] | null

/**
 * Prune every over-budget tool result from one stable current-surface snapshot.
 * Each replacement preserves the complete event data except for `content`,
 * cites the shadowed node so replay can recover the replacement input, and is
 * immediately preceded by a `compaction/prune` shadow-price event pricing the
 * shadowed node through the injected token meter, so pure consumers can
 * subtract it without per-node state.
 * @param session - session whose current surface is rewritten.
 * @returns landed replacements and aggregate Unicode-code-point savings.
 * @throws when the session rejects a replacement; replacements committed
 * earlier in the pass remain durable.
 */
pruneSession(session: Session): PruneResult
```

Types: [ContentBlock](llm-streaming.ar.md) · [Session](session.ar.md)

Source: [`packages/compaction/compaction-tool-result-pruner/src/index.ts`](../../packages/compaction/compaction-tool-result-pruner/src/index.ts)

<a id="compaction-events"></a>

### `compaction/*` events

<a id="compactionsummary-error--waterfall"></a>

#### `compaction/summary-error` — waterfall

Recover a failed summary request by synchronously recording a durable change to its selected input. Return true only after making progress; the provider re-derives and re-prices the selection before retrying. Call next() when the failure cannot be recovered. Decisions survive a later summary failure or cancellation.

```ts cordis-catalog
/**
 * Recover a failed summary request by synchronously recording a durable
 * change to its selected input. Return true only after making progress;
 * the provider re-derives and re-prices the selection before retrying.
 * Call next() when the failure cannot be recovered. Decisions survive a
 * later summary failure or cancellation.
 * @param payload.session - session containing the selected input.
 * @param payload.sourceEventSeqs - selected message events in request order.
 * @param payload.error - failure thrown by the summarizer.
 * @param payload.signal - optional compaction cancellation signal.
 * @param next - delegate to the next recovery listener.
 * @mode waterfall
 */
'compaction/summary-error'(payload: { session: Session; sourceEventSeqs: readonly SessionSeq[]; error: unknown; signal?: AbortSignal }, next: () => boolean): boolean
```

Types: [Session](session.ar.md) · [SessionSeq](session.ar.md)

Source: [`packages/compaction/compaction/src/index.ts`](../../packages/compaction/compaction/src/index.ts)
<!-- END GENERATED cordis-surface -->
