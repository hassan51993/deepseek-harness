# عملية فرعية

[English](subprocess.md) | العربية

عملية فرعية seam قسم لـ Service Definition([dsh-subprocess](../../packages/subprocess/subprocess) ،`ctx.subprocess`) و Service Provider([dsh-subprocess-local](../../packages/subprocess/subprocess-local)) ؛ هو Consumer هو أخرى قدرة seam و عملية خارج خلفية:[bash منفذ بيت عائلة](shell.ar.md) استخدام استلام تجميع نمط دفعة كمية إخراج،LSP استخدام أصلي بروتوكول إدارة طريق،PTY خلفية استخدام طرفية أصل لغة،ACP(Agent Client Protocol)subagent خلفية فإن استخدام عبر إدارة طريق نقل ndjson، و يجعل stderr اعتماد inherit. هذا seam يملك تلقي إدارة `DSH_*` بيئة نطاق الأسماء، مشترك اعتماد صاف حذف (`scrubbedParentEnv`) و `CollectedOutput` شكل حالة؛[dsh-shell](../../packages/shell/shell) إعادة تصدير هذا طقم مفردات، جعل bash مستهلك إبقاء مفرد واحد استيراد مدخل.

شفرة المصدر:[`packages/subprocess/subprocess/src/types.ts`](../../packages/subprocess/subprocess/src/types.ts) و [`packages/subprocess/subprocess/src/index.ts`](../../packages/subprocess/subprocess/src/index.ts)

## يمكن تنفيذ ملف فحص بحث

واحد مزود spawn عمل دليل، يمكن تنفيذ ملف مسار، عادي عملية و طرفية جلسة، و تركيب نظام الملفات مزود موضع في نفس مسار و عملية نطاق الأسماء.`resolveExecutable(command, env?, signal?)` تحقق قطعا مقابل يمكن تنفيذ ملف مسار، أو عبر مزود تنظيف بعد `PATH` إضافة متعمد تغطية قدوم تحليل عار اسم.

## تلقي إدارة بيئة نطاق الأسماء و التقاط إخراج

`DSH_*` متغير هو عودة Harness كل عملية فرعية واقع؛ تنفيذ سوف في دمج استدعاء جهة صريح `env` قبل إسقاط بيئة في قد لديه `DSH_*` اسم، لذلك حالي واقع فقط سوف بـ متعمد توفير نص بند شكل صيغة وصول، بينما صريح `undefined` tombstone سوف حذف عادي بيئة في قد لديه قيمة. كل بند يتم استلام تجميع تدفق كل عبر `CollectedOutput` تقرير إبلاغ ذاته مقتطع و spill استعادة حالة.

```ts type-equiv
/** One environment key inside the managed {@link DSH_ENV_PREFIX} namespace. */
type DshEnvironmentKey = `${typeof DSH_ENV_PREFIX}${string}`
```

```ts type-equiv
/** Trusted DeepSeek Harness variables for one child-process execution. */
type DshEnvironment = Readonly<Record<DshEnvironmentKey, string>>
```

```ts type-equiv
/** One captured stream: the (possibly truncated) text plus recovery info. */
interface CollectedOutput {
  /** Collected text — the TAIL of the stream when truncated. */
  text: string
  /** True when bytes were dropped from `text`. */
  truncated: boolean
  /** Path to a file holding the COMPLETE stream, when truncated and available. */
  spillPath?: string
}
```

## Node ريح إطار stdio موضع وضع طريقة (disposition)

كل بند تدفق موضع وضع طريقة كل صريح إعطاء خروج، من كل مستهلك ذاتي سطر اختيار: أصلي إدارة طريق لأجل بروتوكول قسم لقطة (LSP JSON-RPC،ACP ndjson) ،inherit لأجل مباشر عبر تشخيص إخراج، استلام تجميع نمط لأجل محدود دفعة كمية إخراج؛ منها spill ملف هو اختياري، لذلك تشخيص ذيل جزء (لغة خادم stderr) يمكن فقط في داخل تخزين في مؤقت اندفاع، لا إبقاء تحت أي ملف.

