# ملاحظات على الرسائل

[English](feedback.md) | العربية

تملك [`@deepseek-ai/dsh-message-feedback`](../../packages/feedback/message-feedback) ملاحظاتٍ قابلة للتحرير على رسائل المساعد المفردة. ويخزّن سجلُّ الجلسة المعياري حدثَي `feedback/message-put` و`feedback/message-delete`؛ وتبقى الملاحظةُ غيرُ القابلة للتغيير على مستوى الجلسة حدثَ `feedback/record`، وتملكها [`@deepseek-ai/dsh-command-feedback`](../../packages/feedback/command-feedback) مع تصنيف `FeedbackCategory` الذي يُصنَّف تحته نوعا الملاحظات. والثلاثةُ أحداثٌ للسجل فقط ولا تدخل سياقَ النموذج قط.

المصدر: [`packages/feedback/message-feedback/src/types.ts`](../../packages/feedback/message-feedback/src/types.ts)

## الأنواع العلنية

```ts type-equiv
/** Opaque compare-and-set token for one exact feedback item revision. */
type MessageFeedbackVersion = Branded<'MessageFeedbackVersion'>
```

```ts type-equiv
/** The human's overall judgment of one assistant message. */
type MessageFeedbackRating = 'positive' | 'negative'
```

```ts type-equiv
/** One current feedback value and its opaque mutation token. */
interface MessageFeedbackItem {
  /** Stable identity of the assistant message inside the owning Session. */
  readonly messageId: MessageId
  /** Overall positive or negative judgment. */
  readonly rating: MessageFeedbackRating
  /** Optional explanation, preserved verbatim after validation. */
  readonly note?: string
  /** Category the human filed the judgment under. */
  readonly category?: FeedbackCategory
  /** Equality-only token replaced by every material create or update. */
  readonly version: MessageFeedbackVersion
  /** Host-assigned creation time in Unix epoch milliseconds. */
  readonly createdAt: number
  /** Host-assigned time of the most recent material update. */
  readonly updatedAt: number
}
```

```ts type-equiv
/** A material creation or edit, retaining its complete current value. */
interface MessageFeedbackPut {
  /** Owning Session; inherited feedback in a fork belongs to its parent. */
  readonly sessionId: SessionId
  /** Value after this mutation, including the original creation time. */
  readonly item: MessageFeedbackItem
}
```

```ts type-equiv
/** A material deletion of one current feedback item. */
interface MessageFeedbackDelete {
  /** Session that owns the deleted feedback. */
  readonly sessionId: SessionId
  /** Message whose feedback was removed. */
  readonly messageId: MessageId
}
```

```ts type-equiv
/** Read all message feedback belonging to one persisted Session lifecycle. */
interface MessageFeedbackListRequest {
  /** Session whose feedback events should be read. */
  readonly sessionId: SessionId
}
```

```ts type-equiv
/** Current feedback values for one Session, in first-creation order. */
interface MessageFeedbackListValue {
  /** Fresh immutable item snapshots. */
  readonly items: readonly MessageFeedbackItem[]
}
```

```ts type-equiv
/** Create or replace feedback for one assistant message. */
interface MessageFeedbackPutRequest {
  /** Persisted Session that owns the target message. */
  readonly sessionId: SessionId
  /** Target assistant-message identity. */
  readonly messageId: MessageId
  /** Desired overall judgment. */
  readonly rating: MessageFeedbackRating
  /** Optional non-blank explanation. */
  readonly note?: string
  /** Optional category; absent keeps the item uncategorized. */
  readonly category?: FeedbackCategory
  /** Observed item version, or `null` to require that no item exists. */
  readonly ifVersion: MessageFeedbackVersion | null
}
```

```ts type-equiv
/** Delete feedback for one message after observing its current version. */
interface MessageFeedbackDeleteRequest {
  /** Session that owns the feedback. */
  readonly sessionId: SessionId
  /** Message whose feedback should be absent after this operation. */
  readonly messageId: MessageId
  /** Observed item version; ignored when the item is already absent. */
  readonly ifVersion: MessageFeedbackVersion
}
```

```ts type-equiv
/** Idempotent deletion acknowledgement. */
interface MessageFeedbackDeleteValue {
  /** Stable postcondition shared by the first deletion and every retry. */
  readonly absent: true
}
```

```ts type-equiv
/** No persisted Session header exists for the requested id. */
interface MessageFeedbackSessionNotFound {
  readonly code: 'session-not-found'
  readonly sessionId: SessionId
}
```

