# Shell منفذ

[English](shell.md) | العربية

shell تنفيذ seam من [dsh-shell](../../packages/shell/shell) في `ctx.shell` فوق توفير Service Definition.[shell حزمة مجموعة](../../packages/shell/README.ar.md) صف خروج ذلك Bash و PowerShell مزود و موجه إلى نموذج Consumer. عام خلفية مهمة id، كل حق و تحكم يقع في [jobs.md](jobs.ar.md) ؛ هذا seam إرجاع عملية جملة مقبض، لا تسجيل خلفية مهمة.managed-range آلية غلاف تركيب في[عملية فرعية seam](subprocess.ar.md) بعد.

شفرة المصدر:[`packages/shell/shell/src/types.ts`](../../packages/shell/shell/src/types.ts)

## تلقي إدارة shell بيئة نطاق الأسماء

`DSH_*` متغير هو عودة Harness كل عملية فرعية واقع. موجه إلى نموذج bash أداة عبر `ctx.shellEnv` استلام تجميع هو جمع، مجددا مرور من `ShellExecRequest.dshEnv` نقل تمرير؛ عملية فرعية خدمة في دمج حالي لقطة قبل سوف إزالة وراثة بينما قدوم `DSH_*` اسم.`DshEnvironmentKey`/`DshEnvironment` مفردات عودة[عملية فرعية seam](subprocess.ar.md) كل، من `dsh-shell` إعادة توجيه خروج.

## طلب و قاعدة إطار:`resolve()` تفكيك قسم

هذا seam سوف**موجه إلى نموذج/إضافة طلب**(`workdir`/`timeoutMs`/`stdoutMaxBytes` اختياري، من إعداد أو طلب سياسة تكملة كل) و منفذ فعلي استخدام**تماما تحليل بعد spec**(هذه حقل متساو لـ لا بد ملء) قسم فتح. أداة طبقة في اثنان من بين استدعاء `ctx.shell.resolve(request)`(مستودع «حزمة حد موضع صريح أفضل في خفي صيغة» قاعدة) ؛`ShellExecSpec` يحمل هو قد تحليل قيمة.

```ts type-equiv
/**
 * A caller's execution REQUEST: `workdir` and `timeoutMs` are optional and
 * filled by {@link ShellExecutor.resolve} from the implementation's config.
 * This is the model-/plugin-facing shape; pass it to `resolve()` to obtain a
 * fully-resolved {@link ShellExecSpec}.
 */
interface ShellExecRequest {
  command: string
  /** Working directory override (default: implementation-configured). */
  workdir?: string | undefined
  /** Timeout override in milliseconds (implementations cap it). */
  timeoutMs?: number | undefined
  /**
   * Foreground stdout capture budget in bytes. Absent uses the executor's
   * default output cap. Trusted in-process consumers use this when they must
   * parse complete stdout up to their own bounded limit; the model-facing bash
   * tool does not expose it as a parameter.
   */
  stdoutMaxBytes?: number | undefined
  /** Abort signal — implementations kill the command when it fires. */
  signal?: AbortSignal | undefined
  /**
   * Bytes to write to the command's stdin, then close it. Absent leaves stdin
   * closed/empty (the default for model-driven tool calls). Set by in-process
   * plugins (e.g. the hooks bridges, which write a hook command's JSON payload
   * to its stdin); the model-facing bash tool does not expose it as a parameter
   * (a model that needs stdin uses shell syntax like a heredoc or a pipe).
   */
  stdin?: string | undefined
  /**
   * Ordinary environment entries for the command, merged after the credential
   * scrub. Managed facts belong in {@link dshEnv}, which merges after this
   * map, so an entry here can never displace one. Set by in-process plugins
   * (the hooks bridges set `CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT`, …); the
   * model-facing bash tool does not expose it as a parameter.
   */
  env?: Record<string, string> | undefined
  /**
   * Harness-owned `DSH_*` variables for this execution (typed to managed
   * keys). Executors discard ambient `DSH_*` entries before merging this
   * snapshot last, so an unavailable current fact cannot inherit a stale
   * value from the harness process and a caller {@link env} entry cannot
   * displace a managed one.
   */
  dshEnv?: DshEnvironment | undefined
  /** Fully resolved per-call sandbox policy; sandboxing executors default it. */
  sandboxPolicy?: SandboxExecutionPolicy | undefined
}
```