```ts type-equiv
/**
 * stdin disposition. `'ignore'` leaves fd 0 on `/dev/null`; `'pipe'` exposes
 * {@link SubprocessHandle.stdin} for the caller's ongoing protocol writes;
 * `{ data }` writes the bytes and closes (the batch shape).
 */
type SubprocessStdinMode = 'ignore' | 'pipe' | { readonly data: string }
```

```ts type-equiv
/**
 * Bounded in-memory collection for one output stream, with an optional
 * full-stream spill file. Omitting `spill` keeps only the in-memory tail —
 * the diagnostic-tail shape (a language server's stderr); including it makes
 * the complete stream recoverable up to its cap (the bash tool shape).
 */
interface SubprocessCollect {
  /** In-memory cap in bytes; overflow keeps the TAIL. */
  maxBytes: number
  /** Full-stream spill file; absent disables spilling entirely. */
  spill?: {
    /** Whole-stream byte cap; a larger stream discards its now-incomplete spill. */
    maxBytes: number
  }
}
```

```ts type-equiv
/**
 * stdout/stderr disposition. `'pipe'` exposes the raw `Readable` for the
 * caller's protocol decoding; `'inherit'` passes the parent's descriptor
 * through (child diagnostics land on the harness's own stream); a
 * {@link SubprocessCollect} object buffers boundedly with offset-based reads.
 */
type SubprocessOutputMode = 'pipe' | 'inherit' | SubprocessCollect
```

```ts type-equiv
/** Per-stream stdio dispositions, all explicit — this seam applies no defaults. */
interface SubprocessStdio {
  stdin: SubprocessStdinMode
  stdout: SubprocessOutputMode
  stderr: SubprocessOutputMode
  /** Request a separate byte-mode duplex channel; omission creates none. */
  control?: 'pipe'
}
```

## تماما صريح spawn spec

هذا seam لا تطبيق أي قيمة افتراضية: كل بند موضع وضع طريقة، حد و دليل كل في spec فوق صريح إعطاء خروج، لذلك من استدعاء جهة ذاتي ذات إعداد قرار هو جمع، بينما لا هو من بعض عدد إخفاء عملية فرعية خدمة قيمة افتراضية قرار.`argv` أبدا مرور مرور shell حل تفسير.

```ts type-equiv
/**
 * A fully-specified spawn request. This seam applies no defaults: every
 * disposition, limit, and directory is explicit, so the caller's own config —
 * not a hidden subprocess-service default — decides them (the `dsh-shell`
 * request/spec split is the owning template).
 */
interface SubprocessSpawnSpec {
  /** Executable and arguments; `argv[0]` is the program. Never shell-interpreted here. */
  argv: readonly string[]
  /** Working directory for the child. */
  cwd: string
  /** Per-stream stdio dispositions. */
  stdio: SubprocessStdio
  /**
   * Positive finite grace period in milliseconds, no greater than
   * `MAX_TIMER_DELAY_MS`, available to the provider's termination procedure
   * and used for draining still-open collected pipes after the process exits
   * (an inherited descriptor held by a survivor cannot hold the outcome open
   * indefinitely). Providers document whether range termination is staged or
   * immediate.
   */
  graceMs: number
  /**
   * Abort signal — starts the terminate escalation on the managed range when
   * it fires. The caller owns deadlines and cause classification; this seam
   * only reacts to the abort.
   */
  signal?: AbortSignal | undefined
  /**
   * Explicit environment entries merged onto the implementation's scrubbed
   * parent base (see `scrubbedParentEnv`), with no namespace validation. A
   * string is a deliberate caller opt-in, so a forwarded credential-shaped
   * entry or current `DSH_*` fact survives the scrub; `undefined` is a
   * tombstone that removes an ordinary ambient entry from the child.
   */
  env?: NodeJS.ProcessEnv | undefined
}
```

## جملة مقبض: تدفق، قراءة جهاز و managed-range إنهاء

