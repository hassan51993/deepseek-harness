# الأدوات

[English](tools.md) | العربية

مسارُ الأدوات في [dsh-tools](../../packages/core/tools). وتقدّم [core.md](core.ar.md) النوعَ `ToolDefinition` نوعَ تأليف المسار الذي تتشاركه حزمُ النواة؛ أما نوعُ الشبكة [`ToolSchema`](llm-streaming.ar.md#the-model-request-and-result) الذي يراه النموذج فمعلَنٌ مع طلب النموذج. وتوثّق هذه الصفحةُ كلَّ حقل في `ToolDefinition`، ولغةَ schemas المنوَّعة التي تبنيه، وأنواعَ التنفيذ المحروس، وأنواعَ العرض في الواجهة.

المصادر: [`packages/core/tools/src/index.ts`](../../packages/core/tools/src/index.ts) · [`packages/core/tools/src/schema.ts`](../../packages/core/tools/src/schema.ts) · [`packages/core/tools/src/presentation.ts`](../../packages/core/tools/src/presentation.ts)

## `ToolDefinition` — أداة مسجَّلة

هو `ToolSchema` (أي الحقولُ التي يراها النموذج) مع تصريح خرج معياري مشترَط، ودالةِ `execute`، وبياناتٍ وصفية للمجدول تخص المضيفَ وحده، وردِّ نداء اختياري للمحتوى النهائي، وعارضي واجهة اختياريين. ويمسك السجلُّ هذه، وتوزّع الحلقةُ النداءاتِ عبرها. وتبني دالةُ `schemas()` في السجل مصفوفةَ `ToolSchema[]` التي يراها النموذج بقائمة سماح صريحة — فلا يجوز أن تتسرب `output` ولا `execute` ولا `finalizeContent` ولا `timeoutMs` ولا `isConcurrencySafe` ولا `presentCall` ولا `presentResult` إلى طلب نموذج قط.

```ts type-equiv
/** Tool-owned canonical output contract used after the body returns a JSON value. */
interface ToolOutputDefinition {
  /** Raw supported JSON Schema enforced against every successful canonical value. */
  readonly schema: JsonSchemaNode
  /** Pure projection from validated arguments and value to Native/model content. */
  render(args: unknown, value: JsonValue): ContentBlock[]
  /** Pure replayable presentation projection, computed only for top-level calls. */
  presentationMeta?(args: unknown, value: JsonValue): JsonValue
}
```

```ts type-equiv
/** A registered tool: its schema plus the execution function. */
interface ToolDefinition extends ToolSchema {
  /** Mandatory canonical output declaration. */
  readonly output: ToolOutputDefinition
  /**
   * Run one accepted call and return only its canonical lossless-JSON value.
   * Async work must observe or forward `exec.signal` and settle only after its
   * owned work reaches quiescence. The registry preserves caller cancellation
   * through around-dispatch signal replacement and does not abandon this
   * promise, but it cannot hard-kill same-process code.
   * @param args - losslessly snapshotted, frozen model arguments.
   * @param exec - execution identity, cancellation signal, and context deferral.
   * @returns the canonical value declared by `output.schema`.
   */
  execute(args: unknown, exec: ToolRunContext): Promise<unknown>
  /**
   * Synchronous last-mile transform for model-facing content. The registry
   * snapshots this callback when execution starts and invokes it exactly once
   * for every normalized outcome, including pipeline failures that bypass
   * `tools/post-execute`, immediately before lossless materialization.
   * Returning `undefined` preserves the content; every other result field
   * remains registry-owned. The callback must be total and must not throw.
   * @param exec - immutable execution identity and arguments.
   * @param result - complete normalized outcome before materialization.
   * @returns replacement content, or `undefined` to preserve it.
   */
  finalizeContent?(exec: Readonly<ToolExecution>, result: Readonly<ToolExecutionResult>): ContentBlock[] | undefined
  /**
   * Cooperative tool-call timeout budget in milliseconds. Omit for no deadline.
   * Enforced by `@deepseek-ai/dsh-tool-call-timeout-policy` (a `tools/execute` wrapper); it
   * is NEVER sent to the model — `schemas()` whitelists only name/description/
   * parameters. Declaring it asserts this tool forwards `exec.signal` to a
   * cooperative implementation that can reach quiescence when the signal aborts.
   */
  timeoutMs?: number
  /**
   * Pure synchronous classifier for overlap with sibling tool calls. Only
   * `true` opts in; omission, exceptions, non-`true` returns, and invalid
   * `defineTool` arguments are exclusive. This metadata is never model-visible.
   *
   * Opted-in executions must not mutate parent-owned state. Shared state must
   * tolerate concurrent dispatch; recorder races are permitted only when they
   * commute or fail closed. See the
   * [parallel-tool-call Agent Note](../../../../.agents/notes/implemented/feature/2026-07-10-parallel-tool-call-execution.md)
   * for the full contract.
   * @param args - parsed arguments; `defineTool` validates before calling.
   * @returns Whether this call may join a parallel group.
   */
  isConcurrencySafe?(args: unknown): boolean
  /**
   * Optional: how to present the PENDING state of one call in a UI, derived from
   * the call's `args` (parsed arguments, `unknown` — the tool validates/narrows
   * its own input). Returns a {@link ToolCallView} (a `card`-tagged render intent),
   * or `undefined` (or omit the method) to fall back to a generic presentation
   * (title = tool name, raw args as input). Pure and side-effect-free: a UI may
   * call it during live streaming AND a session-log replay, so it must depend
   * only on `args`.
   */
  presentCall?(args: unknown): ToolCallView | undefined
  /**
   * Optional: how to present the COMPLETED state, given the same `args` and the
   * durable result projection (`content`, failure state, and optional `meta`). Returns a
   * {@link ToolResultView}, or `undefined` (or omit the method) to keep the
   * pending title and render the raw result content. Pure and side-effect-free
   * for the same replay reason.
   */
  presentResult?(args: unknown, result: ToolResult): ToolResultView | undefined
}
```

ويتلقى `execute` قيمةَ `args: unknown` — فـ`ToolDefinition` الخام يتحقق من مُدخَله بنفسه. ولا يكتب مؤلفو الأدوات الأصيلة ذلك بأيديهم؛ بل يستعملون `defineTool`، الذي يتحقق من الوسائط ويضيّقها، ويستنتج إرجاعَ المتن من `output.schema`، وينوّع مُسقطَي الخرج كليهما. ويتلقى `finalizeContent` عمدًا التنفيذَ غيرَ القابل للتغيير بدل وسائط منوَّعة لأن إخفاقاتِ المُدخَل غير الصالح وإخفاقاتِ المسار الخارجي تبلغه أيضًا؛ وله فرضُ حدّ محتوى تملكه الأداةُ مع حفظ `isError` والقيمةِ المعيارية وهويةِ الخطأ المبنيَنة والسياقاتِ المؤجلة والبياناتِ الوصفية للعرض.

## لغة schemas قيم JSON الموحَّدة

يستعمل مؤلفو الإضافات مفرداتٍ واحدة للمعاملات المنوَّعة ولقيم الخرج المنوَّعة. ويدعم `ValueSchemaSpec` الأنواعَ `string` و`number` و`integer` و`boolean` و`null` و`array` و`object`، و`json` للمؤلف وحده، و`oneOf` بمطابقة واحدة بالضبط؛ ويجب أن تطابق قيمُ `enum` و`const` القياسية نوعَ عقدتها. وتعلن عقدةُ الكائن الصريحة دائمًا `additionalProperties: true | false`. وتبقى تعريفاتُ المعاملات خريطةَ خصائص كائن مفتوح ضمنيًّا، مع إرفاق `required: true` بكل خاصية مشترَطة.

المصدر: [`packages/core/tools/src/schema.ts`](../../packages/core/tools/src/schema.ts)

```ts type-equiv
/** One author-facing schema for any lossless JSON value root. */
type ValueSchemaSpec =
  | StringValueSchemaSpec
  | NumberValueSchemaSpec
  | IntegerValueSchemaSpec
  | BooleanValueSchemaSpec
  | NullValueSchemaSpec
  | ArrayValueSchemaSpec
  | ObjectValueSchemaSpec
  | JsonValueSchemaSpec
  | OneOfValueSchemaSpec
```

```ts type-equiv
/** One implicit parameter-root property, optionally required. */
type ParameterPropertySpec = ValueSchemaSpec & { required?: true }
```

```ts type-equiv
/**
 * Tool parameter schema. The map itself is an implicit open object root;
 * requiredness remains a per-property `required: true` annotation.
 */
type ParameterSchemaSpec = {
  [key: string]: ParameterPropertySpec
  [key: symbol]: never
}
```

و`{ type: 'json' }` يستنتج `JsonValue` ويُترجم إلى schema خام غير مقيَّد للتوصيف وحده. وقد تكون جذورُ الخرج كائناتٍ أو مصفوفاتٍ أو قيمًا قياسية أو `null`. ويحترم `InferValue<S>` القيودَ الحرفية وانفتاحَ الكائنات عبر 16 مستوى حاويات، ثم يرتد إلى `JsonValue` بدل استنفاد مكدس إنشاء الأنواع في TypeScript. ويحوّل `InferArgs<P>` اشتراطَ كل خاصية إلى مفاتيح سلاسل مشترَطة واختيارية:

```ts type-equiv
/**
 * Infer the TypeScript value accepted by an author-facing value schema. Exact
 * inference is bounded to 16 container levels, then falls back to `JsonValue`.
 */
type InferValue<S> = InferValueAt<S, []>
```

```ts type-equiv
/** Infer the TypeScript argument object for an implicit parameter schema. */
type InferArgs<S> = InferProperties<S, []>
```

ويربط `defineTool({ name, description, parameters, output, execute, … })` استنتاجَ المعاملات بـ`parameterSchemaSpecToJsonSchema()` و`validateArgs()`، ويربط `execute` و`render` و`presentationMeta` بـ`InferValue<OutputSchema>`. ولا تحتوي سجلاتُ schemas إلا مفاتيحَ سلاسل ذاتيةً قابلة للتعداد، ومصفوفاتُ schemas مصفوفاتٌ أصيلة كثيفة، فيرصد الاستنتاجُ والترجمةُ والتحققُ التصريحَ نفسَه. ويبقى الاستنتاجُ دقيقًا عبر 16 مستوى حاويات ثم يتوسع إلى `JsonValue`؛ ويواصل التحققُ في وقت التشغيل المسيرَ في الـschema كاملًا. ويترجم `valueSchemaSpecToJsonSchema()` تصريحاتِ الخرج عبر المجموعة الخام المفروضة نفسِها. وعدمُ تطابق معامل يرمي `ToolArgsError` (`INVALID_ARGS`)؛ وقيمةُ متن أو قيمةٌ بعد السياسة غيرُ صالحة ترمي `ToolOutputError` (`INVALID_TOOL_OUTPUT`). ويستعمل الاثنان مسارَ أخطاء الأدوات المعتاد. ويبقى JSON Schema الخام مفتوحًا افتراضيًا؛ والكلماتُ المفتاحية غيرُ المدعومة تُرفض بدل أن تُقبل بلا فرض.

والتسجيلُ عقدٌ موثوق داخل العملية. ويستعير السجلُّ التعريفَ المنوَّع مُدخَلًا للقراءة فقط، ويشترط `output`، ويتحقق من schema الخام لديه، ويفحص المتطلباتِ الدلالية مثل `timeoutMs` موجبة منتهية؛ وتبني `schemas()` الإسقاطَ الذي يراه النموذجُ حين تبني طلبًا، فيتشارك التنفيذُ والعرضُ تعريفًا محلولًا واحدًا بلا تسريب ردود نداء إلى الشبكة.

## `ToolRestriction` — مرشّح حي لنطاق واحد على ما يرثه

يسري `ToolRestriction` على الأدوات التي يرثها نطاق: الطبقةِ العامة في النشر وكلِّ نطاق سلف على سلسلته. ويترجم السجلُّ الأسماءَ للقراءة فقط إلى مجموعات خاصة، ويقاطع المقيِّداتِ المتعددة، ثم يُراكب تسجيلاتِ النطاق **الخاصة** به، وهي تبقى معفاةً فيُبقي ابنٌ مفوَّض الأدواتِ التي يجيب بها. ويقبل مرشّحُ المنع وحده أدواتٍ موروثة لاحقة غيرَ مذكورة، بينما تستبعدها قائمةُ السماح.

```ts type-equiv
/**
 * Per-scope filter over global tools. Restrictions intersect and do not affect
 * scoped registrations or the reserved PTC mode transport.
 */
interface ToolRestriction {
  /** Global tool names that stay visible; everything else is removed. */
  readonly allow?: readonly string[]
  /** Global tool names removed from visibility. */
  readonly deny?: readonly string[]
}
```

## التنفيذ: شلالات قابلة للتوسعة مع سياسة تصاعدية

تقبل `ctx.tools.execute()` قيمةَ `ToolExecutionInput` يملكها المستدعي مع `signal` مشترَطة للقراءة فقط، وتجسّد وسائطَ JSON المحلَّلة لديها مرةً واحدة في `ToolExecution` يملكه المسار، وتشغّل ذلك النداءَ عبر `tools/pre-execute` (وهو شلالُ السماح والمنع والسؤال القابل لإعادة الترتيب) ← الحرّاسُ التصاعديون المسجَّلون ← `tools/execute` (مغلِّفاتُ ما حول التوزيع) ← `tools/post-execute` (فحصُ النتيجة أو استبدالُها) ← `finalizeContent` الاختياري الذي يملكه التعريف ← `tools/result` (الحصيلةُ المرجعية غيرُ القابلة للتغيير). ولا يستطيع استبدالَ الإشارة المشترَطة إلا عرضُ `tools/execute`. والحصيلةُ `ToolExecutionResult`.

```ts type-equiv
/** Opaque call identity that permits correlation without exposing mutable execution state. */
type ToolExecutionToken = symbol & { readonly [toolExecutionTokenBrand]: true }
```

```ts type-equiv
/**
 * Caller-supplied description of one tool call. {@link ToolRuntime.execute}
 * adds the registry-owned token to form a pipeline {@link ToolExecution};
 * callers do not choose that token.
 */
interface ToolExecutionInput {
  readonly callId: ToolCallId
  /**
   * Root model-requested call owning this execution tree. Callers omit it for
   * a root execution; nested dispatchers propagate the enclosing value.
   */
  readonly rootCallId?: ToolCallId
  readonly name: string
  /** Binding-time tool schema for a PTC inner call; frozen by its producer and never logged. */
  readonly schema?: ToolSchema
  /** Losslessly JSON-serializable parsed arguments (tools validate their own schema). */
  readonly arguments: unknown
  /** The agent on whose behalf the call runs (set by the agent loop). */
  readonly agent?: Agent
  /**
   * Opaque token of the enclosing transport execution, when one exists. PTC
   * mode sets this on SDK sub-dispatches so commit-style observers can wait for
   * the outer `run_code` outcome without receiving its live mutable execution.
   * The token also marks the call as a transport sub-dispatch rather than a
   * model-direct call: under `mode: 'ptc'`, only calls WITH a parent may
   * execute a native tool name — a model-direct call (no parent) is denied as
   * `UNKNOWN_TOOL` before the policy pipeline. See {@link ToolRuntime.execute}.
   */
  readonly parent?: ToolExecutionToken
  /** Required caller-owned cancellation for this invocation. */
  readonly signal: AbortSignal
}
```

ويتلقى متنُ الأداة التوسعةَ في وقت التشغيل. وتُرفق `deferContext()` سياقًا بنتيجة التنفيذ نفسِه — وهي قناةُ التوزيع المتداخل للأدوات المركَّبة، وتصلح أيضًا لأداة ورقية تسكّ تعليمةً من إضافة — بلا حقن داخل النداء الخارجي الذي ما زال مفتوحًا.

```ts type-equiv
/**
 * Runtime context handed to a tool implementation after the registry has
 * accepted a {@link ToolExecution}. {@link deferContext} attaches context to
 * this execution's own result — a composite tool ferries nested-dispatch
 * context back to the outer result, and a leaf tool may mint a fresh
 * plugin-sourced instruction; the loop appends it only after the
 * `tool/result`.
 */
interface ToolRunContext extends ToolExecution {
  /**
   * Defer one context — typically a nested-dispatch context ferried by a
   * composite tool, or a fresh plugin-sourced instruction — until this tool's
   * final result reaches the agent loop. Contexts retain their individual
   * source and metadata and are emitted in call order.
   */
  deferContext(context: UserMessage): void
  /**
   * Mark a successful final result as terminal for the current agent turn.
   * The marker rides this execution's own result (`concludesTurn` exists only
   * on {@link ToolExecutionSuccess}); a composite that dispatches nested
   * calls forwards it from the nested result, exactly like
   * `additionalContexts`, so only an authoritative nested success can
   * conclude the enclosing run.
   */
  concludeTurn(): void
}
```

وتسأل agent loop السجلَّ عن وضع تنفيذ كل نداء معلَّق وتستعمله لتكوين حواجز حصرية وتشغيلاتٍ متوازية من سلة متدحرجة:

```ts type-equiv
/**
 * Scheduling mode for one pending call. `parallel` may overlap with siblings;
 * `exclusive` runs alone and forms an ordering barrier.
 */
type ToolExecutionMode =
  | { kind: 'parallel' }
  | { kind: 'exclusive' }
```

وتجمّد ارتباطاتُ PTC قيمةَ ToolSchema لديها عند الإنشاء وتمرّرها عبر المجدول إلى `ToolExecution.schema`؛ وهي بياناتٌ وصفية عابرة للتنفيذ. وقبل السياسة، لا يسجّل كلُّ توزيع فرعي بدأ فعلًا إلا معرّفاتِ الاقتران والاسمَ والوسائطَ الموحَّدة. ولا تسلسل أحداثُ البدء ولا أحداثُ الاستقرار الوصفَ ولا المعاملاتِ ولا الـschema. ويكشف الجسرُ لاحقًا النداءَ المستقر لشلال `tools/ptc-dispatch-log`، الذي قد يغيّر نسخةَ المحتوى الدائمة مع حفظ قيمة البرنامج والنتيجةِ الخارجية التي يراها النموذج وهويةِ الإخفاق المبنيَنة:

```ts type-equiv
/**
 * One settled `run_code` sub-dispatch about to be logged, as seen by the
 * `tools/ptc-dispatch-log` waterfall: the parent execution (session owner,
 * outer call identity), the sub-call identity, and the outcome whose durable
 * copy a listener may reshape. `content` is the RENDERED result projection
 * (what a native `tool/result` would carry) — the program itself received
 * the structured `value` (or just the error message on failure); only the
 * `tool/ptc-dispatch` event's copy changes.
 */
interface PtcDispatchLog {
  /** The outer `run_code` execution. */
  readonly exec: ToolExecution
  /** The calling agent (the scope routing key and the spill owner), when the outer call has one. */
  readonly agent?: Agent
  /** Opaque sub-call id; new calls use `<parent>:ptc:<n>`. */
  readonly subCallId: ToolCallId
  /** The dispatched sub-tool name. */
  readonly name: string
  /** Whether the sub-call settled as an error. */
  readonly isError: boolean
  /** The sub-call's complete model-facing content (the settle event's default payload). */
  readonly content: ContentBlock[]
}
```

```ts type-equiv
/**
 * One pending tool call inside the registry pipeline. Parsed arguments cross
 * one lossless-JSON materialization boundary before policy and are deep-frozen;
 * call identity, the caller signal, and the registry-assigned {@link token} are
 * readonly. The registry freezes the complete object before `tools/result`
 * observers run.
 */
interface ToolExecution extends ToolExecutionInput {
  /** Root model-requested call, resolved for every root and nested execution. */
  readonly rootCallId: ToolCallId
  /** Registry-assigned identity shared with nested calls only as their opaque `parent` token. */
  readonly token: ToolExecutionToken
}
```

```ts type-equiv
/**
 * Around-dispatch view of a {@link ToolExecution}. A `tools/execute` wrapper
 * may replace the signal for its delegated lifetime, but it cannot remove it.
 * The registry fuses every replacement with the captured caller signal.
 */
interface ToolDispatchExecution extends Omit<ToolExecution, 'signal'> {
  /** Cancellation signal visible to the next wrapper or tool body. */
  signal: AbortSignal
}
```

و`ToolExecutionToken` رمزُ `Symbol` معتم في وقت التشغيل يُستعمل لمقارنة الهوية وحدها. وقبل السياسة، تجسّد `execute()` الوسائطَ وتجمّدها، وترفض المُدخَلَ غيرَ JSON، وتسند الرمزَ. وتبقى حقولُ الهوية وإشارةُ المستدعي المشترَطة ورمزُ الأب الاختياري للقراءة فقط. وقد يستبدل مغلِّفُ `ToolDispatchExecution` الإشارةَ لكن لا يزيلها؛ ويعيد السجلُّ دمجَ إشارة المستدعي قبل استدعاء المتن. ويتلقى المراقبون النهائيون هويةَ التنفيذ المجمَّدة.

و`ToolGuard` سياسةٌ نهائية قبل التوزيع واعيةٌ بالنطاق. ولا يحمل نوعُ إرجاعه عمدًا نتيجةَ سماح: فـ`undefined` تحفظ قرارَ الشلال، بينما لا يستطيع السببُ المعاد إلا تقليلَ الإذن، فلا يستطيع مستمعٌ لاحق نقضَه.

```ts type-equiv
/**
 * A monotonic execution guard evaluated after every `tools/pre-execute`
 * listener and before the tool body. Returning a reason denies the call;
 * returning `undefined` leaves it unchanged. Because guards have no allow
 * result, listener ordering cannot turn a denial back into permission.
 * @param execution - the identity-protected call after extensible pre-execute policy completed.
 * @returns a final denial reason, or `undefined` to leave the call allowed.
 */
type ToolGuard = (execution: Readonly<ToolExecution>) => string | undefined
```

```ts type-equiv
/** Canonical failure detail; internal routing information remains optional. */
interface ToolFailure {
  /** Human-readable failure message without the Native `Error: ` envelope. */
  message: string
  /** Internal error class/code used by policy and durable diagnostics. */
  info?: ToolErrorInfo
}
```

```ts type-equiv
/** Successful canonical tool execution, including its Native/model projection. */
interface ToolExecutionSuccess {
  readonly isError: false
  /** Execution-local canonical value; deliberately omitted from durable events. */
  readonly value: JsonValue
  readonly content: ContentBlock[]
  readonly error?: never
  readonly meta?: JsonValue
  readonly additionalContexts?: UserMessage[]
  /** The agent loop stops after committing this successful result batch. */
  readonly concludesTurn?: true
}
```

```ts type-equiv
/** Failed canonical tool execution; failures never carry a successful value. */
interface ToolExecutionFailure {
  readonly isError: true
  readonly error: ToolFailure
  readonly value?: never
  readonly content: ContentBlock[]
  readonly meta?: JsonValue
  readonly additionalContexts?: UserMessage[]
  readonly concludesTurn?: never
}
```

```ts type-equiv
/** The discriminated, execution-local outcome of one tool call. */
type ToolExecutionResult = ToolExecutionSuccess | ToolExecutionFailure
```

```ts type-equiv
/** Structured error metadata for a failed tool call (alongside the model-facing text). */
interface ToolErrorInfo {
  name: string
  code: string
  /** Optional raw user-facing detail; durable projections preserve it but model-facing content does not include it. */
  reason?: string
}
```

ولا تحمل النتيجةُ إلا الحصيلة. وتبقى هويةُ النداء على `ToolExecution` غير القابل للتغيير الذي يرافقها عبر كل خطّاف، وعلى حدثَي الجلسة الدائمين `tool/call` و`tool/result`، فلا تستطيع المغلِّفاتُ إنشاءَ هوية ثانية مخالفة. والقيمةُ المعيارية `value` محليةٌ في التنفيذ: فلا تحفظ الحلقةُ إلا `content` و`error` و`meta`، بينما يخزّن `tool/ptc-dispatch` قيمةَ `content` المعروضة للنداء الفرعي و`isError` و`error` المبنيَنة اختياريًا. وتعيد إعادةُ التشغيل إنتاجَ العرض لكنها لا تستطيع إعادةَ بناء القيم الوسيطة المعيارية. ويحتفظ `ToolErrorInfo.reason` الاختياري بتفصيل خام يراه المستخدم بلا إضافته إلى المحتوى الذي يراه النموذج.

وعند النجاح، يلتقط السجلُّ قيمةَ المتن ويتحقق منها ويجمّدها، ويستدعي العارضَ النقي ومُسقطَ البيانات الوصفية الاختياري للنداءات العليا. ويجسّد على حدة حقولَ العرض الدائمة قبل `tools/result` مباشرةً؛ وتصير القيمةُ غيرُ الصالحة أو فشلُ العارض أو المُسقط أو العرضُ غيرُ JSON نتيجةَ `isError` آمنة في JSON. ولذلك يرى المراقبُ الحي الأخير القيمةَ المحلية للتنفيذ بعينها بجوار حقول آمنة للإلحاق الدائم اللاحق.

وقبل المحتوى النهائي، يجسّد السجلُّ النتيجةَ المرشحة؛ ويصير فشلٌ في المحتوى أو الخطأ المبنيَن أو السياق الإضافي أو البيانات الوصفية للعرض نتيجةَ `isError` آمنة في JSON تبلغ `finalizeContent` مع ذلك. ويستدعي السجلُّ ذلك ردَّ النداء مرةً واحدة بالضبط، ثم يجسّد النتيجةَ المقبولة ويجمّدها قبل `tools/result` مباشرةً، فتكون الحصيلةُ الحية المرصودة آمنةً للإلحاق الدائم اللاحق في `tool/result`.

ويعيد كلُّ شلال اعتراض **قرارًا** منوَّعًا (وهو الاصطلاحُ نفسُه المتشارَك مع شلالات `agent/*`). فيتلقى مستمعو `tools/pre-execute` الزوجَ `(exec, next)` ويعيدون `PreToolDecision`؛ وتعيد مغلِّفاتُ `tools/execute` قيمةَ `ToolExecutionResult`؛ ويتلقى مستمعو `tools/post-execute` الثلاثيَّ `(exec, result, next)` ويعيدون `PostToolDecision`:

```ts type-equiv
/**
 * Pre-dispatch decision. `allow` runs the call; `deny` materializes its
 * model-facing reason and optional structured error identity; `cancel` selects
 * the canonical cancellation result without presenting a policy denial; `ask`
 * runs only after an approval service returns `allowed-once` and otherwise
 * denies. Input rewriting is excluded because arguments are already logged and
 * presented.
 */
type PreToolDecision =
  | { kind: 'allow' }
  | { kind: 'deny'; reason: string; info?: ToolErrorInfo }
  | { kind: 'cancel' }
  | { kind: 'ask'; reason?: string }
```

```ts type-equiv
/**
 * Post-dispatch decision: accept, replace one projection, attach context for the
 * next request, or block by turning corrective feedback into an error result.
 */
type PostToolDecision =
  | { kind: 'accept'; content?: ContentBlock[]; value?: never; additionalContexts?: UserMessage[] }
  | { kind: 'accept'; value: JsonValue; content?: never; additionalContexts?: UserMessage[] }
  | { kind: 'block'; feedback: ContentBlock[]; additionalContexts?: UserMessage[] }
```

نادِ `next()` للافتراض أو أعِد قرارًا لقطع السلسلة. وقد تمنع سياسةُ ما قبل التنفيذ أو تسأل؛ ولا يمضي إلا `allowed-once`، بينما يصير عدمُ المنح أو غيابُ قناة الموافقة أو خدمتها أو طلبٌ بلا وكيل منعًا. وقد يُرفق المنعُ هويةً مبنيَنة وتفصيلًا يراه المستخدم بلا تغيير سببه الذي يراه النموذج. وللحرّاس فرضُ منع نهائي مع ذلك. ولا يمكن إعادةُ كتابة الوسائط لأن على التاريخ والتدقيق والواجهة والتنفيذ أن تتفق.

وقد تستبدل سياسةُ ما بعد التنفيذ المحتوى أو القيمةَ، لا الاثنين. ويحفظ استبدالُ المحتوى القيمةَ المعيارية والبياناتِ الوصفية القائمة؛ ويُعاد التحققُ من استبدال القيمة ويُعاد حسابُ المحتوى والبيانات الوصفية؛ والحجبُ يزيل القيمةَ ويصير `isError` يحتوي ملاحظاتٍ تصحيحية. واستبدالُ المحتوى سياسةُ عرض لا سياسةُ سرّية: فالمستمعُ الذي يجب أن يخفي القيمةَ البرمجية يحجبها أو يستبدلها. ويتلقى `tools/result` التنفيذَ والنتيجةَ مجمَّدين بعد التوحيد؛ ولا يستطيع المراقبون تحويلَهما، وإخفاقاتُ المراقبين محتواة. وتصير الأدواتُ المجهولة والرامية أخطاءً مبنيَنة (فـ`ToolNotFoundError` يُربط بـ`UNKNOWN_TOOL`)، فيفشل النداءُ بلا إنهاء الجولة.

## مجموعة JSON Schema الخام المفروضة

تستعمل schemas الخام من الوكلاء الفرعيين ومسارات العمل وMCP والتسجيلات الديناميكية نظيرَ لغة المؤلف على مستوى الشبكة. وتقبل `assertSupportedJsonSchema()` أيَّ جذر JSON، وتفرضه `validateJsonSchemaValue()`، ويبلّغ `JsonSchemaError` عن كل مسار schema غير مدعوم أو مشوَّه. والعقدةُ الفارغة المقتصرة على التوصيف تعني JSON بلا فقد وبلا قيود. ويشترط `oneOf` فرعين على الأقل، وعلى القيمة أن تطابق واحدًا بالضبط. ويستدعي المستهلكون الذين ما زالوا يشترطون جذرَ كائن الدالةَ `assertObjectJsonSchema()` ويحملون `ObjectJsonSchema`؛ وهكذا يبقى الخرجُ المبنيَن الذي يعرّفه المستدعي في الوكلاء الفرعيين ومسارات العمل مجذورًا بكائن بلا تقييد المفردات المشتركة.

```ts type-equiv
/** Scalar JSON values supported by `enum` and `const`. */
type JsonSchemaScalar = string | number | boolean | null
```

```ts type-equiv
/** Single-type keywords accepted by the enforced subset. */
type JsonSchemaType = 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean' | 'null'
```

```ts type-equiv
/**
 * One raw JSON Schema node in the enforced subset. The optional fields express
 * the external wire schema; {@link assertSupportedJsonSchema} rejects invalid
 * combinations before a caller treats the node as trusted.
 */
interface JsonSchemaNode {
  /** Omit with no constraints for any JSON value, or use `oneOf`. */
  type?: JsonSchemaType
  /** Exactly one branch must validate; at least two branches are required. */
  oneOf?: JsonSchemaNode[]
  /** Nested property schemas (`type: 'object'` only). */
  properties?: Record<string, JsonSchemaNode>
  /** Required property names; each must appear in `properties`. */
  required?: string[]
  /** `false` rejects undeclared keys; absent/`true` follows JSON Schema's open default. */
  additionalProperties?: boolean
  /** Item schema (`type: 'array'` only); absent accepts any JSON item. */
  items?: JsonSchemaNode
  /** Allowed values for a scalar node. */
  enum?: JsonSchemaScalar[]
  /** The single allowed value for a scalar node. */
  const?: JsonSchemaScalar
  /** Annotation, ignored for validation. */
  description?: string
  /** Annotation, ignored for validation. */
  title?: string
  /** Annotation, ignored for validation but required to be lossless JSON. */
  default?: JsonValue
  /** Annotation, ignored for validation but required to be lossless JSON. */
  examples?: JsonValue
}
```

```ts type-equiv
/** A consumer-constrained object-rooted schema. */
type ObjectJsonSchema = JsonSchemaNode & { type: 'object' }
```

## مفردات عرض الأدوات في الواجهة

كيف تريد الأداةُ أن يُعرض نداؤها في واجهة (بطاقةُ نداء أداة في محرّر، أو سطرُ سجل في CLI)، محايدةً تجاه المزوّدين فتصف الأداةُ نفسَها بلا اعتماد على بروتوكول عميل. ويعيد `presentCall` و`presentResult` **قصدَ عرض موسومًا بـ`card`** — وهو اتحادٌ مميَّز يفرّع عليه جسرُ الواجهة:

- `ToolCallView` (معلَّق): `{ card: 'generic', title, kind?, rawInput?, content?, locations? }` (وهي البطاقةُ الافتراضية؛ و`locations` مصفوفةُ `{ path, line? }[]` للملفات التي يقرؤها النداءُ أو يغيّرها، لمتابعة المحرّر)، أو `{ card: 'terminal', title, description?, cwd? }` (أمرُ صدفة ← بطاقةُ طرفية)، أو `{ card: 'diff', title, diffs, locations? }` (إنشاءُ ملف أو تعديلُه ← بطاقةُ فرق مضمَّنة؛ و`diffs` مصفوفةُ `{ path, oldText, newText }[]`، و`oldText: null` لملف جديد).
- `ToolResultView` (مكتمل): `{ card: 'generic', title?, content? }`، أو `{ card: 'terminal', title?, output?, exitCode?, signal? }` (وهو خرجُ التشغيل الملتقَط مع الخروج؛ فتعرض واجهةٌ قادرة قرصَ حالة خروج، بينما قد تشتق أخرى احتياطيًّا سياجَ ` ```console `)، أو `{ card: 'diff', title?, diffs }` (تغييرُ ملف مكتمل ← التغييرُ المراد عرضه، وهو عادةً الكتلُ المطبَّقة مع أسطر السياق المحسوبة من محتوى ما قبل وما بعد، أو فرقُ الملف كاملًا حين لا توجد صورةُ «قبل»)، أو `{ card: 'search', shape, title?, truncated, total, … }` (بحثُ اكتشاف مكتمل ← مطابقاتٌ مجمَّعة بالملف حين `shape: 'matches'` (grep) أو قائمةُ مسارات مسطحة حين `shape: 'paths'` (glob)؛ وتبلّغ `truncated` و`total` أسُقّفت النتيجةُ المضمَّنة، فلا تعرض واجهةٌ نتيجةً جزئية بوصفها كاملة؛ ولا يحمل العرضُ نصَّ نتيجة — فالواجهةُ بلا بطاقة بحث ترتد إلى محتوى النتيجة الخام)، أو `{ card: 'read', title?, path, offset, lines, totalLines, lang?, content? }` (قراءةُ ملف مكتملة ← عرضُ شفرة مرقَّم الأسطر ومبرَز اختياريًا؛ و`offset` أولُ سطر طلبته النافذةُ ويبدأ من واحد، ويبقى ولو كانت `lines` فارغة؛ و`lang` تلميحُ لغة من الامتداد، و`content` النصُّ المجرَّد من مغلّفه الذي ترتد إليه واجهةٌ بلا دعم قراءة)، أو `{ card: 'web', kind: 'search' | 'fetch', title?, … }` (جلبُ وِب مكتمل؛ فـ`kind: 'search'` تحمل `sources` المبنيَنة و`answer?` و`truncated`، و`kind: 'fetch'` تحمل `url` و`statusCode` و`truncated`، وترتد الواجهةُ بلا قدرة `web` إلى محتوى النتيجة الخام — فالمتنُ لا يُكرَّر في العرض). وتحلّ العروضُ المكتملة محلَّ العروض المعلَّقة، فتعيد أدواتُ التغيير نتيجةَ فرق ولو كررت مقتطفَ وقت النداء؛ وليس للبحث ولا لجلب الوِب نظيرٌ بـ`card` وقتَ النداء (فتبقى حالتُهما المعلَّقة بطاقةً عامة، إذ لا توجد النتيجةُ المبنيَنة إلا بعد `execute`).

و`ToolCallKind` (`'read' | 'edit' | 'delete' | 'move' | 'search' | 'execute' | 'fetch' | 'other'`) تختار أيقونةً على بطاقة عامة. و`FileLocation` (`{ path, line? }`) و`FileDiff` (`{ path, oldText, newText }`) و`ReadFileLine` (`{ number, text }`، وهو سطرٌ واحد مرقَّم من نافذة قراءة يبدأ من واحد) مفرداتُ بطاقات الملفات المشتركة. والتصميمُ مثبَّت في [ملاحظة الوكيل عن اتحاد قصد العرض](../../.agents/notes/implemented/architecture/2026-07-02-tool-render-intent-union.ar.md)؛ وتُسقط بيئاتُ تشغيل المضيف والعميل هذه المفرداتِ المحايدة في عروضها.

وتوثيقُ حقول العرض كاملًا في [`packages/core/tools/src/presentation.ts`](../../packages/core/tools/src/presentation.ts). وschema أداة `bash` ومنفّذُها على [shell.md](shell.ar.md)؛ وضوابطُ الخلفية العامة على [jobs.md](jobs.ar.md).

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxtools--toolruntime"></a>

### `ctx.tools` — `ToolRuntime`

Tool registry and execution pipeline. Scoped registrations shadow globals; one visibility resolver feeds presentation, lookup, and dispatch.

```ts cordis-catalog
/**
 * Present the calling scope's tools in `mode` instead of the deployment
 * default. Nearest scope on the chain wins, so a preset's standing
 * declaration covers every agent joined under it.
 *
 * Scoped only, and one declaration per scope: this is how an agent preset
 * composes PTC mode agents beside native ones in the same process, and a
 * process-global override would be the `mode` config field instead.
 * @param mode - the presentation the covered agents' models see.
 * @returns the exact disposer that restores the deployment default.
 */
presentAs(mode: ToolPresentationMode): () => void

/**
 * Register globally or in the calling agent scope. Scoped tools shadow
 * globals; duplicates within one layer and the reserved `run_code` name fail.
 * @param definition - tool schema, execution, and optional finalization/presentation callbacks.
 * @returns the exact disposer that unregisters the tool.
 */
register(definition: ToolDefinition): () => void

/**
 * Restrict global tools for the calling agent scope. Empty filters, unknown
 * names, scope-local names, and reserved transport names fail. Restrictions
 * intersect; scoped registrations remain visible.
 * @param filter - global-tool mask: `allow` (keep only) and/or `deny` (remove).
 * @returns the exact disposer that lifts this restriction.
 */
restrict(filter: ToolRestriction): () => void

/**
 * Register a monotonic guard after the extensible `tools/pre-execute`
 * waterfall. A plain-context guard applies globally; one registered through
 * `agent.ctx` applies only to that agent. Any matching guard may deny by
 * returning a reason, while no guard can force-allow a call another guard
 * denied. The exact effect disposer is returned for ordered ownership and
 * HMR cleanup.
 * @param guard - synchronous check; a returned string denies the execution.
 * @returns the exact disposer that unregisters the guard.
 */
guard(guard: ToolGuard): () => void

/**
 * Look up a tool as one scope sees it (scoped
 * shadows global; a restricted-away global reads as absent). Presenters pass
 * the calling agent so the rendered card matches the definition that
 * actually executed.
 * @param name - the tool name as registered.
 * @param scope - the viewing scope (the agent); omitted = the global view.
 * @returns the definition the scope resolves, or undefined when none is visible.
 */
get(name: string, scope?: ScopeKey): ToolDefinition | undefined

/**
 * Project visible definitions onto the allowlisted model-facing schema fields,
 * excluding execution and presentation callbacks.
 * @param scope - the viewing scope (the agent); omitted = the global view.
 * @returns one deep-cloned schema per visible tool.
 */
schemas(scope?: ScopeKey): ToolSchema[]

/**
 * Classify a pending call through the caller's visible tool definition. Only
 * an exact `true` is parallel; unknown, hidden, undeclared, invalid, or
 * throwing classifiers are exclusive.
 * @param exec - call name, parsed arguments, and optional agent scope.
 * @returns the fail-closed scheduling mode.
 */
executionMode(exec: ToolExecutionInput): ToolExecutionMode

/**
 * Execute through pre-policy, guards, around-dispatch, post-policy,
 * definition-owned content finalization, and final notification. Tool and
 * listener failures resolve as materialized error results; an invisible tool
 * reports `UNKNOWN_TOOL`. The returned outcome is the same lossless, frozen
 * snapshot final observers receive. Cancellation
 * arriving after entry and before final result materialization skips a
 * not-yet-started body with `ABORTED_BEFORE_DISPATCH` or replaces a
 * successful started outcome with `ABORTED`; already-started work is still
 * drained and may retain a tool-owned structured error.
 * @param exec - the typed same-process call input. The registry assigns its
 *   correlation token before policy begins.
 * @returns the materialized final result.
 */
async execute(exec: ToolExecutionInput): Promise<ToolExecutionResult>
```

Types: [ScopeKey](scope.ar.md)

Source: [`packages/core/tools/src/index.ts`](../../packages/core/tools/src/index.ts)

<a id="tools-events"></a>

### `tools/*` events

<a id="toolschange--emit"></a>

#### `tools/change` — emit

A tool was registered or unregistered, or a scoped restriction changed (the available tool set changed — possibly for one scope only). An UNFILTERED registry-subject notification, deliberately not scope-filtered dispatch: a global change concerns every agent's next assembly, so a scoped listener subscribing here sees every change, not just its own scope's.

```ts cordis-catalog
/**
 * A tool was registered or unregistered, or a scoped restriction changed
 * (the available tool set changed — possibly for one scope only). An
 * UNFILTERED registry-subject notification, deliberately not scope-filtered
 * dispatch: a global change concerns every agent's next assembly, so a
 * scoped listener subscribing here sees every change, not just its own
 * scope's.
 * @mode emit
 */
'tools/change'(): void
```

Source: [`packages/core/tools/src/index.ts`](../../packages/core/tools/src/index.ts)

<a id="toolsexecute--waterfall"></a>

#### `tools/execute` — waterfall

Around-dispatch waterfall for timeout, retry, or metrics. `next()` returns a normalized result; wrappers may change only `exec.signal`, while call identity remains immutable. The registry re-fuses the original caller signal before the body, so replacement cannot detach caller cancellation; wrappers must still restore their signal and reach quiescence. Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent's calls.

```ts cordis-catalog
/**
 * Around-dispatch waterfall for timeout, retry, or metrics. `next()` returns
 * a normalized result; wrappers may change only `exec.signal`, while call
 * identity remains immutable. The registry re-fuses the original caller
 * signal before the body, so replacement cannot detach caller cancellation;
 * wrappers must still restore their signal and reach quiescence.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent's calls.
 * @param exec - the allowed call about to dispatch (name, parsed arguments, caller agent, signal).
 * @mode waterfall
 */
'tools/execute'(this: Scoped<ToolRuntime>, exec: ToolDispatchExecution, next: () => Promise<ToolExecutionResult>): Promise<ToolExecutionResult>
```

Types: [Scoped](scope.ar.md)

Source: [`packages/core/tools/src/index.ts`](../../packages/core/tools/src/index.ts)

<a id="toolspost-execute--waterfall"></a>

#### `tools/post-execute` — waterfall

Accept, replace, enrich, or block a normalized dispatch result. `next()` accepts it unchanged; thrown tools still reach this waterfall as errors. Async listeners must observe `exec.signal`; after they settle, caller cancellation replaces only a successful accepted outcome with the code selected by whether the tool body was invoked. Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent's calls.

```ts cordis-catalog
/**
 * Accept, replace, enrich, or block a normalized dispatch result. `next()`
 * accepts it unchanged; thrown tools still reach this waterfall as errors. Async
 * listeners must observe `exec.signal`; after they settle, caller
 * cancellation replaces only a successful accepted outcome with the code
 * selected by whether the tool body was invoked.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent's calls.
 * @param exec - the call that just ran (name, parsed arguments, caller agent).
 * @param result - the dispatch outcome a listener may accept, replace, or block.
 * @mode waterfall
 */
'tools/post-execute'(this: Scoped<ToolRuntime>, exec: ToolExecution, result: Readonly<ToolExecutionResult>, next: () => Promise<PostToolDecision>): Promise<PostToolDecision>
```

Types: [Scoped](scope.ar.md)

Source: [`packages/core/tools/src/index.ts`](../../packages/core/tools/src/index.ts)

<a id="toolspre-execute--waterfall"></a>

#### `tools/pre-execute` — waterfall

Allow, deny, cancel, or ask before dispatch. `next()` delegates to allow; `cancel` selects the canonical pre-dispatch cancellation result, and missing approval support turns `ask` into denial. Async gates must observe `exec.signal`; the registry rechecks cancellation after they settle but never abandons their promise. Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent's calls.

```ts cordis-catalog
/**
 * Allow, deny, cancel, or ask before dispatch. `next()` delegates to allow;
 * `cancel` selects the canonical pre-dispatch cancellation result, and missing
 * approval support turns `ask` into denial. Async gates must observe
 * `exec.signal`; the registry rechecks cancellation after they settle but
 * never abandons their promise.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent's calls.
 * @param exec - the pending call (name, parsed arguments, caller agent).
 * @mode waterfall
 */
'tools/pre-execute'(this: Scoped<ToolRuntime>, exec: ToolExecution, next: () => Promise<PreToolDecision>): Promise<PreToolDecision>
```

Types: [Scoped](scope.ar.md)

Source: [`packages/core/tools/src/index.ts`](../../packages/core/tools/src/index.ts)

<a id="toolsptc-dispatch-log--waterfall"></a>

#### `tools/ptc-dispatch-log` — waterfall

Allow a listener to replace content in the DURABLE LOG COPY of one `run_code` sub-dispatch outcome before the bridge appends its `tool/ptc-dispatch` event. `next()` keeps the content unchanged; a listener may return replacement blocks (e.g. the spill policy's preview + locator for an oversized text result). Only the logged copy is affected — the program already received the complete value, and the model sees neither. A throwing listener is contained: the bridge falls back to logging the original settled content. Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent's dispatches.

```ts cordis-catalog
/**
 * Allow a listener to replace content in the DURABLE LOG COPY of one
 * `run_code` sub-dispatch outcome before the bridge appends its
 * `tool/ptc-dispatch` event. `next()` keeps the
 * content unchanged; a listener may return replacement blocks (e.g. the
 * spill policy's preview + locator for an oversized text result). Only the
 * logged copy is affected — the program already received the complete
 * value, and the model sees neither. A throwing listener is contained:
 * the bridge falls back to logging the original settled content.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent's dispatches.
 * @param dispatch - the parent execution, sub-call identity, and the settled content to log.
 * @mode waterfall
 */
'tools/ptc-dispatch-log'(this: Scoped<ToolRuntime>, dispatch: PtcDispatchLog, next: () => Promise<ContentBlock[]>): Promise<ContentBlock[]>
```

Types: [ContentBlock](llm-streaming.ar.md) · [Scoped](scope.ar.md)

Source: [`packages/core/tools/src/index.ts`](../../packages/core/tools/src/index.ts)

<a id="toolsresult--emit"></a>

#### `tools/result` — emit

Observe the frozen, lossless-JSON final outcome. Listener failures are contained. Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): keyed by `exec.agent`.

```ts cordis-catalog
/**
 * Observe the frozen, lossless-JSON final outcome. Listener failures are contained.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): keyed by `exec.agent`.
 * @param exec - the execution object that traversed the pipeline.
 * @param result - a deep-frozen snapshot of the final returned result.
 * @mode emit
 */
'tools/result'(this: Scoped<ToolRuntime>, exec: Readonly<ToolExecution>, result: Readonly<ToolExecutionResult>): undefined
```

Types: [Scoped](scope.ar.md)

Source: [`packages/core/tools/src/index.ts`](../../packages/core/tools/src/index.ts)
<!-- END GENERATED cordis-surface -->
