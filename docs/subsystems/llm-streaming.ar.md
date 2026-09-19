# LLM(كبير لغة نموذج) تدفق صيغة إخراج

[English](llm-streaming.md) | العربية

[`packages/llm`](../../packages/llm/README.ar.md) توفير محادثة و تدفق صيغة إخراج نوع: كل طلب و حمل دائم تاريخ مشترك استخدام `Message`/`ContentBlock` تغيير جسم، كامل تجميع نموذج طلب، أصلي `StreamChunk` بروتوكول، كل مهايئ يجب تنفيذ مهايئ اتفاق (adapter contract) ، و مشترك assembler.[نواة قلب حزمة](core.ar.md) في كل جولة يحتفظ و سجل هذه قيمة؛ هذا صفحة إعلان هو جمع.

شفرة المصدر:[`packages/llm/llm/src/types.ts`](../../packages/llm/llm/src/types.ts)

<a id="content-blocks-and-messages"></a>

## محتوى كتلة و رسالة

واحد مقطع محادثة من `Message` مجموعة صار؛ واحد بند رسالة هو واحد نوع تحويل**محتوى كتلة**عدد مجموعة. كتلة ربط دمج نوع من `ContentBlockMap` إرسال توليد.

شفرة المصدر:[`packages/llm/llm/src/types.ts`](../../packages/llm/llm/src/types.ts)

```ts type-equiv
/**
 * Merge-extensible content blocks keyed by `type`. New core blocks must land
 * with adapter, UI, and compaction support.
 */
interface ContentBlockMap {
  'text': TextBlock
  'reasoning': ReasoningBlock
  'image': ImageBlock
  'file': FileBlock
  'tool-call': ToolCallBlock
  'tool-result': ToolResultBlock
}
```

كل كتلة واجهة (كامل حقل رؤية شفرة المصدر):`TextBlock`(`text`) ،`ReasoningBlock`(thinking، منطقة آخر في مرئي نص) ،`ImageBlock`(واحد حمل دائم[صورة مرفق عنصر](attachment.ar.md)) ،`FileBlock`(واحد حمل دائم أصل مثال[ملف مرفق عنصر](attachment.ar.md) ، طلب تجميع مقابل كل بند توجيه كل يأخذ هو إسقاط لـ handle نص) ،`ToolCallBlock`(`id: ToolCallId`،`name`، أصلي JSON `arguments`) ، و `ToolResultBlock`(`toolCallId`، تضمين طقم `content: ContentBlock[]`،`isError?`).`ContentBlock = ContentBlockMap[ContentBlockType]`. فقط عند مهايئ،UI، ضغط (compaction) و حمل دائم إعادة تشغيل مسار متساو دعم حمل بعض نوع جديد نموذج حالة وقت، عندئذ سوف ذلك قبول دخول يمكن دمج توسيع map.

صورة وصول طريقة يخص طلب تسلسل تحويل، لا يخص حمل دائم مرفق عنصر أو تحديد صفة طلب صورة إصدار.`resolveImageAttachmentAccess()` يأخذ مرفق عنصر مزود اختياري مضيف كائن مسار، و مستهلك لـ حالي أداة تنفيذ نظام الملفات توفير خريطة تركيب بدء قدوم. نتيجة فقط ملائم لأجل هذا مرة طلب، لا مشاركة و `variantId`.

شفرة المصدر:[`packages/llm/llm/src/content.ts`](../../packages/llm/llm/src/content.ts)

```ts type-equiv
/** Execution-world path that model tools can use to read one normalized attachment. */
interface ImageAttachmentAccess {
  /** Absolute path to immutable normalized bytes; callers must treat it as read-only. */
  readonlyPath: string
}
```

شفرة المصدر:[`packages/llm/llm/src/message.ts`](../../packages/llm/llm/src/message.ts)

`Message` هو واحد حمل معرف كما غير ممكن تغيير زاوية لون/مصدر/محتوى قيمة. نموذج توليد assistant رسالة سوف في مصدر في سجل توليد هو مزود و نموذج، و اختياري مهايئ خاص إعادة تشغيل بيانات:

```ts type-equiv
/** Provider/model identity and adapter-private replay data for an assistant message. */
interface AssistantProviderMetadata {
  /** Provider route that produced the message. */
  provider: string
  /** Provider model id that produced the message. */
  model: string
  /**
   * Lossless-JSON adapter state needed to replay the provider response.
   * `LlmRuntime` exposes it to a target adapter only when that adapter instance
   * currently owns both this historical provider and the target provider.
   */
  replayState?: unknown
}
```

```ts type-equiv
/** One immutable message representation shared by delivery, durable history, and model requests. */
interface Message {
  /** Stable identity preserved across every representation boundary. */
  readonly id: MessageId
  /** Provider-neutral conversation role. */
  readonly role: 'system' | 'user' | 'assistant'
  /** Exact model-facing blocks. */
  readonly content: ContentBlock[]
  /** Required source fields supplied by the producer. */
  readonly source: MessageSource
}
```

رسالة مصدر ذاته أيضا هو واحد يمكن دمج توسيع و نوع:

```ts type-equiv
/**
 * Where a message (or injected content) came from.
 * Merge-extensible sum type — plugins add their own `kind`s.
 */
interface MessageSourceMap {
  user: { kind: 'user' }
  plugin: { kind: 'plugin'; plugin: string } & ContextFormed
  model: ModelMessageSource
  tool: ToolMessageSource
}
```

إنتاج جهة معرف و عرض شكل صيغة متبادل متبادل مستقل.`kind` عودة جواب «من من إنتاج» ؛ اختياري `form` عودة جواب «هذا هو ماذا نوع معلومة» ، مستهلك قرار مثل أي عرض. كثير عدد إنتاج جهة يمكن مشترك استخدام واحد نوع `form`، واحد إنتاج جهة في مرة جلسة في أيضا يمكن إرسال خروج كثير نوع `form`. هذه أخذ قيمة وصف دلالة، و تدريجي عدد زيادة؛ لم إعلان أو لا يمكن تعرف آخر قيمة استخدام وثيقة قاعدة تحديد قيمة افتراضية، حسب لا نفاذ واضح محتوى عرض:

```ts type-equiv
/**
 * The kind of information in producer-supplied context, declared by the
 * producer in the same `MessageSource`.
 *
 * `MessageSource.kind` answers *who produced this*; `form` answers *what kind
 * of thing it is*, and the two axes are deliberately independent — several
 * producers share one form, and one producer may emit more than one form over
 * a session.
 *
 * The vocabulary is SEMANTIC, never visual: a value states that the content is
 * a file's instructions or a catalog of available items, and a consumer decides
 * what that looks like. Colors, icons, ordering, and collapse defaults are the
 * consumer's business and must not enter this union. It grows one value at a
 * time as producers gain the structured fields their form needs; an absent or
 * unknown value is the documented default, presented as opaque content.
 */
type ContextForm =
  /** Instructions read out of workspace files the model is expected to follow. */
  | 'instructions'
  /** A catalog of items available in this session, republished as it changes. */
  | 'catalog'
  /** Current state, where a later snapshot from the same producer supersedes an earlier one. */
  | 'snapshot'
  /** A one-off account of something that just happened; it supersedes nothing. */
  | 'notice'
  /** A message another agent addressed to this one. */
  | 'relay'
  /** Material lifted out of another session's log, possibly reduced on the way in. */
  | 'recall'
```

```ts type-equiv
/** One named contribution to a `snapshot`-form context, in assembly order. */
interface ContextSnapshotSection {
  /** The contributing subsystem's name. */
  readonly name: string
  /** That contribution's model-facing text, exactly as assembled. */
  readonly text: string
}
```

```ts type-equiv
/**
 * Producer-declared {@link ContextForm} and the fields that form requires,
 * mixed into the source types that carry one.
 *
 * Discriminated by `form` so a producer cannot select a form without the
 * fields needed to present it: a `notice` must record its one-line
 * account, a `snapshot` its sections. Omitting `form` stays valid — an
 * undeclared context is the documented default.
 */
type ContextFormed =
  | { readonly form?: never }
  | { readonly form: 'instructions' }
  | { readonly form: 'catalog' }
  | {
    readonly form: 'snapshot'
    /** The named contributions this snapshot assembled, in order. */
    readonly sections: readonly ContextSnapshotSection[]
  }
  | {
    readonly form: 'notice'
    /** One-line account of what happened, shown without expanding the row. */
    readonly summary: string
  }
  | { readonly form: 'relay' }
  | { readonly form: 'recall' }
```

<a id="streamchunk--the-raw-protocol"></a>

## `StreamChunk`: أصلي بروتوكول