spawn سوف تزامن إرجاع نشط حركة جملة مقبض، هدف و تلقي إدارة نطاق معرف فإن إبقاء في provider داخلي. استلام تجميع نمط قراءة جهاز قبول كل تدفق بايت انحراف نقل كمية كما من لا إزالة استهلاك، لذلك مستقل قراءة جهاز لن انتزاع مشي ذاك هذا زيادة كمية؛ إدارة طريق تحويل تدفق عودة استدعاء جهة كل.`terminate()` بدء provider سجل إنهاء مرور مسار،`waitForExit()` مراقبة نفس عدد provider-managed range؛ قسم مرحلة مقطع provider يمكن استخدام `graceMs`، قيام أي إنهاء provider لن انتظار. مستهلك يمكن في هذا اثنان بند عملية فوق بناء ذاتي ذات قسم درجة تنظيف مسار؛ACP خلفية أولا إغلاق stdin `disposeAcpChild` هو مشاركة اعتبار تنفيذ.

```ts type-equiv
/**
 * A live subprocess and its provider-managed process range. Collected output
 * remains readable after exit; piped streams belong to the caller.
 *
 * Termination and {@link SubprocessHandle.waitForExit} use the same managed
 * range. Each provider documents the range it can observe and its signalling
 * and observation limits.
 */
interface SubprocessHandle {
  /** The child's stdin, present iff spawned with `stdin: 'pipe'`. */
  readonly stdin: Writable | undefined
  /** The child's raw stdout, present iff spawned with `stdout: 'pipe'`. */
  readonly stdout: Readable | undefined
  /** The child's raw stderr, present iff spawned with `stderr: 'pipe'`. */
  readonly stderr: Readable | undefined
  /** Separate caller-owned byte channel when requested; native startup failure may leave it absent. */
  readonly control: Duplex | undefined
  /** Offset-based readers for collect-mode streams (also readable after exit). */
  readonly collected: SubprocessCollectedOutputs
  /** Resolves with spawned-command exit facts; rejects for spawn or provider failures. */
  readonly done: Promise<SubprocessOutcome>
  /**
   * Begin the provider's documented termination procedure on the managed range
   * — the seam's only termination verb. Idempotent, a no-op once that range is
   * gone, and also triggered by the spec's abort signal.
   */
  terminate(): void
  /**
   * Wait until the same managed range is empty — not just until the spawned
   * command reports its outcome, so surviving work remains observable.
   * @param signal - optional bound for the wait.
   * @returns `true` when the managed range is empty, `false` when the signal aborted first.
   * @throws when the selected provider can no longer observe its managed range.
   */
  waitForExit(signal?: AbortSignal): Promise<boolean>
}
```

```ts type-equiv
/**
 * Cursor-free incremental access to one collected output stream. Offsets are
 * whole-stream byte coordinates owned by the caller, so independent readers
 * cannot consume one another's output; `readFrom(0)` after settlement is the
 * batch result (`lossy` then means the in-memory tail lost its head — the
 * {@link CollectedOutput.truncated} fact).
 */
interface SubprocessOutputReader {
  /**
   * Read everything captured since `fromByte`. When that offset has slid out
   * of the in-memory tail window the read is `lossy` — it returns the whole
   * retained tail and the gap is only recoverable from the spill file.
   * @param fromByte - whole-stream offset to resume from (a prior read's `nextOffset`; 0 for the first read).
   * @returns the delta text, the next offset, the `lossy` flag, and the spill path when one exists.
   */
  readFrom(fromByte: number): SubprocessOutputRead
}
```

```ts type-equiv
/** One incremental {@link SubprocessOutputReader.readFrom} read. */
interface SubprocessOutputRead {
  /** Stream text from the requested offset (the whole retained tail when lossy). */
  text: string
  /** Whole-stream offset to resume from on the next read. */
  nextOffset: number
  /** True when the requested offset slid out of the in-memory tail window. */
  lossy: boolean
  /** Path to the full-stream spill file, when one was created and remains intact. */
  spillPath?: string
}
```

```ts type-equiv
/** Offset-based readers for the streams spawned in collect mode. */
interface SubprocessCollectedOutputs {
  /** Present iff stdout is a {@link SubprocessCollect}. */
  readonly stdout?: SubprocessOutputReader
  /** Present iff stderr is a {@link SubprocessCollect}. */
  readonly stderr?: SubprocessOutputReader
}
```


