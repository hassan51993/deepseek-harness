# جلسة

[English](session.md) | العربية

[dsh-session](../../packages/core/session) داخل تخزين حدث تتبع مصدر نموذج.`Session` هو واحد نسخة من نوع تحويل `SessionEvent` مجموعة صار**فقط إلحاق سجل**، هو agent(ذكي جسم) كامل تفاعل تاريخ وحيد حق مصدر.LLM(كبير لغة نموذج) رسالة تاريخ من سجل*إرسال توليد*بينما قدوم، من لا مفرد وحيد تخزين؛ إعادة تشغيل أي من نفس مجموعة حدث إعادة إرسال توليد. سجل مثل أي تنفيذ**حفظ دائم**(حفظ دائم seam، خلفية، انهيار انهيار استعادة) هو أخ أخ وثيقة [persistence.md](persistence.ar.md) صلة ملاحظة نقطة.

شفرة المصدر:[`packages/core/session/src/types.ts`](../../packages/core/session/src/types.ts)

## `SessionEventMap`: حدث مفردات

فقط إلحاق حدث نوع. يمكن عبر إعلان دمج توسيع: إضافة عبر declaration merging إعلان مقدار خارج حدث نوع. مثال مثل[ضغط (compaction) seam](compaction.ar.md) إضافة `compaction/start` / `compaction/summary` / `compaction/end`،`@deepseek-ai/dsh-hook-protocol` لـ خطاف جسر وصل إضافة فقط سجل سجل `hook/invoked` / `hook/result` سجل. و `compaction/*` واحد مثال، هذه كل لا هو `SurfaceEventType`(لا يوجد `surfaceOp`). توليد[حفظ دائم سجل حدث دليل](../persistence-catalog.ar.md) صف رفع كل عضو (نواة قلب و دمج توسيع) ، يتضمن ذلك payload،surface علامة و إعلان موضع.

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

`UserMessage` هو عادي نص التوجيه، حقن سياق،steering(في طريق جذب توجيه) و فوري استلام عنصر صندوق حدث مشترك حمل معرف كما تجميد ربط user-role قيمة. حدث حزمة تركيب طبقة فقط سوف زيادة حدث محلي موضع أو نتيجة واقع؛ بند انتظار معالجة خلال،loop فقط مقدار خارج مرفق إضافة مشغل ذاتي لديه توجيه حالة.

<a id="the-request-header-event-requestheader"></a>

### طلب رأس حدث:`request/header`

طلب معلومة غلاف (أي `EpochHeader`: استدعاء إعداد + مهايئ الذي توفير قيمة افتراضية علامة + قد تجميع أداة schema) سوف بصفة جلسة حالة كتابة سجل، لذلك كل محادثة طلب كل هو سجل صاف دالة (رؤية يمكن إعادة بناء صفة Agent Note). تصيير بعد توجيه النظام لا يخص طلب رأس: هو هو إرسال توليد تاريخ، أي surface رقم 0 رقم عقدة فوق `system/message` حدث و أي لاحق تاريخ داخل نظام عقدة ([قرار](../../.agents/notes/implemented/architecture/2026-09-02-system-prompt-as-surface-node.ar.md)) ، لذلك نص التوجيه تغيير استبدال أو إلحاق واحد نظام عقدة، بينما طلب رأس إبقاء ثابت. حمل لديه reason `'initial'` أو `'resume'` كامل `request/header` لقطة سجل كل agent loop نسخة حد؛ طلب تغير وقت سوف إلحاق reason لـ `'change'` لقطة؛ لم تغيير معلومة غلاف صريح فتح بدء رسالة تسلسل أو تتبع مع surface استبدال وقت، سوف إلحاق reason لـ `'series'` لقطة. إذا حدوث تغير لقطة الذي تابع طلب معا فتح بدء تسلسل، هو سوف يحمل `startsSeries: true`. عادي فقط إلحاق لاحق Turn، و نفس نموذج رسالة تسلسل داخل لاحق Step و إعادة محاولة امتداد استخدام الأكثر جديد لقطة.`foldRequestHeader(events)` عبر اختيار الأكثر جديد لقطة إعادة بناء طلب رأس. هذا حدث لا هو `SurfaceEventType`، لا إنتاج LLM رسالة.

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

