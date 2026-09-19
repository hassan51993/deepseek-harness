# جلسة حفظ دائم

[English](persistence.md) | العربية

حدث سجل**حمل دائم صفة seam**.[session.md](session.ar.md) وصف داخل تخزين في `Session`: فقط إلحاق `SessionEvent` سجل أي لـ حق مصدر. هذا صفحة وصف مثل أي جعل هذا سجل حفظ دائم: سحب كائن `SessionPersistence` خدمة، هو مزود نموذج و مع منتج تسليم JSONL خلفية،flush فحص نقطة، انهيار انهيار استعادة، و مع سجل واحد نفس تخزين بيانات وصفية رأس. سجل تحمل تحميل حدث مفردات في توليد[حفظ دائم سجل حدث دليل](../persistence-catalog.ar.md) في تدريجي بند صف رفع.

هذا seam هو واحد[قدرة seam](../../.agents/notes/implemented/architecture/2026-06-13-capability-seams.ar.md): واحد سحب كائن خدمة ([dsh-session-persistence](../../packages/session/session-persistence) ،`ctx.sessionPersistence`) في قائم `SessionEvent` فوق كشف `create`/`open`/`stat`/`list`——**لا يوجد مستو سطر حفظ دائم حدث نوع**——منها `create` و `open` إرجاع تدريجي جلسة `SessionHandle`(`read`/`append`/`flush`/`close`) ، هو تحمل تحميل الكل سجل وصول و مفرد كتابة من كل حق. مستودع مع منتج تسليم [dsh-session-persistence-jsonl](../../packages/session/session-persistence-jsonl) بصفة ذلك provider؛ مستودع خارج provider يمكن تنفيذ نفس خدمة اتفاق. رؤية[أساس في جملة مقبض حفظ دائم Agent Note](../../.agents/notes/implemented/architecture/2026-08-27-handle-based-session-persistence.ar.md) و [session-persistence Agent Note](../../.agents/notes/implemented/architecture/2026-06-14-session-persistence.ar.md).

## `SessionHandle`——عبر نحو قد تخزين جلسة واحد بند فتح عبر طريق

كل مرة سجل قراءة كتابة كل مرور من جملة مقبض تدفق حركة، أبدا مرور من حسب id بحث عنوان خدمة طريقة: جملة مقبض هو عبر عملية كتابة إيجار نحو يأخذ حراسة وحيد مدخل. قراءة سوف إرجاع استدعاء جهة وحيد احتلال خارج طبقة slice، و من إنتاج من بناء قيام event value آخر اسم حالة. واحد نوع جملة مقبض نوع معا خدمة اثنان نوع وصول——في `read` جملة مقبض فوق تنفيذ تعديل هو وقت التشغيل `SessionReadOnlyError`، بينما غير نوع طبقة وجه تفكيك قسم——بينما عملية داخل مفرد كتابة من كل حق جعل نيل في قد لديه نشط وثب يحتفظ من وقت ثاني مرة `open(id, 'write')` بـ `SessionAlreadyOwnedError` رفض.

```ts type-equiv
/** One persistence event slice returned by {@link SessionHandle.read}. */
interface SessionHandleReadResult {
  /**
   * Whether event values are exclusively owned or shared only after deep
   * freezing. Slicing preserves the producer's state even when no events remain.
   */
  readonly eventState: SessionSeedEventState
  /** Event values in a caller-owned outer array. */
  readonly events: readonly SessionEvent[]
}
```