## نتيجة فقط تحمل تحميل خروج واقع

`done` تقرير إبلاغ Node close حدث مفردات، لا يحمل سبب تصنيف: خدمة سوف في في توقف وقت إنهاء عملية، لكن أبدا حكم تحديد سبب (استدعاء جهة قراءة عودة ذاتي ذات كل deadline إشارة، مثال مثل bash منفذ `timedOut`/`aborted` تفكيك قسم). استلام تجميع إلى إخراج في تسوية بعد ما زال يمكن مرور `handle.collected` قراءة، لذلك دفعة كمية و تدفق صيغة استدعاء جهة مشترك استخدام واحد بند وصول مسار.

```ts type-equiv
/**
 * Exit facts of one closed process — Node's `close`-event vocabulary.
 * Deliberately carries NO timeout or cancellation classification (the caller
 * reads the signal it owns to classify causes) and NO output: collected
 * streams stay readable through {@link SubprocessHandle.collected} after
 * settlement, so batch and streaming callers share one access path.
 */
interface SubprocessOutcome {
  /** Exit code; null when the process died from a signal. */
  exitCode: number | null
  /** Terminating signal (e.g. 'SIGTERM'); null on normal exit. */
  signal: NodeJS.Signals | null
}
```

## طرفية عملية أصل لغة

`spawnTerminal(spec)` هو غير إدارة طريق عملية أصل لغة. مزود قسم إعداد تحكم طرفية، و مسؤول UTF-8 نص نقل، قبل منصة عملية مجموعة فحص و إشارة إرسال، و واحد بند يجب انتظار TERM→KILL عملية؛ هذا عملية سوف جعل مزود ما زال يمكن مراقبة إلى كل جلسة عضو تماما توقف مستقر، مزود فإن سوف سجل تنفيذ أساس قاع خاص لديه يمكن مراقبة صفة حد.PTY خلفية ما زال مسؤول تلميح رمز فحص قياس، حينئذ خيط دفع قطع،scrollback، صندوق رملي سياسة و حمل دائم جلسة كل حق؛ عادي `spawn()` لا يمكن إعادة بناء تحكم طرفية دلالة.

طرفية spec تماما إشارة تحديد argv،cwd، بيئة تغطية، طرفية نوع، مقياس قياس، تنظيف عرض حد مدة و اختياري قسم إعداد إلغاء و shell نشط حركة مراقبة. ذلك جملة مقبض عام `pid`، لديه ترتيب إخراج،`done`،`write`،`resize`،`inspectForeground`،`inspectActivity`،`signalForeground` و يجب انتظار `terminate`؛[`SubprocessTerminalSpawnSpec` و `SubprocessTerminalHandle`](../../packages/subprocess/subprocess/src/types.ts) تعريف هذه حقل و عملية.`resize(cols, rows)` تحديث جارٍ تشغيل PTY مقياس قياس، عملية خروج بعد رفض استدعاء.

