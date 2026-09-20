# بيئة تشغيل PTC

[English](ptc-runtime.md) | العربية

يقدّم [seam قدرة](../../.agents/notes/implemented/architecture/2026-06-13-capability-seams.ar.md) تنفيذِ PTC خدمةَ `ctx.ptcRuntime` عبر [dsh-ptc-runtime](../../packages/ptc-runtime/ptc-runtime). وهو يشغّل برنامجًا واحدًا في مقابل ارتباطات المضيف، ويبلّغ عن الخرج والفشل وحقائق العزل السارية. وتنفيذُ PTC اختياري لا جزءٌ من [عمود agent loop](core.ar.md). وتملك [أساساتُ PTC](../../.agents/notes/implemented/feature/2026-06-15-ptc.ar.md) عرضَ السجل، ويملك [عقد الإرجاع المنوَّع](../../.agents/notes/implemented/feature/2026-07-20-ptc-typed-tool-returns.ar.md) قيمَ الارتباطات، ويملك [قرارُ Node المعزول](../../.agents/notes/implemented/architecture/2026-09-11-sandboxed-node-ptc-runtime.ar.md) مزوّدَ التنفيذ المشحون.

المصدر: [`packages/ptc-runtime/ptc-runtime/src/types.ts`](../../packages/ptc-runtime/ptc-runtime/src/types.ts)

## التشغيل: طلبٌ يدخل ونتيجةٌ تخرج

يحتوي `PtcRunRequest` على البرنامج والارتباطات والإلغاء وخيارات التنفيذ الاختيارية. وتتحقق دالةُ `resolve` لدى المزوّد من الخيارات المدعومة وتطبّق افتراضاتِ نشره؛ ويتلقى `run` قيمةَ `PtcRunSpec` بدليل صريح وباختيار مهلة صريح. والمهلةُ المُغفَلة تستعمل افتراضاتِ المزوّد، والعددُ يطلب ميزانيةَ انقضاء مسقوفة، و`null` تطلب ألّا تكون هناك مهلةُ انقضاء. ويرفض المزوّدون الخياراتِ غيرَ المدعومة قبل التنفيذ:

```ts type-equiv
/**
 * Caller inputs for one program. The provider's resolve method validates supported
 * options and supplies directory, deadline, and authority before execution.
 */
interface PtcRunRequest {
  /**
   * The program source, in the runtime's {@link ../index.ts | language}. It
   * runs as the body of an async function: top-level `await` and `return`
   * are available, and the completion value becomes
   * {@link PtcRunResult.value}.
   */
  program: string
  /** Host functions exposed to the program, one global object per namespace. */
  bindings: PtcBindingNamespace[]
  /** Working directory in the mounted filesystem and subprocess execution world. */
  cwd?: string
  /**
   * Elapsed execution budget in milliseconds. Omission uses provider defaults;
   * null requests no deadline. Providers validate and cap numeric budgets or reject unsupported choices.
   */
  timeoutMs?: number | null
  /** Resolved authority for this execution. Providers without confinement reject an explicit policy. */
  sandboxPolicy?: SandboxExecutionPolicy
  /**
   * Abort the run: the runtime stops the program (hard, even mid-loop) and
   * resolves with a {@link PtcRunFailure} of kind `'abort'`. In-flight
   * binding calls are the CALLER's to settle — the runtime only stops asking.
   */
  signal?: AbortSignal
}
```

```ts type-equiv
/** Fully resolved execution inputs; run never supplies a missing directory or deadline choice. */
interface PtcRunSpec extends PtcRunRequest {
  /** Absolute directory in the provider's execution world. */
  cwd: string
  /** Positive finite elapsed budget in milliseconds after provider capping, or null for no deadline. */
  timeoutMs: number | null
}
```

```ts type-equiv
/** File confinement applied to a program, independently of its terminal outcome. */
interface PtcRunSandbox {
  /** File-effect mode used for this execution. */
  mode: SandboxMode
  /** Program failure text matched backend diagnostics; not enforcement proof or an exhaustive denial record. */
  denied: boolean
  /** Completeness reported by the selected confining backend; absent for full access. */
  enforcement?: SandboxEnforcement
}
```

وتُحلّ إخفاقاتُ البرنامج عبر `PtcRunResult.error`؛ وقد ترفض مُدخَلاتُ المستدعي غيرُ الصالحة قبل التنفيذ. ووضعُ العزل والمنعُ المرصود واكتمالُ الفرض حقائقُ منفصلة، فالبرنامجُ الناجح لا يثبت بنفسه أن كلَّ قيد مطلوب قد فُرض:

```ts type-equiv
/**
 * The outcome of one run. An error is a FIELD on a resolved result, never a
 * rejection of `run()` — reporting a failed program is the caller's job, not
 * an exception path.
 */
interface PtcRunResult {
  /** Applied file policy and observed denial, when the provider enforces file policy. */
  sandbox?: PtcRunSandbox
  /**
   * The program's completion value (its top-level `return`), when it ran to
   * completion and the value crossed the runtime's lossless-JSON boundary.
   * Invalid or over-limit completions fail the run instead of substituting a
   * rendered string; a failed or value-less run leaves this absent.
   */
  value?: PtcJsonValue
  /**
   * Captured text. Each source channel preserves emission order; interleaving
   * across independent channels is backend-dependent. Bounded only as part of
   * the outer result.
   */
  logs: string[]
  /** Present iff the run failed; see {@link PtcRunFailure} for the taxonomy. */
  error?: PtcRunFailure
}
```

## الارتباطات: دوال المضيف عوامَّ في البرنامج

يصير كلُّ `PtcBindingNamespace` كائنًا عامًّا من مستدعيات لاتزامنية؛ ويمرّر PTC الاسمَ `tools`. ويجب أن تكون الوسائطُ والقيمُ المحلولة JSON بلا فقد. ويفرض المزوّدون سقوفَ نقلهم؛ ولا يضع الـseam حدًّا موحَّدًا لبايتات الارتباطات. ويُنشئ واصفُ صنف الأخطاء الاختياري رفضًا منوَّعًا يراه البرنامج بلا تسمية مستهلك داخل بيئة التشغيل. وأسماءُ الارتباطات خصائصُ ذاتية، فلا يستطيع `__proto__` اجتيازَ نموذج أولي:

```ts type-equiv
/**
 * Program-visible typed rejection for one binding namespace. The runtime
 * injects a real error constructor under `name`; rejected member calls become
 * its instances and expose the exact member name through
 * `memberNameProperty`. Both strings are runtime data rather than knowledge
 * of a particular consumer such as PTC mode.
 */
interface PtcBindingErrorClass {
  /** Constructor global and resulting `Error.name`; same portable identifier rule as {@link PtcBindingNamespace.global}. */
  name: string
  /**
   * Non-empty own property for the member name. The portable exclusion set is
   * `RESERVED_ERROR_MEMBERS` plus dunder-form names (`__x__`, non-empty
   * middle), enforced identically by every backend; any other name —
   * identifiers or not — is accepted everywhere.
   */
  memberNameProperty: string
}
```

```ts type-equiv
/**
 * A named group of {@link PtcBindingFunction}s the runtime exposes to the
 * program as one global object (e.g. `tools`). Function names are arbitrary
 * strings — a runtime must treat names like `__proto__` or `constructor` as
 * ordinary own properties (null-prototype construction), never as prototype
 * collisions.
 */
interface PtcBindingNamespace {
  /**
   * The global identifier the program sees. Must match the LANGUAGE-PORTABLE
   * identifier subset `[A-Za-z_][A-Za-z0-9_]*` and no language's reserved
   * words, so the same namespace list works against every backend regardless
   * of `language` — a JS-only spelling like `$tools` is rejected by design,
   * not just by the Python backend. Names that satisfy the identifier rule but
   * name a backend-owned slot (`RESERVED_BINDING_GLOBALS`, e.g. `console`,
   * `__dsh_main__`) are also refused everywhere; see its declaration for the
   * exact set and why each entry is reserved.
   */
  global: string
  /** The callable members, keyed by the exact name the program calls. */
  functions: Record<string, PtcBindingFunction>
  /** Optional program-visible typed rejection contract for this namespace. */
  errorClass?: PtcBindingErrorClass
}
```

```ts type-equiv
/** A lossless JSON value transferable through the dependency-light Service Definition. */
type PtcJsonValue = null | boolean | number | string | PtcJsonValue[] | { [key: string]: PtcJsonValue }
```

```ts type-equiv
/**
 * One host-side function exposed to the program as an async callable. The
 * runtime bridges calls to it (possibly across a serialization boundary), so
 * `args` and the resolution value MUST be lossless JSON. A runtime rejects a
 * lossy or non-cloneable value with a descriptive error rather than corrupting
 * the run. No seam-level byte cap applies to a binding resolution. A rejection
 * of this function surfaces inside the program as a rejection of the
 * corresponding call.
 */
type PtcBindingFunction = (args: unknown) => Promise<PtcJsonValue>
```

## الخرج الملتقَط وتصنيف الإخفاقات

