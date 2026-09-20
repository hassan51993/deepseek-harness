# بث LLM

[English](llm-streaming.md) | العربية

أنواعُ المحادثة والبث من [`packages/llm`](../../packages/llm/README.ar.md): أشكالُ `Message` و`ContentBlock` التي يتشاركها كلُّ طلب وكلُّ تاريخ دائم، وطلبُ النموذج المجمَّع كاملًا، وبروتوكولُ `StreamChunk` الخام، وعقدُ المهايئات الذي يجب أن ينفّذه كلُّ مهايئ، والمجمِّعُ المشترك. وتمسك [حزمُ النواة](core.ar.md) هذه القيمَ وتسجّلها في كل جولة؛ وتعلنها هذه الصفحة.

المصدر: [`packages/llm/llm/src/types.ts`](../../packages/llm/llm/src/types.ts)

<a id="content-blocks-and-messages"></a>

## كتل المحتوى والرسائل

المحادثةُ رسائلُ `Message`؛ والرسالةُ مصفوفةٌ من **كتل محتوى** منوَّعة. ويُشتق اتحادُ الكتل من `ContentBlockMap`.

المصدر: [`packages/llm/llm/src/types.ts`](../../packages/llm/llm/src/types.ts)

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

وواجهاتُ الكتل (وحقولُها كاملةً في المصدر): `TextBlock` (`text`)، و`ReasoningBlock` (التفكيرُ، وهو متمايز عن النص المرئي)، و`ImageBlock` ([مرفقُ صورة](attachment.ar.md) دائم)، و`FileBlock` ([مرفقُ ملف](attachment.ar.md) دائم حرفي يُسقطه تجميعُ الطلب إلى نص يستطيع كلُّ مسار معالجتَه)، و`ToolCallBlock` (`id: ToolCallId` و`name` و`arguments` بـJSON خام)، و`ToolResultBlock` (`toolCallId` و`content: ContentBlock[]` المتداخل و`isError?`). و`ContentBlock = ContentBlockMap[ContentBlockType]`. ولا تنتمي طريقةُ تمثيل جديدة إلى الخريطة القابلة للتوسعة بالدمج إلا حين تحترمها مساراتُ مهايئها وواجهتها وضغطها وإعادة تشغيلها الدائمة.

والوصولُ إلى الصور يخص تسلسلَ الطلب لا المرفقَ الدائم ولا نسخةَ صورة الطلب الحتمية. وتجمع `resolveImageAttachmentAccess()` بين مسار كائن المضيف الاختياري لدى مزوّد المرفقات وبين ربطٍ يقدّمه المستهلكُ لنظام ملفات تنفيذ الأدوات الحالي. والنتيجةُ متاحةٌ لذلك الطلب وحده ولا تشارك في `variantId`.

المصدر: [`packages/llm/llm/src/content.ts`](../../packages/llm/llm/src/content.ts)

```ts type-equiv
/** Execution-world path that model tools can use to read one normalized attachment. */
interface ImageAttachmentAccess {
  /** Absolute path to immutable normalized bytes; callers must treat it as read-only. */
  readonlyPath: string
}
```

المصدر: [`packages/llm/llm/src/message.ts`](../../packages/llm/llm/src/message.ts)

و`Message` قيمةُ دور ومصدر ومحتوى واحدة معرَّفة وغيرُ قابلة للتغيير. ورسائلُ المساعد التي ينتجها النموذج تسمّي المزوّدَ والنموذجَ اللذين أنتجاها وتحمل بياناتِ إعادة تشغيل خاصة بالمهايئ اختياريًا في مصدرها:

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

ومن أين أتت الرسالةُ نوعُ مجموع قابل للتوسعة بالدمج بنفسه:

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

وهويةُ المنتِج وصورةُ العرض مستقلتان. فـ`kind` تجيب *من أنتج هذا*؛ و`form` الاختيارية تجيب *أيُّ صنف من المعلومات هذا*، ويقرر المستهلكون كيف يعرضونه. وقد يتشارك منتِجون عدة صورةً واحدة، وقد يُصدر منتِجٌ واحد أكثرَ من صورة عبر جلسة. والقيمُ دلالية وتنمو واحدةً واحدة؛ والقيمةُ الغائبة أو غيرُ المعروفة تستعمل الافتراضَ الموثَّق وتُعرض محتوًى معتمًا:

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

