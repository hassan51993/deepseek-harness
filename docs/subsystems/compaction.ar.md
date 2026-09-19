# ضغط (compaction)

[English](compaction.md) | العربية

ضغط seam هو واحد[قدرة seam](../../.agents/notes/implemented/architecture/2026-06-13-capability-seams.ar.md) ، و bash واحد مثال قسم لـ Service Definition([dsh-compaction](../../packages/compaction/compaction) ،`ctx.compaction`) ،Service Provider(مثال مثل [dsh-compaction-basic](../../packages/compaction/compaction-basic) خلفية) و موجه إلى مستخدم Consumer([dsh-command-compact](../../packages/compaction/command-compact)). ضغط هو**واحد بند اختياري قدرة**، لا يخص agent loop(ذكي جسم حلقة) رئيسي جاف، لذلك ذلك مفردات تعريف في هذا بينما غير [core.md](core.ar.md) في. أساس في tokenizer أو نموذج لوح خلفية هو تنفيذ نفس واجهة أخ أخ حزمة. و bash مختلف، هذا واجهة لا بد لكن اعتماد `dsh-session` و `dsh-llm`: ذلك حركة كلمة أثر في agent كل `Session`، بينما ذلك حمل دائم ملخص حدث استخدام `ContentBlock` مفردات (رؤية[ضغط قدرة seam Agent Note](../../.agents/notes/implemented/feature/2026-06-18-compaction-capability-seam.ar.md)).

شفرة المصدر:[`packages/compaction/compaction/src/types.ts`](../../packages/compaction/compaction/src/types.ts)

## `compaction/*` جلسة حدث

ضغط عبر إعلان دمج لـ [`SessionEventMap`](session.ar.md) توسيع ثلاثة نوع حدث نوع. ثلاثة من كل**فقط كتابة سجل**——هو جمع سجل قفل، ملخص، اختيار في نطاق، يتم حجب حجب حدث seq،token عدد و نموذج استدعاء، أبدا دخول surface. هذا داخل متعمد لا توسيع `SurfaceEventType`(فقط لديه إنتاج رسالة حدث عندئذ وصول نموذج) ، لذلك ملخص ذاته تحمل تحميل في آخر بند حمل لديه `surfaceOp: { op: 'replace', startSeq, endSeq }` `user/message` فوق——هذا هو ملخص ضغط تنفيذ وحيد surface تغيير.[Agent Note](../../.agents/notes/implemented/feature/2026-06-18-compaction-capability-seam.ar.md) مسؤول إعادة استخدام `user/message` قرار اعتماد حسب.

| حدث | تحميل حمل | أثر |
|---|---|---|
| `compaction/start` | `{ turn }` | نيل أخذ سجل سجل قفل؛ عدد حرف معرف بعد لم انتهاء تلقائي جولة،`null` معرف مستقل يد حركة محاولة تجربة |
| `compaction/summary` | `{ summary, rawOutput?, llmStreamCall?, shadowedRange, shadowedSeqs, shadowedTokenCount, provider, model, maxTokens?, usage? }` | أمان ملخص إسقاط، اختياري كامل مزود إخراج و usage، توليد نتيجة وقت تماما جيد عبر هذا سياق `ctx.llm.stream()` إرسال بدء مرة استدعاء الذي حمل `llmStreamCall: true` علامة (هذا وقت يجب توفير كامل `rawOutput`) ، يتم حجب حجب surface حد مقابل (`start`/`end` seq——موضع عبر درجة، بينما غير عدد قيمة منطقة بين) ، حسب surface ترتيب صف يتم حجب حجب seq، تقدير حساب token عدد، و ملخص استدعاء envelope(`provider`،`model`، إذا لديه توليد حد أعلى فإن أيضا يشمل هذا حد أعلى)——كتابة سجل بعد، هذا مرة صفة طلب يمكن من سجل + شفرة إعادة بناء (رؤية يمكن إعادة بناء صفة Agent Note) ؛ لم حمل علامة `rawOutput` و لا يستطيع حكم تحديد استدعاء مسار |
| `compaction/end` | `{ turn, error? }` | استخدام نفسه عدد حرف أو `null` ملكية قيمة تحرير قفل (`error` سجل فشل محاولة تجربة) |

