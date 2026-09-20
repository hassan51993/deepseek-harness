# حفظ الجلسة الدائم

[English](persistence.md) | العربية

**seam المتانة** لسجل الأحداث. وتصف [session.md](session.ar.md) كائنَ `Session` في الذاكرة — وهو سجلُّ `SessionEvent` ذو الإلحاق فقط الذي هو مصدرُ الحقيقة. وتصف هذه الصفحةُ كيف يصير ذلك السجلُّ دائمًا: خدمةُ `SessionPersistence` المجردة، ونموذجُ مزوّديها وخلفيةُ JSONL المشحونة، ونقطةُ تفتيش الدفع، والتعافي من الانهيار، والترويسةُ الوصفية التي تسافر بجوار السجل. أما مفرداتُ الأحداث التي يحملها السجلُّ فمعدودةٌ عضوًا عضوًا في [دليل أحداث سجل الحفظ الدائم](../persistence-catalog.ar.md) المولَّد.

والـseam [seam قدرة](../../.agents/notes/implemented/architecture/2026-06-13-capability-seams.ar.md): خدمةٌ مجردة واحدة ([dsh-session-persistence](../../packages/session/session-persistence)، `ctx.sessionPersistence`) تكشف `create` و`open` و`stat` و`list` فوق `SessionEvent` القائم — **بلا نوع حدث محفوظ موازٍ** — حيث يعيد `create` و`open` قيمةَ `SessionHandle` لكل جلسة (`read` و`append` و`flush` و`close`) تحمل كلَّ وصول إلى السجل وملكيةَ الكاتب الواحد. ويشحن المستودعُ [dsh-session-persistence-jsonl](../../packages/session/session-persistence-jsonl) مزوّدًا له؛ ولمزوّدين خارج الشجرة تنفيذُ عقد الخدمة نفسِه. انظر [ملاحظة الوكيل عن الحفظ الدائم القائم على المقابض](../../.agents/notes/implemented/architecture/2026-08-27-handle-based-session-persistence.ar.md) و[ملاحظة الوكيل عن حفظ الجلسة الدائم](../../.agents/notes/implemented/architecture/2026-06-14-session-persistence.ar.md).

## `SessionHandle` — قناة مفتوحة واحدة على جلسة مخزَّنة

يمرّ كلُّ قراءة وكتابة في السجل عبر مقبض، لا عبر طرائقَ في الخدمة تخاطَب بالمعرّف: فالمقبضُ هو البابُ الوحيد الذي يحرسه عقدُ إيجار الكتابة بين العمليات. وتعيد القراءةُ شريحةً خارجية يملكها المستدعي وحالةَ التسمية البديلة لقيم أحداثها كما أرساها المنتِج. ويخدم نوعُ مقبض واحد الوصولين معًا — فالتغييرُ على مقبض `read` خطأُ `SessionReadOnlyError` في وقت التشغيل لا انقسامٌ منوَّع — وتجعل ملكيةُ الكاتب الواحد داخل العملية `open(id, 'write')` ثانيًا يرفض بـ`SessionAlreadyOwnedError` ما دام مالكٌ نشطًا.

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

والجلسةُ المنشأة قابلةٌ للرصد في هذه العملية منذ أن يحلّ `create`، بينما قد تؤجل الخلفيةُ التجسيدَ الفيزيائي (وهو تحسينٌ محض) إلى أول `append` أو `flush`؛ ولا ترى العملياتُ الأخرى إلا الجلساتِ المجسَّدة، والجلسةُ التي لم تتجسد قط قبل انهيار لم تكن موجودةً قط.

## نقطة تفتيش الدفع