السجلاتُ سلاسلُ صرفة. وتحفظ كلُّ قناة مصدر ترتيبَ الإصدار، بينما يتعلق التشابكُ بين القنوات المستقلة بالخلفية لأن البياناتِ الوصفية للقناة ليست من الـseam. وتلتقط بيئةُ التشغيل خرجَ console والمجاري في البرنامج، ولا يعرض المستهلكون إلا النص. وتسقّف التنفيذاتُ مصفوفةَ السجلات الخارجية المسلسَلة مع حمولة قيمة الاكتمال أو رسالة الإخفاق؛ ولا يدخل نحوُ مغلّف النتيجة الثابت ولا فراغاتُ عرض المستهلك ذلك الدفترَ متغيّرَ الحمولة. والطفحُ إخفاقٌ صريح لا استبدالُ قيمة داخل النطاق.

وأصنافُ الإخفاق **حصائلُ متعامدة يُبلَّغ عنها مستقلةً** (بحسب [الأنماط الدفاعية](../defensive-patterns.ar.md)): فانقضاءُ الميزانية ليس استثناءً، والإجهاضُ ليس انقضاءَ مهلة، وموتُ الأساس (نفادُ الذاكرة مثلًا) ليس أيًّا منهما:

```ts type-equiv
/**
 * Why a run failed. The kinds are orthogonal outcomes reported independently
 * (per docs/defensive-patterns.md): a budget expiry is not an exception, an
 * abort is not a timeout, and a substrate death is neither.
 *
 * - `'exception'` — the program threw or failed to parse/transform.
 * - `'timeout'` — an implementation-owned budget expired; the message says which.
 * - `'abort'` — {@link PtcRunRequest.signal} fired.
 * - `'worker-exit'` — the execution substrate died without settling (e.g. OOM).
 * - `'invalid-output'` — the completion value was not lossless JSON.
 * - `'output-limit'` — the serialized outer logs/value/diagnostic exceeded the configured cap.
 * - `'protocol'` — the program sent invalid or over-budget control traffic.
 * - `'sandbox-unavailable'` — required confinement could not be established.
 */
interface PtcRunFailure {
  /** The failure class (see the interface doc for each kind's meaning). */
  kind: 'exception' | 'timeout' | 'abort' | 'worker-exit' | 'invalid-output' | 'output-limit' | 'protocol' | 'sandbox-unavailable'
  /** Human-readable detail, suitable for feeding back to a model to self-correct. */
  message: string
}
```

## الخدمة

`PtcRuntime` معرَّفٌ في [`src/index.ts`](../../packages/ptc-runtime/ptc-runtime/src/index.ts). ويعيد `resolve(request)` مُدخَلاتِ التنفيذ كاملةً، وينفّذها `run(spec)`. ويقدّم `executionInstructions` إرشادَ الاستعمال الذي يملكه المزوّدُ لعرض المستهلك. ويبلّغ `timeout` عن الافتراض والحدّ الأقصى المضبوطين لزمن الانقضاء حين تُدعم التجاوزاتُ لكل نداء؛ ويبقى `resolve` يتحقق من كل طلب ويسقّفه. ويختار `language` عرضَ البرنامج المدعوم؛ ويصف `isolation` الأساسَ بلا ادعاء أمان. ويعلن `sandboxMode` دعمَ سياسة الملفات، وقيمتُه `undefined` للمزوّد الذي لا يوفّر حصرًا. ويُبقي كلُّ تنفيذ حالةَ البرنامج منفصلةً بين التشغيلات، وينهي التنفيذاتِ النشطة وينتظرها أثناء التخلص.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxptcruntime--ptcruntime-abstract-seam"></a>

### `ctx.ptcRuntime` — `PtcRuntime` (abstract seam)

Registers one `ctx.ptcRuntime` implementation. Program, budget, abort, and substrate failures resolve in PtcRunResult; only Service Definition contract misuse rejects. Implementations bridge structured-cloneable bindings, materialize each declared namespace rejection class, treat programs as hostile peers, isolate runs from one another, and terminate and await in-flight runs during disposal.

```ts cordis-catalog
/**
 * Resolve supported options and provider defaults before execution.
 * @param request - Program, bindings, cancellation and optional execution choices.
 * @returns Complete directory, deadline and supported authority for run.
 * @throws When an explicit choice is invalid or unsupported by this provider.
 */
abstract resolve(request: PtcRunRequest): PtcRunSpec

/**
 * Execute resolved inputs; program outcomes resolve as result fields.
 * @param spec - directory, deadline, program, bindings, cancellation and supported policy.
 * @returns Captured output and the execution outcome.
 */
abstract run(spec: PtcRunSpec): Promise<PtcRunResult>
```

Source: [`packages/ptc-runtime/ptc-runtime/src/index.ts`](../../packages/ptc-runtime/ptc-runtime/src/index.ts)
<!-- END GENERATED cordis-surface -->
