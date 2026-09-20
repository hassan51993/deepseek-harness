# الجلسات

[English](session.md) | العربية

النموذجُ في الذاكرة المسنَد إلى الأحداث في [dsh-session](../../packages/core/session). و`Session` **سجلٌّ ذو إلحاق فقط** من `SessionEvent` منوَّعة — وهو مصدرُ الحقيقة الوحيد لتاريخ تفاعل وكيل كاملًا. وتاريخُ رسائل LLM *مشتقٌّ* من السجل، ولا يُخزَّن على حدة قط؛ وإعادةُ التشغيل إعادةُ اشتقاق من الأحداث نفسِها. وكيف يصير السجلُّ **دائمًا** (وهو seam الحفظ الدائم وخلفياتُه والتعافي من الانهيار) شأنٌ شقيق على [persistence.md](persistence.ar.md).

المصدر: [`packages/core/session/src/types.ts`](../../packages/core/session/src/types.ts)

## `SessionEventMap` — مفردات الأحداث

أنواعُ الأحداث ذات الإلحاق فقط. وهي قابلةٌ للتوسعة بالدمج: فتعلن إضافةٌ أنواعَ أحداث إضافية بدمج التصريحات — فيضيف [seam الضغط](compaction.ar.md) مثلًا `compaction/start` و`compaction/summary` و`compaction/end`، وتضيف `@deepseek-ai/dsh-hook-protocol` سجلَّي `hook/invoked` و`hook/result` للسجل فقط لجسر خطّافات. وهذه، مثل `compaction/*`، ليست من `SurfaceEventType` (فلا `surfaceOp` لها). ويعدّد [دليلُ أحداث سجل الحفظ الدائم](../persistence-catalog.ar.md) المولَّد كلَّ عضو — نواةً كان أو مدموجًا — مع حمولته وشارةِ سطحه وموضعِ تصريحه.

```ts type-equiv
/** A user-role specialization of the one shared message representation. */
interface UserMessage extends Message {
  readonly role: 'user'
}
```

```ts type-equiv
/**
 * The merge-extensible, append-only source of truth for an agent interaction.
 * Message history is derived from this log. Every event is lossless JSON and
 * sequence numbers stay contiguous. Assistant attempt events embed their exact
 * compact raw streams so persistence stores one durable settlement per attempt.
 */
interface SessionEventMap {
  /**
   * Opens turn `turn` before the loop claims queued input or runs pre-step.
   * Rejection, empty input, cancellation, or failure may close it with no
   * step; otherwise the following identified `user/message` event or batch
   * records the messages entering the step.
   */
  'turn/start': { turn: number }
  /**
   * Closes turn `turn` with the {@link TurnEndReason} that ended it. A turn
   * with no entered step has no `step/start` or `step/end`. The loop does not await a
   * flush at turn boundaries: `dsh-session-checkpoint-policy` owns the
   * per-request durability checkpoint, and consumers that read storage after
   * `whenIdle()` flush themselves. Success commits the turn; rejection is
   * reported live and does not prevent later work.
   */
  'turn/end': { turn: number; reason: TurnEndReason }
  /** Opens step `step` of turn `turn` — one model call plus the tool executions it requested. */
  'step/start': { turn: number; step: number }
  /** Closes step `step` of turn `turn`. */
  'step/end': { turn: number; step: number }
  /**
   * A user-role message on the model-visible surface: a direct human prompt
   * (the queued message claimed for this turn), a synthetic `agent.inject()`
   * context (file-change notices, subdir AGENTS.md, skill content, cron
   * notifications, …), or an entered goal continuation round. All three
   * project their `content` verbatim; `source` tells them apart.
   */
  'user/message': UserMessage
  /**
   * The rendered system prompt on the model-visible surface. The loop appends
   * the first one as surface node 0 before the step's first `user/message`.
   * A prepared in-history route can append nonempty changes in a continuing
   * series. An incapable route or new series normalizes text to the first system
   * node. Normalization empties nonempty later nodes, then rewrites the head if
   * needed, through logged per-node replacements. An empty rendering always
   * clears all active system nodes, leaving no older instructions model-visible.
   * Empty later nodes are dormant and project to no message; an empty head with
   * no active later node records "no system prompt". Restored nonempty text follows
   * the same route and series rule; empty nodes never restore older text.
   */
  'system/message': { turn: number; step: number; message: SystemMessage }
  /**
   * Assembled assistant message for one step (derived history uses this).
   * Carries the step's `usage` when the adapter reported token accounting, so
   * the model output and its accounting travel together (there is no separate
   * usage record). `usage` is absent when the adapter reported none. A turn
   * cancelled mid-stream finalizes its delivered text/reasoning prefix as this
   * event with `interrupted: true`; undispatched tool calls are absent. The
   * marker distinguishes that prefix without re-deriving interruption from turn
   * boundaries. An aborted turn with no such event streamed no visible content.
   */
  'assistant/message': {
    turn: number
    step: number
    message: AssistantMessage
    /** Exact timed model stream, compacted without joining delta boundaries. */
    stream: AssistantStreamRecord[]
    usage?: TokenUsage
    interrupted?: true
  }
  /**
   * One model attempt that committed no surface message. The embedded stream
   * preserves a failed, retried, cancelled, or stream-error attempt that
   * reached settlement without fabricating model-visible history.
   */
  'assistant/attempt': { turn: number; step: number; stream: AssistantStreamRecord[] }
  /**
   * The model requested one tool invocation: `name` with the raw `arguments`
   * JSON string exactly as the model produced it (unparsed). `callId` pairs the
   * call with its `tool/result`.
   */
  'tool/call': { turn: number; step: number; callId: ToolCallId; name: string; arguments: string }
  /**
   * A completed tool call's model-facing result, optional internal failure
   * identity and user-facing reason, and optional tool-private `meta`
   * presentation payload. The reason remains outside the model-facing message.
   * `meta` is
   * opaque to the core (the producing tool owns its shape and reads it back in
   * `presentResult`) but MUST be JSON-serializable: `Session.append`
   * runtime-validates all event data with `isJsonValue`, so a non-serializable
   * `meta` is rejected at the source, and the durable log reproduces the
   * identical card on replay. Absent
   * unless the tool attaches one (e.g. `dsh-tool-fs` carries its result-time
   * contextual diff here).
   */
  'tool/result': {
    turn: number
    step: number
    message: ToolResultMessage
    /**
     * Optional failure identity and raw user-facing reason, outside model content;
     * allowed only when the tool-result block has `isError: true`.
     */
    error?: { name: string; code: string; reason?: string }
    meta?: JsonValue
  }
  /**
   * Full header for the next request, appended inside its step before dispatch.
   * It is log-only; the latest snapshot reconstructs the request header.
   */
  'request/header': {
    header: EpochHeader
    reason: RequestHeaderReason
    /** A changed header also begins a distinct model-message series. */
    startsSeries?: true
  }
  /**
   * Route metadata for the next request, logged only when the route, capacity,
   * or system prompt update mode changes. It does not participate in request
   * reconstruction or header equality. Prompt admission uses the bound prepared
   * call's capability, not this snapshot from an earlier request.
   */
  'request/context': RequestContext
  /**
   * Marks the end of a constructor seed. Events before it have smaller seq
   * values and came from the seed (resume, fork, or replay); this lifecycle
   * produced none of them. This log-only event is the durable projection of
   * {@link Session.firstLiveSeq}.
   *
   * A fresh fork child owns one `{ inherited: true }` marker at its exact
   * inherited-prefix cut, even when that prefix ends in an ancestor marker.
   * The last tagged marker is the current Session's cut; untagged markers keep
   * ordinary restore and replay lifecycle boundaries.
   *
   * `Session`'s constructor is the only legitimate writer. The invariant
   * companion deliberately constrains nothing here, so a plugin appending one
   * would silently classify every live bracket before it as seed history.
   *
   * An owner of a standalone open/close bracket (`compaction/start` …
   * `compaction/end`) reads it because seed history and live work are otherwise
   * byte-identical: an unmatched opening marker before this event belongs to
   * an ended lifecycle, whatever ended it. NOT a liveness signal about other
   * writers — a concurrently live session holds its own boundary elsewhere,
   * so tolerating concurrent writers needs a signal beyond the log.
   */
  'session/end-seed': { inherited?: true }
}
```

و`UserMessage` هي القيمةُ المعرَّفة المجمَّدة بدور المستخدم التي تتشاركها المطالباتُ المعتادة والسياقُ المحقون والتوجيهُ وأحداثُ صندوق الوارد الحية. ولا تضيف مغلّفاتُ الأحداث إلا حقائقَ موضع أو حصيلة محلية في الحدث؛ ولا تضيف الحلقةُ إلا حالةَ توجيه يملكها القائدُ ما دام البندُ معلَّقًا.

<a id="the-request-header-event-requestheader"></a>

### حدث ترويسة الطلب: `request/header`