```ts type-equiv
/**
 * One open channel onto a stored session. A handle is single-owner state, not
 * a shared service: `read` never backtracks below what this handle already
 * observed, a `write` handle reads its own successful appends, and `close()`
 * is the one teardown (idempotent, uncancellable; `Symbol.asyncDispose`
 * delegates to it). Every operation on a closed handle rejects with
 * `SessionHandleClosedError`.
 *
 * Freshness across handles: once an `append` or `flush` resolves on a write
 * handle, every read STARTED afterwards on the same backend instance — on any
 * handle, or through `stat`/`list` — observes at least that prefix.
 * Reads concurrent with a mutation carry no ordering promise beyond the valid
 * contiguous prefix.
 */
interface SessionHandle extends AsyncDisposable {
  /** The stored session this handle addresses. */
  readonly id: SessionId
  /** The immutable stored header, fixed at `create`/`open`. */
  readonly header: SessionHeader
  /**
   * Exact fork-inherited prefix length stored with the log; `0` when
   * `header.isSeeded` is false. Storage metadata paired with the header for
   * every body read, never part of the replayable event log.
   */
  readonly inheritedEventCount: SessionLogOffset
  /** Whether this handle may mutate the log. */
  readonly access: SessionAccess

  /**
   * Read a slice of the valid contiguous logical log. The slice is a legal log
   * prefix segment: a torn physical tail is never returned, and repeated reads
   * on this handle never observe an older state than a prior read.
   * @param offset - first logical event seq to include; defaults to `0`.
   * @param length - maximum number of events to return; defaults to the rest
   *   of the log. An offset at or past the end returns an empty list.
   * @param options - optional cancellation.
   * @returns the caller-owned outer slice plus the ownership state of its event values.
   */
  read(offset?: number, length?: number, options?: SessionHandleReadOptions): Promise<SessionHandleReadResult>

  /**
   * Append a contiguous batch continuing the current logical end. The first
   * event's `seq` MUST equal the stored next-seq; committed events are never
   * rewritten. Persistence is best-effort: on resolution the batch is
   * accepted, ordered, and visible to reads on this backend instance, but
   * only a resolved {@link flush} promises it survives a crash — a backend
   * may buffer or batch physical writes behind append. Rejects with
   * `SessionReadOnlyError` on a read handle and `SessionOwnershipLostError`
   * when write ownership is gone.
   * @param events - the contiguous batch, in seq order.
   * @param options - optional cancellation observed before the write starts.
   */
  append(events: readonly SessionEvent[], options?: SessionHandleAppendOptions): Promise<void>

  /**
   * The durability barrier — the one operation that promises storage: on
   * resolution every acknowledged append is durable and the session is
   * materialized for other processes; an empty created session becomes
   * durably listable here. Callers that must survive a crash flush; a backend
   * whose `append` already persists on resolution treats this as
   * materialize-if-needed. Rejects with `SessionReadOnlyError` on a read
   * handle.
   * @param options - optional cancellation observed before the barrier starts.
   */
  flush(options?: SessionHandleFlushOptions): Promise<void>

  /**
   * Release the handle: a read handle frees local resources; a write handle
   * completes pending durability and releases write ownership. Idempotent,
   * asynchronous, and deliberately not cancellable.
   */
  close(): Promise<void>
}
```

قد إنشاء جلسة ذاتي `create` إتمام لـ لحظة بدء يكفي في هذا عملية داخل يتم مراقبة إلى، بينما خلفية يمكن يأخذ شيء إدارة فعلي جسم تحويل (صاف خالص أفضل تحويل) دفع متأخر إلى رقم مرة `append` أو `flush`؛ أخرى عملية فقط قدرة يرى قد فعلي جسم تحويل جلسة، واحد في انهيار انهيار قبل من لم فعلي جسم تحويل جلسة انتظار في من لم وجود.

## flush فحص نقطة

