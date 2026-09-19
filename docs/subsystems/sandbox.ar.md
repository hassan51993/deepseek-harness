# عملية صندوق رملي

[English](sandbox.md) | العربية

[dsh-sandbox](../../packages/sandbox/sandbox) عملية صندوق رملي seam سوف و إعداد طقم عملية فرعية مزود مشترك تنفيذ بيئة عملية فرعية argv حزمة تركيب في ملف فاعلية نتيجة سياسة في، بينما لا سوف مستهلك اقتران دمج إلى خاص تحديد منصة تشغيل جهاز.[dsh-sandbox-local](../../packages/sandbox/sandbox-local) توفير Linux bwrap/Landlock،macOS Seatbelt و Windows ACL تلقي حد أمر لوحة خلفية؛[dsh-bash-sandbox](../../packages/shell/bash-sandbox) و [dsh-pwsh-sandbox](../../packages/shell/pwsh-sandbox) هو ذلك مستهلك.[dsh-sandbox-ssh](../../packages/ssh/sandbox-ssh/README.ar.md) عبر و SSH نظام الملفات و عملية فرعية مزود إعداد طقم بعيد طرف خلفية تنفيذ نفس سياسة.

شفرة المصدر:[`packages/sandbox/sandbox/src/index.ts`](../../packages/sandbox/sandbox/src/index.ts)

## نمط و قوي صنع تنفيذ

`SandboxMode` فقط إدارة تحكم نظام الملفات فاعلية نتيجة.`read-only` اشتراط خلفية رفض كتابة——POSIX runner أيضا سوف منح إعطاء ذلك shell الذي يحتاج `/dev/null` استقبال جهاز، بينما Windows ACL runner لا منح إعطاء أي صريح يمكن كتابة أصل دليل، و بسبب بيئة ACL نقص فتحة تقرير إبلاغ جزء قوي صنع تنفيذ؛`workspace-write` سماح في مساحة العمل أصل دليل و خلفية تحمل وعد مؤقت منطقة مجال تحت كتابة؛`danger-full-access` التفاف مرور عزل. شبكة شبكة و عملية مرئي صفة لا في هذا موضع تعريف نطاق داخل.

```ts type-equiv
/**
 * File-effect policy for confined processes. `read-only` permits only required
 * sinks such as `/dev/null`; `workspace-write` also permits the workspace and a
 * backend-defined temp area; `danger-full-access` bypasses confinement. Network
 * and process visibility are outside this vocabulary.
 */
type SandboxMode = 'read-only' | 'workspace-write' | 'danger-full-access'
```

فقط لديه قبل اثنان نوع نمط يمكن إرسال إعطاء مزود.`danger-full-access` مستهلك مباشر spawn أصلي argv، لا استدعاء `ctx.sandbox`.

```ts type-equiv
/** A confining (non-`danger-full-access`) mode — the modes a {@link SandboxPolicy} can carry. */
type ConfinedSandboxMode = Exclude<SandboxMode, 'danger-full-access'>
```

قوي صنع تنفيذ كامل صفة هو خلفية تقرير إبلاغ واقع.`full` يمثل خلفية إدارة تحكم هذا نمط تحمل وعد كل ملف فاعلية نتيجة؛`partial` يمثل نشط وثب خلفية أو مقارنة قديم داخل نواة ABI فقط إدارة تحكم منها واحد فرعي تجميع، لذلك اشتراط قطعا مقابل حفظ إثبات مستهلك يجب رفض أو نحو فوق كشف هذا واحد منطقة آخر. حالي جزء قوي صنع تنفيذ حال شكل يشمل مقارنة قديم Landlock ABI، و Windows ACL runner Everyone و صلب رابط حد.

```ts type-equiv
/**
 * Enforcement completeness for this host. `partial` means an active backend or
 * older kernel ABI cannot govern every promised file effect; callers requiring
 * an absolute boundary must not treat it as `full`.
 */
type SandboxEnforcement = 'full' | 'partial'
```

## تدريجي استدعاء سياسة

كامل تنفيذ سياسة سوف حسب كل مرة قدرة استدعاء تحليل و يحمل. هو يشمل `danger-full-access`، لذلك مستهلك يمكن فقط تحليل مرة سياسة، مجددا قرار هل التفاف مرور قيد. عادي أداة استدعاء من استدعاء جلسة غير ممكن تغيير cwd إرسال توليد `workspaceRoot`؛ نشر إعداد هو لا يوجد agent(ذكي جسم) وقت رجوع قيمة. محلل إبقاء تنفيذ بيئة في قطعا مقابل مسار كتابة قاعدة. تنفيذ حد مزود في ملف فعلي وجود موضع مواصفة تحويل أصل دليل، لذلك يتضمن `symlink/..` cwd سوف معرف إعداد طقم عملية فرعية مزود فعلي تشغيل دليل.