```ts type-equiv
/**
 * A resolved execution spec. {@link ShellExecutor.resolve} fills and caps the
 * required fields; {@link ShellExecutor.start} ignores `timeoutMs` because
 * background processes have no executor timeout.
 */
interface ShellExecSpec {
  command: string
  workdir: string
  timeoutMs: number
  /**
   * Resolved foreground stdout capture budget in bytes. `run()` uses it for
   * stdout; background jobs and stderr keep the executor's own output cap.
   */
  stdoutMaxBytes: number
  /** Abort signal — implementations kill the command when it fires. */
  signal?: AbortSignal | undefined
  /** Bytes to write to stdin before closing it; absent means no stdin. */
  stdin?: string | undefined
  /**
   * Ordinary environment entries carried through from
   * {@link ShellExecRequest.env}; {@link dshEnv} still merges after them.
   * OPTIONAL on the spec for the same reason as `stdin`: absent means no
   * ordinary extra environment.
   */
  env?: Record<string, string> | undefined
  /** Managed `DSH_*` snapshot (typed to managed keys); merges after {@link env}. */
  dshEnv?: DshEnvironment | undefined
  /** Resolved sandbox policy; ignored by executors that do not confine. */
  sandboxPolicy: SandboxExecutionPolicy | undefined
}
```

`stdin` و `env` هو تلقي معلومة مهمة عملية داخل إضافة إدخال، لا من `dsh-tool-bash` كشف. محلي منفذ سوف أولا صاف حذف بيئة في اعتماد، مجددا دمج استدعاء جهة صريح توفير env.

`stdoutMaxBytes` نفس مثال فقط توفير تلقي معلومة مهمة إضافة استخدام. هو يجعل قبل منصة مستهلك قدرة في محدود تحليل ميزانية داخل طلب كامل stdout، بينما لن تغيير stderr، خلفية مهمة أو موجه إلى نموذج bash أداة معتاد قاعدة إخراج حد أعلى.

## قبل منصة تشغيل:`ShellRunResult`

مرة قد إتمام (أو يتم إنهاء) قبل منصة تشغيل نتيجة. صحيح تسليم نتيجة**مستقل تقرير إبلاغ**: واحد عملية يمكن معا مهلة و بـ خروج رمز 0 خروج (لأن هو التقاط إشارة) ، لذلك `timedOut`،`aborted`،`signal` و `exitCode` كل منها مستقل لـ واحد حقل؛ استدعاء جهة دائم بعيد لن يأخذ مرة يتم رفع قبل في قطع تشغيل خطأ قراءة لـ صحيح معتاد نجاح.

```ts type-equiv
/** The outcome of a foreground run, including timeout during preparation. */
interface ShellRunResult {
  /** Exit code; null when preparation expired or the process died from a signal. */
  exitCode: number | null
  /** Terminating signal, or null when none was reported, including preparation expiry. */
  signal: NodeJS.Signals | null
  /**
   * True when the executor's own timeout was the FIRST cause to cut the command
   * short. Mutually exclusive with {@link aborted}: one fused deadline drives
   * both the timeout and the caller's cancellation, so a timeout and an abort
   * racing before process close report the single first-abort cause, not both
   * (see the [timeout-library Agent Note](../../../../.agents/notes/implemented/architecture/2026-07-06-timeout-deadline-library.md)).
   */
  timedOut: boolean
  /**
   * True when the caller's `AbortSignal` was the FIRST cause to kill the command
   * (and it was not the executor's own timeout). Mutually exclusive with
   * {@link timedOut} — see there for the first-cause classification.
   */
  aborted: boolean
  /** The effective timeout applied to this run (after defaulting/capping). */
  timeoutMs: number
  stdout: CollectedOutput
  stderr: CollectedOutput
  /** Sandbox execution facts, absent for an unsandboxed executor. */
  sandbox?: ShellSandboxInfo
}
```