`session/event` هو واحد*تزامن*إشعار؛ تركيب خلفية حسب جلسة id يأخذ هو توجيه دخول نشط وثب كتابة جملة مقبض محدود write-behind نافذة، بينما لا منع سد إنتاج جهة (خلفية مرة صفة تثبيت هذه مستمع، لأن حفظ دائم قد حفظ إثبات كل id فقط لديه واحد نشط وثب كتابة جملة مقبض). رقم واحد انتظار معالجة حدث سوف فتح بدء ثابت داخلي دفعة معالجة نافذة، لاحق حدث سوف إضافة دخول لكن لن إعادة وضع ذلك قطع توقف وقت. نافذة إلى مدة بعد سوف عبر هذا جلسة كتابة جملة مقبض بدء مرة حفظ دائم `append`؛ هذا مرة كتابة خلال وصل قبول حدث سوف نيل نيل ذاتي ذات قطع توقف وقت، و شكل صار لاحق دفعة مرة.`session/flush` سوف إلغاء انتظار و ترتيب فارغ حتى تماما توقف مستقر، لذلك حلقة ما زال سوف ذلك استخدام عمل في قيادة أخذ تحت واحد عادي جولة قبل ترتيب و خطأ مراقبة فحص نقطة. خلفية كتابة يتم رفض وقت سوف حسب ترتيب إبقاء مقابل حدث، مؤقت توقف تلقائي مسار، و عبر logger تقرير إبلاغ؛ تحت مرة صريح flush سوف إعادة محاولة، و نحو ذلك استدعاء جهة صدى مضيء أرض رفض.`session/disposed` سوف تنفيذ نفس مثال نهائي ترتيب فارغ و إغلاق جملة مقبض، بينما `close()` ذاته سوف مرور من ما زال فتح تخزين ترتيب فارغ قد توجيه مؤقت اندفاع، لذلك خلفية teardown إغلاق صاف مسح لا فقد أي بيانات. هذا نافذة فقط حد متعمد دفعة معالجة انتظار، لا حد حدث حلقة ضبط درجة أو خلفية إتمام حفظ دائم تأخير متأخر.

## انهيار انهيار استعادة إبقاء يتم في قطع جولة