```ts type-equiv
/** The id does not name a derived, append-origin assistant message. */
interface MessageFeedbackTargetNotFound {
  readonly code: 'target-not-found'
  readonly sessionId: SessionId
  readonly messageId: MessageId
}
```

```ts type-equiv
/** A material mutation did not match the addressed item's current version. */
interface MessageFeedbackVersionConflict {
  readonly code: 'version-conflict'
  /** Authoritative current item, or `null` when it does not exist. */
  readonly current: MessageFeedbackItem | null
}
```

```ts type-equiv
/** A supplied note contains no non-whitespace character. */
interface MessageFeedbackNoteBlank {
  readonly code: 'note-blank'
}
```

```ts type-equiv
/** A supplied note exceeds the configured UTF-8 byte limit. */
interface MessageFeedbackNoteTooLarge {
  readonly code: 'note-too-large'
  readonly maxBytes: number
  readonly actualBytes: number
}
```

```ts type-equiv
/** Failures shared by the public message-feedback operations. */
type MessageFeedbackFailure =
  | MessageFeedbackSessionNotFound
  | MessageFeedbackTargetNotFound
  | MessageFeedbackVersionConflict
  | MessageFeedbackNoteBlank
  | MessageFeedbackNoteTooLarge
```

```ts type-equiv
/** Successful public operation result. */
interface MessageFeedbackSuccess<T> {
  readonly ok: true
  readonly value: T
}
```

```ts type-equiv
/** Rejected public operation result with a stable business failure. */
interface MessageFeedbackRejected<E extends MessageFeedbackFailure> {
  readonly ok: false
  readonly error: E
}
```

```ts type-equiv
/** Result returned by the message-feedback `list` operation. */
type MessageFeedbackListResult =
  | MessageFeedbackSuccess<MessageFeedbackListValue>
  | MessageFeedbackRejected<MessageFeedbackSessionNotFound>
```

```ts type-equiv
/** Result returned by the message-feedback `put` operation. */
type MessageFeedbackPutResult =
  | MessageFeedbackSuccess<MessageFeedbackItem>
  | MessageFeedbackRejected<
    | MessageFeedbackSessionNotFound
    | MessageFeedbackTargetNotFound
    | MessageFeedbackVersionConflict
    | MessageFeedbackNoteBlank
    | MessageFeedbackNoteTooLarge
  >
```

```ts type-equiv
/** Result returned by the message-feedback `delete` operation. */
type MessageFeedbackDeleteResult =
  | MessageFeedbackSuccess<MessageFeedbackDeleteValue>
  | MessageFeedbackRejected<MessageFeedbackSessionNotFound | MessageFeedbackVersionConflict>
```

## أنواع ملاحظات الجلسة

المصدر: [`packages/feedback/command-feedback/src/types.ts`](../../packages/feedback/command-feedback/src/types.ts)

```ts type-equiv
/** One of the fixed feedback categories; the ids are durable log vocabulary. */
type FeedbackCategory =
  | 'task-result'
  | 'instruction-following'
  | 'product-interaction'
  | 'service-stability'
  | 'resource-cost'
  | 'security-privacy-permission'
  | 'other'
```

```ts type-equiv
/**
 * One recorded human remark about a Session. Both members are optional: a
 * submission with neither still records that the human asked for the
 * Session to be reviewed, which is what authorizes log delivery.
 */
interface FeedbackRecord {
  /** Free-text remark with surrounding whitespace removed; never empty when present. */
  readonly text?: string
  /** Category the human filed the remark under. */
  readonly category?: FeedbackCategory
}
```

```ts type-equiv
/** Record one Session-level remark through the Host Remote. */
interface SessionFeedbackRecordRequest {
  /** Live Session the remark describes. */
  readonly sessionId: SessionId
  /** Free-text remark; blank text is recorded as absent. */
  readonly text?: string
  /** Category the human filed the remark under. */
  readonly category?: FeedbackCategory
}
```

```ts type-equiv
/** Stable postcondition of a recorded remark. */
interface SessionFeedbackRecordValue {
  /** The remark is appended to the Session log; flushing follows the Session's own schedule. */
  readonly recorded: true
}
```

```ts type-equiv
/** No live Session carries the requested id. */
interface SessionFeedbackSessionNotFound {
  readonly code: 'session-not-found'
  readonly sessionId: SessionId
}
```

```ts type-equiv
/** Result returned by the `sessionFeedback.record` operation. */
type SessionFeedbackRecordResult =
  | { readonly ok: true; readonly value: SessionFeedbackRecordValue }
  | { readonly ok: false; readonly error: SessionFeedbackSessionNotFound }
```

