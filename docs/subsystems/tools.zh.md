# أداة

[English](tools.md) | العربية

[dsh-tools](../../packages/core/tools) أداة خط الإنتاج.[core.md](core.zh.md) وسيط تعريف نواة قلب حزمة مشترك استخدام، لأجل تحرير كتابة خط الإنتاج نوع `ToolDefinition`؛ موجه إلى نموذج [`ToolSchema`](llm-streaming.zh.md#the-model-request-and-result) بروتوكول نوع و نموذج طلب واحد بدء إعلان. هذا صفحة سجل `ToolDefinition` كل حقل، لأجل بناء هو نوع تحويل schema DSL، حمل حراسة حماية تنفيذ نوع و UI عرض نوع.

شفرة المصدر:[`packages/core/tools/src/index.ts`](../../packages/core/tools/src/index.ts) · [`packages/core/tools/src/schema.ts`](../../packages/core/tools/src/schema.ts) · [`packages/core/tools/src/presentation.ts`](../../packages/core/tools/src/presentation.ts)

## `ToolDefinition` — واحد قد تسجيل أداة

من واحد `ToolSchema`(موجه إلى نموذج حقل) ، مطلوب مواصفة إخراج إعلان،`execute` دالة، فقط توفير مضيف استخدام مجدول بيانات وصفية، اختياري نهائي محتوى عودة ضبط و اختياري UI عرض دالة مجموعة صار. سجل التسجيل يحتفظ هذه تعريف، حلقة عبر هو جمع قسم إرسال استدعاء. سجل التسجيل `schemas()` عبر صريح سماح قائمة بناء موجه إلى نموذج `ToolSchema[]`؛`output`/`execute`/`finalizeContent`/`timeoutMs`/`isConcurrencySafe`/`presentCall`/`presentResult` أبدا قدرة تسرب تسرب إلى نموذج طلب في.

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

`execute` استقبال `args: unknown`——أصلي `ToolDefinition` ذاتي سطر تحقق إدخال. رقم واحد جهة أداة لا حاجة يد كتابة تحقق؛ هو جمع استخدام `defineTool`، من بعد من بديل لـ تحقق و استلام ضيق معامل نوع، أصل حسب `output.schema` دفع توجيه دالة جسم إرجاع نوع، و لـ اثنان عدد إخراج إسقاط جهاز توفير نوع قيد.`finalizeContent` خاص معنى استقبال غير ممكن تغيير تنفيذ كائن بينما غير نوع تحويل معامل، لأن بلا فاعلية إدخال و خارج طبقة خط الإنتاج فشل أيضا سوف وصول هذا عودة ضبط؛ هو يمكن تطبيق إضافة أداة ذاتي لديه محتوى حد، معا إبقاء `isError`، مواصفة قيمة، بنية تحويل خطأ هوية، تأخير متأخر سياق و عرض بيانات وصفية.

## موحد واحد JSON قيمة schema DSL

إضافة عمل من استخدام نفس طقم مفردات وصف نوع تحويل معامل و نوع تحويل إخراج قيمة.`ValueSchemaSpec` دعم حمل `string`،`number`،`integer`،`boolean`،`null`،`array`،`object`، فقط عمل من جانب متاح `json`، و اشتراط تماما جيد أمر في واحد فرع `oneOf`؛ علامة كمية `enum` و `const` قيمة يجب و عقدة نوع مطابقة. صريح كائن عقدة بداية نهاية إعلان `additionalProperties: true | false`. معامل تعريف ما زال هو خفي صيغة فتح وضع كائن خاصية خريطة، كل لا بد ملء خاصية كل مرفق حمل `required: true`.

شفرة المصدر:[`packages/core/tools/src/schema.ts`](../../packages/core/tools/src/schema.ts)

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

`{ type: 'json' }` دفع توجيه لـ `JsonValue`، و تحرير ترجمة صار فقط يحتوي ملاحظة حل، لا تطبيق إضافة قيد أصلي schema. إخراج أصل يمكن هو كائن، عدد مجموعة، علامة كمية أو null.`InferValue<S>` في 16 طبقة حاوية داخل إبقاء حرف وجه كمية قيد و كائن فتح وضع صفة، بعد رجوع لـ `JsonValue`، تجنب تجنب استهلاك كل TypeScript نوع نسخة تحويل مكدس.`InferArgs<P>` اعتماد حسب تدريجي خاصية لا بد ملء علامة توليد لا بد ملء و اختياري نص مفتاح:

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

`defineTool({ name, description, parameters, output, execute, … })` سوف معامل دفع توجيه و `parameterSchemaSpecToJsonSchema()` و `validateArgs()` ربط، و سوف `execute`/`render`/`presentationMeta` و `InferValue<OutputSchema>` ربط.schema سجل فقط يتضمن ذاتي لديه كما يمكن قطعة رفع نص مفتاح،schema عدد مجموعة هو كثيف سري داخل بناء عدد مجموعة، لذلك دفع توجيه، تحرير ترجمة و تحقق مراقبة إلى هو نفس نسخة إعلان. دقيق دفع توجيه إبقاء إلى 16 طبقة حاوية، بعد وضع عرض لـ `JsonValue`؛ وقت التشغيل تحقق ما زال سوف متابعة مرة تاريخ كامل schema.`valueSchemaSpecToJsonSchema()` عبر نفس طقم قد قوي صنع تنفيذ أصلي فرعي تجميع تحرير ترجمة إخراج إعلان. معامل لا مطابقة وقت رمي خروج `ToolArgsError`(`INVALID_ARGS`) ؛ دالة جسم أو بعد وضع سياسة إنتاج قيمة بلا فاعلية وقت رمي خروج `ToolOutputError`(`INVALID_TOOL_OUTPUT`). اثنان من كل مرور من معتاد قاعدة أداة خطأ مسار معالجة. أصلي JSON Schema افتراضي إبقاء فتح وضع؛ لا دعم حمل صلة مفتاح حرف سوف يتم رفض، بينما لن في لم قوي صنع تنفيذ حال حال تحت نيل دقيق دخول.

تسجيل هو واحد بند تلقي معلومة مهمة نفس عملية اتفاق. سجل التسجيل بـ readonly إدخال استعارة استخدام قد نوع تحويل تعريف، اشتراط هو إعلان `output`، تحقق ذلك أصلي schema، و فحص `timeoutMs` يجب لـ صحيح لديه حد قيمة انتظار دلالة اشتراط؛`schemas()` في بناء طلب وقت توليد موجه إلى نموذج إسقاط، جعل تنفيذ و عرض مشترك نفس نسخة قد تحليل تعريف، بينما لن سوف عودة ضبط تسرب تسرب إلى بروتوكول فوق.

## `ToolRestriction` — مفرد عدد أثر مجال مقابل ذلك وراثة محتوى فوري مرور ترشيح جهاز

`ToolRestriction` أثر في هذا أثر مجال وراثة قدوم أداة: نشر عام طبقة، إضافة فوق ذلك سلسلة فوق كل أصل أولا أثر مجال. سجل التسجيل سوف readonly اسم تحرير ترجمة لـ خاص تجميع دمج، مقابل كثير عدد حد أخذ تسليم تجميع، مجددا تراكم إضافة هذا أثر مجال**ذاته**تسجيل——بعد من لا تلقي قيد، لذلك يتم تفويض إرسال فرعي agent سوف إبقاء ذلك عودة تقرير الذي اعتماد أداة. فقط deny مرور ترشيح جهاز سماح لاحق لم صف خروج وراثة أداة عبر، بينما allow قائمة فإن ترتيب حذف هو جمع.

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

## تنفيذ: يمكن توسيع waterfall(شلال نشر صيغة حدث) إضافة مفرد ضبط سياسة

`ctx.tools.execute()` قبول من استدعاء جهة يملك كما يتضمن مطلوب readonly `signal` `ToolExecutionInput`، سوف ذلك تحليل بعد JSON معامل مرة صفة شيء تحويل لـ خط الإنتاج يملك `ToolExecution`، لكن بعد يجعل استدعاء اعتماد مرة مرور مرور `tools/pre-execute`(يمكن إعادة ترتيب allow/deny/ask waterfall)→ قد تسجيل مفرد ضبط guard → `tools/execute`(حلقة التفاف قسم إرسال حزمة تركيب طبقة)→ `tools/post-execute`(فحص/استبدال نتيجة)→ اختياري كما من تعريف يملك `finalizeContent` → `tools/result`(غير ممكن تغيير مرجعي نتيجة). فقط لديه `tools/execute` عرض يمكن استبدال مطلوب signal. نهائي إنتاج خروج لـ `ToolExecutionResult`.

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

أداة دالة جسم استقبال وقت التشغيل توسيع.`deferContext()` يأخذ سياق مرفق حال إلى هذا مرة تنفيذ ذاتي ذات نتيجة فوق——حيث هو تركيب أداة تحويل تشغيل تضمين طقم قسم إرسال سياق عبر طريق، أيضا يمكن توفير ورقة فرعي أداة صب صنع إضافة مصدر إشارة أمر——بينما لن في خارج طبقة استدعاء بعد لم انتهاء وقت حقن هذه سياق.

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

agent loop(ذكي جسم حلقة) نحو سجل التسجيل استعلام كل انتظار معالجة استدعاء تنفيذ نمط، و حسب هذا شكل صار وحيد احتلال شاشة عائق و تمرير حوض و سطر تنفيذ:

```ts type-equiv
/**
 * Scheduling mode for one pending call. `parallel` may overlap with siblings;
 * `exclusive` runs alone and forms an ordering barrier.
 */
type ToolExecutionMode =
  | { kind: 'parallel' }
  | { kind: 'exclusive' }
```

PTC ربط في بنية صنع وقت تجميد ربط ToolSchema، مرور من مجدول نقل دخول `ToolExecution.schema`؛ هو فقط هو مؤقت تنفيذ بيانات وصفية. كل فعلي بدء فرعي قسم إرسال في سياسة قبل فقط سجل إعداد مقابل id، اسم و مواصفة تحويل معامل. بدء و تسوية حدث كل لا تسلسل تحويل وصف، معامل schema أو schema حقل. جسر وصل طبقة مع بعد يأخذ قد تسوية استدعاء تسليم إعطاء `tools/ptc-dispatch-log` waterfall؛ هو يمكن تغيير حمل دائم محتوى فرعي هذا، لكن سوف إبقاء برنامج أخذ نيل قيمة، نموذج مرئي خارج طبقة نتيجة و بنية تحويل فشل هوية:

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

`ToolExecutionToken` هو لا نفاذ واضح وقت التشغيل `Symbol`، فقط لأجل هوية مقارنة مقارنة. سياسة تنفيذ قبل،`execute()` سوف شيء تحويل و تجميد ربط معامل، رفض غير JSON إدخال و قسم إعداد token. هوية حقل، استدعاء جهة مطلوب signal و اختياري parent token متساو إبقاء readonly.`ToolDispatchExecution` حزمة تركيب طبقة يمكن استبدال signal لكن لا يستطيع إزالة؛ سجل التسجيل سوف في استدعاء أداة دالة جسم قبل إعادة دمج دمج استدعاء جهة signal. نهائي مراقبة من استقبال تجميد ربط تنفيذ هوية.

`ToolGuard` هو شعور معرفة أثر مجال نهائي مسبق قسم إرسال سياسة. ذلك إرجاع نوع متعمد لا يتضمن allow نتيجة:`undefined` إبقاء waterfall قرار، بينما إرجاع reason فقط قدرة تقليص نقص إذن، لذلك لاحق مستمع لا يمكن سحب إلغاء هو.

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

نتيجة فقط تحمل تحميل إنتاج خروج. استدعاء هوية إبقاء في غير ممكن تغيير `ToolExecution` فوق، بعد من مرافق مع نتيجة مرور مرور كل خطاف، و ظهور في حفظ دائم `tool/call` / `tool/result` جلسة حدث فوق، لذلك حزمة تركيب طبقة لا يمكن إنشاء ثاني عدد متبادل متبادل تناقض درع هوية. مواصفة `value` فقط وجود في تنفيذ خلال: حلقة فقط حفظ دائم `content`،`error` و `meta`،`tool/ptc-dispatch` فإن تخزين فرعي استدعاء تصيير بعد `content`،`isError` و اختياري بنية تحويل `error`. إعادة تشغيل يمكن إعادة الآن عرض، لكن لا يمكن إعادة بناء مواصفة في بين قيمة. اختياري `ToolErrorInfo.reason` إبقاء موجه إلى مستخدم أصلي تفصيل حال، لا سوف ذلك إضافة دخول نموذج مرئي محتوى.

نجاح وقت، سجل التسجيل سوف لقطة و تحقق دالة جسم قيمة راجعة، سوف ذلك تجميد ربط، لكن بعد استدعاء صاف مصير؛ مقابل في مباشر خارج طبقة استدعاء، أيضا سوف استدعاء اختياري بيانات وصفية إسقاط جهاز. سجل التسجيل سوف في `tools/result` قبل آخر سطر شيء تحويل حمل دائم عرض حقل؛ بلا فاعلية قيمة، مصير/إسقاط جهاز فشل أو غير JSON عرض كل سوف تحويل لـ JSON أمان `isError`. لذلك، نهائي فوري مراقبة من قدرة يرى دقيق تنفيذ مدة قيمة، و يمكن أمان لأجل لاحق حمل دائم إلحاق حقل.

في نيل إلى نهائي محتوى قبل، سجل التسجيل سوف شيء تحويل مرشح نتيجة؛ إذا محتوى، بنية تحويل خطأ، مرفق إضافة سياق أو عرض بيانات وصفية لا يمكن شيء تحويل، فإن سوف تحويل لـ ما زال يمكن وصول `finalizeContent` JSON أمان `isError` نتيجة. سجل التسجيل تماما جيد استدعاء هذا عودة ضبط مرة، مع بعد في `tools/result` قبل قيام أي شيء تحويل و تجميد ربط قد قبول نتيجة، لذلك فوري مراقبة إلى إنتاج خروج يمكن أمان لأجل لاحق حفظ دائم `tool/result` إلحاق.

كل اعتراض قطع waterfall إرجاع واحد نوع تحويل **Decision**(و `agent/*` waterfall مشترك معتاد استخدام نمط).`tools/pre-execute` مستمع استقبال `(exec, next)` و إرجاع `PreToolDecision`؛`tools/execute` حزمة تركيب طبقة إرجاع `ToolExecutionResult`؛`tools/post-execute` مستمع استقبال `(exec, result, next)` و إرجاع `PostToolDecision`:

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

استدعاء `next()` نيل أخذ افتراضي قرار، أو مباشر إرجاع واحد قرار بـ قصير مسار. قبل وضع سياسة يمكن deny أو ask؛ فقط لديه `allowed-once` عندئذ متابعة تنفيذ، بينما لم تخويل، نقص قليل مراجعة دفعة عبر طريق أو خدمة، أو بلا agent طلب كل سوف تغيير لـ رفض. رفض يمكن مرفق حمل بنية تحويل هوية و مستخدم مرئي تفصيل حال، بينما لا تغيير ذلك نموذج مرئي سبب.Guard ما زال يمكن تطبيق إضافة نهائي رفض. معامل غير ممكن يتم تعديل كتابة، لأن تاريخ سجل، مراجعة حساب،UI و تنفيذ يجب إبقاء متسق.

بعد وضع سياسة يمكن استبدال محتوى أو قيمة، لكن لا يستطيع معا استبدال اثنان من. استبدال محتوى سوف إبقاء مواصفة قيمة و قائم بيانات وصفية؛ استبدال قيمة سوف إعادة تحقق و إعادة حساب حساب محتوى/بيانات وصفية؛ منع توقف سوف إزالة قيمة، و تحويل لـ يتضمن تصحيح صحيح عكس تغذية `isError`. محتوى استبدال هو عرض سياسة، بينما غير حفظ سري سياسة؛ حاجة إخفاء برنامج تحويل قيمة مستمع يجب منع توقف أو استبدال هذا قيمة.`tools/result` في عودة واحد تحويل بعد استقبال تجميد ربط تنفيذ و نتيجة؛ مراقبة من لا يمكن مقابل ذلك إجراء تغيير تبديل، مراقبة من فشل أيضا سوف يتم عزل. لم معرفة أداة و رمي خروج استثناء أداة كل سوف تغيير لـ بنية تحويل خطأ (`ToolNotFoundError` خريطة لـ `UNKNOWN_TOOL`) ، استدعاء فشل لكن لا إنهاء حالي جولة.

## قد قوي صنع تنفيذ أصلي JSON Schema فرعي تجميع

subagent، سير العمل،MCP و حركة حالة تسجيل توفير أصلي schema استخدام عمل من جانب DSL في بروتوكول طبقة مقابل يمثل.`assertSupportedJsonSchema()` قبول مهمة معنى JSON أصل،`validateJsonSchemaValue()` قوي صنع تنفيذ هذا schema،`JsonSchemaError` فإن تقرير إبلاغ كل بند لا تلقي دعم حمل أو صيغة خطأ schema مسار. فقط يحتوي ملاحظة حل فارغ عقدة يمثل لا تلقي قيد بلا ضرر JSON.`oneOf` حتى قليل اشتراط اثنان عدد فرع، كما واحد قيمة يجب تماما جيد مطابقة منها واحد. ما زال اشتراط كائن أصل مستهلك استدعاء `assertObjectJsonSchema()` و يحمل `ObjectJsonSchema`؛ هذا مثال،subagent/سير العمل في من استدعاء جهة تعريف بنية تحويل إخراج يمكن متابعة بـ كائن لـ أصل، بينما لن حد مشترك مفردات.

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

## أداة عرض UI مفردات

أداة أمل نظر ذلك استدعاء في UI في مثل أي عرض (تحرير جهاز أداة استدعاء بطاقة،CLI(أمر سطر واجهة) سجل سطر) ، مزود غير متصل، جعل أداة في لا اعتماد أي عميل بروتوكول حال حال تحت وصف ذاته.`presentCall`/`presentResult` إرجاع واحد **`card` وسم تصيير معنى رسم**——واحد يمكن تمييز تعرف ربط دمج نوع،UI جسر وصل طبقة حسب هذا توزيع:

- `ToolCallView`(انتظار تنفيذ):`{ card: 'generic', title, kind?, rawInput?, content?, locations? }`(افتراضي بطاقة؛`locations` هو `{ path, line? }[]`، يمثل استدعاء قراءة/تعديل ملف، توفير تحرير جهاز تتبع مع) ،`{ card: 'terminal', title, description?, cwd? }`(shell أمر→طرفية بطاقة) ، أو `{ card: 'diff', title, diffs, locations? }`(ملف إنشاء/تعديل→سطر داخل diff بطاقة؛`diffs` هو `{ path, oldText, newText }[]`، جديد ملف وقت `oldText: null`).
- `ToolResultView`(قد إتمام):`{ card: 'generic', title?, content? }`،`{ card: 'terminal', title?, output?, exitCode?, signal? }`(التقاط تشغيل إخراج + خروج حالة؛ لديه قدرة UI عرض خروج حالة وسم، أخرى UI يمكن إرسال توليد محيط شريط ` ```console ` رجوع) ،`{ card: 'diff', title?, diffs }`(قد إتمام ملف تغيير→يلزم عرض تغيير، عبر معتاد هو من تغيير قبل بعد محتوى حساب حساب خروج حمل سياق سطر قد تطبيق hunk، أو في لا يوجد قبل مثل وقت كامل ملف diff) ،`{ card: 'search', shape, title?, truncated, total, … }`(قد إتمام اكتشاف نوع بحث→`shape: 'matches'`(grep) لـ حسب ملف قسم مجموعة مطابقة،`shape: 'paths'`(glob) لـ مسطح مستو مسار قائمة؛`truncated`/`total` تقرير إبلاغ داخل ربط نتيجة هل يتم قطع قطع، جعل UI دائم لا يأخذ جزء نتيجة عند عمل كامل نتيجة عرض؛ هذا عرض لا يحمل نتيجة نص——بلا search بطاقة UI رجوع إلى أصلي نتيجة محتوى) ،`{ card: 'read', title?, path, offset, lines, totalLines, lang?, content? }`(قد إتمام ملف قراءة→حمل سطر رقم، اختياري لغة قاعدة عال مضيء شفرة عرض؛`offset` هو نافذة طلب 1-based بدء بداية سطر، أي جعل `lines` لـ فارغ أيضا إبقاء؛`lang` هو من توسيع اسم دفع نيل لغة تلميح،`content` هو بلا قراءة قدرة UI رجوع وقت استخدام ذهاب معلومة غلاف نص) ، أو `{ card: 'web', kind: 'search' | 'fetch', title?, … }`(قد إتمام web فحص بحث؛`kind: 'search'` يحمل بنية تحويل `sources`/`answer?`/`truncated`،`kind: 'fetch'` يحمل `url`/`statusCode`/`truncated`، لا أداة تجهيز `web` قدرة UI رجوع إلى أصلي نتيجة محتوى——متن لن تكرار دخول عرض). قد إتمام عرض سوف استبدال انتظار تنفيذ عرض، لذلك تغيير أداة أي جعل و استدعاء وقت قطعة مقطع تكرار أيضا يلزم إرجاع diff نتيجة؛ بحث و web فحص بحث كل لا يوجد `card` استدعاء وقت مقابل عرض (ذلك pending حالة إبقاء لـ generic بطاقة، لأن بنية تحويل نتيجة فقط في `execute` بعد عندئذ وجود).

`ToolCallKind`(`'read' | 'edit' | 'delete' | 'move' | 'search' | 'execute' | 'fetch' | 'other'`) لأجل لـ عام بطاقة اختيار رسم علامة.`FileLocation`(`{ path, line? }`) ،`FileDiff`(`{ path, oldText, newText }`) و `ReadFileLine`(`{ number, text }`، قراءة نافذة في واحد سطر حمل 1-based سطر رقم محتوى) هو مشترك ملف بطاقة مفردات. هذا تصميم من[تصيير معنى رسم ربط دمج نوع Agent Note](../../.agents/notes/implemented/architecture/2026-07-02-tool-render-intent-union.zh.md) ثابت؛host/client وقت التشغيل سوف هذا طقم في صفة مفردات إسقاط لـ كل منها عرض.

كامل عرض حقل وثيقة رؤية [`packages/core/tools/src/presentation.ts`](../../packages/core/tools/src/presentation.ts).`bash` schema و منفذ رؤية [shell.md](shell.zh.md) ؛ عام خلفية تحكم رؤية [jobs.md](jobs.zh.md).

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.zh.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

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

Types: [ScopeKey](scope.zh.md)

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

Types: [Scoped](scope.zh.md)

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

Types: [Scoped](scope.zh.md)

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

Types: [Scoped](scope.zh.md)

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

Types: [ContentBlock](llm-streaming.zh.md) · [Scoped](scope.zh.md)

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

Types: [Scoped](scope.zh.md)

Source: [`packages/core/tools/src/index.ts`](../../packages/core/tools/src/index.ts)
<!-- END GENERATED cordis-surface -->
