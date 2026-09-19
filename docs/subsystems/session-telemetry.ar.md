# بعيد قياس (telemetry)

[English](session-telemetry.md) | العربية

مقابل خارج جلسة فوق تقرير تفكيك قسم لـ واحد بند[قدرة seam](../capability-seams.ar.md):Service Definition و التقاط تنسيق ضبط جهاز ([dsh-session-telemetry](../../packages/session/session-telemetry) ،`ctx.sessionTelemetry`) يملك كامل مرجعي حدث التقاط،`session-telemetry/record` انفصال حساس waterfall(شلال نشر صيغة حدث) ،handoff تنقل علامة و الأكثر صغير خلفية اتفاق؛ نشر جهة تحميل Service Provider([dsh-session-telemetry-otel](../../packages/session/session-telemetry-otel)) فإن هو أصل مثال إعداد OpenTelemetry JS SDK سجل خط الإنتاج. هو هو واحد بند اختياري قدرة، لا يخص agent loop(ذكي جسم حلقة) رئيسي جاف، هذا داخل أيضا لا يوجد أي محتوى سوف دخول نموذج طلب. حد عام إدارة (harness مسؤولية توقف في `emit()`؛ دفعة معالجة، إعادة محاولة، ترتيب طابور و فقد فقد سياسة كل يخص فوق تقرير SDK) وصل نفس يتم مرفوض بديل خطة، متساو قد في[تكرار نشط Agent Note](../../.agents/notes/implemented/feature/2026-07-23-session-telemetry-otel-revival.ar.md) في تحديد سجل؛ التقاط و تنقل علامة اتفاق رؤية [Service Definition README](../../packages/session/session-telemetry/README.ar.md).

شفرة المصدر:[`packages/session/session-telemetry/src/index.ts`](../../packages/session/session-telemetry/src/index.ts)

## منطق سجل

```ts type-equiv
/**
 * Severity of a telemetry record, pre-mapped at capture so a receiver can
 * alert with zero configuration: `error` for events whose own outcome flag
 * says so (the tool-result block's `isError`, `turn/end` error reasons) and for
 * `agent-error` operational records. Captured events otherwise default to
 * `info`; `warn` remains available to `session-telemetry/record` policies and
 * backends.
 */
type SessionTelemetrySeverity = 'info' | 'warn' | 'error'
```

```ts type-equiv
/**
 * One logical record handed to a backend — the capture contract's whole outbound
 * vocabulary. Ledger records mirror session-log events one-to-one;
 * operational records (`channel: 'ops'`) carry the two signals with no log
 * home (`agent-error`, `shutdown`) and deliberately omit `event.seq`-style
 * identity so they can never be mistaken for ledger rows.
 */
interface SessionTelemetryRecord {
  /** Ledger (session-log mirror) or ops (operational signal) channel; backends keep the two under separate instrumentation scopes. */
  channel: 'ledger' | 'ops'
  /** Unix epoch milliseconds — the source event's append time for ledger records, the emission time for ops records. */
  time: number
  /** Pre-mapped alerting severity; see {@link SessionTelemetrySeverity}. */
  severity: SessionTelemetrySeverity
  /**
   * Identity attributes, deliberately minimal: ledger records carry
   * `session.id`, `session.format_version`, `event.type`, `event.seq`, plus optional
   * `session.cwd` / `session.parent_id`; a seeded Session also carries
   * `session.seed_length` from its exact inherited event count;
   * ops records carry `telemetry.op`, `session.id`, and (for `agent-error`)
   * `agent.id`, `turn`, `step`, `error.name`. Anything recoverable from the
   * body is intentionally NOT duplicated here.
   */
  attributes: Record<string, string | number>
  /**
   * The complete payload: a deep copy of the session event's `data` for
   * ledger records (JSON-serializable by `Session.append`'s own
   * validation), or the op payload for ops records. Never mutated after
   * handoff.
   */
  body: unknown
}
```