## البيانات والتزامن

تُطوى البنودُ الحالية من أحداث الملاحظات المعيارية التي يطابق `sessionId` في حمولتها الجلسةَ المالكة. ويحمل كلُّ بند تقييمًا موجبًا أو سالبًا، وملاحظةً اختيارية، وفئةً اختيارية، وختمَي `createdAt` و`updatedAt` اللذين يخصصهما المضيف، وإصدارَه المعتم. وتُقارن الإصداراتُ بالتساوي وحده وفي مقابل الرسالة المخاطَبة وحدها؛ ولا يرتّبها المستدعون ولا يصطنعونها.

ويستعمل `put` تزامنًا تفاؤليًّا صارمًا: فعلى كل طلب لبند قائم أن يطابق `ifVersion` الحالي، ولو كان بلا أثر (أي `put` يكرّر التقييمَ والملاحظةَ والفئةَ المخزَّنة). ويعيد التعارضُ البندَ المرجعي الحالي (أو `null`)، فيستطيع المستدعي التوفيقَ بعد استجابة ضائعة أو تحرير متزامن بلا قراءة أخرى. وحذفُ بند غائب سلفًا ينجح. ويسلسل طابورٌ لكل جلسة القراءاتِ والتغييرات؛ وتمسك التغييراتُ الباردة مقبضَ كتابة حفظ دائم عبر القراءة والمقارنة والإلحاق والدفع. والعملياتُ المطابِقة بلا أثر لا تُلحق حدثًا.

## سلطة الهدف ودورة الحياة

يقدّم السجلُّ في ذاكرة المالك الحي مراقبةَ الجلسة الهدف مباشرةً؛ وتستعمل القراءاتُ الباردة مقبضَ `SessionPersistence.open(id, 'read')`، بينما تستعمل التغييراتُ مقبضَ كتابة. ولا ينشئ أيُّ من المسارين جلسةً ولا وكيلًا. ويصنّف تمهيدُ `stat(id)` الغيابَ المؤكد؛ وفشلُ القراءة لجلسة تأكد `stat` لها ينتشر فشلَ بنية. ولا يقبل `put` إلا رسالةَ `assistant/message` غيرَ فارغة ومنشأَها الإلحاقُ وتحمل `MessageId` المطلوب؛ أما السجلاتُ التي منشؤها الاستبدالُ، والفارغةُ التي لا تحمل إلا الاستعمال، وغيرُ رسائل المساعد فليست أهدافَ ملاحظات.

وقد تحتوي بذورُ التفريع أحداثَ ملاحظات الأب، لكن حمولتَها تحتفظ بـ`sessionId` الأب، فلا تصير ملاحظاتٍ حاليةً للابن. وحذفُ بند يُلحق شاهدةً؛ وتبقى التقييماتُ والملاحظاتُ الأسبق في السجل.

## عقد الحفظ الدائم وRemote

تنتظر تغييراتُ ملاحظات الرسائل الناجحةُ الحفظَ الدائم المعياري: فالعملياتُ الحية تُلحق عبر الجلسة المالكة وتشترط مستمعَ `ctx.sessions.flush` مشاركًا؛ والعملياتُ الباردة تُلحق وتدفع عبر مقبض كتابتها. وتنتشر إخفاقاتُ الحفظ الدائم بدل التبليغ عن نجاح. و`maxNoteBytes` مشترَطة وتحدّ نصَّ الملاحظة ببايتات UTF-8؛ ويضبطها تركيبُ مضيف Web على `8192`. وتنشر الحزمةُ عقدَ Remote الأحادي للمضيف `messageFeedback.list` و`messageFeedback.put` و`messageFeedback.delete` عبر `TypertRemoteService` و`@Remote`؛ وتنشر `command-feedback` الدالةَ `sessionFeedback.record` بالطريقة نفسِها لملاحظات مستوى الجلسة على الجلسات الحية. وواجهةُ Cordis البرمجية المولَّدة أدناه هي المرجعُ على مستوى الطرائق.

ويغلق التخلصُ من الإضافة قبولَ العمليات ويصرّف عملَ طوابير الجلسات المقبول.

