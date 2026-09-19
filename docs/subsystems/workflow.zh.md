# سير العمل

[English](workflow.md) | العربية

سير العمل seam سماح agent(ذكي جسم) تشغيل من نموذج تحرير كتابة، سوف بدء subagent تحرير ترتيب نص برمجي. و [subagent](subagent.zh.md) واحد مثال، هو هو**واحد بند اختياري قدرة**، لا يخص agent loop، لذلك ذلك نوع و عملية سجل في هذا موضع، بينما غير [core.md](core.zh.md). و bash واحد مثال، كل سياق فقط سماح واحد جذب محرك تنفيذ توفير `ctx.workflowEngine`؛ لا يوجد تسمية مزود سجل التسجيل (ثاني عدد جذب محرك عبر إضافة إعداد استبدال رقم واحد، بينما لا و هو معا تشغيل).

Service Definition:[dsh-workflow](../../packages/workflow/workflow)(`ctx.workflowEngine` و تحت نص مفردات).[dsh-workflow-ptc](../../packages/workflow/workflow-ptc) عبر مشترك Node PTC عملية وقت التشغيل حسب استدعاء Session ملف سياسة تنفيذ VM و مساعد مساعدة دالة. مستهلك لـ [dsh-tool-workflow](../../packages/workflow/tool-workflow) و يحتاج صريح تفعيل [dsh-tool-ralph](../../packages/workflow/tool-ralph).[سير العمل صندوق رملي إعادة استخدام](../../.agents/notes/implemented/architecture/2026-09-13-workflow-ptc-sandbox-reuse.zh.md) مسؤول تنفيذ اختيار؛[حركة حالة سير العمل قرار](../../.agents/notes/implemented/feature/2026-07-05-dynamic-workflows.zh.md) مسؤول نص برمجي دلالة.

شفرة المصدر: متصفح أمان مفردات يقع في [`packages/workflow/workflow/src/types.ts`](../../packages/workflow/workflow/src/types.ts) ،Host طلب و نشط وثب تشغيل جملة مقبض يقع في [`runtime-types.ts`](../../packages/workflow/workflow/src/runtime-types.ts).

## بدء طلب

هذا عقدة تعريف استدعاء جهة بدء مرة وقت التشغيل إيداع طلب. عادي سير العمل أداة سوف أصل حسب نموذج `{ script, meta, args }` استدعاء و إرسال بدء استدعاء agent بناء هذا طلب؛ مخصص استخدام مستهلك أيضا يمكن لـ هذا مرة تشغيل اختيار جذب محرك درجة `subagentProvider`، و سوف `maxTotalAgents` ضبط منخفض، لكن نص برمجي لا يمكن مراقبة أو استبدال هذا اثنان بند سياسة.`meta` و `args` هو عادي JSON بيانات؛ جذب محرك سوف استخدام schema تحقق `meta`، و في أي عمل بدء قبل واضح تقرير خطأ و رفض بلا فاعلية بيانات. جذب محرك أبدا سوف عبر مقابل نص برمجي نص طلب قيمة قدوم نيل أخذ هو جمع.`parent` هو لا بد ملء حقل——نص برمجي بدء كل فرعي agent كل ملكية في هو،cwd، جدول نظام و عميق درجة عبر [subagent seam](subagent.zh.md) نقل تمرير.

```ts type-equiv
/**
 * What a caller asks for when starting a workflow run. `meta` and `args` are
 * plain JSON data by the seam contract. `parent` is required because every
 * `agent()` spawned by the script is attributed to that live Agent.
 */
interface WorkflowStartRequest {
  /** The plain-JS script body (top-level await allowed; ends with `return <json-value>`). */
  script: string
  /** The workflow's identity block, as plain JSON data (shape-validated by the engine). */
  meta: WorkflowMeta
  /** Optional input exposed verbatim to the script as the `args` global. */
  args?: unknown
  /** Optional engine-wide child-provider override for this run. */
  subagentProvider?: string
  /** Optional per-run total-child ceiling. */
  maxTotalAgents?: number
  /** The agent on whose behalf the run executes (parent of every child). */
  parent: Agent
  /** Cancels the run when aborted. */
  signal?: AbortSignal
}
```

## سير العمل هوية معرف:`WorkflowMeta`

بصفة بيانات مرفق في بدء طلب فوق هوية كتلة (أداة `meta` معامل؛ حقل مفردات و Claude Code حركة حالة سير العمل meta كتلة متسق).`phases` فقط لأجل دخول درجة عرض:`phase()` استدعاء و عنوان مطابقة، توفير مراقبة من استخدام؛ لا داكن عرض أي تنفيذ بنية.

