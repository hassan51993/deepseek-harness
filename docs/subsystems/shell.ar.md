# منفّذ الصدفة

[English](shell.md) | العربية

يستعمل seam تنفيذ الصدفة الحزمةَ [dsh-shell](../../packages/shell/shell) تعريفًا لخدمته على `ctx.shell`. وتعدّد [مجموعة حزم الصدفة](../../packages/shell/README.ar.md) مزوّديها لـBash وPowerShell والمستهلكين الذين يراهم النموذج. وتعيش معرّفاتُ مهام الخلفية العامة وملكيتُها وضوابطُها في [jobs.md](jobs.ar.md)؛ ويعيد هذا الـseam مقبضَ عملية بلا تسجيل مهمة. وتعيش آلياتُ المدى المدار خلف [seam العمليات الفرعية](subprocess.ar.md).

المصدر: [`packages/shell/shell/src/types.ts`](../../packages/shell/shell/src/types.ts)

## فضاء أسماء بيئة الصدفة المدارة

متغيّراتُ `DSH_*` حقائقُ عمليات أبناء يملكها الحزام. وتجمعها أداةُ bash التي يراها النموذج عبر `ctx.shellEnv` وتمرّرها في `ShellExecRequest.dshEnv`؛ وتزيل خدمةُ العمليات الفرعية أسماءَ `DSH_*` الموروثة قبل دمج اللقطة الحالية. ويملك [seam العمليات الفرعية](subprocess.ar.md) مفرداتِ `DshEnvironmentKey` و`DshEnvironment`، وتعيد `dsh-shell` تصديرَها.

## الطلب في مقابل المواصفة: انقسام `resolve()`

يفصل الـseam بين **الطلب الذي يراه النموذجُ أو الإضافة** (فيه `workdir` و`timeoutMs` و`stdoutMaxBytes` اختيارية، وتُملأ من الضبط أو من سياسة الطلب) وبين **المواصفة المحلولة كاملةً** التي يعمل عليها المنفِّذ (وفيها تلك الحقولُ مشترَطة). وتنادي طبقةُ الأدوات `ctx.shell.resolve(request)` بينهما (بحسب قاعدة المستودع «الصريحُ أولى من الضمني عند حدود الحزم»)؛ وتحمل `ShellExecSpec` القيمَ المحلولة.

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

و`stdin` و`env` مُدخَلا إضافات موثوقة داخل العملية ولا تكشفهما `dsh-tool-bash`. ويمسح المنفِّذُ المحلي الاعتماداتِ المحيطة قبل دمج البيئة التي يقدّمها المستدعي صراحةً.

و`stdoutMaxBytes` للإضافات الموثوقة وحدها أيضًا. وهي تتيح لمستهلك أمامي أن يطلب stdout كاملًا حتى ميزانية محلِّل محدودة بلا تغيير stderr ولا مهام الخلفية ولا سقف الخرج المعتاد في أداة bash التي يراها النموذج.

## التشغيلات الأمامية: `ShellRunResult`

حصيلةُ تشغيل أمامي اكتمل أو قُتل. ويُبلَّغ عن الحصائل المتعامدة **مستقلةً** — فقد تنتهي مهلةُ عملية وتخرج بالرمز 0 في آن لأنها اعترضت الإشارة — فتكون `timedOut` و`aborted` و`signal` و`exitCode` حقولًا مستقلة؛ فلا يقرأ مستدعٍ تشغيلًا مبتورًا نجاحًا نظيفًا.

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

وكلُّ مجرى قيمةُ `CollectedOutput` — وهي النصُّ الذي قد يكون مقتطعًا مع معلومات الاسترجاع؛ وحين يُقتطع يكون `text` هو **الذيل** ويفيض المجرى كاملًا إلى ملف خاص. ويملك الحقولَ [seam العمليات الفرعية](subprocess.ar.md)، وتعيد `dsh-shell` تصديرَها.

## عزل الملفات: `ShellSandboxInfo`