## `StreamChunk` — البروتوكول الخام

تشابك الاستجابةُ المبثوثة كتلًا منوَّعة عدة (نصًّا واستدلالًا ونداءاتِ أدوات متعددة). ويربط `index` كلَّ فرق بكتلته؛ ويحمل `block-end` كتلةَ `ContentBlock` مجمَّعةً كاملةً فلا يضطر المستهلكون إلى إعادة تجميع الفروق بأنفسهم. وهو اتحادٌ مميَّز **مغلق** — فالتفريعُ بـ`switch` على `type` ينتهي بـ`assertNever`، فإضافةُ شكل تكسر الترجمةَ عند كل مستهلك يجب أن يعالجه.

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

## مجاري المساعد المضغوطة

يقرن `AssistantStreamAccumulator` كلَّ `StreamChunk` بختمه الزمني الصحيح الآمن الأصلي وينتج `AssistantStreamRecord[]`. وتصير فروقُ النص أو الاستدلال أو وسائط الأدوات المتتالية للكتلة نفسِها سجلًّا واحدًا بـ`time0` وبفجوات أختام زمنية بعينها وبمدخل مصفوفة واحد لكل فرق أصلي؛ وتبقى كلُّ قطعة أخرى سجلًّا خامًا موقوتًا. ويزيل هذا التمثيلُ مغلّفاتِ الأحداث المكررة بلا دمج حدود الرموز ولا إسقاط حقائق النهاية والاستعمال والكتل والإخفاق وإعادة التشغيل.

وتعيد `snapshot()` مجرًى منفصلًا غيرَ قابل للتغيير. وتفحص `expandAssistantStream()` بصرامة مفاتيحَ السجلات وأعدادَ الأعضاء والفهارسَ والأختامَ الزمنية وهويةَ نداء الأداة وسلامةَ JSON قبل أن تعيد إنشاءَ تسلسل القطع الموقوت بعينه. ويضمّن سجلُّ الجلسة هذا المجرى في `assistant/message` لنتيجة سطح أو في `assistant/attempt` لمحاولة بلا رسالة سطح.

وتحمل إطاراتُ `agent/assistant-stream` المحلية في العملية العرضَ الحي. وتظل إعادةُ التشغيل الدائمة والتحققُ عند الاستعادة يوسّعان الاستقرارَ المضمَّن؛ ويقرأ التتبعُ ومحاسبةُ الرموز وطيّاتُ المضيف السجلاتِ المضغوطة مباشرةً. وتجيب القرّاءُ على مستوى السجل (`assistantStreamFirstTokenTime` و`assistantStreamHasVisibleContent` و`assistantStreamHasVisibleText` و`lastAssistantStreamChunk` و`assistantStreamChunks` و`joinAssistantStreamText` و`assembleAssistantStream`، ومعها `runFirstTokenTime` و`runFirstVisibleTime` لكل تشغيل) عن أسئلة المستهلكين في مرور واحد على السجلات مع خروج مبكر، فيكلّف تاريخٌ كبير O(عدد السجلات) لكل استقرار بدل توسيع بـO(عدد الأعضاء) ([قرار الطي](../../.agents/notes/implemented/architecture/2026-09-06-embedded-stream-record-readers.ar.md)). وتبقى `expandAssistantStream()` مسارَ التحقق للسجلات المقروءة عند حدّ دائم وللمستهلكين الذين يحتاجون كلَّ عضو.

<a id="llmfailure"></a>

## `LlmFailure`

يُوحَّد كلُّ إخفاق مهايئ نهائي مرميّ أو داخل النطاق في حمولة واحدة قابلة للتسلسل محايدة تجاه المزوّدين. و`providerRetryAfterMs` تأخيرٌ موجب متحقَّق منه يطلبه المزوّد، لا قرارَ إعادة محاولة؛ و`ProviderRequestId` سلسلةٌ معتمة موسومة للتشخيص.

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

## تسعير صور الطلب