كل تدفق هو واحد `CollectedOutput`:(ممكن يتم قطع قطع) نص إضافة استعادة معلومة؛ قطع قطع وقت،`text` هو**ذيل جزء**، كامل تدفق فيض خروج إلى واحد خاص ملف. هذه حقل عودة[عملية فرعية seam](subprocess.ar.md) كل، من `dsh-shell` إعادة توجيه خروج.

## ملف صندوق رملي:`ShellSandboxInfo`

استخدام صندوق رملي منفذ عبر `ShellExecutor.sandboxMode` كشف ذلك قد إعداد نمط رجوع قيمة. أداة طبقة طلب [`@deepseek-ai/dsh-sandbox-policy`](../../packages/sandbox/sandbox-policy/README.ar.md) ، يأخذ كل استدعاء جلسة حمل دائم `sandbox/mode` تغطية قيمة و غير ممكن تغيير cwd تحليل لـ `ShellExecRequest.sandboxPolicy`؛ مرور مستخدم دفعة دقيق، صارم إطار أكثر عرض رخو استدعاء فقط استبدال نمط. نمط/root/enforcement مفردات عودة [`@deepseek-ai/dsh-sandbox` صندوق رملي seam](sandbox.ar.md) كل؛ نمط فقط إدارة ولاية ملف فاعلية نتيجة.

صندوق رملي تحويل تشغيل سوف تقرير إبلاغ ذلك نمط، حفظ حراسة رفض تصنيف و قوي صنع تنفيذ كامل درجة.`runnerFailed` علامة أمر تشغيل قبل صندوق رملي runner قد فشل؛ قبل منصة تنفيذ سوف رمي خروج `SANDBOX_UNAVAILABLE`، بينما قد انتهاء خلفية عملية فقط قدرة عبر ذلك واقع عبر طريق تقرير إبلاغ.

```ts type-equiv
/**
 * Sandbox facts for one run, present iff a sandboxing executor handled it.
 * Facts are reported independently of process exit status so callers can
 * distinguish command failures from policy denials and runner failures.
 */
interface ShellSandboxInfo {
  /** The mode the command actually ran under. */
  mode: SandboxMode
  /** Whether the sandbox denied a file operation. */
  denied: boolean
  /** How completely the selected runner enforced the requested mode. */
  enforcement?: SandboxEnforcement
  /** Whether the sandbox runner failed before the command could run. */
  runnerFailed?: boolean
}
```

عند تلقي حد نمط لا يوجد متاح خلفية وقت،`ctx.sandbox` مزود سوف رمي خروج، منفذ سوف نقل بث من[صندوق رملي seam](sandbox.ar.md) كل `SANDBOX_UNAVAILABLE` رمز خطأ. اختيار تحديد runner رفض ذلك profile وقت سوف لمس بلوغ نفس عدد لذا عائق إغلاق قبل منصة خطأ؛ قد انتهاء خلفية مهمة فإن سجل `runnerFailed`. نموذج سوف في نتيجة في استلام إلى رفض/runner واقع، فقط عند رفض علامة إشارة خروج توليد فاعلية نمط وقت عندئذ نيل معرفة هذا نمط، و يمكن عبر `sandbox_permissions` إضافة `justification` طلب مرة صفة، صارم إطار أكثر عرض رخو إعادة محاولة؛ تنفيذ أي عملية قبل،`ctx.approval` يجب دفعة دقيق هذا مرة تأكيد قطع استدعاء. كامل سياسة و تبديل تصميم رؤية[صندوق رملي Agent Note](../../.agents/notes/implemented/feature/2026-07-06-sandbox.ar.md).