مغلّفُ الطلب — وهو `EpochHeader` (ضبطُ النداء مع واسمات الافتراضات التي يقدّمها المهايئ مع schemas الأدوات المجمَّعة) — حالةٌ مسجَّلة في الجلسة، فيكون كلُّ طلب محادثة دالةً نقية من السجل (بحسب ملاحظة الوكيل عن قابلية إعادة البناء). ومطالبةُ النظام المعروضة ليست من الترويسة: فهي تاريخٌ مشتق، أي حدثُ `system/message` عند عقدة السطح صفر وأيُّ عقدة نظام لاحقة في التاريخ ([القرار](../../.agents/notes/implemented/architecture/2026-09-02-system-prompt-as-surface-node.ar.md))، فتغييرُ المطالبة يستبدل عقدةَ نظام أو يُلحق واحدة ويترك الترويسةَ كما هي. ولقطةُ `request/header` كاملةً بسبب `'initial'` أو `'resume'` تسجّل حدَّ كل نسخة حلقة؛ ويُلحق الطلبُ المتغيّر لقطةً بسبب `'change'`؛ ويُلحق المغلّفُ غيرُ المتغيّر الذي يبدأ سلسلةَ رسائل معلَنة صراحةً أو يأتي بعد استبدال سطح لقطةً بسبب `'series'`. وتحمل اللقطةُ المتغيّرة `startsSeries: true` حين يبدأ ذلك الطلبُ سلسلةً أيضًا. وترث الجولاتُ اللاحقة المعتادة ذاتُ الإلحاق فقط والخطواتُ الأخرى وإعاداتُ المحاولة في سلسلة رسائل النموذج نفسِها أحدثَ لقطة. ويعيد `foldRequestHeader(events)` بناءَ الترويسة بانتقاء أحدث لقطة. والحدثُ ليس من `SurfaceEventType`: فهو لا ينتج رسالةَ LLM.

```ts type-equiv
/**
 * Logged request state outside derived history: call config and tools. The
 * system prompt is derived history — surface node 0, a `system/message` event.
 * The latest full `request/header` snapshot reconstructs the header; canonical
 * empty optional fields are absent.
 */
interface EpochHeader {
  /** The conversation's call configuration (provider, model, reasoning effort, and sampling scalars). */
  config: LlmCallConfig
  /** Effective config fields materialized from the exact adapter rather than proposed by a caller. */
  adapterDefaults?: LlmCallConfigAdapterDefaults
  /** Assembled tool schemas; absent for a tool-less request. */
  tools?: ToolSchema[]
}
```

ويشترط قبولُ الأحداث الحالي أن تكون `request/header.header` معيارية: فأيُّ حقل `system` ممنوع، ويجب إغفالُ `tools: []` و`adapterDefaults: {}`. ويبقى محتوى رسالة النظام المقتصر على الفراغات و`config.stop: []` والامتداداتُ المتداخلة كما هي. وترفض قراءاتُ البذر والإلحاق والحفظ الدائم الحالي الترويساتِ غيرَ المعيارية بدل توحيدها صامتةً؛ ويملك [قرار مغلّف V3](../../.agents/notes/implemented/architecture/2026-09-06-v3-canonical-session-envelopes.ar.md) التحويلَ التاريخي. وتُرفض سجلاتُ v0 القديمة التي تحتوي `request/header-delta` أو سببَ `fallback` ذا اللقطة الكاملة بدل إعادة تشغيلها ناقصة.

### حدث سعة المسار: `request/context`