قفل تضمين إقامة**كامل**عملية: أولا إلحاق `compaction/start`، لكن بعد تنفيذ ملخص توليد، كتابة `compaction/summary` سجل و `user/message` استبدال، الأكثر بعد عندئذ إلحاق `compaction/end`. الأكثر بعد تحرير قفل معنى طعم حال عملية في طريق انهيار انهيار سوف جدول الآن لـ يمكن فحص قياس متروك إبقاء قفل (لديه `compaction/start` بينما بلا مطابقة `compaction/end`) ، بينما غير واحد وهمي زائف صوت تسمية ضغط اكتمل `compaction/end`.

هذه علامة يمثل قفل وقت نقطة، بينما لا هو ترتيب هو حاوية. ملخص انتظار خلال، لا متبادل صلة فارغ خامل حقن يمكن ظهور في مستقل يد حركة start و end بين. يد حركة مسار فقط إعادة تحقق الذي اختيار موضع span، لذلك استبدال فحص نقطة بعد ما زال إبقاء هذا حقن سياق. نشط حركة لم مطابقة start سوف منع سد كل مدخل نقطة؛ مقارنة جديد `session/end-seed` قبل لم مطابقة start هو أولا قبل دورة الحياة إبقاء تحت قديم قديم دليل، سوف يتم تجاهل اختصار.