كل بند مرجعي[جلسة حدث](session.ar.md) كل سوف كامل نفاذ نقل لـ واحد بند لديه ترتيب ledger سجل، يشمل كل يحمل كامل ضيق تجميع stream `assistant/message` أو `assistant/attempt`، و هذا seam من لم استماع قول مرور، من إضافة دمج دخول قدوم نوع. عملية محلي `agent/assistant-stream` frame لا دخول هذا حمل دائم feed. جديد Session كائن من ذلك دورة الحياة حد بدء، حذف غير خلفية اختيار `includeHistory`؛ إعادة استلام رعاية نفس كائن وقت سوف من handoff تنقل علامة بعد متابعة. إلقاء تمرير هو كل قوة بينما لـ: تنقل علامة علامة هو «قد تسليم وصل» بينما غير «قد إرسال بلوغ» ، سجل ممكن فقد فقد (انهيار انهيار، إعادة تحميل نافذة) أيضا ممكن تكرار (جديد كائن إعادة تشغيل،SDK إعادة محاولة) ، لذلك استقبال طرف مقابل ledger سجل أساس في `(session.id, session.format_version, event.seq)` ذهاب إعادة؛ops سجل لحظة معنى حذف هذا صنف معرف——هو جمع هو لأجل إبلاغ تحذير إشارة، بينما غير لأجل تراكم إضافة بند، تكرار يتم سعة تحمل بينما غير يتم ذهاب إعادة.

## مشترك كشف كشف

