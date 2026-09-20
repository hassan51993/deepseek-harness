# عزل العمليات

[English](sandbox.md) | العربية

يغلّف seam عزل العمليات في [dsh-sandbox](../../packages/sandbox/sandbox) وسائطَ عملية فرعية في العالم نفسِه بسياسة آثار ملفات، بلا ربط المستهلكين بمشغّل منصة بعينه. وتقدّم [dsh-sandbox-local](../../packages/sandbox/sandbox-local) خلفياتِ bwrap وLandlock على Linux، وSeatbelt على macOS، والرمزَ المقيَّد بقوائم التحكم على Windows؛ وتستهلكها [dsh-bash-sandbox](../../packages/shell/bash-sandbox) و[dsh-pwsh-sandbox](../../packages/shell/pwsh-sandbox). وتطبّق [dsh-sandbox-ssh](../../packages/ssh/sandbox-ssh/README.ar.md) السياسةَ نفسَها عبر خلفية بعيدة مقترنة بمزوّدَي نظام الملفات والعمليات الفرعية على SSH.

المصدر: [`packages/sandbox/sandbox/src/index.ts`](../../packages/sandbox/sandbox/src/index.ts)

## الأوضاع والفرض

يحكم `SandboxMode` آثارَ الملفات وحدها. فـ`read-only` يطلب من الخلفية منعَ الكتابة — وتمنح مشغّلاتُ POSIX زيادةً على ذلك مصرفَ `/dev/null` الذي تشترطه صدفاتُها، بينما لا يمنح مشغّلُ قوائم التحكم على Windows جذرًا قابلًا للكتابة صراحةً ويبلّغ عن فرض جزئي لثغرات قوائمه المحيطة؛ و`workspace-write` يسمح بالكتابة تحت جذر مساحة العمل وتحت المنطقة المؤقتة التي تعد بها الخلفية؛ و`danger-full-access` يتجاوز الحصر. أما الشبكةُ ورؤيةُ العمليات فخارج هذه المفردات.

```ts type-equiv
/**
 * File-effect policy for confined processes. `read-only` permits only required
 * sinks such as `/dev/null`; `workspace-write` also permits the workspace and a
 * backend-defined temp area; `danger-full-access` bypasses confinement. Network
 * and process visibility are outside this vocabulary.
 */
type SandboxMode = 'read-only' | 'workspace-write' | 'danger-full-access'
```

ولا يمكن إرسالُ غير أول وضعين إلى مزوّد. والمستهلكُ في وضع `danger-full-access` يطلق وسائطَه الأصلية ولا ينادي `ctx.sandbox`.

```ts type-equiv
/** A confining (non-`danger-full-access`) mode — the modes a {@link SandboxPolicy} can carry. */
type ConfinedSandboxMode = Exclude<SandboxMode, 'danger-full-access'>
```

والفرضُ حقيقةٌ مبلَّغ عنها. فـ`full` تعني أن الخلفية تحكم كلَّ أثر ملفات يعد به الوضعُ؛ و`partial` تعني أن خلفيةً نشطة أو واجهةَ نواة أقدم لا تحكم إلا جزءًا، فعلى المستهلكين الذين يشترطون الوعدَ المطلق أن يرفضوا أو يُظهروا ذلك التمييز. وواجهاتُ Landlock الأقدم وحدودُ Everyone والروابط الصلبة في مشغّل قوائم التحكم على Windows حالتان جزئيتان قائمتان.

```ts type-equiv
/**
 * Enforcement completeness for this host. `partial` means an active backend or
 * older kernel ABI cannot govern every promised file effect; callers requiring
 * an absolute boundary must not treat it as `full`.
 */
type SandboxEnforcement = 'full' | 'partial'
```

## السياسة لكل نداء

تُحلّ سياسةُ التنفيذ كاملةً وتُحمل مع كل نداء قدرة. وهي تشمل `danger-full-access` فيستطيع المستهلكُ حلَّ السياسة مرةً واحدة قبل أن يقرر أيتجاوز الحصرَ أم لا. وتشتق نداءاتُ الأدوات المعتادة `workspaceRoot` من دليل عمل الجلسة المستدعية غير القابل للتغيير؛ وضبطُ النشر هو الاحتياطي حين لا وكيل. ويحفظ المحلِّلُ الهجاءَ المطلق لعالم التنفيذ. وتعيّر المزوّداتُ الفارضة الجذرَ حيث توجد الملفاتُ، فدليلُ عمل يحتوي `symlink/..` يحدد الدليلَ الذي يعمل فيه مزوّدُ العمليات الفرعية المقترن فعلًا.

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