`inspectActivity()` إرجاع `SubprocessTerminalActivity`:`state` لـ `idle`،`busy` أو `unknown`،`revision` مع provider مراقبة إلى نشط حركة أو إدخال تغير. طرفية طلب عبر `shellActivity` تفعيل تلقي دعم حمل shell دورة الحياة مراقبة؛ كل provider دعم حمل نطاق و حفظ حراسة إرجاع unknown حال حال رؤية [subprocess-local](../../packages/subprocess/subprocess-local/README.ar.md#running-terminal-sessions).

`terminalEnvironment(signal?)` إرجاع `SubprocessTerminalEnvironment`: تنفيذ بيئة منصة (`posix` أو `windows`) و اختياري `defaultShell`. هذه واقع قدوم ذاتي مزود، بينما غير Web خادم أو متصفح.`resolveExecutable` تحقق مرشح shell؛`SubprocessExecutableNotFoundError` يمثل يمكن تنفيذ ملف لا وجود، مزود و نقل لذا عائق ما زال بصفة خطأ تقرير إبلاغ.

## خدمة سلوك

سحب كائن [`SubprocessRuntime`](../../packages/subprocess/subprocess/src/index.ts) Service Definition قاعدة تحديد تنفيذ عالم حد جلوس علامة، يمكن تنفيذ ملف فحص بحث، عادي `spawn` و `spawnTerminal`.[`LocalSubprocessRuntime`](../../packages/subprocess/subprocess-local/src/index.ts) بـ منصة اختيار managed range، حسب موضع وضع طريقة وصل خط، اعتماد صاف حذف،`node-pty`، منصة عملية فحص، و أولا إنهاء مجددا انتظار خروج مورد تحرير توفير هذه قدرة.Service Definition اتفاق رؤية [`dsh-subprocess`](../../packages/subprocess/subprocess/README.ar.md) ، محلي آلية رؤية [`dsh-subprocess-local`](../../packages/subprocess/subprocess-local/README.ar.md).

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxsubprocess--subprocessruntime-abstract-seam"></a>

### `ctx.subprocess` — `SubprocessRuntime` (abstract seam)

Abstract subprocess service. Subclass, implement spawn, and load the subclass as a plugin — it registers as `ctx.subprocess` (one implementation per context; loading a second throws, which is cordis' standard duplicate-service behavior).

Implementations must honor these semantics:

- Executable paths belong to one execution world shared with the mounted filesystem provider.
- spawn returns a live handle synchronously. Target identity remains provider-private; `done` resolves with the spawned command's exit facts and may reject for spawn or provider failures.
- Collect-mode readers are offset-based and non-consuming, so independent readers never consume one another's output; lossy reads report truncation and the spill file holding the complete stream when one exists. Piped streams are handed to the caller raw and never buffered here.
- SubprocessHandle.terminate (and the spec's abort signal) starts the provider's documented procedure against its managed range. SubprocessHandle.waitForExit observes that same range so a consumer-owned teardown ladder can hold each tier on real quiescence; each provider documents its signalling and observability limits.
- Disposal of the service terminates all still-running managed processes and awaits their exit.
- spawnTerminal owns terminal allocation, text transport, foreground groups, signalling, and whole-session quiescence behind one awaited termination method; readiness and persistent-shell policy stay in the PTY consumer. Its output stream ends after queued terminal output when the top-level process exits.

```ts cordis-catalog
/**
 * Resolve one configured executable in this provider's execution world.
 * Absolute paths are verified; bare names use the provider's scrubbed PATH
 * plus explicit environment overrides. Relative paths containing separators
 * are rejected: the resolution base is undefined, so providers fail loud
 * instead of guessing.
 * @param command - absolute executable path or bare PATH name.
 * @param env - explicit environment entries used for lookup.
 * @param signal - aborts remote or local lookup.
 * @returns a canonical executable path.
 */
abstract resolveExecutable( command: string, env?: Readonly<Record<string, string>>, signal?: AbortSignal, ): Promise<string>

/**
 * Inspect shell-selection facts in the provider's execution environment.
 * @param signal - cancellation of remote environment inspection.
 * @returns platform and preferred shell; executable lookup and allocation remain separate operations.
 */
abstract terminalEnvironment(signal?: AbortSignal): Promise<SubprocessTerminalEnvironment>

/**
 * Start one managed child process from a fully-specified spec; this seam
 * applies no defaults.
 * @param spec - argv, directory, stdio dispositions, grace, cancellation, and environment.
 * @returns the live process handle (streams/readers, signalling, outcome promise).
 * @throws synchronously when pre-aborted or when argv, cwd, environment, or grace is invalid before handle creation.
 */
abstract spawn(spec: SubprocessSpawnSpec): SubprocessHandle

/**
 * Allocate a real terminal and start one owned process session. This is the
 * only non-pipe process primitive: implementations own terminal byte I/O,
 * foreground groups, signals, and whole-session quiescence.
 * @param spec - fully specified argv, cwd, environment, dimensions, grace, and allocation cancellation.
 * @returns the live terminal handle after allocation succeeds.
 */
abstract spawnTerminal(spec: SubprocessTerminalSpawnSpec): Promise<SubprocessTerminalHandle>
```

Source: [`packages/subprocess/subprocess/src/index.ts`](../../packages/subprocess/subprocess/src/index.ts)
<!-- END GENERATED cordis-surface -->