واحد تدفق صيغة استجابة تسليم خطأ يتضمن كثير نوع نوع كتلة (نص، دفع إدارة (reasoning) ، كثير عدد استدعاء الأداة).`index` سوف كل delta صلة ربط إلى ذلك الذي تابع كتلة؛`block-end` يحمل كامل تجميع جيد `ContentBlock`، مستهلك بلا حاجة ذاتي سطر إعادة تجميع delta. هذا هو واحد**غلاف إغلاق**يمكن تمييز تعرف ربط دمج نوع: مقابل `type` `switch` بـ `assertNever` ربط ذيل، لذلك إضافة جديدة تغيير جسم سوف في كل يجب معالجة هو مستهلك موضع إطلاق تحرير ترجمة خطأ.

```ts type-equiv
/**
 * Adapter-private lossless-JSON state for replaying a successful response,
 * carried by a terminal `finish` chunk and stored on the assembled assistant
 * message's model source. Both halves stay opaque to the harness; only the
 * split is shared vocabulary, so assembly can keep stored metadata aligned
 * with stored content without reading either half.
 */
interface ReplayEnvelope {
  /** Response-level adapter-private metadata (ids, native stop reason). */
  response: unknown
  /**
   * Per-block adapter-private metadata, one entry per emitted block in
   * first-seen stream order. When assembly drops a block it drops the entry at
   * the same position; entries whose length does not match the emitted block
   * count discard the whole envelope. An adapter whose metadata is independent
   * of block structure omits this field and the envelope passes through
   * assembly unchanged.
   */
  blocks?: readonly unknown[]
}
```

```ts type-equiv
/**
 * Raw streaming protocol emitted by adapters.
 * Block indexes correlate interleaved deltas, and `block-end` carries the
 * assembled block. Adapters emit usage before the terminal finish and nothing
 * afterward; tool arguments remain raw JSON strings. An adapter implementation
 * may throw, but `LlmRuntime.stream()` normalizes that failure to a terminal
 * `error` or `aborted` finish before exposing it to consumers.
 */
type StreamChunk =
  | { type: 'block-start'; index: number; blockType: ContentBlockType }
  | { type: 'text-delta'; index: number; text: string }
  | { type: 'reasoning-delta'; index: number; text: string }
  | { type: 'tool-call-delta'; index: number; id: ToolCallId; name?: string; argumentsDelta: string }
  | { type: 'block-end'; index: number; block: ContentBlock }
  | { type: 'usage'; usage: TokenUsage }
  | {
    type: 'finish'
    reason: FinishReason
    /** Replay metadata for a successful response; see {@link ReplayEnvelope}. */
    replayState?: ReplayEnvelope
  }
```

<a id="compact-assistant-streams"></a>

## ضيق تجميع Assistant stream

`AssistantStreamAccumulator` يأخذ كل `StreamChunk` و ذلك أصلي أمان كامل عدد ختم الوقت إعداد مقابل، و توليد `AssistantStreamRecord[]`. نفس block وصل متابعة text،reasoning أو tool argument delta سوف تغيير صار واحد record، استخدام `time0`، دقيق ختم الوقت بين فصل و كل أصلي delta مقابل واحد عدد مجموعة عضو؛ أخرى chunk إبقاء لـ حمل ختم الوقت raw record. هذا يمثل سوف إزالة تكرار event envelope، لكن لن دمج token حد، أيضا لن إسقاط terminal،usage،block،failure أو replay واقع.

`snapshot()` إرجاع قسم مغادرة كما غير ممكن تغيير stream.`expandAssistantStream()` سوف صارم إطار فحص record key، عضو عدد،index، ختم الوقت،tool-call identity و بلا ضرر JSON، مجددا إعادة بناء دقيق حمل وقت chunk تسلسل.Session سجل سوف يأخذ هذا stream تضمين دخول بصفة surface result `assistant/message`، أو تضمين دخول لا يوجد surface message `assistant/attempt`.

عملية محلي `agent/assistant-stream` frame تحمل تحميل فوري عرض. حمل دائم إعادة تشغيل و استعادة تحقق ما زال سوف توسيع داخل تضمين settlement؛ بعيد قياس،token تسجيل حساب و Host طي مباشر قراءة ضيق تجميع سجل. سجل درجة قراءة جهاز (`assistantStreamFirstTokenTime`،`assistantStreamHasVisibleContent`،`assistantStreamHasVisibleText`،`lastAssistantStreamChunk`،`assistantStreamChunks`،`joinAssistantStreamText`،`assembleAssistantStream` و حسب run `runFirstTokenTime` و `runFirstVisibleTime`) بـ رفع قبل خروج في مرة مسح داخل عودة جواب مستهلك مشكلة، لذلك كبير تاريخ كل مرة تسوية بديل قيمة لـ O(records) بينما غير O(members) توسيع ([طي قرار](../../.agents/notes/implemented/architecture/2026-09-06-embedded-stream-record-readers.ar.md)).`expandAssistantStream()` ما زال هو حمل دائم حد قراءة سجل و حاجة كل عضو مستهلك تحقق مسار.

<a id="llmfailure"></a>

## `LlmFailure`

كل رمي خروج فشل أو نهائي مهايئ حمل داخل فشل كل سوف مواصفة تحويل لـ واحد نوع يمكن تسلسل تحويل، مزود غير متصل payload.`providerRetryAfterMs` هو مرور تحقق، من مزود طلب صحيح عدد تأخير متأخر، بينما لا هو إعادة محاولة قرار؛`ProviderRequestId` هو لأجل تشخيص لا نفاذ واضح صنف لوحة نص.

```ts type-equiv
/** Serializable provider or transport failure facts; policy decides whether they are retryable. */
interface LlmFailure {
  /** Human-readable provider or transport failure. */
  readonly message: string
  /** Stable provider-neutral machine-routing code. */
  readonly code: string
  /** HTTP status returned by the provider, when available. */
  readonly status?: number
  /** Provider-requested delay in milliseconds, when valid and available. */
  readonly providerRetryAfterMs?: number
  /** Opaque provider-issued request identifier for diagnostics. */
  readonly requestId?: ProviderRequestId
  /**
   * With code `IMAGE_OFFLOAD_REQUIRED`: how many more of the oldest retained
   * image occurrences the route needs offloaded before the same request fits
   * its exact byte accounting. `dsh-compaction-image-offload` records the
   * selected occurrences in an `image/offload` event and retries the step.
   */
  readonly offloadImages?: number
}
```

## طلب صورة تحديد قيمة

مزود مقابل طلب صورة استلام أخذ نظر شعور token مهايئ عبر تغطية كتابة `LlmAdapter.imageRequestPricing` إعلان حسب توجيه تحديد قيمة، مستهلك مرور `ctx.llm.imageRequestPricing(provider, model)` تزامن تحليل.token حساب كمية خدمة في كل مرة حساب كمية وقت تحليل توجيه نموذج تحديد قيمة، جعل compaction ضغط قوة، إبقاء و اختيار مقطع كل حسب توجيه طلب فعلي إرسال شكل صيغة لـ صورة تاريخ حساب قيمة؛DeepSeek مهايئ حسب نموذج طلب هدف استخدام رسمي جهة عام نشر نظر شعور حساب كمية لـ كل إبقاء ظهور موضع تحديد قيمة، و يأخذ سجل في صورة حذف قرار اختيار في ظهور موضع حسب ذلك احتلال موضع نص تحديد قيمة، اكتمل طلب ما زال بـ provider usage لـ مرجعي مرساة نقطة.

```ts type-equiv
/**
 * Request price of one ordered image occurrence under one exact model route's
 * request projection. Every occurrence resolves to the pair the wire actually
 * carries: provider visual tokens for a retained image, plus the model-visible
 * text sent with or instead of it (request-preview handle, offload placeholder,
 * or text-only substitution). The caller prices `text` with its own text
 * estimator so provider pricing never fixes a text tokenization.
 */
interface LlmImageRequestPrice {
  /** Provider visual tokens for the retained request image; 0 when only text represents this occurrence. */
  visualTokens: number
  /** Model-visible text sent for this occurrence, to be priced by the caller's text estimator. */
  text: string
}
```

```ts type-equiv
/**
 * Provider-side request-image pricing for one exact model route. Implemented
 * by adapters whose provider charges visual tokens; consumers (the token
 * meter) resolve it synchronously per measurement, so implementations must not
 * perform I/O.
 */
interface LlmImageRequestPricing {
  /**
   * Price every image occurrence of one request projection.
   * @param images - surface image blocks in request order, one entry per occurrence; an `offloaded` block
   *   is priced as its placeholder text.
   * @returns one price per occurrence, aligned by index with `images`.
   */
  priceImages(images: readonly ImageBlock[]): readonly LlmImageRequestPrice[]
}
```

## مهايئ اتفاق

كل مهايئ يجب التزام حراسة التالي قاعدة، كل مستهلك يمكن اعتماد هو جمع:

- **`usage` في `finish` قبل،`finish` بعد لم يعد لديه أي قسم قطعة.** سوف اثنان من كل دفع متأخر إلى مزود تدفق انتهاء علامة، هذا مثال ذيل جزء usage-only قسم قطعة حينئذ لن مخالفة عكس ترتيب.
- **استدعاء الأداة `arguments` كل مسار إبقاء أصلي JSON نص.** جزء قطعة مقطع عبر `argumentsDelta` تدفق صيغة نقل؛ إذا مزود إرجاع هو قد تحليل كائن، مهايئ في `block-end` وقت إعادة تسلسل تحويل لـ نص.
- **اثنان بند تلقي دعم حمل خطأ مسار، مشترك استخدام واحد `LlmFailure` نوع.** فشل يمكن من `stream()` رمي خروج (نقل/بروتوكول خطأ) ،**أو من**بـ `finish {kind:'error'|'aborted', failure}` انتهاء تدفق (لا يمكن في تدفق في طريق رمي استثناء مهايئ استخدام هو يمثل مزود حمل داخل خطأ).`LlmError.failure` يحمل نفس عدد `LlmFailure`. استدعاء اختيار تحديد مهايئ بعد، تدفق سوف إبقاء يتم رمي خروج تأكيد قطع `Error` كائن، و سوف غير ممكن تغيير واقع و فعلي خدمة تسجيل الذي مقابل غير ممكن تغيير إعادة محاولة سياسة صلة ربط إلى هذا استدعاء؛agent loop(ذكي جسم حلقة) أولا يأخذ attempt stream إيداع لـ `assistant/attempt`، مجددا إغلاق فشل خطوة، و يأخذ خطأ، واقع، غير ممكن تغيير أولا قبل قد إعادة محاولة فشل واقع، فعلي خدمة سياسة و جولة إشارة توفير إعطاء `agent/request-error`. معالجة هذا خطأ listener في ذلك await إصلاح إتمام بعد إرجاع `{ kind: 'retry' }`؛ إذا لم استعادة، بنية تحويل فشل سوف يصبح جولة خطأ، و كما هذا مرة attempt لن إيداع surface Assistant message أو أداة فرعي أثر.
- **مرة مهايئ استدعاء حينئذ هو مرة مزود محاولة تجربة.** مهايئ منع استخدام مكتبة إعادة محاولة.agent طبقة استعادة سوف فتح آخر عدد حمل دائم، حمل تحرير رقم جولة؛ مباشر استدعاء `ctx.llm.stream()` استدعاء جهة ما زال فقط محاولة تجربة مرة.
- **مزود توقف توقف في نقل طبقة تلقي إلى وقت حد قيد.** اثنان عدد قد تسليم بعيد مسار مهايئ كل كشف صحيح عدد كما لديه حد `streamIdleTimeoutMs`، افتراضي خمسة دقيقة.watchdog فقط في iterator `next()` بعد لم إتمام وقت بدء، كامل طلب استخدام نفس عدد مستقر signal، يأخذ ذاته إلى مدة خريطة لـ `TIMEOUT`، و يأخذ أكثر مبكر حدوث استدعاء جهة في توقف إبقاء لـ `ABORTED`.
- **سياق فيض خروج فقط لديه واحد مواصفة code.** اثنان عدد DeepSeek مهايئ كل عبر `isContextWindowExceededError()` مقابل مزود صريح دقيق عقدة تصنيف و كشف `CONTEXT_WINDOW_EXCEEDED`، بلا نقاش فشل بـ رمي خروج HTTP `LlmError` أيضا هو حمل داخل finish error وصول. مستهلك حسب code توجيه، أبدا اعتماد مزود نص.
- **فارغ completion هو يمكن إعادة محاولة خطأ، بينما لا هو ساكن صامت نجاح نتيجة.** اثنان عدد مهايئ كل يأخذ لا يوجد يحمل أي محتوى كتلة إنهاء صفة `stop` انتهاء خريطة لـ يحمل مواصفة `EMPTY_RESPONSE` code `finish {kind:'error'}`،`dsh-llm-retry` افتراضي سوف إعادة محاولة هو.
- **كل مزود HTTP طلب كل يحمل تطبيق ملكية رأس.** مهايئ إرسال `attributionHeaders()`(رؤية تحت نص) بصفة `User-Agent` أساس خط، و عبر بروتوكول درجة اختبار إضافة بـ إثبات.
- **إعادة تشغيل حالة عودة مهايئ كل؛ ذلك قطع قسم هو مشترك مفردات.** نجاح `finish` يمكن يحمل واحد `ReplayEnvelope`: لا نفاذ واضح استجابة درجة بيانات وصفية، إضافة فوق و إرسال إطلاق كتلة تسلسل مقابل متساو اختياري تدريجي كتلة بند. مقابل متساو علاقة هو harness مفردات——تجميع إسقاط بعض عدد كتلة وقت، نفس موضع بند واحد و إسقاط، لذلك تخزين بيانات وصفية بداية نهاية وصف تخزين محتوى. حلقة يأخذ قطع قص بعد بيانات و تجميع بعد assistant رسالة واحد بدء تخزين. لاحق طلب في، فقط عند تاريخ مزود و هدف مزود حالي تسجيل إلى تماما نفسه مهايئ نسخة وقت،`LlmRuntime` عندئذ سوف نقل تمرير هذا حالة. هذا مهايئ مسؤول تحقق حالة و يملك كل عبر نموذج أو عبر مزود تحويل؛ أخرى مهايئ فقط سوف استلام إلى مزود غير متصل محتوى و مزود/نموذج حقل، لن استلام إلى خاص حالة. حفظ دائم محتوى إبقاء مرجعي: قراءة مهايئ لا يمكن استخدام قد تخزين حالة فقط سوف يأخذ هذا واحد بند رسالة تخفيض لـ مزود غير متصل تحويل و حمل خروج تشخيص، بينما لا هو يجعل طلب فشل.

## `ResolvedRetryPolicy`

إعادة محاولة إعداد سوف في توجيه تسجيل قبل تحليل لـ غير ممكن تغيير يمكن تمييز تعرف ربط دمج.normal mode يحمل `mode: 'normal'`، لديه حد `maxRetries`،`retryableCodes`، و لا بد ملء `initialDelayMs`،`maxDelayMs` و `jitterRatio`؛always mode يحمل `mode: 'always'` و نفسه لا بد ملء تراجع تجنب حقل، لكن لا يوجد لديه حد حد أعلى. حذف مزود سياسة وقت استخدام إعادة محاولة خمسة مرة normal قيمة افتراضية. قسم طبقة settings في تبديل إلى always نمط بعد ممكن إبقاء فقط يخص normal `maxRetries` أو `retryableCodes`؛ محلل سوف تجاهل اختصار هذه لم تفعيل حقل، و التقاط صاف always سياسة.`LlmRuntime.providerRetryPolicy(provider)` إرجاع تسجيل قيمة؛ استدعاء اختيار تحديد فعلي توفير خدمة تسجيل بعد،`llmRetryPolicyOf(stream)` إرجاع من في التقاط قيمة، لذلك بعد تحرير أو استبدال توجيه كل لا يمكن تغيير إجراء في فشل استعادة سياسة. اختياري إعداد إدخال حقل من[توليد إعداد دليل](../config-catalog.ar.md) صف خروج.

## `AppIdentity`: تطبيق ملكية

كل مهايئ كل سوف نحو مزود إرسال ساكن حالة عام تطبيق معرف ([`packages/llm/llm/src/attribution.ts`](../../packages/llm/llm/src/attribution.ts)).`attributionHeaders(identity?)` فقط يأخذ هو خريطة إلى معيار `User-Agent` header؛ هذا اتفاق متعمد لا دعم حمل OpenRouter خاص لديه تطبيق ملكية header. افتراضي `APP_IDENTITY` من حزمة manifest(بيانات وصفية بيان) نيل أخذ إصدار؛ كل حقل كل هو عام منتج واقع——لا يحتوي secret، مسار، جلسة id أو تدريجي مستخدم معرف، كما أي تدريجي طلب معلومة كل لا نيل أثر هذه قيمة. تصميم إدارة من رؤية[قوي صنع `User-Agent` ملكية](../../.agents/notes/implemented/architecture/2026-06-21-mandatory-app-attribution-headers.ar.md).

```ts type-equiv
/**
 * Static public application identity sent to LLM providers.
 *
 * Every field is a public product fact, safe on every request: no secrets,
 * local paths, session ids, prompt text, or per-user identifiers belong here,
 * and nothing per-request may influence the values.
 */
interface AppIdentity {
  /** `User-Agent` product token (lowercase, hyphenated). */
  product: string
  /** Product version; sourced from package metadata, never hand-copied. */
  version: string
  /** Repository home URL of the app, used as the `User-Agent` comment. */
  url: string
}
```

<a id="tokenusage"></a>

## `TokenUsage`