ويقبل `ctx.sandboxPolicy.resolve()` الجلسةَ النشطة، ويقبل وضعًا صريحًا لإعادة محاولة معتمَدة. وتملك الخدمةُ الأسبقيةَ واحتياطيَّ الجذر فلا يكرّرهما bash ولا fs.

```ts type-equiv
/** Inputs that select the sandbox policy for one capability call. */
interface SandboxPolicyRequest {
  /** Calling session; its immutable cwd becomes the workspace boundary. */
  session?: Session
  /** Explicit approved mode override, which outranks session policy. */
  mode?: SandboxMode
}
```

ولا يصل إلى `ctx.sandbox` إلا تنفيذٌ محصور؛ وسياسةُ مزوّده تضيّق الوضعَ مع إبقاء الجذر نفسِه. وهذا يتيح لجلسات ومستهلكين متزامنين ولإعادات محاولة مصعَّدة لمرة واحدة أن يطلبوا من المزوّد نفسِه حدودًا مختلفة بلا تغيير حالة المزوّد.

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

## الوسائط المغلَّفة ولهجات التصنيف

يجمع `RunnerFailureRule` الأدلةَ على أن مشغّلًا فشل قبل تنفيذ الأمر. ويشترط المستهلكُ خروجًا غيرَ صفري، وبوابةَ رموز الخروج المسموح بها الاختيارية، وتوقيعًا قاتلًا بلا حساسية لحالة الأحرف داخل سطر stderr متبقٍّ. وتُزال أولًا الاستثناءاتُ الإخبارية المطابِقة للسطر كاملًا بلا حساسية لحالة الأحرف، فلا يستطيع إشعارُ مشغّل حميد أن يثبت الفشلَ بنفسه. ويبقى السطرُ المطابِق متاحًا تفصيلًا للخطأ؛ والتصنيفُ لا يعيد كتابة stderr.

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

و`ConfinedArgv` هو ما يطلقه المستهلك. وهو يحمل، إلى جانب الوسائط البديلة، حقيقةَ الفرض لدى الخلفية ومصنِّفَي stderr متعامدين. فـ`denialSignatures` تحدد أن الأمرَ المحصور مُنع بينما يعمل العزلُ على ما يرام. و`runnerFailureRules` تحدد أن مشغّلَ العزل رفض أو فشل قبل تنفيذ الأمر؛ ويفحص المستهلكون هذه أولًا ويُظهرون فشلَ بنية عزل، لا فشلَ مهمة عاديًا.

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

ويملك [المزوّد المحلي](../../packages/sandbox/sandbox-local/README.ar.md) ضبطَ المشغّل ويربط لهجةَ مشغّله بهذه القواعد. ويملك [مستهلك bash المعزول](../../packages/shell/bash-sandbox/README.ar.md) الإطلاقَ ونسبةَ النتائج.

## المزوّد والأخطاء الفاشلة مغلقةً

يحلّ `await ctx.sandbox.confine(argv, policy, signal)` مساراتِ السياسة ويعيد `ConfinedArgv` من عالم التنفيذ، أو يرفض بـ`SandboxUnavailableError` ورمزِ `SANDBOX_UNAVAILABLE` حين لا توجد خلفيةٌ صالحة. وتلغي الإشارةُ الاختيارية الحلَّ قبل الإطلاق. وللمستهلكين أيضًا أن يصنّفوا فشلًا أثناء إطلاق الوسائط المعادة أو مراقبتها؛ وتلك النسبةُ تخص عقدَ المستهلك. والتمريرُ الصامت بلا حصر غيرُ مشروع قط مع سياسة محصورة.

أما انتقاءُ المزوّدين واستكشافُهم وتخزينُهم وتقاريرُ الفرض الخاصة بكل خلفية فتخص [المزوّد المحلي](../../packages/sandbox/sandbox-local/README.ar.md).

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
