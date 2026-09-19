# خلفية مهمة وقت التشغيل

[English](jobs.md) | العربية

طويل وقت تشغيل إنتاج جهة،`ctx.jobs` و مهمة تحكم أمر مشترك استخدام نوع.[وقت التشغيل Agent Note](../../.agents/notes/implemented/architecture/2026-06-20-generic-long-running-tool-runtime.ar.md) مسؤول تصميم؛ هذا صفحة سجل [`packages/jobs/jobs/src/types.ts`](../../packages/jobs/jobs/src/types.ts) في تأكيد قطع حقل و تغيير جسم.

## ID و حالة

`JobId` هو حسب `<kind>-N` توليد[صنف لوحة تحويل id](core.ar.md#branded-ids). وصول تحكم اعتماد يملك من تخويل، بينما غير id حفظ سري صفة.`JobKind` إرسال توليد ذاتي يمكن دمج توسيع map؛ سجل التسجيل سوف كل عدد kind نظر لـ لا نفاذ واضح id نطاق الأسماء.

```ts type-equiv
/**
 * Producer-defined job kinds. Plugins extend this map by declaration merging;
 * the registry treats every value as an opaque id namespace.
 */
interface JobKindMap {
  bash: 'bash'
  subagent: 'subagent'
}
```

`JobStatus` لـ `'running' | 'stopping' | 'completed' | 'killed' | 'failed'`؛ إنتاج جهة خاص لديه واقع عودة دخول `JobSnapshot.detail`.

## إنتاج جهة اتفاق

`JobStart` إعلان هوية و بدء جهاز. وقت التشغيل سوف في استدعاء `run()` قبل إتمام مسبق فحص، مع بعد إيداع تسجيل، لم يعد تنفيذ ممكن فشل خطوة. إنتاج جهة يملك تنفيذ مورد؛ وقت التشغيل يملك هوية، وصول إذن و دورة الحياة حالة.

```ts type-equiv
/**
 * Producer declaration passed to {@link JobRegistry.start}. The runtime
 * preflights access and cleanup before invoking {@link run}; the producer owns
 * execution resources while the runtime owns identity and lifecycle state.
 */
interface JobStart {
  /** Producer kind — also the id prefix (`bash`, `subagent`, …). */
  kind: JobKind
  /** One-line model-facing label (the command; the delegation description). */
  label: string
  /**
   * Optional UTF-8 byte cap for each complete model-facing completion notice or
   * output read, including controller status metadata.
   */
  outputLimitBytes?: number
  /**
   * Owning live agent. Access is fenced by its session id, and agent disposal
   * cancels and awaits the job. The instance must be the one currently
   * registered under its agent id. Omitting the owner creates an unowned job,
   * open to any caller until service disposal.
   */
  owner?: Agent
  /**
   * Start the work after preflight and synchronously return its hooks. Called
   * once; a throw leaves nothing registered, and the producer must clean up any
   * partially started resources.
   */
  run(): JobHooks
}
```

`JobHooks.done` سوف في إنتاج جهة تحرير ذلك مورد بعد resolve، بينما لا هو فقط في عمل إتمام وقت resolve. اختياري `readOutput` استخدام قدوم منطقة قسم سوف إزالة استهلاك إخراج تدفق صيغة مهمة و فقط لديه نهائي إخراج مهمة.

```ts type-equiv
/** Hooks through which the runtime controls and observes producer work. */
interface JobHooks {
  /**
   * Request termination. Must be synchronous, idempotent, and eventually settle
   * {@link done}; throws propagate. The optional reason is forwarded verbatim.
   */
  cancel(reason?: string): void
  /**
   * Resolves after the producer releases its resources, not merely when work
   * finishes. Must not reject; the runtime converts a rejection to `failed`.
   * If teardown cancellation throws, the runtime may force-fail only the
   * registry record without claiming that the work stopped.
   */
  done: Promise<JobOutcome>
  /**
   * Consume output produced since the previous call. The producer formats
   * truncation and spill notices. Absence marks a final-output-only job; each
   * job has one consuming cursor.
   */
  readOutput?(): string
}
```

```ts type-equiv
/** Terminal result supplied by a producer through {@link JobHooks.done}. */
interface JobOutcome {
  /** How the job ended: finished (`completed`), cancelled (`killed`), or broke (`failed`). */
  status: 'completed' | 'killed' | 'failed'
  /** Kind-specific detail rendered into status lines ('exit code: 3', 'max-tokens'). */
  detail?: string
  /** Final output for jobs without `readOutput`; stream jobs leave it unset. */
  output?: string
}
```

## مستهلك عرض

لقطة هو كل مرة جديد بناء فقط قراءة إسقاط.`ownerSession` يحمل لأجل تخويل مشترك `SessionId`؛ إتمام مستمع فإن سوف آخر سطر استلام إلى لأجل دورة الحياة تنظيف تأكيد قطع يملك من كائن. آخر عدد واجهة قد تسليم إنهاء حالة أو تحمل وعد تسليم وقت،`reported` سوف كبح صنع إتمام إشعار؛ ترتيب فارغ owner أو خدمة teardown إلغاء نفس مثال حساب دخول.

```ts type-equiv
/**
 * A read-only projection of one job, safe to hand to listeners and tools —
 * a fresh object per call, never live registry state.
 */
interface JobSnapshot {
  /** The registry-issued id (`<kind>-N`). */
  id: JobId
  /** The producer kind the job was registered with. */
  kind: JobKind
  /** The producer-supplied one-line label. */
  label: string
  /** Producer-owned cap for complete model-facing notices and output reads. */
  outputLimitBytes?: number
  /**
   * Owner session id used for authorization and correlation; absent for
   * unowned jobs. Completion listeners receive the exact {@link Agent}
   * separately through {@link JobDoneListener}.
   */
  ownerSession?: SessionId
  /** Current lifecycle state. */
  status: JobStatus
  /** Kind-specific status detail, present once the producer supplied one (usually terminal). */
  detail?: string
  /** Epoch ms when the job was registered. */
  startedAt: number
  /** Epoch ms when the job settled; absent while `running`/`stopping`. */
  finishedAt?: number
  /**
   * True when a kill, read, wait, or teardown cancel has reported or committed
   * to report the terminal state. Completion reporters suppress redundant
   * notices when set. Teardown claims it because the owner or service being
   * destroyed leaves no reader: a reporter that opens a turn on notice would
   * otherwise spend a model request per teardown layer.
   */
  reported: boolean
}
```

```ts type-equiv
/** Output and post-read state returned by {@link JobRegistry.read}. */
interface JobRead {
  /**
   * Stream kinds: the consuming delta since the previous read. Final-output
   * kinds: empty while live, the terminal {@link JobOutcome.output} (or
   * empty) once settled — idempotent, never consumed.
   */
  text: string
  /** The job's state at read time. */
  snapshot: JobSnapshot
}
```

## خدمة سلوك

سحب كائن [`JobRegistry`](../../packages/jobs/jobs/src/index.ts) Service Definition قاعدة تحديد أصل فرعي `start`، حد تحديد استدعاء جهة أثر مجال `get` و `list`،`read`،`kill`، محدود `wait`، لذا عائق عزل `onJobDone` و `onJobsChanged` مستمع، و `attachController`؛[`LocalJobRegistry`](../../packages/jobs/jobs-local/src/index.ts) هو ذلك عملية نطاق جزء Service Provider. تخويل سوف مقارنة مقارنة يملك من جلسة؛ يملك من تنظيف و دقيق دخول سوف استخدام تأكيد قطع قد تسجيل `Agent` نسخة. محلي Service Provider `maxConcurrentJobsPerOwner` إعداد يجب هو صحيح أمان كامل عدد، قيمة افتراضية لـ `10`؛ هو حسب تأكيد قطع owner موحد حساب `running` و `stopping` سجل، كل بلا owner مهمة مشترك واحد خدمة درجة دلو، و في إنتاج جهة إنهاء تسوية بعد تحرير سعة كمية.Service Definition اتفاق رؤية [`dsh-jobs`](../../packages/jobs/jobs/README.ar.md) ، سجل التسجيل دورة الحياة و دقيق دخول سياسة رؤية [`dsh-jobs-local`](../../packages/jobs/jobs-local/README.ar.md) ، موجه إلى نموذج Consumer رؤية [`dsh-tool-jobs`](../../packages/jobs/tool-jobs/README.ar.md).

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxjobs--jobregistry-abstract-seam"></a>

### `ctx.jobs` — `JobRegistry` (abstract seam)

Abstract background job registry. Subclass, implement the abstract methods, and load the subclass as a plugin — it registers as `ctx.jobs` (one implementation per context; loading a second throws, which is cordis' standard duplicate-service behavior).

Implementations must honor these semantics:

- Registrations outlive producer and controller fibers. Owner and service disposal cancel live work and await compliant producers; a throwing teardown cancel force-fails only the record. Teardown cancellation also marks the record reported, because a record its owner is being destroyed for has no reader left.
- Owned-job access is fenced by the owner's session id. Ids are predictable, so authorization — not secrecy — is the boundary.
- Settlement is first-wins: one terminal record, released waiters, and one round of contained listener notification, even against a late producer outcome. Completion is announced last, after the record is committed and every other observer of the settlement has seen it, because a reporter may open a model turn synchronously.
- start refuses work while no attached job controller serves the spec's owner, so a producer cannot start work that owner cannot collect or stop. One registry serves every composition in the process, so this question — and completion-listener delivery — is owner-relative rather than process-wide: registrations made from an unscoped context serve every owner, and registrations made under an agent composition's scope serve exactly the agents composed under it.

```ts cordis-catalog
/**
 * Preflight access, validation, owner cleanup, and implementation-owned
 * admission before starting and atomically registering work. Any preflight
 * rejection leaves no job id or execution resource. A throwing starter
 * leaves nothing registered; after it returns, registration cannot fail.
 * Settlement records the outcome, notifies listeners, and releases waiters.
 * @param spec - job identity, owner, and synchronous starter.
 * @returns the registry-issued `<kind>-N` id.
 */
abstract start(spec: JobStart): JobId

/**
 * List caller-owned and unowned jobs in registration order without exposing
 * another session's labels.
 * @param caller - reading agent; a non-agent caller sees only unowned jobs.
 * @returns fresh snapshots.
 */
abstract list(caller?: Agent): JobSnapshot[]

/**
 * Return a non-consuming snapshot without changing its read cursor or notice
 * state. Throws for an unknown or foreign job.
 * @param id - job to look up.
 * @param caller - reading agent checked against the owner.
 * @returns a fresh snapshot.
 */
abstract get(id: JobId, caller?: Agent): JobSnapshot

/**
 * Read the next stream delta, or the idempotent final output after settlement.
 * A terminal read marks the job reported. Throws for an unknown or foreign
 * job.
 * @param id - job to read.
 * @param caller - reading agent checked against the owner.
 * @returns output text and the post-read snapshot.
 */
abstract read(id: JobId, caller?: Agent): JobRead

/**
 * Request cancellation, then mark the job stopping and reported. A producer
 * throw propagates without changing job state. Throws for an unknown or
 * foreign job.
 * @param id - job to cancel.
 * @param caller - killing agent checked against the owner.
 * @param reason - logged reason forwarded to the producer.
 * @returns `requested` for live work, otherwise `already-finished`.
 */
abstract kill(id: JobId, caller?: Agent, reason?: string): 'requested' | 'already-finished'

/**
 * Wait for settlement or timeout without cancelling the job. Caller abort
 * rejects only while the job is live; after settlement the terminal
 * snapshot wins so a notice suppressed for this waiter is still delivered.
 * Throws for invalid, unknown, or foreign input.
 * @param id - job to wait for.
 * @param timeoutMs - positive finite wait bound in milliseconds.
 * @param caller - waiting agent checked against the owner.
 * @param signal - optional cancellation of the wait itself.
 * @returns snapshot at settlement or timeout.
 */
abstract wait(id: JobId, timeoutMs: number, caller?: Agent, signal?: AbortSignal): Promise<JobSnapshot>

/**
 * Register an effect-scoped completion listener. It receives the settlements
 * of the owners its registering context's scope covers; each listener is
 * contained; returned promises are observed but not awaited. No listener runs
 * after service disposal.
 * @param listener - receives each terminal snapshot and its exact owner.
 * @returns disposer that unregisters the listener.
 */
abstract onJobDone(listener: JobDoneListener): () => void

/**
/**
 * Register an effect-scoped observer of visible-set changes. It fires after
 * every commit that changes what {@link list} returns for that owner —
 * registration, every stopping transition (including the one teardown
 * performs before it awaits a slow producer), settlement, owner-disposal
 * removal, and the emptying that service disposal commits — so an observer
 * re-reads rather than accumulating deltas.
 *
 * Delivery is owner-relative on the same terms as {@link onJobDone}: an
 * observer registered from an unscoped context — a host composition's own
 * carrier — sees every owner, while one registered under an agent
 * composition's scope sees exactly the agents composed under it.
 *
 * This is not a superset of {@link onJobDone}: that one delivers the terminal
 * record under first-wins semantics a job controller couples to notice
 * delivery, while this one carries no delivery meaning and marks nothing
 * reported. Listeners are contained and never awaited.
 * @param listener - receives the owner whose visible set changed, or
 *   `undefined` when an unowned job changed and every caller's set did.
 * @returns disposer that unregisters the listener.
 */
abstract onJobsChanged(listener: JobsChangedListener): () => void

/**
 * Attach an effect-scoped controller that can read and stop jobs. It serves the
 * owners its registering context's scope covers, and {@link start} refuses an
 * owner no attached controller serves.
 * @param name - diagnostic label; duplicate names remain independent.
 * @returns disposer that detaches this controller.
 */
abstract attachController(name: string): () => void
```

Types: [Agent](core.ar.md)

Source: [`packages/jobs/jobs/src/index.ts`](../../packages/jobs/jobs/src/index.ts)
<!-- END GENERATED cordis-surface -->
