# رسالة ملاحظات

[English](feedback.md) | العربية

[`@deepseek-ai/dsh-message-feedback`](../../packages/feedback/message-feedback) يملك إبرة مقابل مفرد بند assistant رسالة يمكن تحرير ملاحظات. مرجعي Session سجل حفظ `feedback/message-put` و `feedback/message-delete`؛ غير ممكن تغيير Session درجة ملاحظة ما زال استخدام `feedback/record`، من [`@deepseek-ai/dsh-command-feedback`](../../packages/feedback/command-feedback) وصل نفس اثنان نوع ملاحظات مشترك استخدام `FeedbackCategory` تصنيف جدول واحد بدء يملك. ثلاثة من كل هو فقط كتابة سجل حدث، أبدا دخول نموذج سياق.

مصدر:[`packages/feedback/message-feedback/src/types.ts`](../../packages/feedback/message-feedback/src/types.ts)

## عام نوع

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

## Session ملاحظات نوع

مصدر:[`packages/feedback/command-feedback/src/types.ts`](../../packages/feedback/command-feedback/src/types.ts)

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

## بيانات و تزامن

حالي بند من payload في `sessionId` و الذي تابع Session مطابقة مرجعي ملاحظات حدث عودة نحو نيل إلى. كل بند يحمل جيد تقييم أو فرق تقييم، اختياري ملاحظة، اختياري تصنيف،Host قسم إعداد `createdAt`/`updatedAt` ختم الوقت و ذاتي ذات opaque version.version فقط قدرة لأجل متبادل انتظار مقارنة مقارنة، كما فقط و هدف رسالة مقارنة مقارنة؛ استدعاء جهة لا يستطيع ترتيب أو ذاتي سطر دمج صار هو.

`put` اعتماد صارم إطار مرح مراقبة تزامن: قد لديه بند كل مرة طلب كل يجب مطابقة حالي `ifVersion`، أي جعل طلب لن تغيير هدف قيمة (تكرار قد تخزين تقييم قسم، ملاحظة و تصنيف put). اندفاع مفاجئ سوف إرجاع مرجعي حالي بند (لا وجود وقت لـ `null`) ، لذلك استدعاء جهة بلا حاجة مقدار خارج قراءة، يكفي تنسيق ضبط فقد فقد استجابة أو تزامن تحرير. حذف قد لا وجود بند نفس مثال نجاح. حسب Session تخطيط قسم طابور صف سلسلة سطر تنفيذ قراءة و تغيير؛cold تغيير في قراءة، مقارنة مقارنة، إلحاق و flush خلال يحتفظ حفظ دائم كتابة جملة مقبض. مطابقة إصدار بلا تغيير عملية لا إلحاق حدث.

## هدف و دورة الحياة مرجعي

live يحتفظ من داخل تخزين سجل مباشر توفير هدف Session مراقبة قياس؛cold قراءة استخدام `SessionPersistence.open(id, 'read')` جملة مقبض، تغيير فإن استخدام كتابة جملة مقبض. اثنان بند مسار كل لا بنية صنع Session أو Agent. أولا من `stat(id)` مسبق فحص واضح لا وجود؛`stat` قد تأكيد وجود Session إذا قراءة فشل، سوف حسب أساس أساس ضبط تطبيق لذا عائق أصل مثال نقل بث.`put` فقط قبول أداة لديه إشارة تحديد `MessageId` غير فارغ،append-origin `assistant/message`؛replacement-origin، فقط تحمل تحميل usage فارغ سجل و غير assistant سجل كل لا هو ملاحظات هدف.

fork نوع فرعي يمكن يتضمن أب Session ملاحظات حدث، لكن payload إبقاء أب درجة `sessionId`، لذلك لن يصبح فرعي Session حالي ملاحظات. حذف بند سوف إلحاق حذف علامة؛ مبكر أولا تقييم قسم و ملاحظة ما زال إبقاء في سجل في.

## حفظ دائم و Remote اتفاق