يعلن المهايئُ الذي يحاسب مزوّدُه على رموز بصرية لصور الطلب تسعيرًا لكل مسار بتجاوز `LlmAdapter.imageRequestPricing`، وتحلّه `ctx.llm.imageRequestPricing(provider, model)` متزامنةً للمستهلكين. ويحلّ مقياسُ الرموز تسعيرَ النموذج المسلوك في كل قياس، فتسعّر ضغوطُ الضغط والاحتفاظُ وانتقاءُ المدى تاريخَ الصور كما يرسله الطلبُ المسلوك فعلًا؛ ويسعّر مهايئُ DeepSeek كلَّ مناسبة محفوظة عند هدف طلبها لكل نموذج بالمحاسبة البصرية المنشورة، ويسعّر كلَّ مناسبة انتقاها قرارُ إزاحة صور مسجَّل بنص نائبها، بينما يبقى استعمالُ المزوّد المرساةَ المرجعية للطلبات المكتملة.

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

## عقد المهايئات

على كل مهايئ أن يلتزم هذه، ولكل مستهلك أن يعتمد عليها:

- **`usage` قبل `finish`، ولا شيءَ بعد `finish`.** أجّلهما إلى واسم نهاية المجرى لدى المزوّد فلا تستطيع قطعةٌ ذيلية مقتصرة على الاستعمال انتهاكَ الترتيب.
- **تبقى `arguments` في نداءات الأدوات سلاسلَ JSON خامة من الطرف إلى الطرف.** وتُبثّ الشظايا الجزئية عبر `argumentsDelta`؛ والمزوّدُ الذي يعيد كائناتٍ محلَّلة يعيد تسليسلَها عند `block-end`.
- **مساران للأخطاء مأذونان، ونوعُ `LlmFailure` واحد.** فقد **يرمي** الإخفاقُ من `stream()` (أخطاءُ النقل والبروتوكول)، **أو** ينهي المجرى بـ`finish {kind:'error'|'aborted', failure}` (أخطاءُ المزوّد داخل النطاق، للمهايئات التي لا تستطيع الرميَ في منتصف البث). ويحمل `LlmError.failure` قيمةَ `LlmFailure` نفسَها. وبعد أن يختار النداءُ مهايئَه، يحفظ المجرى كائنَ `Error` المرميّ بعينه ويربط حقائقَ ثابتة وسياسةَ إعادة المحاولة الثابتة للتسجيل الخادم بذلك النداء؛ وتودِع agent loop مجرى المحاولة بوصفه `assistant/attempt`، وتغلق الخطوةَ الفاشلة، وتعرض الخطأَ والحقائقَ وحقائقَ إعادات المحاولة السابقة الثابتة والسياسةَ الخادمة وإشارةَ الجولة على `agent/request-error`. ويعيد المستمعُ المعالِج `{ kind: 'retry' }` بعد إصلاحه المنتظَر؛ وبلا تعافٍ يصير الإخفاقُ المبنيَن خطأَ الجولة، ولا تُودَع رسالةُ مساعد على السطح ولا أثرٌ جانبي لأداة عن تلك المحاولة.
- **نداءُ مهايئ واحد محاولةُ مزوّد واحدة.** وتعطّل المهايئاتُ إعاداتِ المحاولة في المكتبات. ويفتح التعافي على مستوى الوكيل جولةً مرقَّمة دائمة أخرى؛ ويبقى مستدعو `ctx.llm.stream()` المباشرون بمحاولة واحدة.
- **توقفاتُ المزوّد محدودةٌ عند النقل.** ويكشف المهايئان البعيدان المشحونان كلاهما قيمةَ `streamIdleTimeoutMs` موجبة منتهية بافتراض خمس دقائق. ولا يتسلّح الحارسُ إلا ما دام `next()` في المكرِّر معلَّقًا، ويستعمل إشارةً ثابتة واحدة للطلب كلِّه، ويربط انقضاءَه بـ`TIMEOUT`، ويُبقي إجهاضَ المستدعي الأسبق `ABORTED`.
- **لطفح السياق رمزٌ معياري واحد.** ويصنّف مهايئا DeepSeek كلاهما تفصيلَ المزوّد الصريح عبر `isContextWindowExceededError()` ويُظهران `CONTEXT_WINDOW_EXCEEDED`، سواءٌ وصل الإخفاقُ خطأَ HTTP مرميًّا من نوع `LlmError` أم خطأَ نهاية داخل النطاق. ويوجّه المستهلكون على الرمز لا على نص المزوّد.
- **الإكمالُ الفارغ خطأٌ قابل لإعادة المحاولة لا نجاحٌ صامت.** ويربط المهايئان كلاهما نهايةَ `stop` نهائية لم تحمل كتلَ محتوى بـ`finish {kind:'error'}` بالرمز المعياري `EMPTY_RESPONSE`، وتعيد `dsh-llm-retry` المحاولةَ عليه افتراضيًا.
- **يحمل كلُّ طلب HTTP إلى مزوّد ترويسةَ نسبة التطبيق.** وترسل المهايئاتُ `attributionHeaders()` (أدناه) — وهي خطُّ أساس `User-Agent` — وتثبت ذلك باختبار على مستوى الشبكة.
- **حالةُ إعادة التشغيل يملكها المهايئ؛ وانقسامُها مشترك.** وقد يحمل `finish` ناجح قيمةَ `ReplayEnvelope`: وهي بياناتٌ وصفية معتمة على مستوى الاستجابة مع مداخل اختيارية لكل كتلة مصطفّة مع تسلسل الكتل المُصدر. والاصطفافُ مفرداتُ الحزام — فحين يُسقط التجميعُ كتلةً يُسقط المدخلَ عند الموضع نفسِه، فتصف البياناتُ الوصفية المخزَّنة دائمًا المحتوى المخزَّن. وتخزّن الحلقةُ المغلّفَ المشذَّب مع رسالة المساعد المجمَّعة. وفي طلب لاحق، لا يمرّر `LlmRuntime` الحالةَ إلا حين يكون المزوّدُ التاريخي والمزوّدُ الهدف مسجَّلَين حاليًا على نسخة المهايئ نفسِها بعينها. ويتحقق ذلك المهايئُ من الحالة ويملك أيَّ تحويل بين النماذج أو المزوّدين؛ ويتلقى سائرُ المهايئات المحتوى المحايد تجاه المزوّدين مع حقلَي المزوّد والنموذج بلا الحالة الخاصة. ويبقى المحتوى الدائم هو المرجع: فالحالةُ المخزَّنة التي لا يستطيع المهايئُ القارئ استعمالَها تخفّض تلك الرسالةَ وحدها إلى تحويل محايد تجاه المزوّدين مع تشخيص بدل إفشال الطلب.