## خلفية عملية:`ShellProcess`

`start()` في مختلف خطوة بدء دقيق تجهيز إتمام بعد إرجاع جملة مقبض؛ إلغاء أو دقيق تجهيز فشل سوف في إصدار قبل رفض استدعاء. هذا جملة مقبض لا يوجد id أو owner.`dsh-tool-bash` سوف هو ملائم إعداد لـ `ctx.jobs.start()` خطاف؛ مع بعد من عام وقت التشغيل يملك مهمة معرف و دورة الحياة.`done` سوف في قاع طبقة عملية تسوية وقت إتمام كما أبدا reject؛subprocess مزود rejection سوف توليد حالة لـ `killed` عملية، و يأخذ لا إعلان مرحلة مقطع خطأ كتابة stderr. عملية تسوية بعد ما زال يمكن قراءة، و كما صندوق رملي واقع سوف في `done` إتمام قبل كتابة.

```ts type-equiv
/**
 * A background process handle returned by {@link ShellExecutor.start}. It is the
 * only access path; buffered output remains readable after exit. Composition
 * teardown (the subprocess service's disposal) kills running processes and
 * awaits {@link done}; an executor-only reload leaves them running.
 */
interface ShellProcess {
  /** Process lifecycle state (settled exactly once). */
  status: ShellProcessStatus
  /** Exit code once finished (null = killed by signal / still running). */
  exitCode: number | null
  /** Terminating signal name, when signal-killed. */
  signal: NodeJS.Signals | null
  /**
   * Resolves when the underlying process settles (never rejects — provider
   * rejection settles as `killed` with a stage-neutral error on stderr).
   */
  readonly done: Promise<void>
  /** Sandbox facts, stamped once a confined process settles. */
  sandbox?: ShellSandboxInfo
  /**
   * Read output produced since the previous read (consuming — consecutive
   * reads never re-deliver). Reads that lost data flag `lossy` and point at
   * full-stream spill files when available.
   */
  readOutput(): ShellProcessRead
  /**
   * Terminate the provider-managed range. Returns false when it had already finished
   * (no-op); idempotent.
   */
  kill(): boolean
}
```

`readOutput()` إرجاع زيادة كمية محتوى و spill استعادة معلومة:

```ts type-equiv
/** One incremental {@link ShellProcess.readOutput} read. */
interface ShellProcessRead {
  /** Output produced since the previous read (stderr in a marked section). */
  delta: string
  /** True when truncation dropped unread bytes the delta cannot include. */
  lossy: boolean
  /** Full stdout spill file, when stdout truncation occurred and a safe path is available. */
  stdoutSpillPath?: string
  /** Full stderr spill file, when stderr truncation occurred and a safe path is available. */
  stderrSpillPath?: string
}
```

## خدمة

`ShellExecutor` يملك `resolve`، قبل منصة `run`، خلفية عملية `start` و `sandboxMode` قدرة واقع.`dsh-bash-local` يملك أمر قيمة افتراضية تكملة كل، مهلة/في توقف تصنيف، طرفية بيئة و خلفية قراءة دمج؛managed-range إنهاء، محدود استلام تجميع جهاز،spill ملف، اعتماد صاف حذف و dispose(مورد تحرير) بعد تماما توقف مستقر عودة[عملية فرعية خدمة](subprocess.ar.md) كل.`dsh-tool-bash` يملك موجه إلى نموذج تصيير، و سوف خلفية جملة مقبض ملائم إعداد إلى[عام مهمة وقت التشغيل](jobs.ar.md).`dsh-shell` يملك shell أداة مشترك خروج حالة اتفاق: توجيه خروج `parseExitStatus`/`ParsedExitStatus` هو `dsh-tool-bash` `renderResult` و `dsh-tool-pwsh` `renderPwshResult` الذي إلحاق `[exit code: N]` / `[killed by signal: X]` علامة عكس تحليل، اثنان عدد أداة `presentResult` كل استخدام هو يأخذ تصيير نص تفكيك قسم لـ terminal بطاقة إخراج متن و خروج حالة pill.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxshell--shellexecutor-abstract-seam"></a>

