# PTC وقت التشغيل

[English](ptc-runtime.md) | العربية

PTC تنفيذ[قدرة seam](../../.agents/notes/implemented/architecture/2026-06-13-capability-seams.zh.md) عبر [dsh-ptc-runtime](../../packages/ptc-runtime/ptc-runtime) توفير `ctx.ptcRuntime`. هو إبرة مقابل Host ربط تشغيل واحد برنامج، تقرير إبلاغ إخراج، فشل و ملائم استخدام صندوق رملي واقع.PTC تنفيذ هو اختياري قدرة، لا يخص[ذكي جسم حلقة رئيسي جاف](core.zh.md).[PTC أساس أساس](../../.agents/notes/implemented/feature/2026-06-15-ptc.zh.md) مسؤول سجل التسجيل عرض،[نوع تحويل إرجاع اتفاق](../../.agents/notes/implemented/feature/2026-07-20-ptc-typed-tool-returns.zh.md) مسؤول ربط قيمة،[صندوق رملي Node قرار](../../.agents/notes/implemented/architecture/2026-09-11-sandboxed-node-ptc-runtime.zh.md) مسؤول قد إصدار تنفيذ مزود.

شفرة المصدر:[`packages/ptc-runtime/ptc-runtime/src/types.ts`](../../packages/ptc-runtime/ptc-runtime/src/types.ts)

## تشغيل: طلب دخول، نتيجة خروج

`PtcRunRequest` يتضمن برنامج، ربط، إلغاء و اختياري تنفيذ اختيار. مزود `resolve` تحقق دعم حمل اختيار و تطبيق نشر قيمة افتراضية؛`run` استقبال دليل و قطع توقف اختيار واضح `PtcRunSpec`. حذف timeout استخدام مزود قيمة افتراضية، عدد قيمة طلب غلاف قمة مرور مرور وقت ميزانية،`null` طلب لا ضبط مرور مرور وقت قطع توقف. مزود في تنفيذ قبل رفض لا دعم حمل اختيار:

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

برنامج فشل عبر `PtcRunResult.error` إرجاع؛ بلا فاعلية استدعاء إدخال ممكن في تنفيذ قبل رفض. صندوق رملي نمط، مراقبة إلى رفض و قوي صنع كامل صفة هو مستقل واقع، لذلك برنامج نجاح ذاته لا يستطيع إثبات كل بند طلب حد متساو قد قوي صنع تنفيذ:

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

## ربط: مضيف دالة بصفة برنامج عام متغير

كل `PtcBindingNamespace` يصبح واحد مختلف خطوة يمكن استدعاء دالة عام كائن؛PTC نقل دخول `tools`. معامل و قيمة راجعة يجب هو بلا ضرر JSON. مزود قوي صنع كل منها نقل حد أعلى؛seam لا ضبط موحد واحد ربط بايت حد أعلى. اختياري خطأ صنف وصف رمز إنشاء برنامج مرئي نوع تحويل رفض، بلا حاجة في وقت التشغيل داخل نقطة اسم مستهلك. ربط اسم هو ذاتي لديه خاصية، لذلك `__proto__` لا يستطيع مرة تاريخ أصل نوع:

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

## التقاط إخراج و فشل تصنيف جسم نظام

سجل هو صاف نص. كل مصدر عبر طريق إبقاء ذاته إرسال خروج ترتيب؛ من في عبر طريق بيانات وصفية لا يخص seam، متبادل متبادل مستقل عبر طريق مثل أي تسليم خطأ من خلفية قرار. وقت التشغيل التقاط برنامج console و تدفق إخراج،Consumer فقط تصيير نص. تنفيذ سوف مقابل تسلسل تحويل بعد خارج طبقة سجل عدد مجموعة، و إتمام قيمة أو فشل رسالة تركيب تحميل حمل ضبط حد أعلى؛ ثابت نتيجة غلاف تركيب لغة قاعدة و Consumer عرض فارغ أبيض لا حساب دخول هذا نسخة متغير تحميل حمل حساب كمية. تجاوز حد سوف صريح فشل، بينما لن في قيمة في إدراج دخول بديل محتوى.

فشل نوع هو**صحيح تسليم نتيجة، مستقل تقرير إبلاغ**(رؤية [defensive-patterns](../defensive-patterns.zh.md)): ميزانية استهلاك كل لا هو استثناء، في توقف لا هو مهلة، أساس قاع انهيار انهيار (مثل OOM) أيضا لا هو اثنان من في أي واحد:

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

## خدمة

`PtcRuntime` تعريف في [`src/index.ts`](../../packages/ptc-runtime/ptc-runtime/src/index.ts).`resolve(request)` إرجاع كامل تنفيذ إدخال،`run(spec)` تنفيذ هو جمع.`executionInstructions` توفير من وقت التشغيل يملك استخدام شرح، توفير مستهلك عرض. دعم حمل تدريجي مرة تغطية وقت،`timeout` تقرير إبلاغ إعداد مرور مرور وقت قيمة افتراضية و حد أعلى؛ كل مرة طلب ما زال من `resolve` تحقق و قطع قطع.`language` اختيار دعم حمل برنامج عرض؛`isolation` وصف تنفيذ أساس قاع، لا عمل أمان إعلان.`sandboxMode` إعلان ملف سياسة دعم حمل، لا توفير قيد مزود إرجاع `undefined`. كل تنفيذ سوف كل مرة تشغيل برنامج حالة قسم مغادرة، و في مورد تحرير خلال إنهاء كما انتظار نشط وثب تنفيذ.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.zh.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

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