## `ResolvedRetryPolicy`

يُحلّ ضبطُ إعادة المحاولة قبل تسجيل المسار إلى اتحاد مميَّز غير قابل للتغيير. فالوضعُ العادي يحمل `mode: 'normal'` و`maxRetries` منتهية و`retryableCodes` و`initialDelayMs` و`maxDelayMs` و`jitterRatio` المشترَطة؛ ووضعُ «دائمًا» يحمل `mode: 'always'` وحقولَ التراجع المشترَطة نفسَها بلا حدّ أقصى منتهٍ. وإغفالُ سياسة مزوّد يستعمل الافتراضَ العادي بخمس إعادات. وقد تحتفظ الإعداداتُ الطبقية بـ`maxRetries` أو `retryableCodes` الخاصتين بالوضع العادي بعد التحول إلى وضع «دائمًا»؛ ويتجاهل المحلِّلُ تلك الحقولَ الخاملة ويلتقط سياسةَ «دائمًا» الصرفة. وتعيد `LlmRuntime.providerRetryPolicy(provider)` القيمةَ المسجَّلة، وتعيد `llmRetryPolicyOf(stream)` القيمةَ الملتقَطة من التسجيل الخادم بعد أن يختاره النداء، فلا يستطيع التخلصُ من مسار لاحقًا أو استبدالُه تغييرَ سياسة تعافي إخفاق جارٍ. ويعدّد [دليل الضبط](../config-catalog.ar.md) المولَّد حقولَ المُدخَل الاختيارية.

## `AppIdentity` — نسبة التطبيق