حالي حدث وصل قبول اشتراط `request/header.header` لـ مواصفة شكل صيغة: منع توقف أي `system` حقل، يجب حذف `tools: []` و `adapterDefaults: {}`. فقط يحتوي فارغ أبيض نظام رسالة محتوى،`config.stop: []` و تضمين طقم توسيع إبقاء ثابت.seed،append و حالي حفظ دائم قراءة رفض غير مواصفة header، بينما لن ساكن صامت مواصفة تحويل؛[V3 معلومة غلاف قرار](../../.agents/notes/implemented/architecture/2026-09-06-v3-canonical-session-envelopes.ar.md) مسؤول تاريخ تحويل. يتضمن قديم إصدار `request/header-delta` حدث أو كامل لقطة سبب لـ `fallback` قديم إصدار v0 سجل، سوف يتم رفض، بينما لن بـ لا كامل طريقة إعادة تشغيل.

### توجيه سعة كمية حدث:`request/context`

طلب الذي تحليل إلى توجيه سياق بيانات وصفية هو مستقل قد سجل حالة، في نفس خطوة داخل ضيق مع `request/header` إلحاق، كما فقط في مزود، نموذج، سعة كمية أو `systemPromptUpdate` نمط و فوق واحد بند سجل مختلف وقت إلحاق. هو إبقاء في `EpochHeader` خارج، لأن هذا نوع هو `headerEquals` تدريجي حقل مقارنة مقارنة إعادة بناء اتفاق. سعة كمية و تحديث نمط وصف هو توجيه، لا هو طلب إدخال، يأخذ هو جمع طي دخول ذهاب سوف يجعل مرة توجيه تغير يتم تسجيل تسجيل لـ طلب معلومة غلاف `change`، أيضا سوف يأخذ مهايئ بيانات وصفية سحب دخول loop إعادة بناء ثابت صيغة. و `request/header` واحد مثال، هو لا هو `SurfaceEventType`، أيضا لا إنتاج LLM رسالة.`session.requestContext()` بـ زيادة كمية طريقة عودة و الأكثر جديد واحد بند سجل؛agent loop في قرار تغير بعد توجيه النظام هو استبدال الأكثر جديد نظام عقدة أيضا هو إلحاق إلى قد ذاكرة مؤقتة تاريخ بعد وقت، قراءة هذا سجل `systemPromptUpdate`([قرار قاعدة](../../packages/core/agent-loop/README.ar.md#understand-the-implementation)). مهايئ لا عام نشر سعة كمية توجيه سوف بـ ناقص `contextWindow` شكل صيغة سجل، لذلك جديد سجل يمكن صاف حذف مقارنة مبكر توجيه سعة كمية؛ لم إعلان تحديث نمط توجيه نفس مثال سوف صاف حذف مقارنة مبكر توجيه `systemPromptUpdate`.

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

## `SessionEvent<T>`: واحد بند سجل بند

أساس في `type` حق صحيح يمكن تمييز تعرف ربط دمج (بينما غير مستقل `type`/`data` ربط دمج) ، لذلك `switch (event.type)` قدرة مباشر استلام ضيق `event.data`، بلا حاجة نوع تأكيد.`seq` هو سجل في مفرد ضبط تمرير زيادة موضع (`seq = log.length`) ؛`time` لـ epoch جزء ثانية.

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

`SessionSeq(value)` و `SessionLogOffset(value)` فقط وصل قبول غير سالب أمان كامل عدد، و رفض سالب صفر. هو جمع فقط إضافة تحرير ترجمة مدة صنف لوحة، لا تغيير تسلسل تحويل بعد عدد قيمة؛ حساب فن سوف إرجاع عادي `number`، استدعاء جهة يجب حسب نتيجة مسبق مدة زاوية لون عبر مقابل منشئ إعادة وصل قبول.

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

`SessionEventType = keyof SessionEventMap`. من في `SessionEventMap` يمكن عبر دمج توسيع، مقابل `SessionEvent` switch لغة جملة منع توقف استخدام `assertNever`: إضافة إضافة تغيير جسم هو دمج قاعدة لم معرفة قيمة؛ معالجة معروف case بعد في `default` في وضع سطر.

كل surface حدث كل اشتراط `surfaceOp`؛ معروف فقط سجل حدث منع توقف اثنان عدد surface بيانات وصفية حقل. أصلي لم معرفة أو قد تراجع دور يمكن تجاهل اختصار معلومة غلاف إبقاء لا نفاذ واضح.`assistant/message` تضمين دخول ذلك مزود stream، و منع توقف `sourceEventSeqs`.System،user و tool surface حدث يمكن في مصدر ملكية أو استبدال تغطية حاجة وقت مرجع كامل، غير فارغ كما وحيد مقارنة مبكر حدث تجميع دمج.`tool/result` فقط في أداة نتيجة كتلة حمل لديه `isError: true` وقت يمكن يحمل `data.error`؛ فشل نتيجة فشل هوية ما زال يمكن حذف.

<a id="surface-types"></a>

## Surface نوع

أربعة نوع إنتاج رسالة نوع (`SurfaceEventType`:`system/message`،`user/message`،`assistant/message`،`tool/result`) يحمل surface بيانات وصفية، استخدام قدوم إعلان هو جمع مثل أي إضافة دخول لديه ترتيب إرسال توليد surface.`system/message` تحمل تحميل تصيير بعد توجيه النظام: حلقة يأخذ رقم واحد بند إلحاق لـ surface رقم 0 رقم عقدة، و في نص التوجيه تغير وقت تماما جيد استبدال الأكثر جديد نظام عقدة، أو في تاريخ داخل توجيه فوق إلحاق واحد بند جديد؛surface طي رفض أي أخرى تغطية رقم 0 رقم عقدة `system/message` استبدال، بينما لاحق نظام عقدة هو عادي تاريخ، ضغط استبدال يمكن حجب حجب هو. رؤية [session surface Agent Note](../../.agents/notes/implemented/architecture/2026-06-18-session-surface.ar.md).

### `SurfaceEventType`: حدث نوع في إنتاج رسالة فرعي تجميع

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

### `SurfaceOp`: حدث مثل أي دخول surface

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

`'append'` هو معتاد قاعدة ذيل جزء إلحاق مسار.`replace` تماما جيد يتضمن `op`،`startSeq` و `endSeq`، لا قبول آخر اسم أو مقدار خارج مفتاح. هو حجب حجب هذا اثنان عدد حالي surface حدث ترتيب رقم بين إغلاق منطقة بين، و في أصل موضع إدراج دخول جديد حدث؛ نفسه طرف نقطة فقط استبدال واحد بند. طرف نقطة يجب مبكر في استبدال حدث، لكن هو جمع متبادل مقابل ترتيب حسب surface ترتيب بينما غير عدد قيمة ترتيب رقم ترتيب تحديد.

### `SurfaceIntent`:`session.append()` معامل

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

مقابل `SurfaceEventType` حدث لا بد ملء: كل إنتاج رسالة حدث كل يجب إعلان هو مثل أي إضافة دخول surface(إرسال توليد نموذج تاريخ وحيد مصدر). موجه إلى شخص صنف transcript(نص سجل) هو آخر عدد إسقاط، قراءة هو سجل في إلحاق مصدر حدث، لأن surface سوف متعمد حجب حجب استبدال الذي عام تضمين نطاق (رؤية [dsh-session](../../packages/core/session/README.ar.md) `isAppendSurfaceEvent`). غير surface نوع في تحرير ترجمة مدة رفض هذا معامل.

`assistant/message` لا يستطيع يحمل `sourceEventSeqs`؛ هو `stream` يملك دقيق provider دليل. أخرى surface event لا مرجع مقارنة مبكر event وقت حذف هذا حقل، حاجة مرجع وقت استخدام كامل غير فارغ list.

<a id="plugin-owned-message-projections"></a>
### إضافة يملك رسالة إسقاط

تعديل محتوى إضافة استخدام `@messageProjection` علامة حدث إعلان، و عبر `ctx.sessions.registerMessageProjection()` تسجيل صاف معالج.Session في إيداع قبل عبر معالج تحقق كامل قرار، تطبيق ذلك غير ممكن تغيير رسالة تحديث، و دفع دخول `contentGeneration`. نقص قليل معالج وقت رفض عملية، يشمل استعادة و مستقل طي، إزالة قد استخدام معالج بعد أيضا سوف رفض قراءة ذاكرة مؤقتة. مستقل قراءة جهاز سوف معالج صريح نقل إعطاء `foldSurface(events, projections)`، و عبر `deriveEventMessage()` تطبيق `projectedMessages`. حالي صيغة دليل لـ مغادرة خط قراءة جهاز تركيب إعداد رقم واحد جهة معالج.[صورة حذف إضافة](compaction.ar.md#image-offload) يملك صورة مخصص استخدام حدث و حل تفسير منطق.

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

### `SessionSurface`: فوري فقط قراءة surface إسقاط

`Session.surface` إرجاع جلسة مستقر `SessionSurface` عرض. نفس عدد زيادة كمية إدارة جهاز في إيداع قبل تحقق إلحاق مرشح حدث، و أصل حسب قد إيداع حدث دفع دخول هذا إسقاط؛ استدعاء جهة يمكن مراقبة عضو علاقة و استبدال بديل مرة، لكن لا يستطيع استدعاء تحقق.

`SurfaceManager(log, baseSeq?, projections?)` أيضا يمكن طي واحد وصل متابعة قد تحميل نافذة، ذلك رقم واحد حدث قطعا مقابل ترتيب رقم لـ `baseSeq`. كل حدث في هذا قطعا مقابل ترتيب رقم فضاء في ما زال إبقاء وصل متابعة؛ إذا استبدال عبر مرور نافذة رأس جزء، من في ذلك إعلان نطاق و لا وجود، هذا استبدال سوف فشل.

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

### `SurfaceFoldReplacement` و `SurfaceFoldResult`: كامل surface إعادة تشغيل

`foldSurface(events, projections)` إرجاع واحد نسخة مستقل حالي حدث seq قائمة، و كل إعلان استبدال نطاق فعلي حجب حجب seq. فوري إدارة جهاز إعادة استخدام نفس طقم حالة تحويل، لكن لا إبقاء استبدال تاريخ. كل إيداع مرة استبدال، ذلك `replaceGeneration` حينئذ تمرير زيادة مرة، جعل زيادة كمية مستهلك قدرة كاف منطقة قسم صاف ذيل جزء زيادة طويل و إعادة كتابة.

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

## `Session` عام مشترك API

ذهاب حذف طريقة جسم إعلان و شفرة المصدر في عادي صنف إبقاء تزامن، تغطية ذلك انفصال مغادرة حالة عمل مصنع، حالة وصول جهاز،append طريقة و تاريخ إسقاط. تخزين عملية ما زال من توليد [`ctx.sessions` صغير عقدة](#ctxsessions--sessionstore) سجل.

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

## إرسال توليد تاريخ:`deriveMessages()` و `deriveEventMessage()`

`Session.deriveMessages()` سوف حدث سجل إسقاط لـ نموذج يرى `Message[]`. هو هو ذاكرة مؤقتة (كل surface عقدة في أول مرة ظهور وقت إسقاط مرة؛surface إعادة كتابة إطلاق إعادة بناء) كما تجميد ربط (كل مرة استدعاء إرجاع واحد جديد عدد مجموعة، مرجع مشترك عميق تجميد ربط رسالة، لذلك عبر إسقاط تعديل قد سجل تاريخ في نوع فوق غير ممكن جدول بلوغ).`deriveEventMessage(event)` هو طي الذي تطبيق تدريجي عقدة صاف دالة، عام كشف بـ سهل خارجي إعادة بناء جهاز و تطوير ثابت صيغة فحص قدرة بـ تماما نفسه قاعدة إسقاط سجل بادئة، لن و ذاكرة مؤقتة إنتاج قسم اختلاف. إسقاط قاعدة:

- `user/message` → واحد بند يحمل تأكيد قطع `content` user رسالة؛ اختياري envelope فقط بصفة سجل في عرض بيانات وصفية إبقاء.
- `assistant/message` → واحد بند assistant رسالة، يتضمن توليد هو مزود و نموذج، و اختياري مهايئ خاص إعادة تشغيل حالة. ذلك تضمين دخول صيغة ضيق تجميع stream هو إعادة تشغيل،usage و UI دليل، بينما لا هو ثاني بند message.**محتوى لـ فارغ** `assistant/message` أيضا سوف قفز مرور: بسبب max-tokens بينما قطع قطع كما بلا محتوى خطوة ما زال سوف سجل واحد بند `assistant/message` قدوم حفظ stream،usage، مزود و نموذج، لكن بلا محتوى assistant جولة لا نيل دخول مزود transcript(نص سجل).
- `tool/result` → واحد بند يحمل `tool-result` كتلة user رسالة.
- `user/message`(حقن سياق، أي غير `user` مصدر)→ حسب وقت ترتيب في متبادل ينبغي موضع توليد واحد بند user-role رسالة، و أصل مثال تحمل تحميل ذلك `content`؛ ذلك نوع تحويل source علامة واضح إنتاج جهة، و يحمل كل إنتاج جهة مخصص استخدام بيانات.

ذلك بقية كل حدث (`turn/*`،`step/*`،`assistant/attempt`، إضافة الذي تابع `llm/retry`) متساو لـ بنية معلومة، لن إسقاط لـ رسالة.token تسجيل حساب سوف توسيع كل `assistant/message` أو `assistant/attempt` تضمين دخول صيغة stream،message قمة طبقة `usage` وجود وقت ما زال هو قد إيداع message مرجعي. فشل نموذج طلب attempt لذلك يمكن إبقاء مزود usage، بينما بلا حاجة وهمي بنية assistant message. حالي منطق تحقق سوف رفض لا يوجد مزود/نموذج request header و assistant رسالة، بينما لن تخمين قياس توجيه؛ تلقي دعم حمل تاريخ يمثل سوف في حالي Session وجود قبل، من ذلك متبادل مجاور صيغة ترحيل حافة عودة واحد تحويل و تحقق.

## نشط وثب جلسة fork API

`ctx.sessions.create(id, { seed, meta })` هو قاع طبقة إعادة تشغيل/fork أصل لغة. مقابل في عادي نشط وثب جلسة fork،`SessionStore` كشف واحد سياسة API:

- `fork(source, boundary?, childSessionId?)` قبول واحد نشط وثب `Session` كائن أو نشط وثب `SessionId`، اختيار أخذ إلى `SessionSeq` boundary(يحتوي) لـ توقف مصدر حدث (افتراضي لـ حالي الأكثر بعد واحد حدث) ، اشتراط الذي اختيار بادئة انتهاء وقت لا يوجد فتح وضع جولة، لكن بعد إنشاء واحد نشط وثب فرعي جلسة، يتضمن عميق تغلب ضخم seed event،`parentSession`،`isSeeded: true`، دقيق `inheritedEventCount` و وراثة `cwd`.

صريح `boundary` سماح استدعاء من من مهمة معنى مستقر جولة بين موضع fork، يشمل قبل `turn/end` أو أكثر متأخر مستقل صاف سجل حدث، أي جعل مصدر جلسة لديه تحديث حدث أو صحيح في إجراء جولة.API رفض انتهاء في فتح وضع جولة داخل بادئة، بينما لا هو ساكن صامت قطع قطع. أكثر واسع عام تنفيذ علاقة سليم كل صفة فحص إبقاء في قائم `dsh-invariants` إضافة و حفظ دائم إصلاح مسار في، لا في `fork()` في تكرار.`dsh-subagent-fork-in-process` إبقاء ذلك قد إتمام بادئة قطع قطع منطق، لأن أداة استدعاء وقت تفويض حمل عبر معتاد في أب جولة ما زال فتح وقت بدء؛ عادي جلسة فرع ينبغي صريح إشارة تحديد طلب boundary.

<a id="why-a-turn-ended-turnendreasonmap"></a>

## جولة انتهاء سبب:`TurnEndReasonMap`

`turn/start` لا يوجد trigger حقل. قد دخول `user/message` دفعة مرة سجل دخول كل خطوة محتوى،`llm/retry` سجل طلب استعادة،idle حقن فإن إبقاء انتظار معالجة، مباشر إلى نداء تنبيه تسليم مقاومة بلوغ لاحق pre-step. فوري جولة سوف إبقاء إيقاف مشغل نوع تحويل [`AgentCancelCause`](core.ar.md#the-agent-handle) ؛ فقط لديه في استيراد تلقي دعم حمل خشن حبة درجة إلغاء سجل كما سجل لم حفظ استدعاء جهة وقت، حفظ دائم عندئذ استخدام مقدار خارج `{ kind: 'legacy' }` سبب.

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

`max-tokens` و نموذج استدعاء في نفس اسم `FinishReason` مقابل: فقط يلزم جولة داخل لديه أي خطوة بـ `max-tokens` انتهاء، كامل جولة حينئذ بـ `max-tokens` بينما لا هو `completed` انتهاء (أي جعل بعد متابعة تنفيذ، قطع قطع واقع ما زال أولوية) ، يجعل مستهلك قدرة كاف منطقة قسم صحيح معتاد إيقاف و قطع قطع إيقاف. إلغاء و خطأ ما زال هو مختلف نتيجة.`interrupted` هو وحيد لن من أي loop إرسال خروج سبب: هو من انهيار انهيار استعادة دمج صار (رؤية [persistence.md](persistence.ar.md)). هذا map يمكن عبر دمج توسيع.

## تنفيذ غلاف إغلاق و مستقل حدث

واحد جولة حزمة محيط مرة نموذج حلقة تنفيذ، بينما لا هو كامل جلسة سجل.AgentLoop فقط سوف في جولة داخل دخول pre-step دفعة مرة وقت سجل حقن `user/message` حدث؛ إضافة الذي تابع صاف سجل حدث ما زال يمكن ظهور في `turn/end` و تحت واحد `turn/start` بين، احتلال استخدام حدث seq لكن لا تمرير زيادة جولة تحرير رقم. حفظ دائم سوف سوف كل وصل متابعة كما قد قبول حدث قبول دخول محدود حفظ دائم دفعة مرة، بينما انهيار انهيار إصلاح فقط إغلاق تأكيد فعلي ما زال موضع في فتح وضع حالة ذيل جزء جولة. حاجة أي وقت حمل دائم صفة شاشة عائق إنتاج جهة سوف صريح انتظار `ctx.sessions.flush(session)`.

اختياري `dsh-session/invariant` إعداد طقم إضافة سوف قوي صنع نواة قلب يملك علاقة: جولة و خطوة تحرير رقم، تنفيذ حدث غلاف إغلاق، و نفس خطوة داخل أداة استدعاء/نتيجة إعداد مقابل. يمكن دمج توسيع حدث علاقة من إعلان هو إضافة يملك، لذلك نواة قلب لن فقط بسبب لا يوجد فتح وضع جولة حينئذ رفض لم معرفة حدث. رؤية[مستقل حدث قرار](../../.agents/notes/implemented/simplification/2026-07-28-remove-synthetic-log-only-turns.ar.md).

## نوع فرعي انتهاء حد:`session/end-seed`

جديد fork constructor اشتراط seed انتظار في inherited prefix، و في دقيق حمل دائم cut إلحاق `session/end-seed { inherited: true }`.restore سوف إبقاء هذا tagged marker، و كما فقط في كامل stored seed بعد لم بـ marker ربط ذيل وقت إلحاق عادي `session/end-seed {}`. اثنان نوع شكل صيغة كل فقط دخول log كما لا إنتاج message؛`Session` constructor هو وحيد دمج قاعدة writer.

مقابل في fork lineage، تحديد موضع payload يحمل `inherited: true` الأكثر بعد واحد marker؛ حالي صيغة decoding فقط في `SessionHeader.isSeeded` لـ true وقت اشتراط هذا marker، و من ذلك seq دفع توجيه `inheritedEventCount`. مقابل في lifecycle ownership، تحديد موضع مهمة واحد شكل صيغة الأكثر بعد واحد `session/end-seed`. إعادة فتح قد بـ مهمة واحد marker ربط ذيل seed وقت، لن مجددا إلحاق عادي marker.

هو لـ الذي بـ لا بد يلزم، هو لأن نوع فرعي تاريخ و فوري عمل في بايت طبقة وجه تماما نفسه، هذا سوف يجعل أي يملك مستقل فتح/إغلاق تضمين رقم إضافة بطلان: واحد لم إعداد مقابل `compaction/start`، بلا نقاش كتابة جهة هو في ضغط في طريق انهيار انهيار، أيضا هو هذا لحظة صحيح في ضغط، قراءة بدء قدوم كل واحد مثال. في `session/end-seed` قبل فتح بدء علامة قدوم ذاتي بنية صنع نوع فرعي، و كما يخص واحد قد انتهاء دورة الحياة، بلا نقاش انتهاء سبب لـ أي (انهيار انهيار، عملية وصل بديل، أو من ما زال في تشغيل أب جلسة fork خروج قدوم) ، لذلك ذلك كل جهة يمكن نظر لـ لـ قد ميت. هذا فقط تغطية*هذا*جلسة وراثة تضمين رقم: آخر عدد تزامن تخزين نشط جلسة ممكن في نفس مقطع تاريخ فوق يحتفظ فتح وضع تضمين رقم، بينما هو ذاتي ذات حد في آخر موضع، لذلك سعة تحمل تزامن كتابة جهة أيضا حاجة سجل خارج تخزين نشط إشارة. نواة قلب كتابة هذا حد لكن لا من في قراءة أي محتوى——تضمين رقم مفردات جدول ما زال عودة ذلك الذي تابع إضافة، هذا أيضا صحيح هو انهيار انهيار إصلاح فقط إغلاق جولة/خطوة/أداة حد بينما من لا معالجة `compaction/*` سبب.

حسب حق شخص نشط حركة ترتيب ترتيب Session مستهلك سوف ترتيب حذف هذا حد: وصل يد Session لا حساب عمل، لذلك حسب سجل ذيل جزء ترتيب ترتيب سوف يأخذ كل فتح مرور Session قمة إلى الأكثر قبل.

## إضافة مساهمة فقط سجل حدث

إضافة يمكن عبر declaration merging إضافة مقدار خارج `SessionEventMap` نوع. هذه هو**فقط سجل**حدث: لا هو `SurfaceEventType`(لا يحمل `surfaceOp`، لا مشاركة و إرسال توليد تاريخ). حدث كل جهة قرار هو جمع يخص واحد فتح وضع تنفيذ جولة، أيضا هو يمكن مستقل يقع في جولة بين، و في ذاتي ذات ثابت كمية إعداد طقم إضافة في قوي صنع الذي يحتاج علاقة. توليد[حفظ دائم سجل حدث دليل](../persistence-catalog.ar.md) سوف صف خروج كل نواة قلب أو إضافة مساهمة حدث؛ ضغط seam `compaction/*` دلالة في [compaction.md](compaction.ar.md) في نقاش نقاش.

إذا نفس عدد إضافة حدث عائلة في كثير بند حدث يلزم تجميع صار واحد Web Client Conversation Node، هذا حدث عائلة في كل بند start،update،result،resource أو interruption حدث كل يجب يحمل أو مستقل دفع توجيه خروج نفس عدد مستقر عمل خدمة id. هذا اشتراط فقط قيد حاجة صلة ربط Node حدث عائلة، و لا اشتراط كل بند Session حدث كل لديه عمل خدمة id؛Client لذلك بلا يجب أصل حسب متبادل مجاور علاقة تخمين قياس ملكية، أيضا بلا يجب مسح تاريخ. مشاركة رؤية [Conversation فرعي نظام](conversation.ar.md).

خطاف جسر وصل طبقة `hook/invoked` / `hook/result` مقابل (قدوم ذاتي `@deepseek-ai/dsh-hook-protocol`) عبر `handlerId` صلة ربط.`UserPromptSubmit`،`PreToolUse`،`PostToolUse` و `Stop` في loop قد فتح جولة داخل إطلاق، لذلك ذلك `hook/*` سجل يوم لكن يقع في جولة لـ داخل.`SessionStart` لا توليد `hook/*` سجل، لأن هو في جولة 1 قبل تشغيل؛ ذلك سياق سوف في inbox في إبقاء انتظار معالجة، مباشر إلى نداء تنبيه تسليم فتح واحد جولة.

## حمل دائم صفة اتفاق

حفظ دائم خلفية اعتماد اتفاق مثل تحت: حمل دائم سجل بلا ضرر حفظ كل حدث، كل Assistant attempt كل هو واحد `assistant/message` أو `assistant/attempt`، ذلك تضمين دخول صيغة ضيق تجميع stream سوف إبقاء أصلي حمل وقت chunk.`seq` في هذه settlement و كل تسليم خطأ حدث بين إبقاء وصل متابعة. خلفية يمكن لـ حدث دفعة مرة اختيار ذاتي ذات تخزين framing، فقط يلزم جملة مقبض `read()` إرجاع و إلحاق وقت تماما متسق حدث يكفي؛ حالي JSONL كل حدث كتابة واحد سطر (رؤية [persistence.md](persistence.ar.md)). كل `event.data` كل يجب يمكن تسلسل تحويل لـ JSON؛`Session.append` سوف من مصدر رأس قوي صنع هذا واحد اشتراط (لقاء إلى غير ممكن تسلسل تحويل بيانات وقت رمي خروج) ، لذلك خطأ حدث أبدا سوف دخول سجل،`session.snapshotEvents()` بداية نهاية و خلفية يمكن حفظ دائم محتوى متسق. إضافة جديدة سوف يحمل غير ممكن تسلسل تحويل بيانات، كسر تالف نواة قلب تنفيذ تضمين طقم أو مخالفة عكس حدث كل جهة إعلان علاقة حدث نوع، كل سوف بنية صار مغناطيس قرص صيغة كسر تالف صفة تغيير.

إزالة استهلاك هذا اتفاق خلفية رؤية [persistence.md](persistence.ar.md).

## Remote دليل و workspace فتح

`ModelCatalog` هو `session/modelCatalog` إرجاع Host generation نموذج دليل: هو يحمل نشر قيمة افتراضية، يمكن توجيه provider id، نجاح provider قسم مجموعة و متبادل متبادل عزل provider فشل. هو لا من بعض عدد Session إرسال توليد، لذلك و Session projection قسم فتح حفظ.

`SessionOpenWorkspacePathRequest` يحمل قطعا مقابل مسار أو قد حسب workspace تحليل `path`.`SessionOpenWorkspacePathValue` تأكيد Host قد قبول أصلي تسليم وصل.Session-aware Client سوف في معروف حالي Session cwd وقت حسب هذا تحليل متبادل مقابل مسار؛controller سوف مسار أصل مثال تسليم إعطاء فتح جهاز، و عبر Session Remote خطأ مفردات جدول تقرير إبلاغ بلا فاعلية طلب، إلغاء و فتح جهاز فشل. اختياري `action: "reveal"` اختيار ملف إدارة جهاز تنقل؛ حذف وقت استخدام افتراضي تطبيق فتح.

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