وتحمل [`session-log-deepseek`](../../packages/session/session-log-deepseek/README.ar.md) افتراضيًا الملاحظاتِ جزءًا من لاحقة `dsh_session_log` المعتادة في طلبات DeepSeek المؤهَّلة التالية؛ ويعطّلها التركيبُ بـ`enabled: false`. وتسجيلُ ملاحظة لا يطلق طلبَ LLM ولا رفعَ `dsh_feedback` منفصلًا. أما المساراتُ غيرُ DeepSeek، فتستطيع [خلفيةُ OTel](../../packages/session/session-telemetry-otel/README.ar.md) تحريرَ البادئة المعيارية عبر ملاحظات مسجَّلة. ويؤكد إقرارُ الأمر التسجيلَ ويحدد الجلسةَ والمستخدمَ المجهول؛ ولا يبلّغ عن سياسة التتبع ولا عن التسليم.

## واجهة Web

[`@deepseek-ai/dsh-client-ui-message-feedback`](../../packages/client/ui-message-feedback) هي مستهلكُ المتصفح. وتركّب `@deepseek-ai/dsh-api-remotes` إسهامَي `messageFeedback` و`sessionFeedback` المولَّدين، فتنادي الإضافةُ `ctx.remote.messageFeedback` و`ctx.remote.sessionFeedback` ولا تمسّ النقلَ قط.

والضوابطُ هي مدخلُ `feedback` (بالترتيب 10) في خانة القائمة `conversation.chat.assistant-actions` التي تصرّح بها `ui-conversation` وتعرضها داخل صف IconActions لرسالة المساعد النهائية. وتحمل `AssistantMessageNode` قيمةَ `messageId` الاختيارية من حدث `assistant/message`. والحقلُ غائبٌ في الأجزاء المجمَّدة بالمقاطعة، ويتخطى موضعُ العرض الخانةَ عند غيابه. ويُعرض الشريطُ مرةً واحدة لكل جولة، على رسالة المساعد الختامية: فالمضيفُ يقبل كلَّ رسالة خطوة منشؤها الإلحاق هدفًا، لكن الخطواتِ الأسبق في جولة متعددة الخطوات تعرض صفوفَ أدوات لا متنًا قابلًا للتقييم، فتكشف الواجهةُ مجموعةً أضيق مما يسمح به عقدُ المضيف.

ويسند `MessageFeedbackController` واحدٌ لكل جلسة كلَّ ضابط رسالة في تلك الجلسة: فقراءةُ `list` واحدة تبذر النصَّ كلَّه، وتؤجَّل إلى أول تحويم أو تركيز بدل إطلاقها عند التركيب. ويرسل كلُّ تغيير الإصدارَ الذي رصده ذلك المتحكم آخرَ مرة بوصفه `ifVersion`؛ وتحمل استجابةُ `version-conflict` البندَ المرجعي، فيوفّق المتحكمُ من الاستجابة بدل إعادة الجلب. وتُسلسَل التغييراتُ لكل جلسة فتقارن العمليةُ المصطفّة في مقابل الإصدار المودَع. وتعيد عمليةُ `retract` المحقونة فحصَ التقييم المودَع داخل ذلك الطابور وتصير بلا أثر بعد تغيير متزامن، فلا تستطيع واجهةٌ قديمة تجاوزَ الحوار بتسجيل تقييم مجرد. و`connection/reset` لا يحدّث إلا الجلساتِ المقروءة سلفًا.

وأيُّ تقييم غير مسجَّل يفتح حوارَ ملاحظات الجلسة، وهو مدخلُ `feedback-dialog` في `conversation.input.overlay`: بطاقةُ Modal المشتركة بسبع رقاقات فئات وصندوق تفصيل. ويضع الإرسالُ الحكمَ المختار حاملًا الفئةَ المختارة والوصفَ المشذَّب، أو لا يحمل أيًّا منهما؛ وينجح فيغلق الحوارَ ويعرض إشعارَ الإقرار، بينما يُبقي الفشلُ الحوارَ والمسوّدة مفتوحين ويعرض إشعارَ تحذير. ويُفتح الحوارُ نفسُه للجلسة من `/feedback` مجردًا — وهو زخرفةٌ توجّهها `ui-commands` بوصفها `action` — ثم يسجّل عبر `sessionFeedback.record`؛ ويُبقي `/feedback <text>` مسارَ أمر المضيف. والنقرُ على تقييم مسجَّل يسحبه بلا فتح الحوار.

## الحدود والقيود