```ts type-equiv
/**
 * The complete file-effect policy resolved for one capability call. The root
 * is carried even under modes that do not consume it so callers can resolve
 * policy once before choosing the enforcement path.
 */
interface SandboxExecutionPolicy {
  /** The file-effect mode this execution runs under. */
  mode: SandboxMode
  /** Absolute root directory `workspace-write` may write under. */
  workspaceRoot: string
  /**
   * Opaque identity of the calling session (the branded `dsh-session`
   * SessionId). Backends key per-session state off it (e.g. windows-acl gives
   * each live session/workspace pair a random private temp directory and SID,
   * while the workspace SID and standing grant remain per-workspace); absent
   * for agentless calls, which fall back to per-call backend state.
   */
  sessionId?: SessionId
}
```

`ctx.sandboxPolicy.resolve()` استقبال نشط وثب جلسة؛ مقابل في قد دفعة دقيق إعادة محاولة، أيضا استقبال صريح نمط. هذا خدمة يملك أولوية درجة و root رجوع قاعدة، جعل bash و fs لا لا بد تكرار تنفيذ.

```ts type-equiv
/** Inputs that select the sandbox policy for one capability call. */
interface SandboxPolicyRequest {
  /** Calling session; its immutable cwd becomes the workspace boundary. */
  session?: Session
  /** Explicit approved mode override, which outranks session policy. */
  mode?: SandboxMode
}
```

فقط لديه تلقي قيد تنفيذ سوف وصول `ctx.sandbox`؛ نقل إعطاء مزود سياسة في إبقاء نفس root معا استلام ضيق نمط. هذا جعل تزامن جلسة، مستهلك و مرة صفة رفع حق إعادة محاولة يمكن نحو نفس مزود طلب مختلف حد، بينما بلا حاجة تغيير مزود حالة.

```ts type-equiv
/**
 * What one confined execution is allowed to touch — carried PER CALL, not
 * fixed on the provider: two consumers may confine under different policies
 * at the same instant (bash under `read-only` while a confined child agent
 * needs its state directory writable), and an approved escalated retry is a
 * new call with a wider policy. Defaulting/resolution is an explicit step at
 * the consumer boundary; the provider treats the policy as fully specified.
 */
interface SandboxPolicy extends SandboxExecutionPolicy {
  /** The file-effect mode this execution runs under. */
  mode: ConfinedSandboxMode
}
```

<a id="wrapped-argv-and-classification-dialects"></a>

## حزمة تركيب بعد argv و تصنيف جهة قول

`RunnerFailureRule` تجميع تجميع لأجل حكم تحديد runner في تنفيذ أمر قبل فشل دليل. مستهلك اشتراط عملية بـ غير صفر حالة خروج، و معا ممتلئ كاف اختياري سماح خروج رمز باب تحكم، و بقية تحت بعض واحد stderr سطر في لا منطقة قسم كبير صغير كتابة يؤدي أمر توقيع. نظام سوف أولا حسب لا منطقة قسم كبير صغير كتابة كامل سطر دقيق مطابقة إزالة معلومة صفة ترتيب حذف بند، لذلك بلا ضرر runner إشعار ذاته لا يستطيع إثبات فشل. مطابقة إلى سطر ما زال متاح عمل خطأ تفصيل حال؛ تصنيف مرور مسار لن إعادة كتابة stderr.

```ts type-equiv
/**
 * Evidence that identifies a sandbox runner failing before it executes the
 * wrapped command. A consumer first applies {@link allowedExitCodes} when
 * present, removes {@link informationalLines} by case-insensitive exact line
 * equality, then matches {@link fatalSignatures} case-insensitively within
 * each remaining stderr line. Exit status alone never proves runner failure.
 */
interface RunnerFailureRule {
  /** Nonzero process exit codes on which this rule may match; omitted permits any nonzero exit. */
  allowedExitCodes?: readonly number[]
  /** Non-empty substrings identifying a fatal runner diagnostic on one stderr line. */
  fatalSignatures: readonly string[]
  /** Benign stderr lines excluded by exact full-line equality before fatal matching. */
  informationalLines?: readonly string[]
}
```

`ConfinedArgv` هو مستهلك فعلي spawn محتوى. حذف استبدال بعد argv، هو أيضا يحمل خلفية قوي صنع تنفيذ واقع و اثنان نوع صحيح تسليم stderr تصنيف جهاز.`denialSignatures` لأجل تعرف آخر صندوق رملي صحيح معتاد عمل وقت تلقي حد أمر يتم منع توقف حال حال.`runnerFailureRules` لأجل تعرف آخر صندوق رملي runner في تنفيذ أمر قبل رفض أو فشل حال حال؛ مستهلك ينبغي أولا فحص بعد من، سوف ذلك بصفة صندوق رملي أساس أساس ضبط تطبيق لذا عائق فوق تقرير، بينما غير عادي مهمة فشل.