```ts type-equiv
/**
 * The script's identity block, provided as plain JSON data alongside the
 * script body (the model-facing tool carries it as its `meta` parameter) and
 * validated by the engine before the body runs. `name`/`description` are
 * required; the rest is optional annotation. The field vocabulary matches the
 * Claude Code dynamic-workflows meta block.
 */
interface WorkflowMeta {
  /** Short kebab-case workflow name (display + persistence key). */
  name: string
  /** One-line description of what the workflow does. */
  description: string
  /** Optional guidance on when this workflow applies (shown in listings). */
  whenToUse?: string
  /** Optional phase declarations matched by `phase()` calls. */
  phases?: WorkflowPhase[]
}
```

## نهاية حالة نتيجة:`WorkflowResult`

`WorkflowRun.result` سوف صرف الآن لـ مرة تشغيل نتيجة.`value` هو نص برمجي شيء تحويل قيمة راجعة——صاف مضيف مجال JSON بيانات (نص برمجي بلا قيمة راجعة وقت لـ `null`)——فقط في `completed` وقت متعمد معنى.`stopReason` هو غلاف إغلاق ربط دمج نوع (من جذب محرك تعريف؛ مستهلك يمكن نفاد رفع):`completed` | `cancelled` | `error`. غير `completed` سبب في `error` في يحمل فشل معلومة، مستهلك سوف ذلك خريطة لـ `isError` أداة نتيجة، بينما غير يأخذ جزء إخراج عند عمل نجاح فوق تقرير.

```ts type-equiv
/**
 * The outcome resolved by a live workflow run. `value` is
 * the script's materialized return value (plain host-realm JSON data; `null`
 * when the script returned `undefined`) — meaningful only for `completed`.
 * A non-`completed` reason carries the failure in `error`; the consumer maps
 * it to an `isError` tool result rather than reporting partial output.
 */
interface WorkflowResult {
  /** The script's return value (host JSON data; `null` for no return). */
  value: unknown
  /** Why the run settled. */
  stopReason: WorkflowStopReason
  /** The failure message (present iff `stopReason` is not `completed`). */
  error?: string
  /**
   * How many `agent()` calls the run accepted over its whole lifetime. On a
   * graceful settlement this is the script-side count (calls still queued for
   * a concurrency slot included); on a termination path (cancellation or
   * process failure) it degrades to the host-observed count — calls queued
   * inside a terminated script are unknowable then.
   */
  agentsStarted: number
}
```

## نشط وثب تشغيل:`WorkflowRun`

مستهلك انتظار `result`، يمكن في تنفيذ خلال استدعاء `cancel`، كما يجب في كل بند مسار فوق استدعاء `dispose`(مورد تحرير).`result` أبدا رفض: نص برمجي فشل بـ `stopReason: 'error'` صرف الآن، إلغاء بـ `'cancelled'` صرف الآن.PTC جذب محرك لا يوجد كامل جسم مرور مرور وقت قطع توقف؛ إلغاء وقت قيام أي في توقف تلقي إدارة عملية. مورد تحرير حسب وفق كل مزود اتفاق انتظار عملية و فرعي agent تنظيف، لا آخر ضبط سير العمل تنظيف قطع توقف.

```ts type-equiv
/**
 * Holder-owned live workflow. `result` never rejects; consumers may cancel
 * and must call idempotent `dispose()` to await script and child quiescence.
 */
interface WorkflowRun {
  readonly id: WorkflowRunId
  /** The validated meta block available before the script body runs. */
  readonly meta: WorkflowMeta
  readonly result: Promise<WorkflowResult>
  /** Cancel the run and its children. */
  cancel(reason?: string): void
  /** Cancel if needed and await script and child cleanup. */
  dispose(): Promise<void>
}
```

## فشل سجل قاعدة:`WorkflowError.fatal`

نص برمجي داخلي خطاف خطأ استخدام: خطأ معامل، لم معرفة أو تأخير متأخر `agent()` خيار، تجاوز خروج[بنية تحويل إخراج فرعي تجميع](../../packages/core/tools/README.zh.md) schema، تجاوز خروج حد أعلى،seam بدء فشل، إلغاء، كل سوف رمي خروج `fatal: true` `WorkflowError`.`parallel()`/`pipeline()` تركيب جهاز مقابل fatal خطأ مباشر إعادة رمي خروج، بينما غير سوف هذا بند خريطة لـ `null`: واحد تجميع كتابة خطأ خيار يجب واضح تقرير خطأ و إنهاء نص برمجي، أبدا قدرة إزالة دمج لـ نظر يشبه عادي فرعي agent فشل نتيجة. تدريجي بند `null` إبقاء إعطاء فرعي تشغيل فشل (غير `completed` stop reason) و مرحلة مقطع داخل عادي نص برمجي خطأ.