هويةُ التطبيق العلنية الساكنة التي يرسلها كلُّ مهايئ إلى المزوّدين ([`packages/llm/llm/src/attribution.ts`](../../packages/llm/llm/src/attribution.ts)). وتربطها `attributionHeaders(identity?)` بترويسة `User-Agent` القياسية وحدها؛ أما ترويساتُ نسبة التطبيق الخاصة بـOpenRouter فغيرُ مدعومة في هذا العقد عمدًا. ويأخذ `APP_IDENTITY` الافتراضي إصدارَه من بيان الحزمة؛ وكلُّ حقل حقيقةُ منتَج علنية — فلا أسرارَ ولا مساراتٍ ولا معرّفاتِ جلسات ولا معرّفاتٍ لكل مستخدم، ولا يجوز أن يؤثر شيءٌ خاص بكل طلب في القيم. والمسوّغ: [نسبة `User-Agent` الإلزامية](../../.agents/notes/implemented/architecture/2026-06-21-mandatory-app-attribution-headers.ar.md).

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

محاسبةُ الرموز لكل نداء. والأعدادُ **متباينة**: فـ`inputTokens` مُدخَلٌ غيرُ مخزَّن فقط؛ ويُبلَّغ عن المُدخَل المخزَّن على حدة، والمُدخَلُ المحاسَب عليه مجموعُ الثلاثة. والمهايئاتُ التي يطوي مزوّدوها إصاباتِ المخزن في مجموع مطالبة واحد (مثل `prompt_tokens` في DeepSeek) تطرحها ثانيةً. و`totalTokens` الاختيارية مجموعٌ دقيق للمطالبة والخرج محفوظٌ من المزوّد أو معادُ بناؤه من عدّادات مجاميع مرجعية؛ وتُغفلها المهايئاتُ حين تكون غيرَ متاحة أو غيرَ متسقة. و`reasoningTokens`، حين توجد، تفصيلٌ إخباري مشمول سلفًا في `outputTokens`؛ ويجب ألّا تضيفه المجاميعُ ثانيةً.

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

`BlockAssembler` ([`packages/llm/llm/src/assembler.ts`](../../packages/llm/llm/src/assembler.ts)) هو التنفيذُ المشترك الوحيد الذي يطوي مجرى `StreamChunk` عائدًا إلى `ContentBlock` والاستعمالِ وسببِ النهاية وحالةِ إعادة التشغيل. وتسجّل الحلقةُ القطعَ الخام بينما تمرّر القطعَ نفسَها عبر مجمِّع، ثم تخزّن محتوى المساعد المجمَّع مع المزوّد والنموذج اللذين أنتجاه. ويستعمل هذا المستهلكُ الذي يحتاج إلى النتيجة المجمَّعة بلا إعادة تنفيذ الطي.

وقرارُ إبقاء أو إسقاط واحد يغطي المحتوى والبياناتِ الوصفية معًا: فنهايةُ `max-tokens` تُسقط كلَّ نداء أداة لأن النداءَ المبتور غيرُ آمن للتنفيذ، ويشذّب القرارُ نفسُه مدخلَ مغلّف إعادة التشغيل لكل كتلة عند كل موضع مُسقط. ولذلك لا تستطيع `blocks()` و`replayState` الاختلافَ، مهما أزال التجميع.

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

## طلب النموذج