تدريجي استدعاء token تسجيل حساب. كل حساب عدد**متبادل لا إعادة تراكم**:`inputTokens` فقط يتضمن لم ذاكرة مؤقتة إدخال؛ ذاكرة مؤقتة إدخال مفرد وحيد تقرير إبلاغ، حساب استهلاك إدخال هو ثلاثة من لـ و. إذا مزود يأخذ ذاكرة مؤقتة أمر في طي دخول مفرد واحد نص التوجيه مجموع عدد (مثل DeepSeek `prompt_tokens`) ، مهايئ سوف مجددا سوف ذلك خصم حذف. اختياري `totalTokens` هو دقيق نص التوجيه و إخراج تجمع دمج حساب عدد، من مهايئ إبقاء مزود أصل قيمة أو من مرجعي تجمع دمج حساب عدد إعادة بناء؛ غير ممكن استخدام أو لا متسق وقت حذف.`reasoningTokens` وجود وقت فقط هو معلومة صفة دقيق عقدة، قد يتضمن في `outputTokens` في؛ تجميع مجموع وقت لا نيل تكرار متبادل إضافة.

```ts type-equiv
/**
 * Token accounting for one model call (cache fields are optional).
 *
 * Counts are DISJOINT: `inputTokens` is uncached input only; cached input is
 * reported separately as `cacheReadTokens`/`cacheWriteTokens` (billed input =
 * sum of the three). Adapters whose providers fold cache hits into a total
 * prompt count (DeepSeek's `prompt_tokens`) subtract them out.
 */
interface TokenUsage {
  inputTokens: number
  outputTokens: number
  /**
   * Exact full-call total including aggregate prompt and output tokens.
   *
   * Adapters preserve a provider total or derive it from authoritative
   * aggregate prompt/output counters; they omit it when unavailable or
   * inconsistent.
   */
  totalTokens?: number
  cacheReadTokens?: number
  cacheWriteTokens?: number
  reasoningTokens?: number
}
```

<a id="blockassembler"></a>

## `BlockAssembler`

`BlockAssembler`([`packages/llm/llm/src/assembler.ts`](../../packages/llm/llm/src/assembler.ts)) هو وحيد مشترك تنفيذ، مسؤول يأخذ `StreamChunk` تدفق طي عودة `ContentBlock`،usage، انتهاء سبب و إعادة تشغيل حالة. حلقة في سجل أصلي قسم قطعة معا، يأخذ نفس دفعة قسم قطعة إرسال دخول assembler، مجددا سوف تجميع بعد assistant محتوى وصل نفس توليد هو مزود و نموذج واحد بدء تخزين. حاجة تجميع نتيجة، أيضا لا تفكير إعادة تنفيذ fold مستهلك استخدام هو.

محتوى و بيانات وصفية مشترك استخدام نفس مرة إبقاء/إسقاط قرار:`max-tokens` انتهاء سوف إسقاط كل استدعاء الأداة، لأن يتم مقتطع استدعاء لا يستطيع أمان تنفيذ، بينما نفس قرار سوف في كل يتم إسقاط موضع قطع قص إعادة تشغيل بيانات تدريجي كتلة بند. بلا نقاش تجميع إزالة ماذا،`blocks()` و `replayState` كل غير ممكن قدرة لا متسق.

```ts public-api
/**
 * Incrementally assembles raw {@link StreamChunk}s into complete
 * {@link ContentBlock}s and a final assistant {@link Message}.
 *
 * The agent loop feeds it while logging raw chunks for replay fidelity, then
 * reads `blocks()` / `message()` / `usage` / `finish` once the stream ends,
 * or `interruptedBlocks()` when cancellation cut the stream short.
 *
 * Tolerant of delta-only protocols (no block-start/end); deltas arriving for
 * an index already closed by `block-end` are ignored (malformed stream) so a
 * misbehaving adapter cannot grow memory or corrupt a completed block.
 */
declare class BlockAssembler {
  /**
   * Feed one chunk into the assembly state.
   * @param chunk - the next raw chunk, in stream order.
   */
  push(chunk: StreamChunk): void;
  /**
   * Assemble all blocks seen so far, in stream order.
   * @returns one block per seen index, except that max-token truncation drops
   *   tool calls that cannot be executed safely; an open block assembles from
   *   its accumulated deltas (an unknown block type never closed by `block-end` throws).
   */
  blocks(): ContentBlock[];
  /**
   * Assemble the prefix an interrupted stream can safely finalize: closed and
   * open text/reasoning blocks with non-whitespace content, in stream order.
   * Tool calls are omitted because interruption precedes dispatch; retaining
   * one would require a fabricated result. Open unknown blocks are also omitted.
   * @returns the kept blocks; empty when nothing streamed before the interruption.
   */
  interruptedBlocks(): ContentBlock[];
  /** Usage from the `usage` chunk; undefined until one arrives. */
  get usage(): TokenUsage | undefined;
  /** Finish reason from the `finish` chunk; `{kind: 'stop'}` when the stream ended without one. */
  get finish(): FinishReason;
  /**
   * Replay metadata from the terminal finish chunk, if any, with per-block
   * entries pruned in step with {@link blocks}. Undefined when the envelope's
   * entries do not align with the emitted blocks.
   */
  get replayState(): ReplayEnvelope | undefined;
  /**
   * The assembled assistant message.
   * @param source - producer attribution for the assembled message.
   * @returns a frozen assistant-role message over `blocks()` (same open-block assembly rules).
   */
  message(source: MessageSource = { kind: 'plugin', plugin: 'dsh-llm/assembler' }): Message;
}
```

<a id="the-model-request-and-result"></a>

## نموذج طلب