## حدث

`workflow/*` حدث (`workflow/start`،`workflow/phase`،`workflow/log`،`workflow/agent-start`،`workflow/agent-end`،`workflow/end`، رؤية[حدث دليل](#cordis-surface)) هو**فقط توفير مراقبة** emit، يحمل بيانات لقطة: كل payload بـ `WorkflowRunInfo`(id + meta) فتح رأس، بينما غير نشط وثب `WorkflowRun`، لذلك حجز قراءة من لا يمكن نيل نيل `cancel`/`dispose`؛`workflow/end` لحظة معنى حذف result value(مراقبة نتيجة مستمع لا نيل استلام إلى استدعاء جهة result متغير آخر اسم). كل مرة emit مقابل كل مستمع عزل: حجز قراءة من رمي خروج استثناء سوف يتم سجل إلى سجل في بينما لن نقل بث، أيضا لن منع توقف لاحق تسجيل مستمع استلام إلى حدث؛ كل مستمع استلام إلى ذاتي ذات payload تغلب ضخم، لذلك تعديل هو حيث لن ضرر تالف جذب محرك أيضا لن أثر أخرى مستمع. هذا نوع عزل طريقة و `subagent/start`/`subagent/end` متسق.

## حمل دائم Chat سجل

قمة طبقة `dsh-tool-workflow` مستهلك يأخذ عرض واقع إسقاط إلى استدعاء هو أب Session، معا لا تغيير تنفيذ كل حق. تشغيل قبول بعد كتابة `tool-workflow/run-start`، بـ `runId + seq` إعداد مقابل عضو بدء و انتهاء، و كما فقط في نتيجة قد أخذ نيل كما dispose تماما توقف مستقر بعد كتابة `tool-workflow/run-end`. تضمين طقم transport استدعاء لا كتابة سجل. رقم مرة append فشل سوف منع استخدام هذا تشغيل لاحق كتابة، لذلك سجل إبقاء لـ فارغ أو دمج قاعدة وصل متابعة بادئة، أداة نتيجة ثابت.

`dsh-tool-workflow/invariant` سوف في فوري إيداع قبل و Session تحميل وقت تحقق نفس بروتوكول: كل تشغيل فقط لديه واحد start، عضو ترتيب رقم لـ صحيح كما وحيد، عضو end يجب إعداد مقابل، ما زال لديه فتح وضع عضو وقت لا يستطيع انتهاء تشغيل، تشغيل انتهاء بعد لا يستطيع متابعة تحديث. سجل ذيل جزء نقص قليل عضو end أو run end هو صالح في قطع دليل، لا هو ضرر تالف.

`dsh-client-ui-workflow-run` عبر Conversation Node جذب محرك يأخذ أربعة صنف حدث طي لـ واحد `workflow-run` Chat عقدة، بـ run-start ترتيب رقم مرساة تحديد في أصل سير العمل أداة عقدة بعد. مرحلة مقطع مجموعة فقط قدوم ذاتي حق صحيح بدء مرور عضو، و إبقاء دقيق نص، يشمل حقل نقص حذف و `''` منطقة آخر.Location إغلاق وقت، ناقص نهاية نقطة سوف عرض لـ قد في قطع.[واجهة حزمة README](../../packages/client/ui-workflow-run/README.zh.md) مسؤول تعريف disclosure، حالة و نفس أب محلي تنقل سلوك.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.zh.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxworkflowengine--workflowengine-abstract-seam"></a>

### `ctx.workflowEngine` — `WorkflowEngine` (abstract seam)

Workflow Service Definition contract. Invalid requests throw before publication; a live run is holder-owned, its result never rejects, and disposal waits for script and child cleanup. Lifecycle listener failures are contained, and `workflow/end` fires exactly once as the result settles.

```ts cordis-catalog
/**
 * Parse and execute a workflow script.
 * @param request - the script, its `args`, the parent agent, and an
 *   optional cancel signal.
 * @returns the live run; its `result` resolves when the script settles.
 */
abstract start(request: WorkflowStartRequest): WorkflowRun
```

Source: [`packages/workflow/workflow/src/index.ts`](../../packages/workflow/workflow/src/index.ts)

<a id="workflow-events"></a>

### `workflow/*` events

<a id="workflowagent-end--emit"></a>

#### `workflow/agent-end` — emit

One `agent()` call settled (clean result, child failure, or run cancellation). Paired with Events['workflow/agent-start'] by `agent.seq`, exactly once per started call on every stop path — on an engine termination path the end is engine-synthesized with outcome `'cancelled'`.

```ts cordis-catalog
/**
 * One `agent()` call settled (clean result, child failure, or run
 * cancellation). Paired with {@link Events['workflow/agent-start']} by
 * `agent.seq`, exactly once per started call on every stop path — on an
 * engine termination path the end is
 * engine-synthesized with outcome `'cancelled'`.
 * @param info - the run's identity snapshot.
 * @param agent - the call identity plus its outcome.
 * @mode emit
 */
'workflow/agent-end'(info: WorkflowRunInfo, agent: WorkflowAgentEndInfo): void
```

Source: [`packages/workflow/workflow/src/index.ts`](../../packages/workflow/workflow/src/index.ts)

<a id="workflowagent-start--emit"></a>

#### `workflow/agent-start` — emit

One `agent()` call established a published child run. Paired with Events['workflow/agent-end'] by `agent.seq`. A call that never receives a published run from the provider emits neither event in this pair.

```ts cordis-catalog
/**
 * One `agent()` call established a published child run. Paired with
 * {@link Events['workflow/agent-end']} by `agent.seq`. A call that never
 * receives a published run from the provider emits neither
 * event in this pair.
 * @param info - the run's identity snapshot.
 * @param agent - the call's sequence number, label, phase, and child id.
 * @mode emit
 */
'workflow/agent-start'(info: WorkflowRunInfo, agent: WorkflowAgentInfo): void
```

Source: [`packages/workflow/workflow/src/index.ts`](../../packages/workflow/workflow/src/index.ts)

<a id="workflowend--emit"></a>

#### `workflow/end` — emit

A workflow run settled (any stop reason). Fired when WorkflowRun.result resolves. Paired with Events['workflow/start'].

```ts cordis-catalog
/**
 * A workflow run settled (any stop reason). Fired when
 * {@link WorkflowRun.result} resolves. Paired with
 * {@link Events['workflow/start']}.
 * @param info - the run's identity snapshot.
 * @param result - the outcome data (stop reason, error, agent count) —
 *   deliberately WITHOUT the result value (see {@link WorkflowResultInfo}).
 * @mode emit
 */
'workflow/end'(info: WorkflowRunInfo, result: WorkflowResultInfo): void
```

Source: [`packages/workflow/workflow/src/index.ts`](../../packages/workflow/workflow/src/index.ts)

<a id="workflowlog--emit"></a>

#### `workflow/log` — emit

The script emitted a narration line (a `log(message)` call).

```ts cordis-catalog
/**
 * The script emitted a narration line (a `log(message)` call).
 * @param info - the run's identity snapshot.
 * @param message - the logged message, verbatim.
 * @mode emit
 */
'workflow/log'(info: WorkflowRunInfo, message: string): void
```

Source: [`packages/workflow/workflow/src/index.ts`](../../packages/workflow/workflow/src/index.ts)

<a id="workflowphase--emit"></a>

#### `workflow/phase` — emit

The script entered a phase (a `phase(title)` call) — progress grouping for observers; no execution semantics.

```ts cordis-catalog
/**
 * The script entered a phase (a `phase(title)` call) — progress grouping
 * for observers; no execution semantics.
 * @param info - the run's identity snapshot.
 * @param title - the phase title, verbatim.
 * @mode emit
 */
'workflow/phase'(info: WorkflowRunInfo, title: string): void
```

Source: [`packages/workflow/workflow/src/index.ts`](../../packages/workflow/workflow/src/index.ts)

<a id="workflowstart--emit"></a>

#### `workflow/start` — emit

A workflow run started — the script's meta block validated, the body about to execute. Paired with Events['workflow/end'].

```ts cordis-catalog
/**
 * A workflow run started — the script's meta block validated, the body
 * about to execute. Paired with {@link Events['workflow/end']}.
 * @param info - the run's identity snapshot (id + meta).
 * @mode emit
 */
'workflow/start'(info: WorkflowRunInfo): void
```

Source: [`packages/workflow/workflow/src/index.ts`](../../packages/workflow/workflow/src/index.ts)
<!-- END GENERATED cordis-surface -->