```ts type-equiv
/**
 * A {@link SandboxProvider.confine} result: the argv to spawn in place of
 * the caller's own, plus the enforcement completeness the selected backend
 * achieves for it.
 */
interface ConfinedArgv {
  /** The wrapped argv (runner, profile, separator, then the caller's argv). */
  argv: string[]
  /** How completely the selected backend enforces the policy's file effects. */
  enforcement: SandboxEnforcement
  /**
   * The selected backend's denial DIALECT: the case-insensitive stderr
   * substrings a file effect denied by THIS backend produces (EROFS text
   * under bwrap's read-only binds, EACCES under Landlock, EPERM under
   * Seatbelt). A consumer that infers denials from a failed run's stderr
   * matches against exactly these rather than a cross-backend union — the
   * union claims denials a given backend never produces.
   */
  denialSignatures: readonly string[]
  /**
   * Structured runner-failure evidence rules. Consumers require a matching
   * fatal stderr line (after informational exclusions) and any rule-specific
   * exit-code gate before checking denial signatures: runner failure means the
   * command never ran, while denial means confinement worked and blocked it.
   */
  runnerFailureRules: readonly RunnerFailureRule[]
}
```

[محلي مزود](../../packages/sandbox/sandbox-local/README.ar.md) يملك تشغيل صيانة إعداد، و سوف ذلك runner جهة قول خريطة إلى هذه قاعدة.[صندوق رملي تحويل bash مستهلك](../../packages/shell/bash-sandbox/README.ar.md) يملك spawn و نتيجة عودة بسبب.

## مزود و fail-closed خطأ

`await ctx.sandbox.confine(argv, policy, signal)` في تنفيذ بيئة في تحليل سياسة مسار و إرجاع `ConfinedArgv`، لا يوجد متاح خلفية وقت بـ `SandboxUnavailableError`(رمز خطأ `SANDBOX_UNAVAILABLE`) رفض. اختياري إشارة يمكن في بدء قبل إلغاء تحليل. مستهلك أيضا يمكن في spawn أو مراقبة الذي إرجاع argv وقت مقابل فشل إجراء تصنيف؛ هذا عودة بسبب يخص مستهلك اتفاق. مقابل في تلقي حد سياسة، ساكن صامت بلا عزل نفاذ نقل دائم بعيد لا دمج قاعدة.

مزود اختيار، استكشاف قياس، ذاكرة مؤقتة و خلفية خاص تحديد قوي صنع تنفيذ تقرير إبلاغ عودة[محلي مزود](../../packages/sandbox/sandbox-local/README.ar.md) كل.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxsandbox--sandboxprovider-abstract-seam"></a>

### `ctx.sandbox` — `SandboxProvider` (abstract seam)

Abstract process-sandbox service. confine must return enforcing argv or fail closed at wrap or runner-execution time; silent unconfined passthrough is forbidden. Functional probes arbitrate multi-runner chains and may be skipped for a sole candidate, whose own refusal remains the fail-closed end.

```ts cordis-catalog
/**
 * Wrap `argv` so it executes confined under `policy` on this host; the
 * caller spawns the returned argv in place of its own.
 * @param argv - the exact argv the caller is about to spawn (program plus
 *   arguments), NOT a shell string — a shell-shaped consumer passes
 *   `['bash', '-c', command]`.
 * @param policy - the file-effect policy this execution runs under,
 *   carried per call (see {@link SandboxPolicy}).
 * @param signal - cancellation while the provider resolves the policy and runner.
 * @returns the argv to spawn instead, plus the enforcement completeness
 *   the selected backend achieves for it.
 */
abstract confine(argv: readonly string[], policy: SandboxPolicy, signal?: AbortSignal): Promise<ConfinedArgv>
```

Source: [`packages/sandbox/sandbox/src/index.ts`](../../packages/sandbox/sandbox/src/index.ts)

<a id="ctxsandboxpolicy--sandboxpolicyservice"></a>

### `ctx.sandboxPolicy` — `SandboxPolicyService`

The sandbox-policy service (`ctx.sandboxPolicy`). Owns the deployment default mode, fallback workspace root, and current request-time policy section. Tool layers call resolve for each execution so a session's mode log and immutable cwd travel together to every enforcing capability.

```ts cordis-catalog
/**
 * Resolve the complete policy for one capability call. An approved explicit
 * mode outranks the session's last `sandbox/mode` event, which outranks the
 * deployment default. A session cwd is its workspace-write boundary; the
 * configured root is the fallback for agentless calls and sessions without a
 * cwd.
 * @param request - optional session and approved mode override.
 * @returns the fully resolved per-call mode and absolute workspace root.
 */
resolve(request: SandboxPolicyRequest = {}): SandboxExecutionPolicy

/**
 * Read the session override without applying the deployment default.
 * @param session - session whose log supplies the override.
 * @returns the last logged mode, or `undefined` without one.
 */
overrideOf(session: Session): SandboxMode | undefined
```

Types: [Session](session.ar.md)

Source: [`packages/sandbox/sandbox-policy/src/index.ts`](../../packages/sandbox/sandbox-policy/src/index.ts)
<!-- END GENERATED cordis-surface -->