مرة نموذج استدعاء هو واحد تماما تجميع جيد `GenerateOptions`. مهايئ بـ أصلي [`StreamChunk`](#streamchunk--the-raw-protocol) تدفق عمل جواب؛ مستهلك استخدام [`BlockAssembler`](#blockassembler) تجميع هو.

شفرة المصدر:[`packages/llm/llm/src/types.ts`](../../packages/llm/llm/src/types.ts)

مزود و نموذج اكتشاف استخدام صغير نوع، مزود غير متصل وصف رمز. نموذج دليل فقط توفير مشاركة اعتبار: توجيه ما زال بـ قد تسجيل مزود لـ مفتاح.

تسجيل مهايئ سوف إرجاع واحد جملة مقبض: حيث هو تحرير جهاز، أيضا حمل لديه أصل فرعي توجيه استبدال——توجيه تجميع دمج من مستخدم إعداد قرار إضافة صحيح حاجة هو.

```ts type-equiv
/**
 * What {@link LlmRuntime.registerAdapter} returns: the disposer, plus an
 * atomic route replacement for the same adapter instance.
 */
interface AdapterRegistrationHandle {
  /** Release every route this registration currently holds. */
  (): void
  /**
   * Replace this registration's routes with `providers`, keeping the same
   * adapter instance. The candidate set is validated in full first — a
   * conflict with another adapter, an invalid name, or bad provider metadata
   * throws and leaves the current routes untouched — and the swap itself is
   * one synchronous section, so no request can observe a gap. An empty array
   * is legal here (a settings section that emptied holds zero routes while
   * staying registered), unlike an empty initial registration.
   *
   * Throws `LlmError` with code `REGISTRATION_DISPOSED` once the registration
   * has been released: its routes are gone and its disposer has already run,
   * so anything registered afterwards would have no owner left to release it.
   * @param providers - the complete next route set for this registration.
   */
  replace(providers: string[]): void
}
```

```ts type-equiv
/** Display metadata for one registered provider route. */
interface LlmProviderInfo {
  /** Provider route key used by {@link GenerateOptions.provider}. */
  id: string
  /** Human-readable provider name for selectors and diagnostics. */
  name: string
}
```

مهايئ إضافة أيضا سوف عبر `registerConfigurableProviders()` إعلان أي بعض توجيه*يمكن*تشغيل، و إشارة واضح كل بند توجيه مستخدم ضبط قسم عقدة، جعل إعداد واجهة قدرة في أي توجيه تسجيل قبل حينئذ عرض راحة نوم مزود.

```ts type-equiv
/**
 * One provider route an adapter plugin can activate through configuration,
 * whether or not the route is currently registered. Configuration surfaces
 * merge this directory with `listProviders()` to offer every configurable
 * provider alongside its live/dormant state.
 */
interface LlmConfigurableProvider {
  /** Provider route key this entry activates when configured. */
  provider: string
  /** Human-readable provider name for configuration surfaces. */
  displayName: string
  /** User-settings namespace whose section configures this provider. */
  settingsNs: string
  /**
   * Path from that namespace's section root to this provider's profile
   * object; empty when the whole section is the profile.
   */
  settingsPath: readonly string[]
  /**
   * Whether the owning adapter knows this route only because configuration
   * declared it — a gateway or self-hosted server it ships nothing about.
   * Absent means the adapter draws no such distinction; false means it does
   * and this route is one of its own. Only the adapter can answer: a stored
   * profile is how a user-added route AND a corrected shipped one both look
   * from outside.
   */
  declared?: boolean
  /** Configuration diagnostic for repair; unaffected models may remain serviceable. */
  error?: string
}
```

```ts type-equiv
/** One adapter-discovered model; catalog membership is advisory, not request validation. */
interface LlmModelInfo {
  /** Provider route that owns this model entry. */
  provider: string
  /** Model id passed to {@link GenerateOptions.model}. */
  id: string
  /** Human-readable model name for selectors. */
  name: string
  /** Optional user-facing distinction from otherwise similar models. */
  description?: string
  /** Accepted request modalities; absent means unknown, while an explicit omission is negative capability. */
  inputModalities?: readonly ModelModality[]
}
```

مقابل صحيح تأكيد صفة حساس شعور بيانات وصفية و مشاركة اعتبار دليل قسم فتح تحليل، و عودة خدمة هذا تأكيد قطع توجيه مهايئ كل. سياق سعة كمية، مهايئ استدعاء قيمة افتراضية، دفع إدارة خيار و توجيه النظام تحديث نمط مشترك استخدام نفس عدد تأكيد قطع نموذج نتيجة، مستهلك بسبب بينما بلا حاجة تكرار تنفيذ مرجعي نموذج تحليل.`SystemPromptUpdate` فقط لديه واحد قيمة `'in-history'`: نموذج يأخذ `messages` في مهمة معنى موضع الأكثر جديد `system` رسالة قراءة عمل كامل صالح توجيه النظام، لذلك agent loop يمكن يأخذ تغير بعد نص التوجيه إلحاق إلى قد ذاكرة مؤقتة تاريخ بعد، بينما لا هو تعديل كتابة رقم 0 بند رسالة ([قرار قاعدة](../../packages/core/agent-loop/README.ar.md#understand-the-implementation)) ؛ نمط ناقص يمثل فقط قراءة فتح رأس system رسالة،`normalizeModelInfo` بـ `INVALID_MODEL_INFO` رفض أي أخرى قيمة.

```ts type-equiv
/** Provider-owned context capacity for one exact provider/model route. */
interface LlmModelContext {
  /** Maximum combined request and response context in tokens. */
  contextWindow: number
}
```

دفع إدارة قوي درجة هو آخر بند إبرة مقابل تأكيد قطع توجيه قدرة. نواة قلب لـ معرف رمز إضافة صنف لوحة نوع، لكن لا قطعة رفع ذلك قيمة؛ لديه ترتيب تجميع دمج، عرض اسم و اختياري نشر قيمة افتراضية متساو من كل مهايئ يحتفظ.

```ts type-equiv
/** Adapter-owned identifier for one model's selectable reasoning effort. */
type ReasoningEffortId = Branded<'ReasoningEffortId'>
```

```ts type-equiv
/** Display metadata for one adapter-owned reasoning effort. */
interface LlmReasoningEffortInfo {
  /** Opaque stable value accepted by {@link GenerateOptions.reasoningEffort}. */
  id: ReasoningEffortId
  /** Human-readable effort name for selectors and diagnostics. */
  name: string
  /** Optional user-facing distinction from otherwise similar efforts. */
  description?: string
}
```

```ts type-equiv
/** Selectable reasoning efforts for one exact provider/model route. */
interface LlmModelReasoningInfo {
  /** Supported efforts in adapter-preferred display order. */
  efforts: readonly LlmReasoningEffortInfo[]
  /**
   * Adapter-configured default materialized into requests when callers omit
   * an effort. Absence preserves the provider's own default.
   */
  defaultEffort?: ReasoningEffortId
}
```

```ts type-equiv
/** Exact-route model metadata resolved by its owning adapter. */
interface LlmResolvedModelInfo extends LlmModelInfo {
  /** Provider-owned context capacity when known. */
  context?: LlmModelContext
  /** Adapter-configured per-request output cap materialized when callers omit one. */
  defaultMaxTokens?: number
  /** Adapter-owned selectable reasoning levels when exposed. */
  reasoning?: LlmModelReasoningInfo
  /** Declared mid-conversation system prompt handling; absent means only a leading system message is read. */
  systemPromptUpdate?: SystemPromptUpdate
}
```

```ts type-equiv
/** A single model request, fully assembled. */
interface GenerateOptions {
  /** Registered provider route selecting the adapter instance. */
  provider: string
  model: string
  /** Adapter-owned reasoning effort selected for this exact model. */
  reasoningEffort?: ReasoningEffortId
  /**
   * Ordered conversation messages, exactly as the provider sees them. A
   * loop-built request passes the derived history (dsh-agent-loop), whose
   * leading system-role message carries the system prompt; a hand-built
   * one-shot passes any list.
   */
  messages: Message[]
  /**
   * System prompt text for one-shot callers; adapters map it to the provider's
   * system slot ahead of `messages`. Loop-built requests leave it undefined.
   */
  system?: string
  /** Tool schemas (adapters map to the provider's `tools` field). */
  tools?: ToolSchema[]
  temperature?: number
  maxTokens?: number
  /**
   * Stop sequences: generation halts as soon as the model produces any one of
   * these strings (adapters map to the provider's stop field, e.g. OpenAI
   * `stop`). The stop string itself is not included in the output.
   */
  stop?: string[]
  signal?: AbortSignal
  /**
   * Session identity stamped by the loop for request routing. Replay uses it
   * to separate cursors; adapters may map it to model-hidden transport metadata.
   */
  sessionId?: Branded<'SessionId'>
  /**
   * Provider-neutral classification for an auxiliary model call. Adapters may
   * map the purpose to model-hidden transport metadata or purpose-specific
   * generation policy. Ordinary conversation requests leave it unset.
   */
  purpose?: 'compaction' | 'session-title'
}
```

نموذج استجابة لـ أي إيقاف من يمكن دمج توسيع سبب يمثل. مزود نهاية حالة فشل يحمل تدفق صيغة اتفاق [`LlmFailure`](#llmfailure):

```ts type-equiv
/**
 * Why a model response stopped.
 * Merge-extensible so adapters can surface provider-specific reasons.
 */
interface FinishReasonMap {
  'stop': { kind: 'stop' }
  'tool-calls': { kind: 'tool-calls' }
  'max-tokens': { kind: 'max-tokens' }
  'aborted': { kind: 'aborted'; failure: LlmFailure }
  'error': { kind: 'error'; failure: LlmFailure }
}
```

`FinishReason = FinishReasonMap[keyof FinishReasonMap]`.`TokenUsage`(تدريجي استدعاء حساب كمية، يحتوي لا متبادل تسليم ذاكرة مؤقتة حقل) تفصيل رؤية[تحت نص](#tokenusage).

`GenerateOptions.tools` يحمل `ToolSchema`——أداة JSON Schema وصف، إرسال إعطاء نموذج. هو إعلان في dsh-llm(بينما غير dsh-tools) في، صحيح هو لأن هو هو حلقة كل واحد خطوة تجميع طلب واحد جزء:

```ts type-equiv
/**
 * JSON-schema description of a tool, as sent to the model.
 *
 * Declared here (not in dsh-tools) because it is part of {@link GenerateOptions};
 * dsh-tools' ToolDefinition and dsh-system-prompt's PromptAssembly both import
 * it from this package.
 */
interface ToolSchema {
  name: string
  description: string
  /** JSON Schema object for the arguments. */
  parameters: Record<string, unknown>
}
```

موجه إلى نموذج `ToolSchema` هو بروتوكول نوع؛ إنتاج خروج هو قد تسجيل `ToolDefinition`(schema + `execute`) في [tools.md](tools.ar.md) في.

واجهة جارٍ بدء مسودة مزود حيث لا يوجد توجيه أيضا لا يوجد catalog، لذلك استفسار سؤال يتم مفرد وحيد وصف: طلب يحمل مستخدم جارٍ تحرير مسودة مسودة، عودة تكرار هو واجهة يمكن قبول مرشح، بينما لا هو هو يجب خدمة catalog.

```ts type-equiv
/**
 * One interrogation of a provider endpoint that configuration has not stored
 * yet. Configuration surfaces send the draft a user is still editing, so the
 * request carries the endpoint and credential directly instead of naming a
 * route: a provider being added has no route to name.
 */
interface LlmModelDiscoveryRequest {
  /**
   * Route the draft is editing, when it edits an existing one. A route whose
   * adapter already knows its models answers from that knowledge instead of
   * asking the endpoint — the adapter's own registry is the better answer, and
   * it costs no network call.
   */
  provider?: string
  /**
   * Endpoint to interrogate. Optional because a route the adapter already
   * describes needs none; a route it does not must supply one.
   */
  baseURL?: string
  /** Wire protocol the endpoint speaks, when the draft names one. */
  api?: string
  /** Credential for this interrogation alone; the harness never stores it. */
  apiKey?: string
}
```

```ts type-equiv
/**
 * One model an endpoint reports about itself. Every field but the id is
 * optional because most provider listings disclose an id and nothing else;
 * a surface adopting one of these still owes the capacities its adapter needs.
 */
interface LlmDiscoveredModel {
  /** Model id the endpoint accepts. */
  id: string
  /** Human-readable name when the endpoint supplies one. */
  name?: string
  /** Maximum combined request and response context, when disclosed. */
  contextWindow?: number
  /** Maximum output tokens, when disclosed. */
  maxTokens?: number
  /** Accepted input types when disclosed by the catalog or endpoint; absent means unknown. */
  inputModalities?: readonly ModelModality[]
}
```

### طلب معلومة غلاف:`LlmCallConfig` و سجل header

حلقة من قد سجل حالة بناء كل طلب.`EpochHeader` سجل استدعاء إعداد، علامة من مهايئ قيمة افتراضية توفير حقل، و عبر كامل `request/header` لقطة سجل مرجعي إرجاع أداة ترتيب (من `toolOrder` إعداد؛ لم إعداد وقت حسب حرف قاموس ترتيب). تصيير بعد نص التوجيه هو إرسال توليد تاريخ——surface رقم 0 رقم عقدة فوق `system/message`، إضافة فوق `in-history` توجيه إلحاق أي لاحق نظام عقدة——لذلك طلب رأس و إرسال توليد تاريخ مشترك نفس جعل طلب يمكن من جلسة سجل إعادة بناء. رؤية [session.md](session.ar.md#the-request-header-event-requestheader) و[يمكن إعادة بناء صفة Agent Note](../../.agents/notes/implemented/architecture/2026-07-05-reconstructable-requests.ar.md).

`agent/request` استقبال تجميد ربط استدعاء إعداد نوع فرعي، و يمكن إرجاع بديل قيمة بـ تبديل مزود، نموذج، دفع إدارة قوي درجة أو أخذ مثال معامل.waterfall(شلال نشر صيغة حدث) بدء قبل، حلقة سوف إزالة علامة لـ مهايئ قيمة افتراضية قيمة، جعل تأكيد قطع نموذج دقيق تجهيز مرور مسار ملء دخول الذي اختيار توجيه حالي قيمة؛ لم حمل علامة صريح ضبط ما زال إبقاء في رفع اقتراح في.waterfall انتهاء بعد، دقيق تجهيز مرور مسار سوف في جولة إشارة تحكم تحت رفض صريح إشارة تحديد لكن لا تلقي دعم حمل دفع إدارة قوي درجة ID(لا تلقائي ضبط كامل) ، و سجل توليد فاعلية إعداد و من مهايئ قيمة افتراضية توفير حقل. خطوة دقيق دخول وقت، هذا waterfall و دقيق تجهيز مرور مسار في تجميع و `step/start` بعد، توجيه النظام و قد وصل قبول مستخدم دفعة مرة إيداع قبل تشغيل؛ في مهمة واحد مرحلة مقطع إلغاء كل لن إيداع هذا اثنان من. قد دقيق تجهيز استدعاء قدرة قرار نص التوجيه تنسيق ضبط، استدعاء مباشر حتى قسم إرسال إتمام بداية نهاية يحتفظ نفس بند مهايئ تسجيل. وصول `llm/stream` طلب سوف يتم عميق درجة تجميد ربط، لذلك تغيير سوف رمي استثناء؛ طلب أيضا يحمل عملية محلي حلقة معرف، جعل مراقبة من لن يأخذ مفرد وحيد سجل تجميد ربط مساعد مساعدة استدعاء خطأ إقرار صار محادثة طلب.

في بروتوكول في، حلقة بناء طلب فقط لديه إرسال توليد تاريخ: تصيير بعد نص التوجيه بصفة فتح رأس `system` زاوية لون رسالة (surface رقم 0 رقم عقدة، أي واحد `system/message` حدث) نقل، و كما عند قد دقيق تجهيز استدعاء إعلان `systemPromptUpdate: 'in-history'` وقت، تغير بعد غير فارغ نص التوجيه يمكن بصفة لاحق `system` زاوية لون رسالة تتبع في قد ذاكرة مؤقتة تاريخ بعد، من نموذج قراءة عمل صالح نص التوجيه؛ طلب `system` حقل لا ضبط——`GenerateOptions.system` خدمة في عنوان مزود انتظار مباشر مفرد مرة استدعاء جهة. فارغ تصيير نص جعل إرسال توليد تاريخ لا يتضمن أي نظام رسالة، أي جعل أولا قبل طلب إبقاء كثير عدد نص التوجيه إصدار. قد سجل طلب سوف بـ الأكثر جديد `user/message`(جولة أول خطوة) أو فوق واحد خطوة أداة نتيجة (لاحق خطوة) ربط ذيل. تطوير ثابت صيغة إبرة مقابل كل حلقة بناء طلب دقيق إعادة حساب هذا انتظار صيغة، و رفض يحمل `system` حقل حلقة طلب.

FIXME(call-config-shape): إعادة مراجعة نظر ذلك بقية أي بعض حقل خروج في ذاكرة مؤقتة هدف تأكيد فعلي يخص epoch طبقة درجة (`model` و نموذج يحتفظ دفع إدارة قوي درجة قد واضح يخص؛ أخذ مثال علامة كمية هدف قبل خروج في حذر حذر إبقاء في هذا).

```ts type-equiv
/**
 * Provider, model, reasoning effort, and sampling scalars of one conversation's
 * requests. Every field maps 1:1 onto the same-named `GenerateOptions` field;
 * the loop builds requests from the logged header rather than accepting these
 * per call.
 */
interface LlmCallConfig {
  provider: string
  model: string
  reasoningEffort?: ReasoningEffortId
  temperature?: number
  maxTokens?: number
  stop?: string[]
}
```

```ts type-equiv
/**
 * Effective config fields supplied by exact-model adapter resolution rather
 * than by the caller's request proposal.
 */
interface LlmCallConfigAdapterDefaults {
  reasoningEffort?: true
  maxTokens?: true
}
```

## DeepSeek رسمي جهة طلب توسيع

`ctx.deepseekLlmApiExtensions` هو لأجل نحو `deepseek-official` طلب إضافة قمة طبقة حقل مزود خاص تحديد سجل التسجيل. مساهمة إضافة عبر `register(field, provider)` إقرار قيادة واحد حقل؛ مهايئ في تسلسل تحويل أساس أساس متن بعد استدعاء `prepare(request)`، و في HTTP قبل دمج إرجاع حقل. قد دقيق تجهيز `accept()` أمر خدمة سوف في 2xx بعد تشغيل، لذلك مساهمة جهة يمكن إيداع تسليم حالة، بينما لن يأخذ نقل فشل أو مزود رفض عند عمل قبول. دقيق تجهيز، اندفاع مفاجئ و قبول فشل سوف استخدام `REQUEST_EXTENSION`، و جعل نموذج طلب فشل.

[بروتوكول مشاركة اعتبار](../deepseek-llm-api-wire-extensions.ar.md) تعريف تأكيد قطع طلب علامة رأس، توسيع أمر خدمة، حقل إصدار و استقبال جهة معنى خدمة. مع مرفق تركيب سوف سوف [`dsh_session_log`](../../packages/session/session-log-deepseek/README.ar.md) تسجيل لـ بلا ضرر زيادة كمية مرجعي سجل بعد لاحقة، و سوف [`dsh_plugin_packages`](../../packages/llm/plugin-package-inventory-deepseek/README.ar.md) تسجيل لـ كامل تخزين نشط Loader حزمة تجميع دمج. هذه حقل ما زال يقع في نموذج رسالة خارج، أيضا لن دخول pi-ai مهايئ مسار.

## خدمة و مزود اتفاق

`LlmAdapter` هو مزود اتفاق: إنشاء فرعي صنف، تنفيذ `stream()`، مجددا استخدام `ctx.llm.registerAdapter(providers, adapter)` تسجيل واحد مهايئ نسخة.`GenerateOptions.provider` اختيار قد تسجيل مهايئ؛`GenerateOptions.model` سوف نقل إعطاء هذا مهايئ، بلا حاجة في دورة الحياة بدء وقت تسجيل. تكرار مزود توجيه سوف أصل فرعي فشل. اختياري `providerRetryPolicy()` سوف حسب توجيه التقاط و ملء دخول normal قيمة افتراضية،`providerInfo()` و مختلف خطوة `listModels()` طريقة فإن لـ `LlmRuntime.listProviders()` / `listModels()` توفير قسم مغادرة selector بيانات وصفية. هذا دليل فقط توفير مشاركة اعتبار، لا هو طلب أبيض اسم مفرد: مهايئ ما زال هو مرجعي، و يمكن قبول لم صف خروج نموذج id. مفرد مرة مختلف خطوة `resolveModel()` استعلام إرجاع تأكيد قطع نموذج هوية، و اختياري مقابل صحيح تأكيد صفة حساس شعور سياق سعة كمية، مهايئ إعداد `defaultMaxTokens`، من نموذج يحتفظ لديه ترتيب دفع إدارة قوي درجة ID و اختياري نشر قيمة افتراضية؛ حقل ناقص يمثل بيانات وصفية غير ممكن استخدام أو إبقاء مزود يحتفظ سلوك، بينما لا يمثل دليل عضو علاقة بلا فاعلية. محلل سوف استقبال اختياري إلغاء إشارة، و كما يجب في إشارة في توقف بعد سريع سرعة إتمام تسوية.`LlmRuntime.resolveModelInfo()` سوف تحقق تجمع دمج نتيجة و إرجاع قسم مغادرة قيمة. في نهائي مهايئ حد،`resolveCallConfig()` فقط في `maxTokens` ناقص وقت ملء دخول إخراج قيمة افتراضية، و تحقق و ملء دخول دفع إدارة قوي درجة، لذلك مباشر استدعاء أيضا لا يمكن التفاف مرور أي واحد بند قد إعداد سلوك؛ مباشر قسم إرسال سوف في انتظار تحليل قبل التقاط واحد بند مهايئ تسجيل.agent loop فإن استخدام `prepareCall()`، جعل نموذج تحليل، طلب رأس حمل دائم سجل و قسم إرسال كل مسار استخدام نفس بند تسجيل، إبقاء قدوم ذاتي نفس مرة استعلام قسم مغادرة سياق بيانات وصفية، و تقرير إبلاغ مهايئ ملء دخول إعداد حقل. مهايئ فحص بحث حدوث في `llm/stream` waterfall طرفية continuation، لذلك listener يمكن في فحص بحث قبل قصير مسار استدعاء، أو توجيه واحد متغير مرة صفة طلب.AgentLoop في خارج طبقة waterfall إرجاع تدفق جملة مقبض وقت مراقبة إلى مرة طلب محاولة تجربة؛ هذا عدد لديه حد حد لا يستطيع إثبات كسول صفة طرفية مهايئ قد بنية صنع إتمام أو بدء مزود I/O.`block-start` / `block-end` `index` صلة ربط و assembler مشترك نفس معنى طعم حال مهايئ فقط يحتاج emit صيغة صحيح تأكيد قسم قطعة——كتلة إعادة مجموعة لا هو كل مهايئ كل منها مشكلة.`ctx.llm.stream()` و `llm/stream` waterfall في واحد جولة في موضع رؤية [architecture.md](../architecture.ar.md#turn-flow).

```ts type-equiv
/** One model call whose config and adapter registration were resolved together. */
interface PreparedLlmCall {
  /** Detached, deep-frozen config with any adapter-owned default materialized. */
  readonly config: LlmCallConfig
  /** Immutable retry policy captured with the adapter registration. */
  readonly retryPolicy: ResolvedRetryPolicy
  /** Detached context metadata resolved with the registration-bound call. */
  readonly context?: LlmModelContext
  /** Exact model modalities captured with the adapter dispatch generation. */
  readonly inputModalities?: readonly ModelModality[]
  /** Exact model system prompt update mode captured with the adapter dispatch generation. */
  readonly systemPromptUpdate?: SystemPromptUpdate
  /** Config fields materialized by the captured adapter rather than proposed by the caller. */
  readonly adapterDefaults: LlmCallConfigAdapterDefaults
  /**
   * Dispatch this call once through the registration captured during
   * preparation. The request's call-config fields must match {@link config};
   * reuse or mismatch fails with `INVALID_PREPARED_CALL`.
   * @param options - fully assembled request carrying the prepared config.
   * @returns the chunk stream, including the `llm/stream` waterfall.
   */
  stream(options: GenerateOptions): AsyncIterable<StreamChunk>
}
```

```ts public-api
/**
 * Provider-wire adapter for the harness message and stream vocabulary. Register implementations
 * with `ctx.llm.registerAdapter(providers, adapter)`. Every provider HTTP request must include
 * `attributionHeaders()`; prove the headers are added in the wire request or library header hook. The direct-fetch
 * DeepSeek and library-backed pi-ai adapters meet this contract through different internals.
 */
declare abstract class LlmAdapter {
  /**
   * Describe one provider route owned by this adapter.
   * @param provider - a route passed to `registerAdapter()` for this instance.
   * @returns detached display metadata whose id must equal `provider`.
   */
  providerInfo(provider: string): LlmProviderInfo;
  /**
   * Return the provider-owned retry policy captured with this route.
   * @param _provider - a route passed to `registerAdapter()` for this instance.
   * @returns a resolved policy, or `undefined` to use the normal defaults.
   */
  providerRetryPolicy(_provider: string): ResolvedRetryPolicy | undefined;
  /**
   * Resolve provider-side request-image pricing for one exact model route.
   * The default declares none, so consumers fall back to their own neutral
   * estimate. Implementations must answer synchronously without I/O; the
   * token meter resolves this per measurement.
   * @param _provider - a route passed to `registerAdapter()` for this instance.
   * @param _model - exact model id passed to {@link GenerateOptions.model}.
   * @returns route-owned image pricing, or `undefined` when the route declares none.
   */
  imageRequestPricing(_provider: string, _model: string): LlmImageRequestPricing | undefined;
  /**
   * List models this adapter can currently advertise for one owned provider.
   * The result is advisory: an adapter may accept unlisted model ids, and
   * consumers must not turn absence into request rejection.
   * @param _provider - one provider route owned by this adapter.
   * @returns discoverable models in adapter-preferred order.
   */
  listModels(_provider: string): Promise<readonly LlmModelInfo[]>;
  /**
   * Resolve all metadata available for one exact model. This query is
   * independent of the advisory catalog and does not validate request routing.
   * @param provider - one provider route owned by this adapter.
   * @param model - exact model id passed to {@link GenerateOptions.model}.
   * @param _signal - cancellation for this exact-model lookup; asynchronous
   *   implementations must settle promptly after it aborts.
   * @returns provider/model identity plus any context, call-default, and reasoning metadata.
   */
  resolveModel(
    provider: string,
    model: string,
    _signal?: AbortSignal,
  ): Promise<LlmResolvedModelInfo>;
  /**
   * Bind exact model metadata and the eventual request dispatch to one adapter generation.
   * Dynamic adapters override this so settings changes between preparation and
   * dispatch cannot combine one generation's capabilities with another's endpoint.
   * @param provider - registered provider route.
   * @param model - exact model id.
   * @param signal - cancellation for model resolution.
   * @returns model metadata and a one-generation stream entry point.
   */
  async prepareCall(provider: string, model: string, signal?: AbortSignal): Promise<PreparedAdapterCall>;
  /**
   * Stream one model call as raw chunks. The only required method.
   * @param options - the fully-assembled request; implementations must honor `options.signal`.
   * @returns the chunk stream, obeying the adapter contract documented on `StreamChunk`.
   */
  abstract stream(options: GenerateOptions): AsyncIterable<StreamChunk>;
}
```

`ContentBlockType`(حمل `index` صلة ربط كتلة الذي يحمل مفتاح تجميع دمج) من فوق نص [`ContentBlockMap`](#content-blocks-and-messages) إرسال توليد.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxdeepseekllmapiextensions--deepseekllmapiextensionregistry"></a>

### `ctx.deepseekLlmApiExtensions` — `DeepSeekLlmApiExtensionRegistry`

Registry of independently owned top-level fields for official DeepSeek requests.

```ts cordis-catalog
/**
 * Register the sole provider of one top-level request field. Registration is effect-scoped.
 * @param field - declaration-merged field owned by the provider.
 * @param provider - request-time field preparation and optional acceptance behavior.
 * @returns disposer that releases the field.
 */
register<K extends keyof DeepSeekLlmApiExtensionMap>( field: K, provider: DeepSeekLlmApiExtensionProvider<DeepSeekLlmApiExtensionMap[K]>, ): () => Promise<void>

/**
 * Prepare every currently registered field from one immutable base request.
 * Preparation failures reject before HTTP dispatch. Field values are cloned and frozen;
 * providers retain no mutable alias to the outgoing request.
 * @param request - exact serialized request facts before extension fields.
 * @returns detached fields and their idempotent joint acceptance transaction.
 */
async prepare(request: DeepSeekLlmApiExtensionRequest): Promise<PreparedDeepSeekLlmApiExtensions>
```

Source: [`packages/llm/deepseek-llm-api-extensions/src/index.ts`](../../packages/llm/deepseek-llm-api-extensions/src/index.ts)

<a id="ctxllm--llmruntime"></a>

### `ctx.llm` — `LlmRuntime`

The abstract `llm` service: an adapter registry plus a streaming model-call API, interceptable via the `llm/stream` waterfall.

```ts cordis-catalog
/**
 * Register an adapter for the given provider routes. Throws `LlmError` with code
 * `DUPLICATE_ADAPTER` if any provider already has an adapter (all-or-nothing).
 * Disposed with the fiber.
 * @param providers - every provider route this adapter should serve.
 * @param adapter - the adapter that streams calls for those providers.
 * @returns the disposer, carrying {@link AdapterRegistrationHandle.replace}.
 */
registerAdapter(providers: string[], adapter: LlmAdapter): AdapterRegistrationHandle

/**
 * Describe provider routes with a registered adapter.
 * @returns detached provider metadata in registration order.
 */
@Remote listProviders(): LlmProviderInfo[]

/**
 * Declare provider routes an adapter plugin can activate through
 * configuration. Registration is all-or-nothing: an empty list, invalid
 * entry, or a provider already declared by any registration throws
 * `LlmError` without registering the rest. Disposed with the fiber.
 * @param entries - every configurable provider this plugin owns.
 * @returns a handle that withdraws all of them, and can atomically replace them.
 */
registerConfigurableProviders(entries: readonly LlmConfigurableProvider[]): DirectoryRegistrationHandle

/**
 * List every declared configurable provider, registered or dormant.
 * @returns detached directory entries in declaration order.
 */
@Remote listConfigurableProviders(): LlmConfigurableProvider[]

/**
 * Offer to interrogate provider endpoints on behalf of the settings
 * namespace this plugin owns. The namespace is the key because that is what
 * a configuration surface already holds from the configurable-provider
 * directory, and because a provider being *added* has no route to name yet.
 * Disposed with the fiber.
 * @param settingsNs - the namespace whose profiles this discovery serves.
 * @param discover - interrogates one endpoint and must honor the supplied signal.
 * @returns the disposer that withdraws the offer.
 */
registerModelDiscovery( settingsNs: string, discover: ( request: LlmModelDiscoveryRequest, signal?: AbortSignal, ) => Promise<readonly LlmDiscoveredModel[]>, ): () => void

/**
 * Interrogate one provider endpoint for the models it advertises. The
 * request describes a draft, not a stored route, so nothing here reads or
 * writes settings or credentials — the caller owns both, and the reply is
 * candidate metadata a surface may offer for adoption.
 * @param settingsNs - namespace whose registered discovery serves this draft.
 * @param request - the endpoint, protocol, and one-shot credential to use.
 * @param signal - caller cancellation.
 * @returns the advertised models, deduplicated in endpoint order.
 */
async discoverModels( settingsNs: string, request: LlmModelDiscoveryRequest, signal?: AbortSignal, ): Promise<LlmDiscoveredModel[]>

/**
 * Remote adapter for one draft provider interrogation.
 * @param settingsNs - namespace whose registered discovery serves this draft.
 * @param request - endpoint, protocol, and one-shot credential to use.
 * @param signal - caller cancellation supplied by the Remote carrier.
 * @returns advertised models in endpoint order.
 * @throws RemoteError with `llm/model-discovery-rejected` when discovery refuses or fails.
 */
@Remote('discoverModels') async remoteDiscoverModels( settingsNs: string, request: LlmModelDiscoveryRequest, signal: AbortSignal, ): Promise<LlmDiscoveredModel[]>

/**
 * Resolve the retry policy captured when one provider route was registered.
 * @param provider - registered provider route to inspect.
 * @returns the provider-owned policy, with normal defaults already resolved.
 */
providerRetryPolicy(provider: string): ResolvedRetryPolicy

/**
 * Resolve provider-side request-image pricing for one exact route, or
 * `undefined` when the provider is unregistered or declares none. Unknown
 * providers degrade to `undefined` rather than throwing because callers
 * price durable history whose route may no longer be mounted.
 * @param provider - provider route named by a request header.
 * @param model - exact model id named by the same header.
 * @returns the owning adapter's image pricing for the route, when declared.
 */
imageRequestPricing(provider: string, model: string): LlmImageRequestPricing | undefined

/**
 * Resolve the exact text one durable file occurrence contributes to every
 * provider request in the current execution environment.
 * @param ref - durable verbatim file reference from model history.
 * @returns the same deterministic handle text used at adapter dispatch.
 */
fileRequestText(ref: FileAttachmentRef): string

/**
 * Discover models advertised by one registered provider. Catalog membership
 * is advisory and never changes routing or request validation.
 * @param provider - registered provider route to inspect.
 * @returns detached model metadata in adapter-preferred order.
 */
async listModels(provider: string): Promise<LlmModelInfo[]>

/**
 * Resolve and validate all metadata from the adapter that owns one exact
 * route. The result is detached from adapter-owned objects; catalog
 * membership remains advisory and does not control request routing.
 * @param provider - registered provider route to inspect.
 * @param model - exact model id passed to the adapter.
 * @param signal - optional cancellation for adapter-owned asynchronous lookup.
 * @returns exact model identity plus available context and reasoning metadata.
 */
async resolveModelInfo( provider: string, model: string, signal?: AbortSignal, ): Promise<LlmResolvedModelInfo>

/**
 * Validate a conversation call config against its exact model capability and
 * materialize adapter-configured defaults. Unsupported explicit efforts
 * reject before provider I/O; no clamping or aliasing is performed. This
 * standalone query does not bind a later dispatch; use {@link prepareCall}
 * when logging and streaming must share one adapter registration.
 * @param config - provider/model route and optional request controls.
 * @param signal - optional cancellation for adapter-owned capability lookup.
 * @returns a detached config only when a default must be materialized.
 */
async resolveCallConfig(config: LlmCallConfig, signal?: AbortSignal): Promise<LlmCallConfig>

/**
 * Resolve one call under its current adapter registration. The returned
 * one-shot handle keeps that registration across header logging and dispatch,
 * so HMR cannot combine one adapter's capability result with another adapter.
 * @param config - provider/model route and optional request controls.
 * @param signal - optional cancellation for adapter-owned capability lookup.
 * @returns a prepared config and its registration-bound stream entry point.
 */
async prepareCall(config: LlmCallConfig, signal?: AbortSignal): Promise<PreparedLlmCall>

/**
 * Stream one model call as raw chunks (token-level deltas). Replay state is
 * retained only when the same adapter instance owns its historical provider
 * and the target provider. Final adapter selection remains fixed through
 * asynchronous exact-model resolution and dispatch. Adapter selection,
 * dispatch, and iteration failures become terminal `error` or `aborted`
 * finish chunks; middleware, nested-call, cleanup, and consumer failures
 * remain thrown.
 * @param options - the full request; `options.provider` selects the adapter.
 * @returns the chunk stream, possibly wrapped by `llm/stream` listeners.
 */
stream(options: GenerateOptions): AsyncIterable<StreamChunk>
```

Types: [FileAttachmentRef](attachment.ar.md)

Source: [`packages/llm/llm/src/index.ts`](../../packages/llm/llm/src/index.ts)

<a id="llm-events"></a>

### `llm/*` events

<a id="llmadapters-updated--emit"></a>

#### `llm/adapters-updated` — emit

The provider topology changed: an adapter registered or unregistered routes, or the configurable-provider directory gained or lost entries. This payload-free registry notification fires at each commit point (including registration disposal); consumers re-read `listProviders()`, `listModels()`, or `listConfigurableProviders()` for the new state. Observer failures are contained and cannot veto the registry mutation.

```ts cordis-catalog
/**
 * The provider topology changed: an adapter registered or unregistered
 * routes, or the configurable-provider directory gained or lost entries.
 * This payload-free registry notification fires at each commit point
 * (including registration disposal); consumers re-read `listProviders()`,
 * `listModels()`, or `listConfigurableProviders()` for the new state.
 * Observer failures are contained and cannot veto the registry mutation.
 * @mode emit
 */
'llm/adapters-updated'(): void
```

Source: [`packages/llm/llm/src/types.ts`](../../packages/llm/llm/src/types.ts)

<a id="llmstream--waterfall"></a>

#### `llm/stream` — waterfall

Waterfall around every streaming model call (retry, replay, routing). Bound to the LlmRuntime; call `next()` to reach the resolved adapter's stream, or yield your own chunks to short-circuit.

```ts cordis-catalog
/**
 * Waterfall around every streaming model call (retry, replay, routing).
 * Bound to the {@link LlmRuntime}; call `next()` to reach the resolved
 * adapter's stream, or yield your own chunks to short-circuit.
 * @param options - the full request. A LOOP-built request carries the
 *   process-local {@link markAgentLoopRequest} identity and arrives deep-frozen
 *   (mutation throws): its content is a pure function of the session log (the
 *   reconstructability Agent Note), so listeners read it, never rewrite it.
 *   Hand-built calls do not carry that marker; their messages already obey
 *   the immutable creation contract.
 * @mode waterfall
 */
'llm/stream'(this: LlmRuntime, options: GenerateOptions, next: () => AsyncIterable<StreamChunk>): AsyncIterable<StreamChunk>
```

Source: [`packages/llm/llm/src/index.ts`](../../packages/llm/llm/src/index.ts)
<!-- END GENERATED cordis-surface -->