واحد في جولة في طريق انهيار انهيار سجل بـ فتح `turn/start` بينما بلا `turn/end` انتهاء. حفظ دائم**لن**مقتطع أو إصلاح هو: في طويل دورة مدة مهمة في، مفرد عدد جولة ممكن غير معتاد ضخم كبير (سماح كثير خطوة، كبير كمية أداة إخراج) ، بينما هذه حدث في انهيار انهيار قبل قد يتم حمل دائم إلحاق. هو إرجاع شيء إدارة فوق صالح وصل متابعة سجل؛ فقط لديه تمزيق شق شيء إدارة ذيل جزء——يخص مرة من لم إتمام append——في لا كامل تفتيت قطعة سوف يتم إسقاط: من في استعادة كامل سجل (JSONL خلفية سوف جزء حل رمز تمزيق شق Zstandard لقطة) من كتابة مسار في جملة مقبض رقم مرة جديد append قبل حمل دائم إعادة كتابة. إصلاح هو قراءة جهة مسؤولية:resume(agent-loop) عبر ذلك كتابة جملة مقبض قراءة قد تخزين سجل، حساب حساب `interruptedTurnClosers`——ناقص أداة خطأ، أي لم إغلاق دمج `step/end`، و واحد دمج صار `turn/end { reason: { kind: 'interrupted' } }`——و في إصدار Session قبل يأخذ هو جمع بصفة عادي دفعة مرة عبر نفس جملة مقبض إلحاق.`interrupted` هو وحيد واحد لا من حلقة إرسال خروج `TurnEndReason`(رؤية [session.md](session.ar.md#why-a-turn-ended-turnendreasonmap)).

لذلك إصلاح فقط في كتابة كل حق لـ تحت كتابة: نشط وثب جلسة كتابة جملة مقبض من ذلك دورة الحياة كل من يحتفظ، لذا تزامن `open(id, 'write')` سوف بـ `SessionAlreadyOwnedError` رفض، بينما لا هو يجعل إصلاح و نشط وثب جولة تنافس سرعة. فقط قراءة مراقبة جهة (session-query) فقط في داخل تخزين في استخدام نفس مثال إغلاق دمج حدث إعداد مستو يتم في قطع بارد سجل، لا عودة كتابة أي محتوى.

فقط قراءة مراقبة أي `open(id, 'read')`: جملة مقبض توفير مرور مرور تحقق وصل متابعة بادئة مقتطعة، أبدا إرجاع تمزيق شق ذيل جزء، كما نفس جملة مقبض فوق تكرار قراءة أبدا سوف مراقبة إلى مقارنة أولا قبل قراءة أكثر قديم حالة. حفظ دائم جانب لا وجود قد دقيق تجهيز Session ذاكرة مؤقتة:session-query يملك ذاتي ذات بارد قراءة ذاكرة مؤقتة، حسب `stat().revision` تغيير أمر لوحة لـ كل id ذاكرة مؤقتة واحد قد إعداد مستو بارد Session، فقط في أمر لوحة تغير وقت إعادة قراءة. هذا دورة الحياة من[أساس في جملة مقبض حفظ دائم Agent Note](../../.agents/notes/implemented/architecture/2026-08-27-handle-based-session-persistence.ar.md) تعريف؛ قد عودة ملف [Session دقيق تجهيز مرحلة مقطع سجل](../../.agents/notes/archived/architecture/2026-08-05-session-preparation.md) تسجيل تحميل إصدار حد `SessionPreparation` الأكثر أول قرار.

## `SessionLocation`——رفض تشخيص ناتج هدف

`SessionLocation` لا هو موجه إلى إزالة استهلاك من استعلام: سجل وصول مشي جلسة جملة مقبض `read`. هو فقط بصفة رفض تشخيص وجود، جعل `SessionFormatUnsupportedError` قدرة إشارة خروج هذا بناء رفض حل قراءة أصلي سجل.JSONL توفير ذلك مشروع/جلسة دليل داخل transcript(نص سجل) قطعا مقابل مسار؛ لا يوجد تدريجي جلسة عمل عنصر خلفية فإن لا توفير.

```ts type-equiv
/**
 * A backend-resolved, per-session local artifact location. Carried only by
 * refusal diagnostics ({@link SessionFormatUnsupportedError}) so a user can
 * find the raw log a build refused to interpret; it is not a consumer-facing
 * query — log access goes through a session handle's `read`.
 */
interface SessionLocation {
  /** Backend-specific artifact kind, for example `jsonl`. */
  readonly kind: string
  /** Absolute path to this session's backend-owned artifact. */
  readonly path: string
}
```

<a id="sessionheader--metadata-beside-the-log"></a>

## `SessionHeader`: سجل جانب بيانات وصفية

كل جلسة بيانات وصفية و حدث سجل**قسم فتح**تخزين:header يحمل صيغة إصدار،cwd و `isSeeded` جدول نظام bit، يحتوي متن تخزين قيمة فإن في ذلك جانب حافة مفرد وحيد يحمل دقيق inherited cut. اثنان من كل لا دخول `SessionEventMap`، أيضا لن وصول `deriveMessages()`.logical header عبر `session.header` مرفق إضافة،Session فإن بـ `inheritedEventCount` كشف ذلك cut.

شفرة المصدر:[`packages/core/session/src/types.ts`](../../packages/core/session/src/types.ts)

```ts type-equiv
/**
 * Immutable validated storage metadata, kept outside the conversation event log.
 */
interface SessionHeader {
  /**
   * Current logical format version, stamped from {@link SESSION_FORMAT_VERSION}.
   * Historical physical headers are translated before entering this interface.
   */
  readonly version: typeof SESSION_FORMAT_VERSION
  /** The session's id (mirrors the {@link Session}'s id). */
  readonly id: SessionId
  /** Non-negative safe-integer Unix epoch milliseconds when the session was created. */
  readonly createdAt: number
  /** Absolute working directory the session was created in (if any). */
  readonly cwd?: string
  /** The session this one was forked from (seed lineage), if any. */
  readonly parentSession?: SessionId
  /**
   * Whether this Session contains a fork-inherited event prefix. The exact prefix
   * length is Session state rather than ordinary header metadata.
   */
  readonly isSeeded: boolean
  /**
   * Coarse product classification for a session created as a subagent child.
   * This is presentation metadata, not proof that the child is continuable.
   */
  readonly origin?: 'subagent'
  /**
   * Delegation depth: absent (zero) for a top-level session, parent depth + 1
   * for a subagent child. Persisted so a recursion budget survives restart and
   * resume — a runtime-only depth would reset a resumed child to top-level.
   */
  readonly delegationDepth?: number
  /**
   * Id of the agent preset this session's agent was composed from, when the
   * deployment composes per session. Durable because the preset decides the
   * session's tools and prompt: a resume that restored a different composition
   * would replay history the model can no longer act on.
   */
  readonly agentPreset?: string
}
```

## صيغة رفض: هذا بناء لا يمكن يمكن اعتماد قراءة سجل

خلفية استخدام `SessionFormatUnsupportedError` رفض لا يمكن يمكن اعتماد حل قراءة سجل، هو و `SessionPersistenceCorruptionError` منطقة قسم، لأن بيانات لا يوجد ضرر تالف.`stat` و `list` سوف مقابل الأكثر عال مواصفة generation تصنيف، و في لا قراءة أو تغيير متن قبل رفع تحت تحويل تلقي دعم حمل تاريخ header. تاريخ `open` سوف مشترك كل Session وحيد مرة migration preparation، مجددا إرجاع حالي منطق قيمة، و إبقاء كل مصدر مسار، بايت و inode ثابت.JSONL provider مباشر من هذا داخل تخزين نتيجة إرجاع قراءة جملة مقبض بينما لا إصدار؛ كتابة open فإن في يحتفظ مفرد كتابة من claim و ملف lease وقت إعادة استخدام preparation، ترتيب هو إصدار نهائي current generation، مع بعد عندئذ إرجاع يمكن كتابة جملة مقبض. أي جعل ما زال لديه مقارنة قديم يمكن قراءة generation، الأكثر عال لم قدوم generation ما زال سوف توجيه يؤدي رفض. حالي صيغة استعادة سوف إبقاء قد تثبيت توسيع و حمل `ignorable: true` لم معرفة حدث؛ تاريخ v0/v1/v2 ترحيل فإن سوف رفض لم معرفة نوع، أي جعل هو حمل لديه ignorable علامة. خلفية لـ كل جلسة إبقاء مستقل ملف وقت، رسالة مرفق فوق اختيار تحديد أصلي سجل مسار. مستودع خارج خلفية يجب في ذاتي ذات شيء إدارة صيغة مدخل توفير انتظار قيمة فقط حالي جملة مقبض قيمة و جهة نحو شعور معرفة رفض.[قد إصدار صيغة ترحيل قرار](../../.agents/notes/implemented/architecture/2026-08-31-released-session-format-migrations.ar.md) مسؤول ترحيل سلسلة و غير ممكن تغيير إصدار قاعدة.

## `CreateSessionOptions`:seed و بيانات وصفية

عبر store إنشاء `Session` وقت سوف استقبال `seed`(ابتدائي إعادة تشغيل أو fork تاريخ) ، اختياري دقيق `inheritedEventCount` و `meta`(store كامل دمج دخول `SessionHeader` تخزين طبقة حقل).store ملء ملء `version`/`id` و لـ `createdAt` توفير قيمة افتراضية؛ استدعاء جهة يمكن توفير قد تحقق قطعا مقابل `cwd`،`parentSession` جدول نظام،`isSeeded` جدول نظام علامة، اختياري خشن حبة درجة `origin`،`delegationDepth`، لأجل تجميع هذا agent(ذكي جسم) `agentPreset` و قد لديه `createdAt`.seeded إنشاء يجب صريح توفير و inherited prefix تماما متبادل انتظار seed و دقيق cut؛constructor سوف أولا في هذا cut إلحاق child-owned tagged end-seed marker،setup مجددا إضافة child-owned event.`origin: 'subagent'` يجعل منتج تنقل قدرة كاف إخفاء تكرار child سطر؛ هو لا إثبات وصف رمز صالح، أيضا لا إثبات child يمكن استعادة.

```ts type-equiv
/**
 * Options for creating a {@link Session} via the store. `seed` replays/forks
 * an existing event log; `meta` carries the caller-supplied storage fields the
 * store folds into a {@link SessionHeader}.
 */
interface CreateSessionOptions {
  /** Initial replay or fork history supplied at construction. */
  readonly seed?: readonly SessionEvent[]
  /**
   * Exact fork-inherited prefix length when `meta.isSeeded` is true. The
   * constructor seed is exactly this inherited prefix; the constructor
   * appends the child-owned tagged marker at the cut.
   */
  readonly inheritedEventCount?: SessionLogOffset
  /**
   * Storage metadata read once before publication. `isSeeded` marks fork
   * lineage; supplying replay history alone does not make it inherited.
   */
  readonly meta?: {
    readonly cwd?: string
    readonly parentSession?: SessionId
    readonly createdAt?: number
    readonly isSeeded?: boolean
    readonly origin?: 'subagent'
    readonly delegationDepth?: number
    readonly agentPreset?: string
  }
}
```

لذلك، إعادة تشغيل/fork استدعاء طريقة لـ `ctx.agents.create({ sessionId, seed, meta })`——fork أيضا سوف مع `meta.isSeeded: true` توفير `inheritedEventCount`، كما فقط لديه مرور agent-loop إصدار جلسة عندئذ سوف حفظ دائم، كما حلقة سوف في إصدار قبل عبر جلسة جديدة كتابة جملة مقبض تخزين seed؛ سوف واحد*حفظ دائم*جلسة استعادة لـ نشط وثب agent استدعاء طريقة لـ `ctx.agents.resume({ resumeSessionId })`.

## دقيق تجهيز و استعادة كل حق

`SessionStore.prepare()` استقبال عادي إنشاء خيار، أو عبر `RestoredSessionOptions` استقبال يمكن مباشر وصل إدارة seed. هو `eventState` جدول واضح event value هو وحيد احتلال كائن، أيضا هو فقط لديه عميق درجة تجميد ربط بعد مشترك كائن؛ إنتاج من مسؤول بناء قيام هذا حالة،slice لن أصل حسب نتيجة طويل درجة دفع قطع أخرى حالة. استعادة مسار سوف تحقق و مباشر وصل إدارة هذه قيمة، لم يعد نسخ أو تجميد ربط.`SessionPreparation` مع بعد يحتفظ هذا دقيق لم إصدار Session، مباشر حتى إصدار أو تراجع؛dispose هو تزامن كما قوة انتظار.agent-loop resume عبر هذا جلسة كتابة جملة مقبض قراءة هذا نسخة نتيجة، و في دقيق تجهيز قبل إلحاق وحيد احتلال `interruptedTurnClosers`.

```ts type-equiv
/**
 * Aliasing state of an adoptable Session seed. `shared-frozen` permits deeply
 * frozen aliases plus independently owned unfrozen values in the same seed.
 */
type SessionSeedEventState = 'detached' | 'shared-frozen'
```

```ts type-equiv
/**
 * Adoptable storage values transferred to {@link SessionStore.prepare}
 * without another copy or freeze pass.
 */
interface RestoredSessionOptions {
  /** Events that are independently owned or already deeply frozen. */
  readonly seed: SessionEvent[]
  /** Independently owned storage metadata to validate and freeze in place. */
  readonly meta: SessionHeader
  /** Exact number of fork-inherited leading events decoded from storage. */
  readonly inheritedEventCount: SessionLogOffset
  /** Aliasing state carried from the operation that produced the seed. */
  readonly eventState: SessionSeedEventState
}
```

```ts type-equiv
/** Inputs accepted while constructing an unpublished Session. */
type PrepareSessionOptions =
  | (CreateSessionOptions & { readonly eventState?: undefined })
  | RestoredSessionOptions
```

```ts type-equiv
/** Options for a preparation whose provider retains unpublished state. */
interface SessionPreparationOptions {
  /** Release provider-owned state when the Session was not published. */
  readonly release?: () => void
}
```

```ts public-api
/**
 * One exact unpublished Session and the provider state that keeps it usable.
 * Disposal is synchronous and idempotent. Providers decide whether release
 * returns the Session to a cache or discards it; publication may consume that
 * state before disposal, making the callback a no-op.
 */
declare class SessionPreparation implements Disposable {
  /** The exact Session to use for setup and publication. */
  readonly session: Session;
  /**
   * Wrap an unpublished Session in one preparation lifetime.
   * @param session - exact unpublished Session.
   * @param options - optional provider release behavior.
   * @returns a preparation disposed after publication or rollback.
   */
  static create(session: Session, options?: SessionPreparationOptions): SessionPreparation;
  /** Release provider state once when this preparation leaves its caller. */
  [Symbol.dispose](): void;
}
```

## خفيف كمية مصدر إصلاح حجز رقم

إرسال توليد قراءة نموذج مستهلك سوف في تحميل كامل حدث سجل قبل مقارنة مقارنة واحد منخفض فتح إلغاء لا نفاذ واضح إصلاح حجز رقم. هذا إصلاح حجز رقم هو قدوم ذاتي `stat`/`list` تدريجي خلفية نسخة تغيير أمر لوحة: إصلاح حجز رقم متبادل انتظار يمكن نظر لـ سجل لم تغيير؛ لا متبادل انتظار فإن لا عمل أي تحمل وعد، كما كتابة كل حق تغيير حركة أبدا سوف تغيير إصلاح حجز رقم.session-query بـ هو لـ مفتاح إدارة بارد قراءة ذاكرة مؤقتة؛ هذا أمر لوحة في open،read أو resume في لا بدء أي أثر.

```ts type-equiv
/**
 * Backend-owned token that identifies both one storage source and one revision
 * of a persisted session log.
 */
type SessionPersistenceRevision = Branded<'SessionPersistenceRevision'>
```

```ts type-equiv
/**
 * Lightweight stored-session observation returned by {@link SessionPersistence.stat}
 * and {@link SessionPersistence.list} without reading the full event log.
 */
interface SessionPersistenceSnapshot {
  /** Detached metadata for one stored session. */
  readonly header: SessionHeader
  /** Opaque change token; see {@link SessionPersistence.stat}. */
  readonly revision: SessionPersistenceRevision
  /** Logical event count, when the backend can provide it cheaply from metadata; otherwise absent. */
  readonly eventCount?: number
  /** Physical artifact byte size, when the backend can provide it cheaply (JSONL); otherwise absent. */
  readonly sizeBytes?: number
}
```

اختياري `eventCount`/`sizeBytes` حقل ما زال هو توفير واضح حاجة هو جمع consumer استخدام منخفض صار هذا backend observation.Session قائمة لا استعارة مساعدة هذا اثنان عدد حقل فتح بارد سجل، فقط قراءة header و مرور مرور identity تحقق projection cache hint، لذلك cache أو Session format ترقية لن يأخذ بدء تغيير صار body scan.

## خلفية

مع منتج تسليم provider تنفيذ سحب كائن `SessionPersistence` اتفاق (`create`/`open`/`stat`/`list`، تدريجي جلسة `SessionHandle` تحمل تحميل `read`/`append`/`flush`/`close`، كل مسار اختياري دعم حمل إلغاء) ، و عبر مشترك حفظ دائم عقد نحو طقم عنصر:

- **[dsh-session-persistence-jsonl](../../packages/session/session-persistence-jsonl)**——تدريجي جلسة فقط إلحاق منطق JSONL سجل، افتراضي تخزين لـ حمل checksum وصل متابعة Zstandard frame، أيضا يمكن إعداد لـ أصلي سطر؛ أداة تجهيز انهيار انهيار أمان أصل فرعي فعلي جسم تحويل، تدريجي دفعة `fsync` append، و في رقم مرة جديد append قبل مقتطع تمزيق شق ذيل جزء.`stat`/`list` يحمل `sizeBytes` و كل قوة بينما لـ، من `fs.stat` إرسال توليد إصلاح حجز رقم.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxsessionpersistence--sessionpersistence-abstract-seam"></a>

### `ctx.sessionPersistence` — `SessionPersistence` (abstract seam)

Durable append-only session storage addressed through per-session handles.

Storage semantics shared by every backend: events are contiguous from seq 0 and never rewritten; a torn physical tail is never returned to a reader and is truncated by the write path before its first append; reads validate current-format records only and refuse unknown vocabulary fail-closed. `append` persists best-effort; `flush` — per handle or service-wide — is the durability barrier.

Visibility: a created session is observable through `stat`/`list`/`open` in this process from the moment `create` resolves, even while a backend defers physical materialization (a pure optimization); other processes see the session only once it materializes, and a session that never materialized before a crash never existed. `SessionHandle.flush` forces materialization.

Freshness: once an `append` or `flush` resolves, reads started afterwards on this backend instance observe at least that prefix.

```ts cordis-catalog
/**
 * Create a new stored session and take its write ownership.
 * @param header - the immutable header (id, version, cwd, lineage) to store.
 * @param options - optional cancellation.
 * @returns a `write` handle owned by the caller; close it to release ownership.
 * @throws {SessionAlreadyExistsError} when the id already exists.
 */
abstract create(header: SessionHeader, options?: SessionPersistenceCreateOptions): Promise<SessionHandle>

/**
 * Open an existing stored session.
 *
 * `read` never takes ownership and works while another handle (or process)
 * holds write ownership. `write` atomically claims single-writer ownership;
 * an existing active owner rejects.
 * @param id - the stored session to open.
 * @param access - `read` or `write`.
 * @param options - optional cancellation.
 * @returns the open handle.
 * @throws {SessionPersistenceNotFoundError} when the session does not exist.
 * @throws {SessionAlreadyOwnedError} for `write` when ownership is taken.
 */
abstract open(id: SessionId, access: SessionAccess, options?: SessionPersistenceOpenOptions): Promise<SessionHandle>

/**
 * Flush every active write handle owned by this service instance in one
 * durability barrier: each handle's routed live events drain durably and
 * its session materializes, exactly as that handle's own
 * `SessionHandle.flush` would. Read handles buffer nothing and are
 * untouched. A handle closed concurrently counts as flushed — close itself
 * drains durably.
 * @returns resolution once every write handle active at the call has flushed.
 * @throws {AggregateError} naming each session whose flush failed; the
 *   remaining handles still flush.
 */
abstract flush(): Promise<void>

/**
 * Observe one stored session without reading its event log or taking
 * ownership.
 *
 * The snapshot's `revision` is an opaque change token comparable only
 * against revisions from the same service instance and session id: equal
 * revisions may be treated as an unchanged log; unequal revisions promise
 * nothing. Write-ownership churn does not change a revision. It exists for
 * derived read-model caches keyed off `stat`/`list`; it plays no part in
 * open, read, or resume.
 * @param id - the stored session to observe.
 * @param options - optional cancellation.
 * @returns the snapshot, or `undefined` when the session does not exist.
 */
abstract stat(id: SessionId, options?: SessionPersistenceStatOptions): Promise<SessionPersistenceSnapshot | undefined>

/**
 * List every stored session visible to this process, in no promised order.
 * @param options - optional cancellation.
 * @returns one snapshot per stored session.
 */
abstract list(options?: SessionPersistenceListOptions): Promise<readonly SessionPersistenceSnapshot[]>
```

Types: [SessionId](core.ar.md)

Source: [`packages/session/session-persistence/src/index.ts`](../../packages/session/session-persistence/src/index.ts)
<!-- END GENERATED cordis-surface -->