كل خلفية كل عبر `ctx.sessionTelemetry` فوق مطلوب سحب كائن `sharing` عضو كشف ذلك نشر درجة نمط ([Service Definition README](../../packages/session/session-telemetry/README.ar.md#the-sharing-disclosure)). هو حيث لا هو تدريجي Session وصل قبول قرار، أيضا لا هو إلقاء تمرير عودة تنفيذ.`/feedback` تأكيد نص لا استعلام هو.

```ts type-equiv
/**
 * Deployment-selected session-sharing mode, not confirmation of SDK delivery.
 */
type SessionTelemetrySharingStatus = 'full' | 'feedback-only' | 'disabled'
```

## التقاط سياسة

```ts type-equiv
/** Whether capture follows live events or reads the canonical log only when requested. */
type SessionTelemetryCapture = 'live' | 'on-demand'
```

```ts type-equiv
/** Backend-selected capture mode and history policy. */
interface SessionTelemetryCaptureOptions {
  /** Follow live events, or wait for explicit capture; defaults to live. */
  capture?: SessionTelemetryCapture
  /** Include stored history before this lifecycle; defaults to false. */
  includeHistory?: boolean
}
```

`includeHistory` سماح التقاط تخزين و وراثة سجل، لكن ذاته لا تخويل التقاط.[OTel خلفية](../../packages/session/session-telemetry-otel/README.ar.md) استخدام حسب يحتاج التقاط، و اشتراط جديد ذاته صريح عكس تغذية؛ هو فقط تحرير قطع حتى هذا عكس تغذية كامل بادئة، ملائم لأجل كل مزود.

## خلفية اتفاق

```ts type-equiv
/**
 * The minimum backend contract the coordinator requires. {@link SessionTelemetryBackend} is
 * its service-registered form; tests compose the coordinator with a bare
 * implementation of this interface.
 */
interface SessionTelemetrySink {
  /**
   * Hand one record to the backend's pipeline. MUST be a non-blocking
   * enqueue — the coordinator calls this synchronously from the
   * `session/event` hot path or an explicit canonical-log capture, so anything
   * slower than a queue push would tax the agent loop or feedback handling.
   * Errors thrown here are contained by the coordinator and logged; they
   * never reach the loop.
   * @param record - the logical record to report; owned by the backend after the call.
   */
  emit(record: SessionTelemetryRecord): void
  /**
   * Optional hint that a turn ended. A backend may forward it to its SDK's
   * flush so records are exported after each turn. Called
   * fire-and-forget; implementations must not block and must not throw
   * meaningfully (the coordinator contains exceptions). Most backends should
   * leave this unimplemented and let their SDK's own batching cadence govern
   * export timing: a backend that does implement it owns the interaction
   * between its concurrent flushes and {@link shutdown}'s drain (the OTel
   * backend leaves it unimplemented for exactly that hazard — see the
   * revival Agent Note).
   */
  flush?(): void
  /**
   * Forward the fiber's disposal to the SDK: flush whatever is queued and
   * reach quiescence, per the SDK's own shutdown contract. Everything
   * emitted before this call must still be delivered — including records
   * enqueued while a {@link flush} hint is in flight, so a backend whose SDK
   * guards against concurrent flushes orders behind the outstanding one (the
   * coordinator emits its dispose-time `shutdown` markers immediately before
   * calling this). Awaited by the coordinator's dispose; a rejection is
   * logged as a warning and never fails application teardown.
   * The coordinator captures dispose-time shutdown markers immediately before
   * this call for live capture; on-demand capture creates no ops records.
   * @returns resolves when the backend's pipeline has quiesced.
   */
  shutdown(): Promise<void>
}
```

`SessionTelemetryBackend`(`ctx.sessionTelemetry`،[توقيع](#ctxsessiontelemetry--sessiontelemetrybackend-abstract-seam)) هو هذا اتفاق يمكن تحميل شكل: كل سياق فقط سماح واحد تنفيذ، تكرار تحميل سوف رمي خروج استثناء؛ خلفية في ذلك بنية صنع دالة في تركيب seam `SessionTelemetryCoordinator`، بـ هذا تركيب إعداد التقاط جانب.

## انفصال حساس waterfall:`session-telemetry/record`

كل بند سجل في مرجعي حدث فرعي هذا و `emit()` بين كل يلزم مرور مرور `session-telemetry/record` [waterfall](../cordis-primer.ar.md#cordis-waterfall-semantics)([حدث بند](#session-telemetryrecord--waterfall)).seam ذاته لا حمل أي قاعدة: لم تركيب مستمع وقت، سجل بـ التقاط وقت أصل مثال وصول خلفية؛ توجيه خروج بيانات قدرة جاف صاف إلى ماذا مسار درجة، تماما تماما أخذ قرار في نشر جهة تركيب ماذا قاعدة. مستمع عبر تغيير تبديل `next()` قيمة راجعة قدوم كومة تراكم؛ لا استدعاء `next()` حينئذ إرجاع، أي استبدال ذلك تحت جهة الكل منطق؛ رمي خروج استثناء مستمع سوف في تنسيق ضبط جهاز عزل نطاق داخل بـ fail-closed طريقة خصم تحت هذا واحد بند سجل. انفصال حساس فقط أثر في توجيه خروج فرعي هذا؛ مرجعي جلسة سجل دائم لا تعديل كتابة.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxsessiontelemetry--sessiontelemetrybackend-abstract-seam"></a>

### `ctx.sessionTelemetry` — `SessionTelemetryBackend` (abstract seam)

Loadable form of the backend contract: one implementation per context — the cordis `Service` registration under the `telemetry` key throws on a duplicate, cordis' standard behavior. A backend composes a SessionTelemetryCoordinator in its constructor to install the capture side.

```ts cordis-catalog
/**
 * See {@link SessionTelemetrySink.emit} — that declaration is the contract's one home.
 * @param record - the logical record to report; owned by the backend after the call.
 */
abstract emit(record: SessionTelemetryRecord): void

/** See {@link SessionTelemetrySink.flush}. */
flush?(): void

/**
 * See {@link SessionTelemetrySink.shutdown}.
 * @returns resolves when the backend's pipeline has quiesced.
 */
abstract shutdown(): Promise<void>
```

Source: [`packages/session/session-telemetry/src/index.ts`](../../packages/session/session-telemetry/src/index.ts)

<a id="session-telemetry-events"></a>

### `session-telemetry/*` events

<a id="session-telemetryrecord--waterfall"></a>

#### `session-telemetry/record` — waterfall

Transform one outbound record before it reaches the backend. This waterfall is the Service Definition's redaction extension point. It ships NO rules of its own: the innermost `next()` passes the record through unchanged, and with no listener mounted records reach the backend as captured, so exported data is exactly as clean as the rules a deployment mounts. Listeners stack by transforming `next()`'s return value; returning without `next()` replaces everything beneath. Dispatched synchronously on the capture hot path inside the coordinator's containment: a throwing listener withholds that one record (fail-closed) and never reaches the agent loop. Live capture dispatches at append time; on-demand capture dispatches while reading the canonical log. Redaction applies to the exported copy only; the canonical session log is never rewritten.

```ts cordis-catalog
/**
 * Transform one outbound record before it reaches the backend. This
 * waterfall is the Service Definition's redaction extension point. It ships NO rules
 * of its own: the
 * innermost `next()` passes the record through unchanged, and with no
 * listener mounted records reach the backend as captured, so exported
 * data is exactly as clean as the rules a deployment mounts. Listeners
 * stack by transforming `next()`'s return value; returning without
 * `next()` replaces everything beneath. Dispatched synchronously on the
 * capture hot path inside the coordinator's containment: a throwing
 * listener withholds that one record (fail-closed) and never reaches the
 * agent loop. Live capture dispatches at append time; on-demand capture
 * dispatches while reading the canonical log. Redaction applies to the
 * exported copy only; the canonical session log is never rewritten.
 * @param record - the candidate record, already the coordinator's own deep
 *   copy; listeners return a (possibly new) record and must not mutate it.
 * @mode waterfall
 */
'session-telemetry/record'(record: SessionTelemetryRecord, next: () => SessionTelemetryRecord): SessionTelemetryRecord
```

Source: [`packages/session/session-telemetry/src/index.ts`](../../packages/session/session-telemetry/src/index.ts)
<!-- END GENERATED cordis-surface -->