هذه تغيير جسم في `declare module '@deepseek-ai/dsh-session/types'` كتلة داخل دمج، لذلك——و أخرى فرعي نظام صفحة فوق قمة طبقة نوع مختلف——هو جمع لا بـ عائم نقل فحص ` ```ts type-equiv ` كتلة لصق لصق (`verify-type-equiv` رفع أخذ جهاز فقط حسب اسم مطابقة قمة طبقة إعلان). فوق جهة تحميل حمل جدول أي لـ دليل بند؛ مرجعي حقل طلب دوران شفرة المصدر رابط عرض.

<a id="image-offload"></a>
## صورة حذف

`compaction-image-offload` يملك `image/offload` إعلان و ذلك صاف رسالة إسقاط. كل هدف إشارة تحديد حالي إدخال عقدة و حسب عميق درجة أولوية حساب عدد تأكيد قطع صورة موضع. حدث إبقاء عقدة و رسالة هوية، لا يحمل `surfaceOp`.[حزمة README](../../packages/compaction/compaction-image-offload/README.ar.md) مسؤول استعادة سياسة، تسجيل و مستقل إعادة تشغيل شرح.

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

نجاح ضغط نحو استدعاء جهة إرجاع: تسجيل حساب حدث seq، أمان ملخص إسقاط، يتم حجب حجب نطاق و seq، و تقدير حساب token عدد.

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

## خدمة

تلقائي استدعاء جهة سوف شرح سياسة لـ أي تشغيل؛ تنفيذ يمكن مقارنة عادي ضغط قوة أكثر تنشيط دخول أرض معالجة قد تأكيد فيض خروج.

```ts type-equiv
/** Why automatic policy is asking a backend to consider compaction. */
type CompactionTrigger = 'pressure' | 'context-overflow'
```

`CompactionEngine` كشف `compactIfNeeded(agent, trigger, signal)` بـ تنفيذ تلقائي `pressure` أو `context-overflow` سياسة، كشف `compactNow(agent, signal)` بـ سهل أي جعل لم بلوغ إلى ضغط قوة أيضا مقابل فارغ خامل جلسة إجراء مرة صالح تقليص نقص، أيضا إبرة مقابل صريح، اثنان طرف متساو يتضمن surface نطاق كشف `compactRegion(...)`.`compactNow()` بصفة جولة بين agent maintenance تشغيل؛ لا يوجد صالح نطاق وقت إرجاع `null` كما لا كتابة؛ في ملخص قبل سجل مستقل `turn: null` علامة مقابل، و في لاحق ترتيب طابور نص التوجيه قدرة كاف من جديد جدول طبقة إرسال توليد قبل flush قد إغلاق دمج محاولة تجربة. كل خلفية كل استخدام `compactCheckpointSource(compactionId, sourceCommandId?)` إنشاء استبدال استخدام `user/message` مصدر؛client و wire مستهلك من بلا Cordis `@deepseek-ai/dsh-compaction/checkpoint` فرعي مسار استيراد هذا بنية صنع دالة،`CompactionCheckpointSource` و `isCompactCheckpointSource()`، حزمة أصل فإن لـ host مستهلك إعادة تصدير هو جمع. لا بد ملء أمر خدمة هوية سوف صلة ربط استبدال فحص نقطة، بينما هذا حكم تحديد دالة جعل فحص نقطة تعرف آخر لا اعتماد مهمة واحد خاص تحديد خلفية. تنفيذ يجب يأخذ نقل دخول signal تحويل إرسال إعطاء ملخص مسار. هذا seam لا يملك حساب قيمة API: مفرد مثال [`ctx.tokenMeter`](token-meter.ar.md) مباشر يملك تقدير حساب و إعادة تشغيل، بينما `dsh-compaction-basic` يملك إبقاء سياسة، حدث ترتيب، حسب توجيه تنفيذ ملخص استدعاء و ذلك إعداد.

مسبق مدة يد حركة فشل استخدام `ManualCompactionErrorCode`:

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

`changed` و `summary` إغلاق دمج فشل محاولة تجربة و سوف ذلك حفظ دائم إلى سجل، لا كتابة ملخص استبدال؛ استعادة مرور مسار في سجل صورة حذف ما زال صالح.`commit` ممكن حدوث في جزء تغيير بعد؛`persistence` يمثل داخل تخزين في علامة مقابل قد إغلاق دمج، لكن flush فشل. إلغاء مستقل في هذه فشل، و في إتمام لا بد يلزم تنظيف بعد رمي خروج أصلي abort سبب.

ضغط قوة ضغط في `agent/pre-step` waterfall(شلال نشر صيغة حدث) في تشغيل، أولا في طلب دفع توجيه. واحد حالما ضغط قوة أو مواصفة تحويل فيض خروج ممتلئ كاف شرط،compaction-basic سوف في اختيار نطاق قبل استدعاء اختياري [`ctx.toolResultPruner`](../../packages/compaction/compaction-tool-result-pruner/README.ar.md) ، مجددا عبر `ctx.tokenMeter` إعادة قياس كمية، و كما يمكن في لا توليد ملخص حال حال تحت دفع دخول surface. فشل طلب استعادة في فشل خطوة إغلاق بعد عبر `agent/request-error` تشغيل؛ فقط عند surface replacement generation قبل دخول وقت عندئذ إرجاع إعادة محاولة حركة عمل، أي سهل لاحق ملخص عمل في قص غصن بعد رمي استثناء أيضا مثل هذا؛ إلغاء ما زال أولوية. منطقة مجال حد إبقاء استدعاء الأداة/نتيجة إعداد مقابل، لكن لا إبقاء كامل جولة، لذلك واحد مرور كبير جولة في مقارنة مبكر إغلاق خطوة يمكن يتم ضغط.`dsh-compaction-basic` يملك عتبة قيمة، إبقاء ذيل جزء سياسة، فيض خروج حد أعلى و فشل معالجة.

هذا Service Definition تصدير `toolPairingBalancedBefore(session, seq)` و `toolPairingBalancedAfter(session, seq)`، لأجل فحص seq قبل و بعد استدعاء الأداة/نتيجة إعداد مقابل. اثنان من كل سوف تحقق حالي surface عضو علاقة، و رفض ناقص seq و متروك إبقاء نتيجة؛[حزمة اتفاق](../../packages/compaction/compaction/README.ar.md#tool-pairing-boundaries) تعريف ذلك ذاكرة مؤقتة سلوك.

## أداة نتيجة قص غصن إنتاج خروج

اختياري أداة نتيجة قص غصن خدمة سوف تقرير إبلاغ كل مرة حمل دائم محتوى استبدال و Unicode code point مجموع نقص قليل كمية. ذلك عام نتيجة نوع يقع في [`compaction-tool-result-pruner/src/types.ts`](../../packages/compaction/compaction-tool-result-pruner/src/types.ts).

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