نجاح رسالة ملاحظات تغيير سوف انتظار مرجعي حفظ دائم إتمام:live عملية عبر الذي تابع Session إلحاق، و اشتراط لديه `ctx.sessions.flush` مستمع مشاركة و؛cold عملية عبر كتابة جملة مقبض إلحاق و flush. حفظ دائم لذا عائق سوف أصل مثال نقل بث، لن تقرير إبلاغ نجاح.`maxNoteBytes` لـ لا بد ملء بند، حسب UTF-8 بايت حد ملاحظة نص؛Web Host تركيب سوف ذلك ضبط لـ `8192`. هذا حزمة عبر `TypertRemoteService` و `@Remote` إصدار Host `messageFeedback.list`،`messageFeedback.put` و `messageFeedback.delete` واحد عنصر Remote اتفاق؛`command-feedback` بـ نفس مثال طريقة إصدار موجه إلى live Session Session درجة ملاحظة `sessionFeedback.record`. تحت جهة توليد Cordis API هو طريقة درجة مرجعي.

إضافة تحرير سوف إغلاق عملية وصل قبول، و ترتيب فارغ قد دخول كل Session طابور صف عمل.

افتراضي حال حال تحت،[`session-log-deepseek`](../../packages/session/session-log-deepseek/README.ar.md) سوف في لاحق رمز دمج شرط DeepSeek طلب في، يأخذ ملاحظات بصفة عادي `dsh_session_log` بعد لاحقة واحد جزء نقل إرسال؛ تركيب متاح `enabled: false` منع استخدام هو. سجل ملاحظات لن إطلاق LLM طلب، أيضا لن مفرد وحيد فوق نقل `dsh_feedback`. مقابل في غير DeepSeek توجيه،[OTel خلفية](../../packages/session/session-telemetry-otel/README.ar.md) يمكن سوف مرجعي سجل بادئة تحرير حتى قد سجل ملاحظات. أمر تأكيد نص تأكيد سجل و معرف Session و مجهول اسم مستخدم، لا تقرير إبلاغ بعيد قياس سياسة أو إلقاء تمرير نتيجة.

## Web واجهة

[`@deepseek-ai/dsh-client-ui-message-feedback`](../../packages/client/ui-message-feedback) هو متصفح جانب مستهلك.`@deepseek-ai/dsh-api-remotes` تركيب توليد `messageFeedback` و `sessionFeedback` مساهمة، لذلك هذا إضافة استدعاء `ctx.remote.messageFeedback` و `ctx.remote.sessionFeedback`، لا وصل لمس نقل طبقة.

تحكم عنصر هو `conversation.chat.assistant-actions` list slot `feedback` بند (order 10) ، هذا slot من `ui-conversation` إعلان، و تصيير في قد تحديد مسودة مساعدة يد رسالة IconActions سطر داخل.`AssistantMessageNode` يحمل قدوم ذاتي `assistant/message` حدث اختياري `messageId`. يتم في قطع تجميد ربط جزء إخراج لا يوجد هذا حقل، تصيير نقطة في حقل ناقص وقت قفز مرور هذا slot. هذا عملية شريط كل Turn تصيير مرة، يقع في استلام ذيل مساعدة يد رسالة فوق:Host قبول كل بند append-origin خطوة رسالة بصفة هدف، لكن كثير خطوة Turn في مقارنة مبكر خطوة تصيير هو أداة سطر بينما غير يمكن تقييم قسم متن، لذلك UI كشف نطاق مقارنة Host اتفاق سماح أكثر ضيق.