البياناتُ الوصفية لسياق المسار الذي حُلّ إليه طلبٌ حالةٌ مسجَّلة منفصلة، تُلحق بجوار `request/header` داخل الخطوة نفسِها، ولا تُلحق إلا حين يختلف المزوّدُ أو النموذجُ أو السعةُ أو وضعُ `systemPromptUpdate` عن السجل السابق. وهي تبقى خارج `EpochHeader` لأن ذلك النوعَ هو عقدُ إعادة البناء الذي يقارنه `headerEquals` حقلًا حقلًا: فالسعةُ ووضعُ التحديث يصفان مسارًا لا مُدخَلَ طلب، فطيُّهما فيه سيجعل تغييرَ مسار يُسجَّل تغييرَ مغلّف طلب `change` وسيجرّ بياناتِ المهايئ الوصفية إلى ثابتة إعادة البناء في الحلقة. وهي، مثل `request/header`، ليست من `SurfaceEventType` ولا تنتج رسالةَ LLM. ويطوي `session.requestContext()` أحدثَ سجل تدريجيًّا؛ وتقرأ agent loop قيمةَ `systemPromptUpdate` في ذلك السجل حين تقرر أتستبدل مطالبةُ نظام متغيّرة أحدثَ عقدة نظام أم تُلحق بعد التاريخ المخزَّن ([قاعدة القرار](../../packages/core/agent-loop/README.ar.md#understand-the-implementation)). والمسارُ الذي لا يعلن مهايئُه سعةً يُسجَّل بـ`contextWindow` غائبة، فيمسح السجلُّ الجديد سعةَ مسار أقدم؛ والمسارُ بلا وضع تحديث معلَن يمسح كذلك `systemPromptUpdate` لمسار أقدم.

```ts type-equiv
/** Registration-bound metadata for one resolved model route. */
interface RequestContext {
  /** Registered provider route the metadata belongs to. */
  provider: string
  /** Provider-owned model id the metadata belongs to. */
  model: string
  /** Maximum combined request and response context in tokens, when advertised. */
  contextWindow?: number
  /** `'in-history'` when the route reads the latest `system` message at any position as the effective system prompt. */
  systemPromptUpdate?: SystemPromptUpdate
}
```

## `SessionEvent<T>` — مدخل سجل واحد

اتحادٌ مميَّز صحيح على `type` (لا اتحادَي `type` و`data` مستقلين)، فيضيّق `switch (event.type)` قيمةَ `event.data` بلا تحويلات. و`seq` الموضعُ التصاعدي في السجل (`seq = log.length`)؛ و`time` بالميلي ثانية منذ حقبة Unix.

```ts type-equiv
/** Sequence number of one existing event in a Session log. */
type SessionSeq = BrandedNumber<'SessionSeq'>
```

```ts type-equiv
/** A Session log gap, prefix length, or read offset, which may equal the event count. */
type SessionLogOffset = BrandedNumber<'SessionLogOffset'>
```

```ts type-equiv
/** Inclusive Session event watermark, or `-1` before any event exists. */
type SessionSeqCursor = SessionSeq | -1
```

```ts type-equiv
/** One existing Session event position, or explicit absence. */
type OptionalSessionSeq = SessionSeq | null
```

ولا يقبل `SessionSeq(value)` و`SessionLogOffset(value)` إلا الأعدادَ الصحيحة الآمنة غير السالبة ويرفضان الصفرَ السالب. ويضيفان علاماتٍ عند الترجمة بلا تغيير العدد المسلسَل؛ والحسابُ يعيد `number` عاديًّا على المستدعين أن يُدخلوه البانيَ ثانيةً لدوره المقصود.

```ts type-equiv
/**
 * One immutable entry in the session log.
 *
 * A proper discriminated union over `type` (not independent `type`/`data`
 * unions), so `switch (event.type)` narrows `event.data` without casts.
 *
 * The {@link sourceEventSeqs} and {@link surfaceOp} fields are conditional:
 * they only exist on {@link SurfaceEventType} variants (`system/message`, `user/message`,
 * `assistant/message`, `tool/result`).
 * Non-surface events (boundary markers, attempts, errors) never carry
 * surface metadata — the compiler enforces this at `Session.append()`
 * call sites.
 */
type SessionEvent<T extends SessionEventType = SessionEventType> = {
  [K in SessionEventType]: {
    type: K
    /** Monotonic sequence number within the session. */
    seq: SessionSeq
    /** Unix epoch milliseconds. */
    time: number
    data: SessionEventMap[K]
    /**
     * Marks an event a reader may safely skip when it does not recognize
     * `type`. Absent means required: a reader meeting an unrecognized type
     * without this marker MUST refuse to reconstruct the session instead of
     * silently dropping the event, because an unrecognized required event may
     * change how the rest of the log is interpreted. A writer sets `true` only
     * on purely informational records whose loss cannot affect reconstruction;
     * defaulting to required means a forgotten marker over-refuses (an
     * inconvenience) rather than silently resuming a gutted session.
     */
    ignorable?: true
  } & (K extends SurfaceEventType ? SurfaceIntent<K> : {
    surfaceOp?: never
    sourceEventSeqs?: never
  })
}[T]
```

و`SessionEventType = keyof SessionEventMap`. ولأن `SessionEventMap` قابلةٌ للتوسعة بالدمج، يجب ألّا تستعمل التفريعاتُ على `SessionEvent` الدالةَ `assertNever` — فالشكلُ الذي تضيفه إضافةٌ قيمةٌ مجهولة صالحة؛ فعالِج الحالاتِ المعروفة واسقط عبر `default`.

ويشترط كلُّ حدث سطح قيمةَ `surfaceOp`؛ وتمنع أحداثُ السجل فقط المعروفة حقلَي بيانات السطح كليهما. وتبقى المغلّفاتُ الأصيلة المجهولة أو المهجورة القابلة للتجاهل معتمة. ويضمّن `assistant/message` مجرى مزوّده ويمنع `sourceEventSeqs`. ولأحداث سطح النظام والمستخدم والأدوات أن تذكر مجموعةً كاملة غيرَ فارغة من أحداث أسبق فريدة حين تشترط نسبةُ المصدر أو تغطيةُ الاستبدال ذلك. ولا يحمل `tool/result` قيمةَ `data.error` إلا حين تحمل كتلةُ نتيجة أداته `isError: true`؛ وتبقى هويةُ الإخفاق اختياريةً للنتائج الفاشلة.

<a id="surface-types"></a>

## أنواع السطح

الأنواعُ الأربعةُ المنتِجة للرسائل (وهي `SurfaceEventType`: `system/message` و`user/message` و`assistant/message` و`tool/result`) تحمل بياناتِ سطح وصفية تعلن كيف تنضم إلى السطح المشتق المرتَّب. ويحمل `system/message` مطالبةَ النظام المعروضة: فتُلحق الحلقةُ أولَها عقدةَ سطح صفر، وحين تتغير المطالبةُ تستبدل أحدثَ عقدة نظام بعينها أو تُلحق عقدةً جديدة على مسار داخل التاريخ؛ ويرفض طيُّ السطح أيَّ استبدال آخر يغطي `system/message` عند العقدة صفر، بينما تكون عقدةُ نظام لاحقة تاريخًا عاديًّا قد يظلّله استبدالُ ضغط. انظر [ملاحظة الوكيل عن سطح الجلسة](../../.agents/notes/implemented/architecture/2026-06-18-session-surface.ar.md).

### `SurfaceEventType` — المجموعة المنتِجة للرسائل من أنواع الأحداث

```ts type-equiv
/**
 * The subset of {@link SessionEventType} values whose events produce LLM
 * messages and are eligible to appear on the ordered surface. Only these
 * event types may carry {@link SurfaceOp}; system, user, and tool events may also cite
 * earlier sources through {@link SessionEvent.sourceEventSeqs}.
 */
type SurfaceEventType =
  | 'system/message'
  | 'user/message'
  | 'assistant/message'
  | 'tool/result'
```

### `SurfaceOp` — كيف دخل الحدثُ السطحَ

```ts type-equiv
/**
 * How a session event entered the ordered surface. Only valid on
 * {@link SurfaceEventType} events.
 *
 * - `'append'`: added to the tail — normal path for user/assistant/tool
 *   messages.
 * - `{ op: 'replace', startSeq, endSeq }`: replaces surface nodes from `startSeq`
 *   (inclusive) through `endSeq` (inclusive) with this node. Both must exist as
 *   surface nodes in the current surface. `startSeq === endSeq` replaces a single
 *   node. The node's {@link SessionEvent.sourceEventSeqs} must include every
 *   shadowed surface node. Used by compaction; any surface-replacing producer
 *   may use it.
 */
type SurfaceOp =
  | 'append'
  | { op: 'replace'; startSeq: SessionSeq; endSeq: SessionSeq }
```

و`'append'` مسارُ الإلحاق المعتاد في الذيل. ويحتوي `replace` على `op` و`startSeq` و`endSeq` بالضبط، بلا أسماء بديلة ولا مفاتيح زائدة. وهو يظلّل المدى الشامل بين تسلسلَي حدثَي السطح الحاليين ويدرج الحدثَ الجديد مكانهما؛ والطرفان المتساويان يستبدلان مدخلًا واحدًا. ويجب أن يسبق الطرفان الحدثَ المستبدِل، لكن ترتيبَهما النسبي ترتيبُ سطح لا ترتيبُ تسلسل عددي.

### `SurfaceIntent` — المعامل الممرَّر إلى `session.append()`

```ts type-equiv
/**
 * Surface placement and cited source-event seqs for {@link Session.append}. Required on
 * message-producing events and forbidden on log-only events.
 */
type SurfaceIntent<T extends SurfaceEventType = SurfaceEventType> = {
  surfaceOp: SurfaceOp
} & (T extends 'assistant/message' ? {
  /** Assistant messages embed their provider stream instead of citing source events. */
  sourceEventSeqs?: never
} : {
  /** Complete non-empty set of known earlier source-event seqs. */
  sourceEventSeqs?: SessionSeq[]
})
```

وهو مشترَطٌ لأحداث `SurfaceEventType` — فعلى كل حدث منتِج للرسائل أن يعلن كيف ينضم إلى السطح، وهو المصدرُ الوحيد لتاريخ النموذج المشتق. والنصُّ الذي يراه البشر إسقاطٌ آخر ويقرأ أحداثَ السجل التي منشؤها الإلحاق بدلًا من ذلك، لأن السطحَ يظلّل عمدًا المدياتِ التي يلخّصها استبدال (انظر `isAppendSurfaceEvent` في [dsh-session](../../packages/core/session/README.ar.md)). والأنواعُ غيرُ السطحية ترفضه عند الترجمة.

ولا يستطيع `assistant/message` حملَ `sourceEventSeqs`؛ فـ`stream` لديه يملك دليلَ المزوّد بعينه. وتُغفل أحداثُ السطح الأخرى الحقلَ حين لا تذكر حدثًا أسبق وتستعمل قائمةً كاملة غيرَ فارغة حين تذكره.

<a id="plugin-owned-message-projections"></a>
### إسقاطات الرسائل التي تملكها الإضافات

تسم الإضافاتُ التي تغيّر المحتوى تصريحَ حدثها بـ`@messageProjection` وتسجّل تعريفًا نقيًّا عبر `ctx.sessions.registerMessageProjection()`. وتتحقق الجلسةُ من القرار كاملًا عبر ذلك التعريف قبل الإيداع، وتطبّق تحديثاتِ رسائله غيرَ القابلة للتغيير، وتقدّم `contentGeneration`. وهي ترفض المفسِّرين المفقودين، ومن ذلك عند الاستعادة والطيِّ المنفصل؛ وتفريغُ تعريف مستعمَل يحجب القراءاتِ المخزَّنة. ويمرّر القرّاءُ المنفصلون تعريفاتٍ صريحة إلى `foldSurface(events, projections)` ويطبّقون `projectedMessages` عبر `deriveEventMessage()`. ويجمّع دليلُ الصيغ المثبَّت التعريفاتِ الأصيلة للقرّاء خارج الاتصال. وتملك [إضافةُ إزاحة الصور](compaction.ar.md#image-offload) حدثَها الخاص بالصور وتفسيرَه.

```ts type-equiv
/** Readonly history immediately before a message-projection event. */
interface SessionMessageProjectionContext {
  /** Current message-producing event sequences in model-visible order. */
  nodes: readonly SessionSeq[]
  /** Contiguous event window; entries at or beyond the candidate seq are not committed inputs. */
  events: readonly SessionEvent[]
  /** Absolute sequence of the window's first event. */
  baseSeq: SessionLogOffset
  /** Previously projected messages keyed by their original event sequences. */
  messages: ReadonlyMap<SessionSeq, Message>
}
```

```ts type-equiv
/** Pure interpretation of one plugin-owned event that changes existing message content. */
interface SessionMessageProjection<T extends SessionEventType = SessionEventType> {
  /** Event interpreted by this definition; declare it with `@messageProjection` in SessionEventMap. */
  type: T
  /**
   * Validate the complete durable decision before returning any updates. Preserve
   * message identities and publish immutable copies without mutating the input.
   * @param event - candidate event, not yet applied to the supplied history.
   * @param context - history preceding this decision.
   * @returns changed current messages keyed by their original sequences.
   * @throws when the durable decision cannot be applied to this history.
   */
  project(event: SessionEvent<T>, context: SessionMessageProjectionContext): ReadonlyMap<SessionSeq, Message>
}
```

### `SessionSurface` — إسقاط السطح الحي للقراءة فقط

يعيد `Session.surface` عرضَ `SessionSurface` الثابت للجلسة. ويتحقق مديرُ التدرج نفسُه من مرشحي الإلحاق قبل الإيداع ويقدّم هذا الإسقاطَ من الأحداث المودَعة؛ ويستطيع المستدعون رصدَ العضوية وجيل الاستبدال لكنهم لا يستطيعون استدعاءَ التحقق.

ويستطيع `SurfaceManager(log, baseSeq?, projections?)` بدلًا من ذلك طيَّ نافذة محمَّلة متصلة أولُ حدث فيها تسلسلُه المطلق `baseSeq`. ويبقى كلُّ حدث متصلًا في فضاء التسلسل المطلق ذاك، ويفشل استبدالٌ يعبر رأسَ النافذة لأن مداه المعلَن غائب.

```ts type-equiv
/** Readonly live projection of the message-producing session events. */
interface SessionSurface {
  /** Current surface event sequences in model-visible order. */
  readonly nodes: readonly SessionSeq[]
  /** Monotonic count of committed positional replacements. */
  readonly replaceGeneration: number
  /** Monotonic count of committed replacements and plugin-owned message changes. */
  readonly contentGeneration: number
}
```

### `SurfaceFoldReplacement` و`SurfaceFoldResult` — إعادة تشغيل سطح كاملة

يعيد `foldSurface(events, projections)` تسلسلاتِ الأحداث الحالية منفصلةً مع التسلسلات التي ظلّلها فعلًا كلُّ مدى استبدال معلَن. ويستعمل المديرُ الحي الانتقالاتِ نفسَها بلا الاحتفاظ بتاريخ الاستبدال. وتزيد `replaceGeneration` لديه مع كل استبدال مودَع فيستطيع المستهلكون التدريجيون التمييزَ بين نموّ ذيل محض وإعادة كتابة.

```ts type-equiv
/** One replacement operation observed while folding a session surface. */
interface SurfaceFoldReplacement {
  /** Seq of the event that replaced the prior surface range. */
  seq: SessionSeq
  /** Declared inclusive start seq of the replaced surface range. */
  start: SessionSeq
  /** Declared inclusive end seq of the replaced surface range. */
  end: SessionSeq
  /** Actual surface entries removed by the operation, in surface order. */
  shadowedSeqs: SessionSeq[]
}
```

```ts type-equiv
/** Complete result of replaying the surface operations in a session log. */
interface SurfaceFoldResult {
  /** Current surface event sequences in model-visible order. */
  nodes: SessionSeq[]
  /** Replacement operations in event order. */
  replacements: SurfaceFoldReplacement[]
  /** Immutable projected messages, keyed by their original event sequences. */
  projectedMessages: ReadonlyMap<SessionSeq, Message>
}
```

## واجهة `Session` البرمجية العلنية

يُبقي التصريحُ المجرَّد من المتون مصنعَ الصنف الصرف المنفصل ومُلحِقاتِ الحالة وطريقةَ الإلحاق وإسقاطاتِ التاريخ متزامنةً مع المصدر. وتبقى عملياتُ المخزن في [قسم `ctx.sessions`](#ctxsessions--sessionstore) المولَّد.

```ts public-api
/**
 * An event-sourced session: an append-only log of {@link SessionEvent}s.
 *
 * Plain class (not a Service) — create live instances via
 * `ctx.sessions.create()` and detached instances via {@link create}.
 * Seeding with an existing event log replays/forks a session.
 * @typert object
 */
declare class Session {
  /** The ordered surface over this session's event log. */
  get surface(): SessionSurface;
  /**
   * Detached, deep-frozen creation metadata (format version, cwd, lineage,
   * and whether fork history exists). Supplied by the store via `ctx.sessions.create()`. When a
   * `Session` is created without a store-owned header, a minimal header is
   * synthesized (stamped with the current {@link SESSION_FORMAT_VERSION}) so
   * `session.header` is always present. Kept out of the event log — it is a
   * storage concern, not replayable conversation state.
   */
  readonly header: SessionHeader;
  /** Number of leading events inherited from this Session's fork parent. */
  readonly inheritedEventCount: SessionLogOffset;
  /** The session identity, derived from its durable header's single copy. */
  get id(): SessionId;
  /**
   * The first seq appended IN THIS PROCESS: the length of the constructor
   * seed (0 without one). Events with smaller seq values entered through
   * construction — replay, fork, or resume — and were never published on the
   * `session/event` firehose (constructor seeds do not emit). This offset marks
   * the constructor-input boundary for lifecycle ownership and persistence
   * adoption; consumers that need complete canonical history still start at
   * seq 0. Distinct from {@link inheritedEventCount}, the DURABLE
   * fork-lineage cut: a resumed session's constructor seed is its full stored
   * log, while the inherited count keeps the original fork value — this field is the
   * in-process construction fact.
   *
   * Not persisted itself: a seeded session projects it into the log as the
   * `session/end-seed` event, which is what a consumer reading STORED history
   * reads. Locate the LAST such event, not necessarily one at this seq — a
   * seed already ending in one is not re-marked, so reopening an untouched
   * session leaves that event at a smaller seq than `firstLiveSeq`. Prefer
   * this field in-process: it is exact before the marker reaches storage.
   *
   * When this lifecycle appends the marker, it occupies this seq before the
   * store attaches and therefore does not publish either. Otherwise this seq
   * holds an ordinary published write.
   */
  readonly firstLiveSeq: SessionLogOffset;
  /**
   * Create a detached session by validating and snapshotting borrowed seed
   * events and storage metadata.
   * @param id - session identity.
   * @param seed - optional borrowed replay or fork events.
   * @param header - optional borrowed storage metadata.
   * @param inheritedEventCount - exact fork-inherited prefix length for a seeded header.
   * @param projections - pure interpreters for plugin-owned message changes.
   * @returns a detached session.
   * @throws when a seed event requires a missing message interpreter or fails validation.
   */
  static create(
    id: SessionId,
    seed?: readonly SessionEvent[],
    header?: SessionHeader,
    inheritedEventCount?: SessionLogOffset,
    projections?: readonly SessionMessageProjection[],
    ): Session;
  /**
   * Restore a detached session by adopting an independently owned or deeply frozen seed.
   * Runtime-required event fields, event envelopes, sequence continuity, surface
   * transitions, and header fields are validated without copying or freezing events.
   * Embedded Assistant streams remain opaque until a stream consumer or storage
   * verifier reads them.
   * @param id - restored session identity.
   * @param seed - independently owned or deeply frozen events.
   * @param header - independently owned storage metadata.
   * @param inheritedEventCount - exact fork-inherited prefix length decoded from storage.
   * @param eventState - aliasing state carried from the operation that produced the seed.
   * @param projections - pure interpreters for plugin-owned message changes.
   * @returns a restored detached session.
   * @throws when a seed event requires a missing message interpreter or fails validation.
   */
  static fromRestore(
    id: SessionId,
    seed: readonly SessionEvent[],
    header: SessionHeader,
    inheritedEventCount: SessionLogOffset,
    eventState: SessionSeedEventState,
    projections?: readonly SessionMessageProjection[],
    ): Session;
  /**
   * Return the immutable event stored at one exact sequence number.
   * @deprecated Existing logic may remain unmigrated for now, but new calls are prohibited.
   * See the [Agent Note](../../../../.agents/notes/implemented/architecture/2026-09-09-deprecate-synchronous-session-event-reads.md).
   * @param seq - event sequence number.
   * @returns the accepted event, or undefined when the log does not contain it.
   */
  eventAt(seq: SessionSeq): SessionEvent | undefined;
  /**
   * Materialize an immutable snapshot of a half-open event sequence range.
   * A full current snapshot is reused until the next append; every previously
   * returned snapshot remains stable after later appends.
   * @deprecated Existing logic may remain unmigrated for now, but new calls are prohibited.
   * See the [Agent Note](../../../../.agents/notes/implemented/architecture/2026-09-09-deprecate-synchronous-session-event-reads.md).
   * @param fromSeq - non-negative inclusive sequence number; defaults to the log start.
   * @param toSeqExclusive - non-negative exclusive sequence number; defaults to the current end.
   * @returns a frozen array of the selected deeply frozen events.
   */
  snapshotEvents(
    fromSeq: SessionLogOffset = SessionLogOffset(0),
    toSeqExclusive: SessionLogOffset = this.seq,
    ): readonly SessionEvent[];
  /**
   * Return this Session's events after its fork-inherited prefix.
   * @deprecated Existing logic may remain unmigrated for now, but new calls are prohibited.
   * See the [Agent Note](../../../../.agents/notes/implemented/architecture/2026-09-09-deprecate-synchronous-session-event-reads.md).
   * @returns a fresh array containing child-owned events in log order.
   */
  ownEvents(): readonly SessionEvent[];
  /**
   * Whether one existing event position is outside the fork-inherited prefix.
   * @param seq - event position in this Session.
   * @returns true when the event belongs to this Session rather than its parent.
   */
  isOwnSeq(seq: SessionSeq): boolean;
  /** The next event's sequence number — always the log length (the `seq = log.length` contiguity contract). */
  get seq(): SessionLogOffset;
  /**
   * Append one typed event to the log and synchronously notify observers via
   * the store-owned, module-private publication hooks. The hot path never blocks
   * on I/O — persistence plugins buffer asynchronously. Once the event enters
   * the log, the append is committed: observer failures are logged and
   * contained per listener, so they do not change the return value or prevent
   * later listeners from observing the same accepted event.
   *
   * @param type - The event type (key of {@link SessionEventMap}).
   * @param data - The event payload; must be JSON-serializable.
   * @param opts - Surface metadata: `surfaceOp` controls how the event enters
   *   the ordered surface; `sourceEventSeqs` lists the seq numbers of earlier
   *   events this one derives from. REQUIRED for
   *   {@link SurfaceEventType} events (every message-producing event must
   *   declare how it joins the surface, the sole source of derived model
   *   history) and
   *   rejected by the compiler for non-surface types like `turn/start` or
   *   `assistant/attempt`. Assistant messages embed their exact provider
   *   stream and cannot cite top-level source events.
   * @returns the logged event — its assigned `seq`/`time` plus the SNAPSHOT of
   *   `data` that entered the log, so reading `event.data` back sees the logged
   *   value, never the caller's still-mutable input.
   * @throws if `data` or surface metadata is not losslessly JSON-serializable
   *   (BigInt, function, symbol, undefined, negative zero, non-finite number,
   *   circular reference, sparse array, or an exotic object such as
   *   Map/Set/Date/class instance), or when the candidate violates the
   *   request-header empty-field or tool-error consistency rules, or the
   *   canonical surface contract (marker shape and eligibility, unique
   *   earlier source-event references, positional replacement validity, and complete
   *   shadowed-node coverage). One iterative pass reads, validates, and
   *   copies each nested value once, so a stateful getter cannot supply one value
   *   to validation and another to storage. The event log is the durable source
   *   of truth, so a bad event fails at the append site rather than later during
   *   a backend flush. A synchronous internal dispatch validation failure or an
   *   append reentered while this acceptance/publication boundary is open also
   *   rejects before the log changes.
   */
  append<T extends SessionEventType>(
    type: T,
    data: SessionEventMap[T],
    ...opts: T extends SurfaceEventType ? [opts: SurfaceIntent<T>] : []
    ): SessionEvent<T>;
  /**
   * The {@link EpochHeader} in force after the log's last header event — the
   * header the NEXT request will be compared against — or undefined before
   * the first `request/header` snapshot. The live, incrementally-maintained
   * form of `foldRequestHeader(session.snapshotEvents())`: each header event is folded
   * once, when first seen, so a per-step read costs O(new events).
   * @returns the folded header, or undefined when no header event exists yet.
   */
  requestHeader(): EpochHeader | undefined;
  /**
   * Return the latest resolved route metadata, or `undefined` before the first
   * `request/context` event. Each event is folded once.
   * @returns the latest immutable route metadata.
   */
  requestContext(): RequestContext | undefined;
  /**
   * Derive the LLM message history by walking the ordered sequences of
   * message-producing events maintained by `surfaceOp` markers. The
   * surface is the single source of derived history: every message-producing
   * append records its `surfaceOp`, so a raw event with no marker (a chunk, a
   * turn boundary) is correctly absent, and a compaction `replace` deletes the
   * shadowed nodes from the derivation. The projection rules are
   * {@link deriveEventMessage}, with logged message projections applied
   * without changing node membership or message identity.
   *
   * CACHED: pure tail growth costs O(new nodes); a replacement or message projection
   * ({@link SessionSurface.contentGeneration}) rebuilds. The returned array is
   * a fresh snapshot per call (later appends never grow an array a caller
   * already holds); the `Message` objects in it are SHARED and **deep-frozen**.
   * Unchanged content reuses frozen event data; projected blocks are frozen
   * derived copies. Consumers cannot mutate the log through either form.
   * @returns a fresh array of the shared, frozen derived history.
   */
  deriveMessages(): Message[];
  /**
   * Project one event with all committed message projections applied.
   * The original durable event remains unchanged.
   * @param event - the event to project.
   * @returns the derived message, or null when the event produces none.
   */
  deriveEventMessage(event: SessionEvent): Message | null;
}
```

## التاريخ المشتق: `deriveMessages()` و`deriveEventMessage()`

تُسقط `Session.deriveMessages()` سجلَّ الأحداث في مصفوفة `Message[]` التي يراها النموذج — مخزَّنةً (فتُسقط كلُّ عقدة سطح مرةً واحدة عند أول رؤية؛ وإعادةُ كتابة السطح تعيد البناء) ومجمَّدةً (مصفوفةٌ جديدة لكل نداء فوق رسائل مشتركة مجمَّدة عميقًا، فيكون تغييرُ التاريخ المسجَّل عبر إسقاط غيرَ قابل للتمثيل). و`deriveEventMessage(event)` هي الدالةُ النقية لكل عقدة التي يطبّقها الطيُّ — وهي علنية فيُسقط المعيدون الخارجيون وثابتةُ التطوير بادئةَ سجل بالقواعد نفسِها بالضبط ولا يستطيعون مخالفةَ المخزن. وقواعدُ الإسقاط:

- `user/message` ← رسالةُ مستخدم تحمل `content` بعينه؛ ويبقى المغلّفُ الاختياري بياناتِ عرض وصفية للسجل فقط.
- `assistant/message` ← رسالةُ مساعد بالمزوّد والنموذج اللذين أنتجاها مع حالة إعادة تشغيل خاصة بالمهايئ اختياريًا. ومجراها المضغوط المضمَّن دليلُ إعادة تشغيل واستعمال وواجهة لا رسالةٌ ثانية. وتُتخطى أيضًا رسالةُ `assistant/message` **الفارغة المحتوى** — فالخطوةُ التي قُطعت بسقف الرموز بلا محتوى تسجّل `assistant/message` مع ذلك لتحمل مجراها واستعمالَها ومزوّدَها ونموذجَها، لكن دورَ مساعد بلا محتوى يجب ألّا يدخل نصَّ المزوّد.
- `tool/result` ← رسالةُ مستخدم تحمل كتلةَ `tool-result`.
- `user/message` (السياقُ المحقون، أي ما مصدره ليس `user`) ← رسالةٌ بدور المستخدم تحمل `content` لديها حرفيًّا في موضعها الزمني؛ ويسمّي مصدرُها المنوَّع المنتِجَ ويحمل أيَّ بيانات خاصة به.

وما عدا ذلك (`turn/*` و`step/*` و`assistant/attempt` و`llm/retry` التي تملكها إضافة) بنيويٌّ ولا يُسقط في رسالة. وتوسّع محاسبةُ الرموز المجرى المضمَّن في كل `assistant/message` أو `assistant/attempt`، بينما يبقى حقلُ `usage` الأعلى في الرسالة مرجعَ الرسالة المودَعة حين يوجد. ولذلك تحتفظ محاولةُ طلب نموذج فاشلة باستعمال مزوّدها بلا اختلاق رسالة مساعد. ويرفض التحققُ المنطقي الحالي ترويساتِ الطلبات ورسائلِ المساعد التي تُغفل المزوّدَ أو النموذج بدل تخمين مسار؛ وتُوحَّد التمثيلاتُ التاريخية المدعومة ويُتحقق منها عند حافة صيغتها المجاورة قبل أن توجد جلسةٌ حالية.

## واجهة تفريع الجلسات الحية

`ctx.sessions.create(id, { seed, meta })` هي بدائيةُ إعادة التشغيل والتفريع منخفضةُ المستوى. وللتفريعات المعتادة للجلسات الحية، يكشف `SessionStore` واجهةَ سياسة واحدة:

- `fork(source, boundary?, childSessionId?)` تقبل كائنَ `Session` حيًّا أو `SessionId` حيًّا، وتنتقي أحداثَ المصدر عبر حدّ `SessionSeq` الشامل (وافتراضُه آخرُ حدث حالي)، وتشترط أن تنتهي البادئةُ المنتقاة خارج جولة مفتوحة، ثم تنشئ جلسةَ ابن حية بأحداث بذرة منسوخة عميقًا، ومعها `parentSession` و`isSeeded: true` و`inheritedEventCount` بعينه و`cwd` موروثًا.

ويتيح `boundary` صريح للمستدعين التفريعَ من أي موضع مستقر بين الجولات، ومنه `turn/end` سابق أو حدثُ سجل فقط مستقل لاحق، ولو كانت للمصدر أحداثٌ أحدث أو جولةٌ حالية مفتوحة. وترفض الواجهةُ بادئةً تنتهي داخل جولة مفتوحة بدل الاقتطاع الصامت. ويبقى فحصُ علاقات التنفيذ الأوسع في إضافة `dsh-invariants` القائمة وفي مسار إصلاح الحفظ الدائم بدل تكراره في `fork()`. وتُبقي `dsh-subagent-fork-in-process` اقتطاعَها للبادئة المكتملة لأن التفويضَ وقتَ الأدوات يبدأ عادةً وجولةُ الأب مفتوحة؛ أما تفريعُ الجلسات المعتاد فينبغي أن يجعل الحدَّ المطلوب صريحًا.

<a id="why-a-turn-ended-turnendreasonmap"></a>

## لماذا انتهت الجولة: `TurnEndReasonMap`

لا حقلَ مُطلِقًا في `turn/start`. فدفعةُ `user/message` الداخلة تسجّل ما دخل كلَّ خطوة، ويسجّل `llm/retry` التعافيَ من الطلبات، ويبقى حقنُ الخمول معلَّقًا حتى يبلغ تسليمٌ موقظ خطوةً تمهيدية لاحقة. وتحتفظ الجولاتُ الحية بـ[`AgentCancelCause`](core.ar.md#the-agent-handle) المنوَّع الذي أوقف القائد؛ ولا يستعمل الحفظُ الدائم السببَ الإضافي `{ kind: 'legacy' }` إلا عند استيراد سجل إلغاء خشن مدعوم لم يخزّن مستدعيه.

```ts type-equiv
/** Durable cancellation cause, including imports whose original coarse record carried no cause. */
type TurnEndCancelCause = AgentCancelCause | { readonly kind: 'legacy' }
```

```ts type-equiv
/**
 * Why a turn ended. Merge-extensible sum type.
 */
interface TurnEndReasonMap {
  completed: { kind: 'completed' }
  /** A cancellation request interrupted the live turn. */
  aborted: { kind: 'aborted'; reason: TurnEndCancelCause }

  blocked: { kind: 'blocked' }
  /**
   * The turn failed. `error` is always a structured failure: the `LlmError`
   * facts verbatim, or `{ message: errorChain(error), code: 'UNKNOWN' }`
   * flattened from any other error.
   */
  error: { kind: 'error'; error: LlmFailure }
  /** At least one step reached its output-token ceiling, even if a plugin continued the turn. */
  'max-tokens': { kind: 'max-tokens' }
  /**
   * A crash-orphaned turn was closed after the fact: agent-loop resume appends
   * this closer for a stored log whose last turn never ended, and session-query
   * synthesizes it on cold reads. The loop never emits this marker live, and
   * the events recorded before the crash remain intact.
   */
  interrupted: { kind: 'interrupted' }
}
```

و`max-tokens` تحاكي `FinishReason` بالاسم نفسِه في نداء النموذج: فأيُّ خطوة `max-tokens` في جولة تجعل الجولةَ كلَّها تنتهي بـ`max-tokens` لا بـ`completed` (فحقيقةُ القطع تغلب متابعةً لاحقة)، فيستطيع المستهلكُ تمييزَ التوقف النظيف من المبتور. ويبقى الإلغاءُ والأخطاءُ حصائلَ متمايزة. و`interrupted` هو السببُ الوحيد الذي لا تُصدره حلقةٌ — بل يصطنعه التعافي من الانهيار (انظر [persistence.md](persistence.ar.md)). والخريطةُ قابلة للتوسعة بالدمج.

## إحاطة التنفيذ والأحداث المستقلة

تحيط الجولةُ بتنفيذ حلقة نموذج واحد، لا بسجل الجلسة كلِّه. ولا يسجّل AgentLoop أحداثَ `user/message` المحقونة إلا من دفعات الخطوات التمهيدية الداخلة داخل جولة؛ وقد تظهر مع ذلك أحداثُ سجل فقط تملكها إضافةٌ بين `turn/end` و`turn/start` التالي، فتستهلك أرقامَ تسلسل أحداث بلا زيادة أرقام الجولات. ويقبل الحفظُ الدائم كلَّ حدث متصل مقبول في دفعة دائمة محدودة، بينما لا يغلق إصلاحُ الانهيار إلا جولةً ذيلية مفتوحة حقًّا. والمنتِجُ الذي يحتاج إلى حاجز متانة فوري ينتظر `ctx.sessions.flush(session)` صراحةً.

ويفرض الرفيقُ الاختياري `dsh-session/invariant` العلاقاتِ التي تملكها النواةُ: ترقيمَ الجولات والخطوات، وإحاطةَ أحداث التنفيذ، واقترانَ نداء الأداة بنتيجتها في الخطوة نفسِها. وتخص علاقاتُ الأحداث القابلة للتوسعة بالدمج الإضافةَ التي تعلنها، فلا ترفض النواةُ حدثًا مجهولًا لمجرد ألّا جولةَ مفتوحة. انظر [قرار الأحداث المستقلة](../../.agents/notes/implemented/simplification/2026-07-28-remove-synthetic-log-only-turns.ar.md).

## حدّ نهاية البذرة: `session/end-seed`

يشترط بانيُ تفريع جديد أن تساوي بذرتُه البادئةَ الموروثة ويُلحق `session/end-seed { inherited: true }` عند القطع الدائم بعينه. وتحتفظ الاستعادةُ بذلك الواسم الموسوم ولا تُلحق `session/end-seed {}` عاديًّا إلا حين لا تنتهي بذرتُها المخزَّنة كاملةً بواسم سلفًا. والصيغتان للسجل فقط ولا تنتجان رسالةً؛ وبانيُ `Session` هو الكاتبُ المشروع الوحيد.

ولنسب التفريع، حدّد **آخرَ** واسم تحمل حمولتُه `inherited: true`؛ ويشترطه فكُّ ترميز الصيغة الحالية بالضبط حين تكون `SessionHeader.isSeeded` صحيحة ويشتق `inheritedEventCount` من رقم تسلسله. ولملكية دورة الحياة، حدّد آخرَ `session/end-seed` من أي صيغة. وإعادةُ فتح بذرة تنتهي بأي واسم سلفًا لا تُلحق واسمًا عاديًّا آخر.

وهو موجود لأن تاريخَ البذرة والعملَ الحي متطابقان بايتًا بايتًا لولاه، وهو ما يُفشل أيَّ إضافة تملك قوسَ فتح وإغلاق مستقلًّا: فـ`compaction/start` بلا مقابل يُقرأ بالصورة نفسِها سواءٌ انهار الكاتبُ في منتصف الضغط أم كان يضغط الآن. والواسمُ الفاتح قبل `session/end-seed` جاء من بذرة الباني ويخص دورةَ حياة منتهية، أيًّا كان ما أنهاها (انهيارٌ أو عمليةٌ خلَفت أخرى أو تفريعٌ من أب ما زال يعمل)، فيجوز لمالكه عدُّه ميتًا. ولا يغطي ذلك إلا الأقواسَ التي ورثتها **هذه** الجلسة: فالجلسةُ الحية المتزامنة التي تمسك قوسًا مفتوحًا على التاريخ نفسِه لها حدُّها في موضع آخر، فاحتمالُ كُتّاب متزامنين يشترط إشارةَ حياة خارج السجل. وتكتب النواةُ الحدَّ ولا تقرأ منه شيئًا — فمفرداتُ القوس تبقى مع الإضافة المالكة له، ولذلك يغلق إصلاحُ الانهيار حدودَ الجولات والخطوات والأدوات ولا يغلق `compaction/*` قط.

ويستبعد المستهلكون الذين يرتّبون الجلساتِ بنشاط البشر هذا الحدَّ: فالتقاطُ جلسة ليس عملًا، والترتيبُ بذيل السجل سيطفو كلَّ جلسة فُتحت إلى الأعلى.

## أحداث السجل فقط التي تسهم بها الإضافات

قد تدمج إضافةٌ بالتصريح أنواعًا إضافية في `SessionEventMap`. وهذه **للسجل فقط**: فهي ليست من `SurfaceEventType` (فلا تحمل `surfaceOp` ولا تسهم بشيء في التاريخ المشتق). ويقرر مالكُها أتخص جولةَ تنفيذ مفتوحة أم يجوز أن تقف بين الجولات، ويفرض أيَّ علاقة في رفيق ثوابته. ويعدّد [دليلُ أحداث سجل الحفظ الدائم](../persistence-catalog.ar.md) المولَّد كلَّ حدث من النواة ومن الإضافات؛ وتُناقَش دلالاتُ `compaction/*` في seam الضغط على [compaction.md](compaction.ar.md).

وحين تتجمع أحداثٌ عدة من عائلة واحدة تملكها إضافةٌ في عقدة محادثة واحدة في عميل Web، يحمل كلُّ حدث بداية أو تحديث أو نتيجة أو مورد أو مقاطعة في تلك العائلة معرّفَ العمل الثابت نفسَه أو يشتقه مستقلًّا. ويسري هذا الاشتراطُ على عائلات العقد المترابطة، لا على كل حدث جلسة؛ وهو يتيح للعميل تجميعَ كل حدث بلا تخمين من التجاور ولا مسح التاريخ. انظر [نظام المحادثة](conversation.ar.md).

ويقترن زوجا `hook/invoked` و`hook/result` في جسور الخطّافات (من `@deepseek-ai/dsh-hook-protocol`) بـ`handlerId`. وتنطلق `UserPromptSubmit` و`PreToolUse` و`PostToolUse` و`Stop` داخل جولة الحلقة المفتوحة، فتكون سجلاتُ `hook/*` لديها محاطةً بجولة بالبناء. ولا يحصل `SessionStart` على سجل `hook/*` لأنه يعمل قبل الجولة الأولى؛ ويبقى سياقُه معلَّقًا في صندوق الوارد حتى يفتح تسليمٌ موقظ جولةً.

## عقد المتانة

ما تعتمد عليه خلفيةُ الحفظ الدائم: أن السجلَّ الدائم يحفظ كلَّ حدث بلا فقد، وأن كلَّ محاولة مساعد هي `assistant/message` أو `assistant/attempt` واحدة يحفظ مجراها المضغوط المضمَّن القطعَ الموقوتة الأصلية. ويبقى `seq` متصلًا عبر هذه الاستقرارات وعبر كل الأحداث المتخللة. وللخلفية اختيارُ تأطير تخزينها لدفعة أحداث ما دام `read()` في مقبض يعيد الأحداثَ المُلحقة بعينها؛ وتكتب JSONL حاليًا صفًّا لكل حدث (انظر [persistence.md](persistence.ar.md)). ويجب أن تكون كلُّ `event.data` قابلةً للتسلسل بـJSON؛ ويفرض `Session.append` ذلك عند المصدر (فيرمي على البيانات غير القابلة للتسلسل)، فلا يدخل حدثٌ سيئ السجلَّ ويساوي `session.snapshotEvents()` دائمًا ما تستطيع خلفيةٌ حفظَه. وإضافةُ نوع حدث يحمل بياناتٍ غيرَ قابلة للتسلسل أو يفسد تداخلَ التنفيذ في النواة أو ينتهك علاقةً يعلنها مالكُه تغييرٌ كاسر لصيغة القرص.

والخلفياتُ التي تستهلك هذا العقدَ على [persistence.md](persistence.ar.md).

## دليل Remote وفتح مساحة العمل

`ModelCatalog` هو دليلُ نماذج جيل المضيف الذي يعيده `session/modelCatalog`: فهو يحمل افتراضَ النشر، ومعرّفاتِ المزوّدين القابلة للتوجيه، ومجموعاتِ المزوّدين الناجحة، وإخفاقاتِ المزوّدين المعزولة. وهو غيرُ مشتق من جلسة واحدة ويبقى منفصلًا عن إسقاطات الجلسة.

ويحمل `SessionOpenWorkspacePathRequest` قيمةَ `path` مطلقة أو محلولة في مساحة العمل؛ ويختار `action: "reveal"` الاختياري تنقّلَ مدير الملفات بدل الفتح بالتطبيق الافتراضي. ويؤكد `SessionOpenWorkspacePathValue` أن المضيفَ قبل التسليمَ الأصيل. ويحلّ عميلٌ واعٍ بالجلسة المساراتِ النسبية في مقابل دليل عمل جلسته الحالي حين يعرفه؛ ويسلّم المتحكمُ المسارَ إلى الفاتح بلا تغيير ويبلّغ عن الطلبات غير الصالحة والإلغاء وإخفاقات الفاتح عبر مفردات أخطاء Remote للجلسة.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxsessioncontroller--sessioncontroller"></a>

### `ctx.sessionController` — `SessionController`

Host service backing the generated `ctx.remote.session` namespace.

```ts cordis-catalog
/**
 * Resolve or resume one ordinary Session for another Host API domain.
 * @param sessionId - Session identity whose Agent owns the operation.
 * @returns the live Agent or the stable Session-domain failure.
 */
resolveAgent(sessionId: SessionId): Promise<ApiSessionAgentResult>

/**
 * Inspect one attached or persisted Session without activating its Agent.
 * @param sessionId - durable Session identity.
 * @param signal - optional caller cancellation for persistence reads.
 * @returns the current attached state or persisted header and event prefix.
 */
inspect( sessionId: SessionId, signal?: AbortSignal, ): Promise<SessionInspection>

/**
 * Read all visible Session rows without resuming an Agent.
 * @param _request - reserved empty list request.
 * @param signal - cancellation for persistence reads.
 * @returns visible Session summaries ordered by activity.
 */
@Remote('list') async list(_request: SessionListRequest, signal: AbortSignal): Promise<SessionListValue>

/**
 * Search visible Session content without resuming an Agent.
 * @param request - literal message-content query.
 * @param signal - cancellation for list and search reads.
 * @returns authorized bounded Session search results.
 */
@Remote('search') search(request: SessionSearchRequest, signal: AbortSignal): Promise<SessionSearchValue>

/**
 * Create or idempotently adopt one ordinary Session.
 * @param request - requested identity, location, and Agent preset.
 * @returns the Session identity and resolved preset when configured.
 */
@Remote('create') create(request: SessionCreateRequest): Promise<SessionCreateValue>

/**
 * Select one Session-local model after explicitly resuming the Session.
 * @param request - Session identity and requested model selection.
 * @returns the normalized selection installed for the Session.
 */
@Remote('selectModel') selectModel(request: SessionSelectModelRequest): Promise<SessionSelectModelValue>

/**
 * Describe every currently routable model for Host-generation selectors.
 * @returns provider-grouped models, the deployment default, and isolated provider failures.
 */
@Remote('modelCatalog') modelCatalog(): Promise<ModelCatalog>

/**
 * Report whether this deployment can hand a Session workspace path to a native desktop.
 * @returns true when the matching open operation is available.
 */
@Remote canOpenWorkspacePath(): boolean

/**
 * Describe the serving desktop for authenticated file-action routes.
 * @returns Host name, configured availability, and platform-specific file-manager behavior.
 */
workspaceDesktop(): { name: string; available: boolean; fileManager: 'finder' | 'explorer' | 'directory' | null }

/**
 * Open one path prepared by a Session-aware caller on the Host desktop.
 * @param request - path after best-effort Session workspace resolution.
 * @param signal - caller lifetime; abort terminates the native command.
 * @returns confirmation after the native opener accepts the path.
 * @throws RemoteError when the request is invalid, cancelled, or the opener fails.
 */
@Remote('openWorkspacePath') async openWorkspacePath( request: SessionOpenWorkspacePathRequest, signal: AbortSignal, ): Promise<SessionOpenWorkspacePathValue>

/**
 * Rename one Session after explicitly resuming it.
 * @param request - Session identity and proposed title.
 * @returns the accepted title and durable event sequence.
 */
@Remote('rename') rename(request: SessionRenameRequest): Promise<SessionRenameValue>

/**
 * Fork one cold-readable completed-turn prefix into a new Session.
 * @param request - source Session and optional event anchor.
 * @returns the new Session identity.
 */
@Remote('fork') fork(request: SessionForkRequest): Promise<SessionForkValue>

/**
 * Admit one prompt after explicitly resuming its Session.
 * @param request - Session identity, prompt content, source metadata, and delivery mode.
 * @param signal - caller cancellation before prompt admission begins.
 * @returns acknowledgement that the Agent accepted the prompt.
 */
@Remote('prompt') prompt(request: SessionPromptRequest, signal: AbortSignal): Promise<SessionPromptValue>

/**
 * Read one image proven reachable from the addressed Session log.
 * @param request - Session and attachment identities used for authorization.
 * @returns the durable attachment reference and base64-encoded bytes.
 */
@Remote('attachment') attachment(request: SessionAttachmentRequest): Promise<SessionAttachmentValue>

/**
 * Mutate one still-pending queue occurrence, resuming a cold Agent first.
 * @param request - Session, queue item, and requested mutation.
 * @returns acknowledgement that the queue mutation was applied.
 */
@Remote('updateQueue') updateQueue(request: SessionUpdateQueueRequest): Promise<SessionUpdateQueueValue>

/**
 * Cancel one active Agent turn without dropping its pending inbox.
 * @param request - Session whose active Agent turn is cancelled.
 * @returns acknowledgement that cancellation was requested.
 */
@Remote('cancel') cancel(request: SessionCancelRequest): SessionCancelValue

/**
 * Read one cold-safe, message-aligned Session history page.
 * @param request - durable address, backward cursor, and page budget.
 * @param signal - cancellation for persistence reads.
 * @returns one chronological page.
 */
@Remote('page') page(request: SessionPageRequest, signal: AbortSignal): Promise<SessionPage>

/**
 * Follow one Session log from its opening or resume cursor.
 * @param request - durable address and last committed sequence already held by the caller.
 * @param signal - cancellation owned by the Remote stream carrier.
 * @returns a complete opening snapshot followed by gap-free durable event
 *   frames and optional cursorless assistant-stream frames.
 */
@Remote({ mode: 'stream' }) follow(request: SessionFollowRequest, signal: AbortSignal): AsyncIterable<SessionFollowFrame>

/**
 * Stream a complete live-control baseline followed by replacement frames.
 * @param signal - cancellation owned by the Remote stream carrier.
 * @returns one complete baseline followed by live replacement frames.
 */
@Remote({ mode: 'stream' }) control(signal: AbortSignal): AsyncIterable<SessionControlFrame>
```

Types: [SessionId](core.ar.md) · [SessionInspection](persistence.ar.md) · [SessionSearchRequest](session-query.ar.md)

Source: [`packages/api/session-controller/src/index.ts`](../../packages/api/session-controller/src/index.ts)

<a id="ctxsessions--sessionstore"></a>

### `ctx.sessions` — `SessionStore`

In-memory session store (`ctx.sessions`).

Persistence is intentionally not implemented here — the agent lifecycle attaches a session-log writer to each published session's write handle; a session published outside that lifecycle persists nothing.

```ts cordis-catalog
/**
 * Register one event interpreter for live creation, restore, and fork.
 * Disposing the contribution makes sessions that used it refuse further derivation.
 * @param projection - pure definition owned by the event's plugin.
 * @returns the fiber-owned disposer.
 * @throws when another definition already owns this event type.
 */
registerMessageProjection(projection: SessionMessageProjection): () => Promise<void>

/**
 * Create a session owned by the calling fiber: disposing that fiber stops
 * event notification and removes the session from the store. `options.seed`
 * populates the session with a copy of those events (replay/fork);
 * `options.meta` attaches creation metadata (validated absolute `cwd`, seed
 * and parent lineage, and delegation depth) as the immutable
 * {@link SessionHeader} (the store fills `version`/`id`/`createdAt`).
 *
 * For an agent whose session must be torn down IN ORDER with its loop (so the
 * loop's final events are published before the store attachment ends), do NOT use this
 * — fold the session lifecycle into the agent's own effect via
 * {@link prepare} + {@link enter} + {@link announce} (see
 * `dsh-agent-loop`'s creation transaction).
 *
 * @param id - the session id; omitted, the store mints `session-<n>`.
 * @param options - seed events and/or creation metadata for the header.
 * @returns the live session, already entered and announced.
 * @throws if a session with `id` already exists, metadata is not a plain
 *   lossless-JSON record with valid scalar fields, or `meta.cwd` is a
 *   non-absolute path (storage backends key directories off it).
 */
create(id?: SessionId, options?: CreateSessionOptions): Session

/**
 * Build a session WITHOUT entering it into the store — validate the id/cwd and
 * construct the {@link Session} (with its immutable {@link SessionHeader}).
 * Pairs with {@link enter} + {@link announce}: a caller that owns a composite
 * `ctx.effect` (the agent factory) folds the session lifecycle into that ONE
 * effect so a fiber unload tears the session + agent down as a single ORDERED
 * chain rather than as racing sibling effects — which would remove the publication hooks
 * before the driver's closing events commit, dropping them.
 *
 * @param id - the session id; omitted, the store mints `session-<n>`.
 * @param options - seed events and/or creation metadata for the header. With
 *   `eventState`, every seed event is either independently owned or any
 *   shared value is deeply frozen; {@link Session.fromRestore} validates and
 *   adopts those values without copying or freezing them.
 * @returns the constructed session, NOT yet in the store.
 * @throws if a session with `id` already exists, metadata is not a plain
 *   lossless-JSON record with valid scalar fields, or `meta.cwd` is a
 *   non-absolute path.
 */
prepare(id?: SessionId, options?: PrepareSessionOptions): Session

/**
 * Enter a {@link prepare}d session into the store: install the module-private
 * append publication hooks and add it to the store. Returns the DETACH
 * disposer (hooks + store removal). Does NOT emit `session/created` —
 * the caller yields this disposer inside its effect and THEN calls
 * {@link announce}, so a throwing `session/created` listener rolls the attach
 * back instead of leaking it.
 *
 * Re-checks the id for a duplicate: `prepare` and `enter` are public
 * cross-package primitives and a caller may interleave arbitrary work (or
 * another create) between them, so a stale prepared session must NOT overwrite
 * a live store entry of the same id — its detach disposer would later delete
 * the REAL session. The {@link create} convenience and the agent factory call
 * the two back-to-back so they never trip this, but the public API cannot
 * assume that.
 *
 * @param session - a {@link prepare}d session not yet in the store.
 * @returns the detach disposer (publication hooks + store removal). When called from
 *   a synchronous `session/created` listener, removal and disposal wait until
 *   that creation dispatch unwinds.
 * @throws if a session with this id is already in the store.
 */
enter(session: Session): () => void

/** Emit `session/created` exactly once for an {@link enter}ed session (with
 * the carrier {@link enter} captured). Separate from {@link enter} so the
 * caller can yield the detach disposer first (rollback safety — see
 * {@link enter}).
 * @param session - the entered session to announce to listeners.
 * @throws if the session is not live or its announcement already began,
 *   including a reentrant call from a creation listener. */
announce(session: Session): void

/**
 * Dispatch the awaited `session/flush` durability checkpoint for `session`,
 * with the carrier captured at {@link enter}. THE flush entry point: the
 * store owns the carrier, so callers (the checkpoint policy's per-request
 * barrier, goal-round-driver's idle checkpoint, teardown drains, and consumers
 * that flush themselves before reading storage) must come through here
 * rather than dispatch a raw `ctx.parallel('session/flush', …)` — one owner,
 * one spelling, and the scoped-dispatch invariant can pin it.
 * @param session - the session whose buffered events must reach durable storage.
 * @returns whether at least one durability listener participated, after every
 *   listener has settled successfully.
 * @throws the first registered listener failure after every listener settles.
 */
async flush(session: Session): Promise<boolean>

/**
 * Look up a live session.
 * @param id - the session id to look up.
 * @returns the session, or undefined when no live session has that id.
 */
get(id: SessionId): Session | undefined

/**
 * All live sessions, in creation order.
 * @returns a fresh array; mutating it does not affect the store.
 */
list(): Session[]

/**
 * Create a live child session from a stable prefix of a live source.
 * `boundary` is an inclusive source event seq; omitted means the source's
 * current last event. The selected slice may end with a between-turn event
 * but must not end inside an open turn.
 *
 * @param source - Live source session object or id.
 * @param boundary - Inclusive source event seq to fork through; omitted means
 *   the source's current last event, and omitted on an empty source forks an
 *   empty child.
 * @param childSessionId - Optional child session id; omitted delegates to
 *   `SessionStore`'s id policy.
 * @returns The created live child session.
 */
fork(source: SessionForkSource, boundary?: SessionSeq, childSessionId?: SessionId): Session
```

Types: [CreateSessionOptions](persistence.ar.md) · [PrepareSessionOptions](persistence.ar.md) · [SessionId](core.ar.md)

Source: [`packages/core/session/src/index.ts`](../../packages/core/session/src/index.ts)

<a id="api-session-events"></a>

### `api-session/*` events

<a id="api-sessionactivity--emit"></a>

#### `api-session/activity` — emit

One user-authored durable message advanced Session list activity.

```ts cordis-catalog
/**
 * One user-authored durable message advanced Session list activity.
 * @mode emit
 * @param sessionId - addressed Session identity.
 * @param updatedAt - durable message time used for list ordering.
 */
'api-session/activity'(sessionId: SessionId, updatedAt: number): void
```

Types: [SessionId](core.ar.md)

Source: [`packages/api/session-controller/src/types.ts`](../../packages/api/session-controller/src/types.ts)

<a id="api-sessionadded--emit"></a>

#### `api-session/added` — emit

A Session became visible to Session list consumers.

```ts cordis-catalog
/**
 * A Session became visible to Session list consumers.
 * @mode emit
 * @param summary - initial list row for the Session.
 */
'api-session/added'(summary: SessionSummary): void
```

Source: [`packages/api/session-controller/src/types.ts`](../../packages/api/session-controller/src/types.ts)

<a id="api-sessionerror--emit"></a>

#### `api-session/error` — emit

One Agent failed outside a durable turn position.

```ts cordis-catalog
/**
 * One Agent failed outside a durable turn position.
 * @mode emit
 * @param sessionId - Agent and Session identity.
 * @param message - user-safe failure chain.
 */
'api-session/error'(sessionId: SessionId, message: string): void
```

Types: [SessionId](core.ar.md)

Source: [`packages/api/session-controller/src/types.ts`](../../packages/api/session-controller/src/types.ts)

<a id="api-sessionremoved--emit"></a>

#### `api-session/removed` — emit

A Session left the live Host registry.

```ts cordis-catalog
/**
 * A Session left the live Host registry.
 * @mode emit
 * @param sessionId - removed Session identity.
 */
'api-session/removed'(sessionId: SessionId): void
```

Types: [SessionId](core.ar.md)

Source: [`packages/api/session-controller/src/types.ts`](../../packages/api/session-controller/src/types.ts)

<a id="api-sessionstatus--emit"></a>

#### `api-session/status` — emit

One Agent changed running state.

```ts cordis-catalog
/**
 * One Agent changed running state.
 * @mode emit
 * @param sessionId - Agent and Session identity.
 * @param running - whether the Agent is running.
 */
'api-session/status'(sessionId: SessionId, running: boolean): void
```

Types: [SessionId](core.ar.md)

Source: [`packages/api/session-controller/src/types.ts`](../../packages/api/session-controller/src/types.ts)

<a id="session-events"></a>

### `session/*` events

<a id="sessioncreated--emit"></a>

#### `session/created` — emit

Creation announcement during session publication. A synchronous throw vetoes and rolls back with a paired disposal; detach requested during dispatch is deferred. A returned-promise rejection is logged but cannot retroactively veto this synchronous boundary. Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only sessions entered through that agent's context.

```ts cordis-catalog
/**
 * Creation announcement during session publication. A synchronous throw vetoes and rolls
 * back with a paired disposal; detach requested during dispatch is deferred.
 * A returned-promise rejection is logged but cannot retroactively veto this
 * synchronous boundary.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners
 * receive only sessions entered through that agent's context.
 * @param session - the session just entered and announced.
 * @dshScopeScan unsupported
 * @mode emit
 */
'session/created'(this: Scoped<Session>, session: Session): void
```

Types: [Scoped](scope.ar.md)

Source: [`packages/core/session/src/index.ts`](../../packages/core/session/src/index.ts)

<a id="sessiondisposed--emit"></a>

#### `session/disposed` — emit

Emitted once when an announced session leaves the store, including publication rollback, but never for an entry whose creation announcement did not begin. Listener failures are logged and contained. Scope-filtered dispatch (`@deepseek-ai/dsh-scope`) reuses the owner scope.

```ts cordis-catalog
/**
 * Emitted once when an announced session leaves the store, including
 * publication rollback, but never for an entry whose creation announcement
 * did not begin. Listener failures are logged and contained.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`) reuses the owner scope.
 * @param session - the session that is no longer live in the store.
 * @dshScopeScan unsupported
 * @mode emit
 */
'session/disposed'(this: Scoped<Session>, session: Session): void
```

Types: [Scoped](scope.ar.md)

Source: [`packages/core/session/src/index.ts`](../../packages/core/session/src/index.ts)

<a id="sessionevent--emit"></a>

#### `session/event` — emit

Post-commit, fire-and-forget append feed. The listener snapshot resolves before the log push, but callbacks run after it; observer failures are logged and contained without making the committed append fail. Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only events from sessions entered through that agent's context.

```ts cordis-catalog
/**
 * Post-commit, fire-and-forget append feed. The listener snapshot resolves
 * before the log push, but callbacks run after it; observer failures are
 * logged and contained without making the committed append fail.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners
 * receive only events from sessions entered through that agent's context.
 * @param session - the session whose log grew.
 * @param event - the appended event, exactly as recorded.
 * @dshScopeScan unsupported
 * @mode emit
 */
'session/event'(this: Scoped<Session>, session: Session, event: SessionEvent): void
```

Types: [Scoped](scope.ar.md)

Source: [`packages/core/session/src/index.ts`](../../packages/core/session/src/index.ts)

<a id="sessionflush--parallel"></a>

#### `session/flush` — parallel

Awaited parallel durability checkpoint: every listener runs and the caller awaits all of them, with no waterfall veto. Scope-filtered dispatch (`@deepseek-ai/dsh-scope`) reuses the session's owner scope.

```ts cordis-catalog
/**
 * Awaited parallel durability checkpoint: every listener runs and the
 * caller awaits all of them, with no waterfall veto. Scope-filtered dispatch
 * (`@deepseek-ai/dsh-scope`) reuses the session's owner scope.
 * @param session - the session whose buffered events must reach durable storage.
 * @dshScopeScan unsupported
 * @mode parallel
 */
'session/flush'(this: Scoped<Session>, session: Session): Promise<void> | void
```

Types: [Scoped](scope.ar.md)

Source: [`packages/core/session/src/index.ts`](../../packages/core/session/src/index.ts)
<!-- END GENERATED cordis-surface -->