- طابورُ العمليات محليٌّ في العملية؛ ويعتمد استبعادُ الكاتب البارد على مزوّد الحفظ الدائم المختار.
- يزيل الحذفُ البندَ الحالي، لا نصَّ الملاحظات الأسبق من السجل ذي الإلحاق فقط ولا لاحقةً سُلّمت سلفًا.
- قد يتلقى طلبٌ في الفترة الضيقة بعد الانفصال الحي وقبل أن يجسّد دليلُ الحفظ الدائم الترويسةَ الردَّ `session-not-found`؛ ويعيد المستدعون المحاولةَ بعد تجسيد التقاعد.
- تقرأ الطلباتُ الباردة السجلَّ كاملًا؛ ولا سقفَ للخدمة على عدد البنود ولا على مجموع البايتات. و`maxNoteBytes` لا تحدّ إلا كلَّ ملاحظة.
- لا يسجّل عقدُ المضيف فاعلًا موثَّقًا ولا هويةَ تدقيق، ولذلك يفترض حدَّ مستدعٍ موثوقًا.
- لا تظهر ضوابطُ Web إلا في عرض المحادثة. ولا يعرض عرضُ المسار ولا عرضُ الشلال مدخلَ ملاحظات مع أن عقدَ المساعد فيهما تحمل `messageId` نفسَه.
- لا يستهلك متحكمُ Web أحداثَ سجل الملاحظات، فيصير تقييمُ لسان ثانٍ مرئيًّا عند إعادة الاتصال أو عند استجابة التعارض التالية لا فورًا.
- لا يفحص الحوارُ `maxNoteBytes` مسبقًا؛ فالوصفُ المفرطُ الطول لرسالة يفشل عند الإرسال بـ`note-too-large` لا أثناء الكتابة. ولا حدَّ لحجم ملاحظة الجلسة، إذ لم يكن لأمر `/feedback` حدٌّ قط.
- لا تخدم `sessionFeedback.record` إلا الجلساتِ الحية وتجيب بـ`session-not-found` فيما عداها؛ ويبلّغ الحوارُ عن ذلك الفشل حين تتقاعد جلستُه وهو مفتوح.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxmessagefeedback--messagefeedbackservice"></a>

### `ctx.messageFeedback` — `MessageFeedbackService`

Session-log service; cold operations never construct a Session or Agent.

```ts cordis-catalog
/**
 * Read current feedback from the canonical log.
 * @param request - Session to inspect.
 * @returns immutable items or a definite persistence miss.
 */
@Remote('list') list(request: MessageFeedbackListRequest): Promise<MessageFeedbackListResult>

/**
 * Create or replace feedback after checking its current version.
 * Matching no-ops retain the version and append no event.
 * @param request - Target, desired value, and observed item version.
 * @returns the durable item or an explicit business failure.
 */
@Remote('put') put(request: MessageFeedbackPutRequest): Promise<MessageFeedbackPutResult>

/**
 * Delete one item after checking its version; absence succeeds without an event.
 * @param request - Session, message, and observed item version.
 * @returns the stable absent postcondition or an explicit failure.
 */
@Remote('delete') delete(request: MessageFeedbackDeleteRequest): Promise<MessageFeedbackDeleteResult>
```

Source: [`packages/feedback/message-feedback/src/index.ts`](../../packages/feedback/message-feedback/src/index.ts)

<a id="ctxsessionfeedback--sessionfeedbackservice"></a>

### `ctx.sessionFeedback` — `SessionFeedbackService`

Host Remote through which a product surface records a Session-level remark.

```ts cordis-catalog
/**
 * Record one remark on a live Session.
 * @param request - target Session plus the optional text and category.
 * @returns the recorded postcondition, or `session-not-found` when no live
 * Session carries the id.
 */
@Remote('record') record(request: SessionFeedbackRecordRequest): Promise<SessionFeedbackRecordResult>
```

Source: [`packages/feedback/command-feedback/src/index.ts`](../../packages/feedback/command-feedback/src/index.ts)

<a id="feedback-events"></a>

### `feedback/*` events

<a id="feedbackcommitted--parallel"></a>

#### `feedback/committed` — parallel

Observe a durable cold feedback mutation without publishing a live Session. Observers run before write ownership is released and must not await another message-feedback operation for this Session. The payload is borrowed read-only; deep-clone it before transferring ownership (for example, to Session.fromRestore).

```ts cordis-catalog
/**
 * Observe a durable cold feedback mutation without publishing a live Session.
 * Observers run before write ownership is released and must not await
 * another message-feedback operation for this Session. The payload is borrowed
 * read-only; deep-clone it before transferring ownership (for example, to Session.fromRestore).
 * @param inspection - committed canonical prefix, including the feedback as its last event.
 * @mode parallel
 */
'feedback/committed'(inspection: SessionInspection): void
```

Types: [SessionInspection](persistence.ar.md)

Source: [`packages/feedback/message-feedback/src/index.ts`](../../packages/feedback/message-feedback/src/index.ts)
<!-- END GENERATED cordis-surface -->