يكشف المنفِّذُ المستهلِك للعزل احتياطيَّ وضعه المضبوط عبر `ShellExecutor.sandboxMode`. وتطلب طبقةُ الأدوات من [`@deepseek-ai/dsh-sandbox-policy`](../../packages/sandbox/sandbox-policy/README.ar.md) أن تحلّ تجاوزَ `sandbox/mode` الدائم لكل جلسة مستدعية ودليلَ عملها غيرَ القابل للتغيير إلى `ShellExecRequest.sandboxPolicy`؛ والنداءُ الأوسعُ صراحةً الذي وافق عليه المستخدم لا يستبدل إلا الوضع. ويملك [seam `@deepseek-ai/dsh-sandbox`](sandbox.ar.md) مفرداتِ الوضع والجذر والفرض؛ ولا تحكم الأوضاعُ إلا آثارَ الملفات.

ويبلّغ التشغيلُ المعزول عن وضعه، وعن تصنيف المنع المتحفظ، وعن اكتمال الفرض. وتعلّم `runnerFailed` فشلَ مشغّل عزل قبل أن يعمل الأمر؛ فيرمي التنفيذُ الأمامي `SANDBOX_UNAVAILABLE`، بينما لا تملك عمليةُ خلفية استقرت إلا قناةَ حقائقها.

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

ورمزُ الخطأ `SANDBOX_UNAVAILABLE` (يملكه [seam العزل](sandbox.ar.md)) هو ما يرميه مزوّدُ `ctx.sandbox` — وينشره المنفِّذ — حين لا توجد خلفيةٌ صالحة لوضع محصور. والمشغّلُ المختار الذي يرفض ملفَّه التعريفي يبلغ الخطأَ الأمامي الفاشل مغلقًا نفسَه؛ أما مهمةُ الخلفية المستقرة فتسجّل `runnerFailed`. ويتلقى النموذجُ حقائقَ المنع والمشغّل في النتائج، ولا يعرف الوضعَ الساري إلا حين يسمّيه واسمُ منع، ويستطيع طلبَ إعادة محاولة واحدة أوسع صراحةً عبر `sandbox_permissions` مع `justification`؛ وعلى `ctx.approval` أن يمنح ذلك النداءَ بعينه قبل أن ينفَّذ شيء. وتصميمُ السياسة والتبديل كاملًا في [ملاحظة الوكيل عن العزل](../../.agents/notes/implemented/feature/2026-07-06-sandbox.ar.md).

## عمليات الخلفية: `ShellProcess`

يحلّ `start()` بمقبض بعد تحضير إطلاق لاتزامني؛ ويرفض الإلغاءُ أو فشلُ التحضير قبل النشر. ولا معرّفَ للمقبض ولا مالك. وتهايئه `dsh-tool-bash` مع خطّافات `ctx.jobs.start()`؛ ثم تملك بيئةُ التشغيل العامة هويةَ المهمة ودورةَ حياتها. ويحلّ `done` حين تستقر العمليةُ الأساسية ولا يرفض قط؛ ورفضُ مزوّد العمليات الفرعية يصير عمليةً `killed` مع خطأ محايد المرحلة على stderr. وتبقى القراءاتُ صالحةً بعد الاستقرار، وتُختم حقائقُ العزل قبل أن يحلّ `done`.

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

ويعيد `readOutput()` الفرقَ التدريجي وحقائقَ استرجاع الفائض:

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

## الخدمة

يملك `ShellExecutor` الدوالَّ `resolve` و`run` الأمامية و`start` لعمليات الخلفية وحقيقةَ القدرة `sandboxMode`. وتملك `dsh-bash-local` افتراضاتِ الأوامر وتصنيفَ المهلة والإجهاض وبيئةَ الطرفية ودمجَ قراءات الخلفية؛ أما إنهاءُ المدى المدار والمجمِّعاتُ المحدودة وملفاتُ الفائض ومسحُ الاعتمادات وسكونُ التخلص فتخص [خدمة العمليات الفرعية](subprocess.ar.md). وتملك `dsh-tool-bash` العرضَ الذي يراه النموذج وتهايئ مقابضَ الخلفية مع [بيئة تشغيل المهام العامة](jobs.ar.md). وتملك `dsh-shell` عقدَ حالة الخروج المشترك لأدوات الصدفة: فالدالةُ المصدَّرة `parseExitStatus` والنوعُ `ParsedExitStatus` يعكسان واسمَي `[exit code: N]` و`[killed by signal: X]` اللذين تُلحقهما `renderResult` في `dsh-tool-bash` و`renderPwshResult` في `dsh-tool-pwsh`، وتستعملهما دالةُ `presentResult` في الأداتين لتقسيم النص المعروض إلى متن خرج بطاقة الطرفية وإلى قرص حالة الخروج فيها.

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