نداءُ النموذج الواحد قيمةُ `GenerateOptions` مجمَّعة كاملةً. ويجيب المهايئُ بمجرى [`StreamChunk`](#streamchunk--the-raw-protocol) خام؛ ويجمّعه المستهلكُ بـ[`BlockAssembler`](#blockassembler).

المصدر: [`packages/llm/llm/src/types.ts`](../../packages/llm/llm/src/types.ts)

ويستعمل اكتشافُ المزوّدين والنماذج واصفاتٍ صغيرة محايدة تجاه المزوّدين. ودليلُ النماذج إرشادي: فيبقى التوجيهُ مفهرَسًا بمزوّد مسجَّل.

ويعيد تسجيلُ مهايئ مقبضًا: هو المُفكِّك، مع استبدال المسارات الذرّي الذي تحتاج إليه إضافةٌ مجموعةُ مساراتها قابلةٌ لضبط المستخدم.

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

وتعلن إضافاتُ المهايئات زيادةً على ذلك أيَّ المسارات *قد* تعمل عبر `registerConfigurableProviders()`، فتخاطب قسمَ إعدادات المستخدم لكل مسار، فتستطيع واجهاتُ الضبط عرضَ مزوّدين خاملين قبل تسجيل أي مسار.

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

وتُحلّ البياناتُ الوصفية الحساسة للصحة على حدة عن الدليل الإرشادي ويملكها المهايئُ الذي يخدم المسارَ بعينه. وتتشارك سعةُ السياق وافتراضاتُ نداء المهايئ وخياراتُ الاستدلال ووضعُ تحديث مطالبة النظام نتيجةَ نموذج بعينه واحدة فلا يكرّر المستهلكون حلَّ النموذج المرجعي. ولـ`SystemPromptUpdate` قيمةٌ واحدة هي `'in-history'`: فيقرأ النموذجُ أحدثَ رسالة `system` في أي موضع من `messages` بوصفها مطالبةَ النظام السارية كاملةً، فتستطيع agent loop إلحاقَ مطالبة متغيّرة بعد التاريخ المخزَّن بدل إعادة كتابة الرسالة صفر ([قاعدة القرار](../../packages/core/agent-loop/README.ar.md#understand-the-implementation))؛ والوضعُ الغائب يعني ألّا تُقرأ إلا رسالةُ نظام في الصدر، وترفض `normalizeModelInfo` أيَّ قيمة أخرى بـ`INVALID_MODEL_INFO`.

```ts type-equiv
/** Provider-owned context capacity for one exact provider/model route. */
interface LlmModelContext {
  /** Maximum combined request and response context in tokens. */
  contextWindow: number
}
```

وجهدُ الاستدلال قدرةُ مسار بعينه أخرى. وتَسِم النواةُ المعرّفاتِ لكنها لا تعدّد قيمَها؛ ويملك كلُّ مهايئ المجموعةَ المرتَّبة وأسماءَ العرض والافتراضَ الاختياري للنشر.

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

ولماذا توقفت استجابةُ النموذج سببٌ قابل للتوسعة بالدمج. وتحمل إخفاقاتُ المزوّد النهائية قيمةَ [`LlmFailure`](#llmfailure) من عقد البث:

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

و`FinishReason = FinishReasonMap[keyof FinishReasonMap]`. و`TokenUsage` (وهي محاسبةُ كل نداء بحقول مخزن متباينة) مفصَّلة [أدناه](#tokenusage).

ويحمل `GenerateOptions.tools` قيمةَ `ToolSchema` — وهي وصفُ الأداة بـJSON Schema كما يُرسل إلى النموذج. وهو معلَنٌ في dsh-llm (لا في dsh-tools) بالضبط لأنه جزءٌ من الطلب الذي تجمّعه الحلقةُ كلَّ خطوة:

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

و`ToolSchema` الذي يراه النموذجُ هو نوعُ الشبكة؛ أما `ToolDefinition` المسجَّل الذي ينتجه (وهو schema مع `execute`) فعلى [tools.md](tools.ar.md).

والمزوّدُ الذي ما زالت واجهةٌ تسوّده لا مسارَ له ولا دليل، فيُوصف الاستجوابُ على حدة: فيحمل الطلبُ المسوّدةَ التي يحرّرها المستخدم، ويكون الردُّ مرشحين قد تتبناهم واجهةٌ لا دليلًا عليها أن تخدمه.

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

### مغلّف الطلب: `LlmCallConfig` والترويسة المسجَّلة

تبني الحلقةُ كلَّ طلب من حالة مسجَّلة. ويسجّل `EpochHeader` ضبطَ النداء، ويعلّم الحقولَ التي قدّمتها افتراضاتُ المهايئ، ويسجّل ترتيبَ الأدوات المعاد المرجعي (المضبوطَ بـ`toolOrder`، أو المعجميَّ حين لا يُضبط) عبر لقطات `request/header` كاملة. والمطالبةُ المعروضة تاريخٌ مشتق — وهي `system/message` عند عقدة السطح صفر، مع أي عقدة نظام لاحقة أُلحقت على مسار `in-history` — فتجعل الترويسةُ والتاريخُ المشتق معًا الطلبَ قابلًا لإعادة البناء من سجل الجلسة. انظر [session.md](session.ar.md#the-request-header-event-requestheader) و[ملاحظة الوكيل عن قابلية إعادة البناء](../../.agents/notes/implemented/architecture/2026-07-05-reconstructable-requests.ar.md).

ويتلقى `agent/request` بذرةَ ضبط نداء مجمَّدة وقد يعيد بديلًا لتبديل المزوّد أو النموذج أو جهد الاستدلال أو المعاينة. وقبل الشلال، تزيل الحلقةُ القيمَ الموسومة بأنها افتراضاتُ مهايئ فيجسّد إعدادُ النموذج بعينه القيمَ الحالية للمسار المختار؛ وتبقى الإعداداتُ الصريحة غيرُ الموسومة في الاقتراح. وبعد الشلال، يرفض الإعدادُ معرّفاتِ جهد صريحة غيرَ مدعومة بلا قصّها ويسجّل الضبطَ الساري مع الحقول التي قدّمتها افتراضاتُ المهايئ تحت إشارة الجولة. وعند قبول الخطوة، يعمل هذا الشلالُ والإعدادُ بعد التجميع وبعد `step/start` وقبل إيداع مطالبة النظام ودفعةِ المستخدم المقبولة؛ والإلغاءُ أثناء أيٍّ منهما لا يودِع أيًّا منهما. وتحكم القدرةُ المُعَدّة توفيقَ المطالبة، ويُبقي النداءُ تسجيلَ مهايئ واحدًا عبر التوزيع. والطلباتُ التي تبلغ `llm/stream` مجمَّدةٌ عميقًا، فيرمي التغييرُ، وتحمل هويةَ حلقة محلية في العملية فلا يخلط المراقبون بين نداءات مساعدة مجمَّدة مسجَّلة على حدة وبين طلبات المحادثة.

وعلى الشبكة، الطلبُ الذي تبنيه الحلقةُ هو التاريخُ المشتق وحده: فتسافر المطالبةُ المعروضة رسالةً في صدرها بدور `system` (وهي عقدةُ السطح صفر، أي حدثُ `system/message`)، وحين يعلن النداءُ المُعَدّ `systemPromptUpdate: 'in-history'`، قد تتبع مطالبةٌ متغيّرة غيرُ فارغة التاريخَ المخزَّن رسالةً لاحقة بدور `system` يقرؤها النموذجُ مطالبةً سارية؛ وحقلُ `system` في الطلب غيرُ مضبوط — فـ`GenerateOptions.system` يخدم المستدعين المباشرين ذوي اللقطة الواحدة مثل مزوّدي العناوين. والعرضُ الفارغ لا يترك رسائلَ نظام في التاريخ المشتق، ولو احتفظت طلباتٌ أسبق بعدة إصدارات مطالبة. وينتهي الطلبُ المسجَّل بأحدث `user/message` في أول خطوة من جولة، وبنتائج أدوات الخطوة السابقة في الخطوات اللاحقة. وتعيد ثابتةُ التطوير حسابَ هذه المعادلة بعينها في مقابل كل طلب تبنيه الحلقةُ وترفض طلبَ حلقة يحمل حقلَ `system`.

FIXME(call-config-shape): revisit which remaining fields are genuinely epoch-level for cache purposes (`model` and the model-owned reasoning effort are explicit; the sampling scalars sit here out of caution).

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

## امتدادات طلبات DeepSeek الرسمية

`ctx.deepseekLlmApiExtensions` هو السجلُّ الخاص بالمزوّد للحقول العليا الإضافية في طلبات `deepseek-official`. وتستعمل إضافاتُ المساهمين `register(field, provider)` لتدّعي حقلًا واحدًا؛ وينادي المهايئُ `prepare(request)` بعد تسليسل جسمه الأساس ويدمج الحقولَ المعادة قبل HTTP. وتعمل معاملةُ `accept()` المُعَدّة بعد 2xx، فيستطيع مساهمٌ إيداعَ حالة تسليم بلا عدّ رفض نقل أو مزوّد قبولًا. وتستعمل إخفاقاتُ الإعداد والتصادم والقبول الرمزَ `REQUEST_EXTENSION` وتُفشل طلبَ النموذج.

ويعرّف [مرجع الشبكة](../deepseek-llm-api-wire-extensions.ar.md) ترويساتِ الطلب بعينها ومعاملةَ الامتداد وإصداراتِ الحقول وواجباتِ المتلقي. ويسجّل التركيبُ المشحون [`dsh_session_log`](../../packages/session/session-log-deepseek/README.ar.md) لاحقةَ سجل معياري تدريجية بلا فقد، و[`dsh_plugin_packages`](../../packages/llm/plugin-package-inventory-deepseek/README.ar.md) مجموعةَ الحزم النشطة الكاملة المسنَدة إلى المُحمِّل. ويبقى هذان الحقلان خارج رسائل النموذج ويغيبان عن مسار مهايئ pi-ai.

## عقود الخدمة والمزوّدين

`LlmAdapter` هو عقدُ المزوّد: اشتقّ منه، ونفّذ `stream()`، وسجّل نسخةَ مهايئ واحدة بـ`ctx.llm.registerAdapter(providers, adapter)`. ويختار `GenerateOptions.provider` المهايئَ المسجَّل؛ ويُمرَّر `GenerateOptions.model` إلى ذلك المهايئ ولا يلزم تسجيلُه عند بدء دورة الحياة. وتفشل مساراتُ المزوّدين المكررة ذرّيًّا. وتُلتقط `providerRetryPolicy()` الاختيارية لكل مسار بافتراضات عادية، بينما تغذي `providerInfo()` و`listModels()` اللاتزامنية دالتَي `LlmRuntime.listProviders()` و`listModels()` ببيانات مُنتقٍ وصفية منفصلة. وذلك الدليلُ إرشادي لا قائمةَ سماح للطلبات: فيبقى المهايئُ المرجعَ وقد يقبل معرّفاتِ نماذج غيرَ مدرَجة. ويعيد استعلامُ `resolveModel()` اللاتزامني الواحد هويةَ النموذج بعينها مع سعةِ سياق اختيارية حساسة للصحة، و`defaultMaxTokens` مضبوطة في المهايئ، ومعرّفاتِ استدلال مرتَّبة يملكها النموذج مع افتراض نشر اختياري؛ والحقولُ الغائبة تعني بياناتٍ وصفية غيرَ متاحة أو سلوكًا يملكه المزوّد، لا عضويةَ دليل غير صالحة. ويتلقى المحلِّلُ إلغاءً اختياريًا وعليه أن يستقر سريعًا بعد الإجهاض. وتتحقق `LlmRuntime.resolveModelInfo()` من المجموع وتفصله. وعند حدّ المهايئ النهائي، لا تجسّد `resolveCallConfig()` افتراضَ الخرج إلا حين تغيب `maxTokens`، وتتحقق من الاستدلال وتجسّده، فلا تستطيع النداءاتُ المباشرة تجاوزَ أيٍّ من السلوكين المضبوطين؛ ويلتقط التوزيعُ المباشر تسجيلًا واحدًا قبل انتظار ذلك الحلّ. وتستعمل agent loop بدلًا من ذلك `prepareCall()` لتُبقي التسجيلَ نفسَه عبر حلّ النموذج وتسجيلِ الترويسة الدائم والتوزيع، ولتحتفظ ببيانات سياق منفصلة من ذلك البحث بعينه، ولتبلّغ عن أيِّ حقول ضبط جعلها المهايئُ افتراضية. ويقع البحثُ عن المهايئ عند المتابعة النهائية لشلال `llm/stream`، فيستطيع مستمعٌ قطعَ النداء أو توجيهَ طلب ذي لقطة واحدة قابل للتغيير قبل البحث. وترصد AgentLoop محاولةَ طلب حالما يعيد الشلالُ الخارجي مقبضَ مجرى؛ وذلك الحدُّ المحدود لا يثبت أن مهايئًا نهائيًّا كسولًا أُنشئ ولا أنه بدأ إدخالًا وإخراجًا مع المزوّد. ويعني ارتباطُ `index` بين `block-start` و`block-end` مع المجمِّع أن على المهايئ إصدارَ قطع سليمة البنية وحدها — فإعادةُ تجميع الكتل ليست مشكلةَ كل مهايئ. وتبيّن [architecture.md](../architecture.ar.md#turn-flow) أين يقع `ctx.llm.stream()` وشلالُ `llm/stream` في جولة واحدة.

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

و`ContentBlockType` (وهي مجموعةُ المفاتيح التي تحملها الكتلُ المرتبطة بـ`index`) مشتقةٌ من [`ContentBlockMap`](#content-blocks-and-messages) أعلاه.

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