`session/event` إشعارٌ *متزامن*؛ وتوجّهه الخلفيةُ المركَّبة بمعرّف الجلسة إلى نافذة الكتابة المؤجلة المحدودة في مقبض الكتابة النشط بلا حجب المنتِج (وتثبّت الخلفيةُ هذه المستمعاتِ مرةً واحدة، لأن الحفظَ الدائم يفرض سلفًا مقبضَ كتابة نشطًا واحدًا لكل معرّف). ويبدأ أولُ حدث معلَّق نافذةَ تجميع داخلية ثابتة، وتنضم الأحداثُ اللاحقة بلا إعادة ضبط مهلتها. ويبدأ انقضاؤها عمليةَ `append` دائمة واحدة عبر مقبض كتابة الجلسة؛ وتتلقى الأحداثُ المقبولة أثناء تلك الكتابة مهلتَها وتكوّن دفعةَ متابعة. ويلغي `session/flush` الانتظارَ ويصرّف حتى السكون، فتبقى الحلقةُ تستعمله نقطةَ تفتيش للترتيب ورصد الأخطاء قبل ادعاء الجولة العادية التالية. والكتابةُ الخلفية المرفوضة تحتفظ بأحداثها مرتَّبةً وتوقف المسارَ التلقائي ويُبلَّغ عنها عبر المسجّل؛ ويعيد الدفعُ الصريح التالي المحاولةَ ويرفض بصوت عالٍ لمستدعيه. ويُجري `session/disposed` التصريفَ النهائي نفسَه ويغلق المقبضَ، ويصرّف `close()` نفسُه الذاكرةَ الموجَّهة عبر التخزين الذي ما زال مفتوحًا، فلا يضيع شيءٌ في كنس الإغلاق عند تفكيك الخلفية. ولا تحدّ النافذةُ إلا انتظارَ التجميع المقصود، لا جدولةَ حلقة الأحداث ولا زمنَ متانة الخلفية.

## التعافي من الانهيار يحفظ الجولة المقطوعة