### `ctx.shell` — `ShellExecutor` (abstract seam)

Abstract bash execution service. Subclass, implement the abstract methods, and load the subclass as a plugin — it registers as `ctx.shell` (one implementation per context; loading a second throws, which is cordis' standard duplicate-service behavior).

Implementations must honor these semantics:

- run rejects only for infrastructure failures. Nonzero exits, timeout kills, and abort kills resolve with a ShellRunResult.
- start resolves after launch preparation; cancellation or setup failure rejects before publishing a handle. No timeout applies to background processes. Once published, `done` settles at process close and never rejects; subprocess provider failures settle as `killed` with the error on stderr.
- ShellProcess.readOutput is incremental: consecutive reads never repeat output. Lossy reads report truncation and available spill files.
- A still-running background process is stopped and awaited when its owning composition tears down. With the subprocess seam that boundary is `ctx.subprocess` disposal, so a background process survives an executor-only reload.

```ts cordis-catalog
/**
 * Apply implementation-owned defaults and caps to a request before execution.
 * @param request - the caller's request; omitted fields get this
 *   implementation's defaults, capped fields are clamped.
 * @returns the fully-specified spec to hand to {@link run}/{@link start}.
 */
abstract resolve(request: ShellExecRequest): ShellExecSpec

/**
 * Run preparation and the foreground command under the resolved timeout.
 * @param spec - a resolved spec from {@link resolve}, never a raw request.
 * @returns the outcome; nonzero exits, timeout kills, and abort kills
 *   resolve with a descriptive result rather than reject.
 * @throws on preparation failure or caller cancellation before process publication.
 */
abstract run(spec: ShellExecSpec): Promise<ShellRunResult>

/**
 * Prepare a background process asynchronously and publish its live handle.
 * @param spec - a resolved spec from {@link resolve}, never a raw request.
 * @returns the live process handle after preparation; cancellation or setup failure rejects.
 */
abstract start(spec: ShellExecSpec): Promise<ShellProcess>
```

Source: [`packages/shell/shell/src/index.ts`](../../packages/shell/shell/src/index.ts)

<a id="ctxshellenv--shellenvregistry"></a>

### `ctx.shellEnv` — `ShellEnvRegistry`

Registry (`ctx.shellEnv`) for trusted, per-execution `DSH_*` variables. The namespace is rebuilt for every model shell call: ambient `DSH_*` values are discarded by the executor, then the registry's current snapshot is injected. Built-in shell facts remain owned by the registry itself while plugins can register additional, enumerable facts with effect-scoped disposal.

```ts cordis-catalog
/**
 * Register one environment contributor. Names and keys are unique; built-in
 * keys are reserved. Registration is disposed with the calling plugin fiber.
 * @param contributor - declared key ownership and per-execution resolver.
 * @returns the disposer that unregisters the contribution.
 */
register(contributor: BashEnvContributor): () => void

/**
 * Build the trusted `DSH_*` snapshot for one shell tool execution.
 * @param execution - the current tool execution.
 * @returns an immutable environment overlay containing built-ins and current contributions.
 */
collect(execution: ToolExecution): DshEnvironment

/**
 * Enumerate plugin-contributed variables without executing their resolvers.
 * @returns declarations sorted by environment variable name.
 */
list(): BashEnvVariableInfo[]
```

Types: [DshEnvironment](subprocess.ar.md) · [ToolExecution](tools.ar.md)

Source: [`packages/shell/shell-env/src/index.ts`](../../packages/shell/shell-env/src/index.ts)
<!-- END GENERATED cordis-surface -->