كل Session واحد `MessageFeedbackController`، دعم دعم هذا Session داخل كل رسالة تحكم عنصر: مرة `list` قراءة أي ملء ملء كامل مقطع محادثة، كما تأخير متأخر إلى أول مرة hover أو focus عندئذ إرسال بدء، بينما غير تركيب وقت إطلاق. كل مرة تغيير يأخذ هذا controller الأكثر بعد مراقبة إلى إصدار بصفة `ifVersion` إرسال؛`version-conflict` استجابة يحمل مرجعي بند،controller حسب هذا مقابل حساب بينما لا إعادة سحب أخذ. تغيير حسب Session سلسلة سطر، ترتيب طابور عملية و قد إيداع إصدار مقارنة مقارنة. حقن `retract` عملية سوف في هذا طابور صف داخل إعادة فحص قد إيداع تقييم قسم، و في تزامن تغيير بعد تغيير لـ بلا عملية، لذلك قديم قديم UI لا يمكن التفاف مرور نابض نافذة سجل عار تقييم قسم.`connection/reset` فقط تحديث جديد قد قراءة مرور Session.

مهمة واحد لم سجل تقييم قسم كل سوف فتح هذا Session ملاحظات نابض نافذة، أي `conversation.input.overlay` `feedback-dialog` بند: مشترك استخدام Modal بطاقة، داخل وجه هو سبعة عدد تصنيف وسم و واحد تفصيل حال إطار. إيداع سوف put الذي اختيار تقييم قسم، حمل فوق الذي اختيار تصنيف و ذهاب حذف أول ذيل فارغ أبيض وصف، اثنان من أيضا يمكن كل لا حمل؛ نجاح سوف إغلاق نابض نافذة و عرض تأكيد toast، فشل فإن إبقاء نابض نافذة و مسودة مسودة و عرض تحذير إبلاغ toast. لا حمل نص `/feedback`(`ui-commands` بـ `action` توجيه واحد تركيب زينة) لـ Session فتح نفس عدد نابض نافذة، مع بعد عبر `sessionFeedback.record` سجل؛`/feedback <text>` ما زال مشي مضيف أمر مسار. مجددا مرة نقر قد سجل تقييم قسم سوف مباشر سحب عودة، لا فتح نابض نافذة.

## حد و حد

- عملية طابور صف فقط في عملية داخل توليد فاعلية؛cold كتابة ترتيب هو صفة اعتماد الذي اختيار حفظ دائم مزود.
- حذف فقط إزالة حالي بند، لن مسح حذف append-only سجل أو قد إلقاء تمرير بعد لاحقة في مبكر أولا ملاحظة.
- طلب إذا تماما جيد سقوط في live detach بعد،persistence catalog شيء تحويل header قبل أقصى قصير نافذة، ممكن استلام إلى `session-not-found`؛ استدعاء جهة ينبغي في retirement materialization بعد إعادة محاولة.
- cold طلب قراءة كامل سجل؛ خدمة لا يوجد بند عدد أو تجمع دمج بايت حد أعلى.`maxNoteBytes` فقط حد كل بند ملاحظة.
- Host اتفاق لا سجل قد إقرار إثبات actor أو مراجعة حساب هوية، لذلك زائف ضبط استدعاء جهة حد يمكن معلومة.
- Web تحكم عنصر فقط ظهور في محادثة عرض.trajectory و waterfall عرض لا تصيير ملاحظات بند، كل إدارة هو جمع مساعدة يد عقدة يحمل نفسه `messageId`.
- Web تحكم جهاز لا إزالة استهلاك ملاحظات سجل حدث، لذلك آخر عدد وسم صفحة تقييم قسم يلزم انتظار إلى إعادة وصل أو تحت مرة اندفاع مفاجئ استجابة عندئذ مرئي، لن قيام أي ظهور.
- نابض نافذة لا مسبق أولا تحقق `maxNoteBytes`؛ إبرة مقابل رسالة تجاوز طويل وصف في إيداع وقت بـ `note-too-large` فشل، بينما لا هو في إدخال مرور مسار في.Session درجة ملاحظة لا يوجد كبير صغير حد أعلى،`/feedback` أمر من قدوم أيضا لا يوجد.
- `sessionFeedback.record` فقط خدمة live Session، لا فإن عودة جواب `session-not-found`؛ نابض نافذة فتح خلال Session تراجع دور وقت، نابض نافذة سوف تقرير إبلاغ هذا فشل.

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