السجلُّ الذي انهار في منتصف جولة ينتهي بـ`turn/start` مفتوح بلا `turn/end`. ولا يقتطعه الحفظُ الدائم ولا يصلحه — فقد تكون الجولةُ الواحدة ضخمةً في مهمة طويلة الأفق (خطواتٌ كثيرة، وخرجُ أدوات كبير)، وتلك الأحداثُ أُلحقت دائمةً قبل الانهيار. وهو يعيد السجلَّ المتصل الصالح فيزيائيًّا؛ ولا يُهمل إلا الجزءُ الناقص من ذيل فيزيائي ممزق يخص إلحاقًا لم يُحلّ قط — والسجلاتُ الكاملة المستردة منه (إذ تفك خلفيةُ JSONL ترميزَ إطار Zstandard ممزق جزئيًّا) يعيد مسارُ الكتابة كتابتَها دائمةً قبل أول إلحاق جديد للمقبض. والإصلاحُ عملُ القارئ: فيقرأ الاستئنافُ (في agent loop) السجلَّ المخزَّن عبر مقبض كتابته، ويحسب `interruptedTurnClosers` — أخطاءَ الأدوات المفقودة، وأيَّ `step/end` مفتوح، و`turn/end { reason: { kind: 'interrupted' } }` مصطنَعًا — ويُلحقها عبر المقبض نفسِه دفعةً عادية قبل نشر الجلسة. و`interrupted` هو `TurnEndReason` الوحيد الذي لا تُصدره حلقةٌ (انظر [session.md](session.ar.md#why-a-turn-ended-turnendreasonmap)).

ولذلك لا يكتب الإصلاحُ إلا تحت ملكية كتابة: فمقبضُ كتابة جلسة حية يمسكه مالكُ دورة حياتها، فيرفض `open(id, 'write')` متزامنٌ بـ`SessionAlreadyOwnedError` بدل أن يتسابق الإصلاحُ مع جولة حية. ويوازن المراقبون للقراءة فقط (session-query) سجلًّا باردًا مقطوعًا بالمغلِقات نفسِها في الذاكرة وحدها، ولا يكتبون شيئًا.

والمراقبةُ للقراءة فقط هي `open(id, 'read')`: فيقدّم المقبضُ شرائحَ بادئة متصلة متحقَّقًا منها، ولا يعيد ذيلًا ممزقًا قط، ولا ترصد القراءاتُ المتكررة على مقبض واحد حالةً أقدمَ من قراءة سابقة. ولا مخزنَ جلسات مُعَدّ في جانب الحفظ الدائم: فتملك session-query مخزنَ قراءتها الباردة، وتفهرس جلسةً باردة متوازنة واحدة لكل معرّف برمز التغيير `stat().revision` ولا تعيد القراءةَ إلا حين يتغير الرمز. وتملك [ملاحظةُ الوكيل عن الحفظ الدائم القائم على المقابض](../../.agents/notes/implemented/architecture/2026-08-27-handle-based-session-persistence.ar.md) دورةَ الحياة هذه؛ ويوثّق [سجلُّ إعداد الجلسة](../../.agents/notes/archived/architecture/2026-08-05-session-preparation.md) المؤرشَف قرارَ حدّ النشر الأصلي `SessionPreparation`.

## `SessionLocation` — هدف الأثر في تشخيصات الرفض

`SessionLocation` ليس استعلامًا يراه المستهلك: فالوصولُ إلى السجل يمر بـ`read` في مقبض جلسة. وهو يبقى تشخيصَ رفض وحده، فيتيح لـ`SessionFormatUnsupportedError` أن يسمّي السجلَّ الخام الذي رفض بناءٌ تفسيرَه. وتقدّم JSONL المسارَ المطلق للنص داخل دليل مشروعها أو جلستها؛ أما الخلفيةُ التي لا أثرَ واحدًا لها لكل جلسة فلا تقدّم شيئًا.

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

## `SessionHeader` — بيانات وصفية بجوار السجل

تسافر البياناتُ الوصفية لكل جلسة **منفصلةً** عن سجل الأحداث: فتحمل الترويسةُ إصدارَ الصيغة ودليلَ العمل وبتَ نسب `isSeeded`، بينما تحمل قيمُ التخزين ذاتُ الجسم القطعَ الموروث بعينه بجوارها. ولا ينتمي أيٌّ منهما إلى `SessionEventMap` ولا يبلغ `deriveMessages()`. وتُربط الترويسةُ المنطقية عبر `session.header`؛ وتكشف الجلسةُ قطعَها باسم `inheritedEventCount`.

المصدر: [`packages/core/session/src/types.ts`](../../packages/core/session/src/types.ts)

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

## رفض الصيغة — سجلات لا يستطيع بناءٌ قراءتَها بأمانة

ترفض الخلفيةُ سجلًّا لا تستطيع تفسيرَه بأمانة بـ`SessionFormatUnsupportedError`، وهو متمايز عن `SessionPersistenceCorruptionError` لأن لا شيءَ تالفًا. ويصنّف `stat` و`list` أعلى جيل معياري ويترجمان ترويسةً تاريخية مدعومة بلا قراءة جسمها ولا تغييره. وتتشارك نداءاتُ `open` التاريخية إعدادَ ترحيل واحدًا لكل جلسة قبل أن تعيد القيمَ المنطقية الحالية، وتترك كلَّ مسار مصدر وبايت وinode بلا تغيير. ويعيد مزوّدُ JSONL مقبضَ قراءة من تلك النتيجة في الذاكرة بلا نشر؛ أما فتحُ الكتابة فيمسك ادعاءَ كاتبه الواحد وعقدَ إيجار ملفه بينما يعيد استعمالَ الإعداد، وينشر الجيلَ الحالي النهائي حصريًّا، ثم يعيد المقبضَ القابل للكتابة. والجيلُ الأعلى المستقبلي يرفض ولو بقي جيلٌ أقدم قابلًا للقراءة. وتحتفظ استعادةُ الصيغة الحالية بالامتدادات المثبَّتة وبالأحداث المجهولة الحاملة `ignorable: true`؛ أما ترحيلُ v0 وv1 وv2 التاريخي فيرفض نوعًا مجهولًا ولو وُسم بأنه قابل للتجاهل. وتُلحق الرسالةُ مسارَ السجل الخام المنتقى حين تُبقي الخلفيةُ أثرًا واحدًا لكل جلسة. وعلى خلفية خارج الشجرة فرضُ قيم مقابض مقتصرة على الحالي مكافئة ورفضٍ واعٍ بالاتجاه عند مدخل صيغتها الفيزيائية. ويملك [قرارُ ترحيل الصيغ المُصدَرة](../../.agents/notes/implemented/architecture/2026-08-31-released-session-format-migrations.ar.md) قواعدَ السلسلة والنشر غير القابل للتغيير.

## `CreateSessionOptions` — البذر والبيانات الوصفية

يأخذ إنشاءُ `Session` عبر المخزن بذرةَ `seed` (تاريخَ إعادة تشغيل أو تفريع)، وقيمةَ `inheritedEventCount` دقيقة اختيارية، و`meta` (حقولَ مستوى التخزين التي يطويها المخزنُ في `SessionHeader`). ويملأ المخزنُ `version` و`id` ويجعل `createdAt` افتراضيًا؛ وللمستدعي تقديمُ `cwd` المطلق المتحقَّق منه، ونسبِ `parentSession`، وبتِ نسب `isSeeded`، و`origin` الخشن الاختياري، و`delegationDepth`، و`agentPreset`، و`createdAt` قائمًا. ويشترط الإنشاءُ المبذور بذرةً صريحة تساوي بادئتَه الموروثة وقطعًا دقيقًا؛ ويُلحق البانيُ واسمَ بذرة النهاية الموسوم الذي يملكه الابنُ عند ذلك القطع قبل أن يضيف الإعدادُ أحداثًا يملكها الابن. وتتيح `origin: 'subagent'` لتنقّل المنتَج إخفاءَ صفوف الأبناء المكررة؛ وهي لا تثبت صحةَ واصف ولا قدرةَ الابن على الاستئناف.

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

ولذلك تكون إعادةُ التشغيل أو التفريع `ctx.agents.create({ sessionId, seed, meta })` — ويقدّم التفريعُ زيادةً على ذلك `inheritedEventCount` مع `meta.isSeeded: true`، ولا تُحفظ إلا الجلساتُ التي ينشرها agent loop، وتخزّن الحلقةُ البذرةَ عبر مقبض كتابة الجلسة الجديدة قبل النشر؛ أما استئنافُ جلسة *محفوظة* في وكيل حي فهو `ctx.agents.resume({ resumeSessionId })`.

## ملكية الإعداد والاستعادة

تقبل `SessionStore.prepare()` خياراتِ إنشاء عادية أو بذرةً قابلة للتبني عبر `RestoredSessionOptions`. وتبيّن `eventState` فيها أقيمُ الأحداث مملوكةٌ استقلالًا أم مشتركةٌ بعد التجميد العميق وحده؛ ويرسي المنتِجُ تلك الحالةَ، ولا تستنتج التشريحُ حالةً مختلفة من طول النتيجة. وتتحقق الاستعادةُ من تلك القيم وتتبناها بلا نسخة أخرى ولا مرور تجميد آخر. ثم يملك `SessionPreparation` الجلسةَ غيرَ المنشورة بعينها حتى النشر أو التراجع؛ والتخلصُ متزامنٌ ومتماثل. ويقرأ استئنافُ agent loop هذه النتيجةَ عبر مقبض كتابة الجلسة ويُلحق `interruptedTurnClosers` مملوكةً استقلالًا قبل الإعداد.

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

## مراجعات المصدر الخفيفة

يقارن مستهلكو نماذج القراءة المشتقة مراجعةً معتمة رخيصة قبل تحميل سجل أحداث كامل. والمراجعةُ رمزُ تغيير لكل نسخة خلفية يأتي من `stat` أو `list`: فالمراجعاتُ المتساوية يجوز عدُّها سجلًّا لم يتغير؛ والمراجعاتُ غيرُ المتساوية لا تعد بشيء، ولا يغيّرها تقلّبُ ملكية الكتابة قط. وتفهرس session-query مخزنَ قراءتها الباردة عليها؛ ولا دورَ للرمز في الفتح ولا القراءة ولا الاستئناف.

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

ويبقى حقلا `eventCount` و`sizeBytes` الاختياريان مراقباتِ خلفية رخيصة للمستهلكين الذين يحتاجونها صراحةً. ولا يستعمل تعدادُ الجلسات أيًّا منهما لفتح سجلات باردة: فهو يقرأ الترويساتِ مع تلميحات مخزن الإسقاط المفحوصة الهوية وحدها، فلا تحوّل ترقيةُ مخزن ولا ترقيةُ صيغة جلسة الإقلاعَ إلى مسح أجسام.

## الخلفية

ينفّذ المزوّدُ المشحون عقدَ `SessionPersistence` المجرد (`create` و`open` و`stat` و`list`، مع `SessionHandle` لكل جلسة تحمل `read` و`append` و`flush` و`close` والإلغاءَ الاختياري في كل موضع) ويجتاز مجموعةَ عقد الحفظ الدائم المشتركة:

- **[dsh-session-persistence-jsonl](../../packages/session/session-persistence-jsonl)** — سجلُّ JSONL منطقي ذو إلحاق فقط لكل جلسة، مخزَّنٌ إطاراتِ Zstandard متسلسلة بمجاميع تحقق افتراضيًا أو أسطرًا خامة بالضبط، مع تجسيد ذرّي آمن عند الانهيار، وإلحاقاتٍ تستدعي `fsync` لكل دفعة، واقتطاعِ الذيل الممزق قبل أول إلحاق جديد. ويحمل `stat` و`list` قيمةَ `sizeBytes` ومراجعةً مشتقة من `fs.stat` على قدر الاستطاعة.

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
