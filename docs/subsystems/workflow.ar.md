# مسارات العمل

[English](workflow.md) | العربية

يتيح seam مسارات العمل للوكيل أن يشغّل سكربتَ تنسيق كتبه النموذجُ ويبدأ وكلاء فرعيين. وهو، مثل [الوكلاء الفرعيين](subagent.ar.md)، **قدرةٌ اختيارية واحدة**، لا جزءٌ من agent loop، ولذلك تعيش أنواعُه وعملياتُه هنا لا في [core.md](core.ar.md). وهو، مثل bash، يسمح بتنفيذ محرّك واحد لكل سياق ليقدّم `ctx.workflowEngine`؛ ولا سجلَّ مزوّدين مسمّين (فالمحرّكُ الثاني يحلّ محلَّ الأول عبر ضبط الإضافات بدل أن يعمل بجانبه).

تعريفُ الخدمة: [dsh-workflow](../../packages/workflow/workflow) (`ctx.workflowEngine` والمفرداتُ أدناه). وتنفّذ [dsh-workflow-ptc](../../packages/workflow/workflow-ptc) الآلةَ الافتراضية والمساعدات عبر بيئة تشغيل عمليات Node PTC المشتركة تحت سياسة ملفات الجلسة المستدعية. والمستهلكان هما [dsh-tool-workflow](../../packages/workflow/tool-workflow) و[dsh-tool-ralph](../../packages/workflow/tool-ralph) الاختياري. وتملك [إعادةُ استعمال عزل مسارات العمل](../../.agents/notes/implemented/architecture/2026-09-13-workflow-ptc-sandbox-reuse.ar.md) خياراتِ التنفيذ؛ ويملك [قرارُ مسارات العمل الديناميكية](../../.agents/notes/implemented/feature/2026-07-05-dynamic-workflows.ar.md) دلالاتِ السكربت.

المصادر: المفرداتُ الآمنة في المتصفح في [`packages/workflow/workflow/src/types.ts`](../../packages/workflow/workflow/src/types.ts)، وطلبُ المضيف ومقابضُ التشغيل الحية في [`runtime-types.ts`](../../packages/workflow/workflow/src/runtime-types.ts).

## طلب البدء

ما يطلبه المستدعي حين يبدأ تشغيلًا. وتبني أداةُ مسارات العمل المعتادة هذا الطلبَ من نداء النموذج `{ script, meta, args }` مع الوكيل المستدعي؛ وللمستهلكين المتخصصين أن يختاروا أيضًا `subagentProvider` واحدًا على مستوى المحرّك وأن يخفضوا `maxTotalAgents` لذلك التشغيل، لكن السكربتَ لا يستطيع رصدَ أي من السياستين ولا استبدالَهما. و`meta` و`args` بياناتُ JSON صرفة (يتحقق المحرّكُ من `meta` في مقابل schema ويرفض بصوت عالٍ قبل أن يعمل شيء — ولا يُقيَّم نصُّ سكربت قط للحصول عليها). و`parent` مشترَط — فكلُّ ابن يبدؤه السكربتُ يُنسب إليه، ويمرّ دليلُ العمل والنسبُ والعمقُ عبر [seam الوكلاء الفرعيين](subagent.ar.md).

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

## هوية مسار العمل: `WorkflowMeta`

كتلةُ الهوية المحمولة بياناتٍ على طلب البدء (وهي معامل `meta` في الأداة؛ ومفرداتُ حقولها تطابق كتلةَ meta في مسارات العمل الديناميكية لدى Claude Code). و`phases` مفرداتُ تقدّم فقط: فنداءاتُ `phase()` تطابق العناوينَ لأجل المراقبين؛ ولا يُفهم منها بنيةُ تنفيذ.

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

## النتيجة النهائية: `WorkflowResult`

حصيلةُ تشغيل واحد، يحلّها `WorkflowRun.result`. و`value` هي قيمةُ إرجاع السكربت مجسَّدةً — بياناتُ JSON صرفة في عالم المضيف (و`null` حين لا يعيد السكربتُ شيئًا) — ولا معنى لها إلا مع `completed`. و`stopReason` اتحادٌ مغلق (يملكه المحرّك، وللمستهلكين استيفاؤه): `completed` أو `cancelled` أو `error`. والسببُ غيرُ `completed` يحمل الإخفاقَ في `error`، ويربطه المستهلكُ بنتيجة أداة `isError` بدل التبليغ عن خرج جزئي بوصفه نجاحًا.

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

## تشغيل حي: `WorkflowRun`

ينتظر المستهلكُ `result`، وله أن ينادي `cancel` أثناء التنفيذ، وعليه أن ينادي `dispose` في كل مسار. و`result` لا يرفض قط: ففشلُ السكربت يحلّ بـ`stopReason: 'error'`، والإلغاءُ بـ`'cancelled'`. ولا مهلةَ إجمالية منقضية لمحرّك PTC؛ وهو يجهض العمليةَ المدارة فورًا عند الإلغاء. وينتظر التخلصُ تنظيفَ العملية والأبناء بحسب عقود مزوّديهم، بلا مهلة تنظيف مستقلة لمسار العمل.

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

## انضباط الإخفاق: `WorkflowError.fatal`

إساءةُ استعمال الخطّافات داخل سكربت — وسائطُ خاطئة، أو خياراتُ `agent()` مجهولة أو مؤجلة، أو schema خارج [مجموعة الخرج المبنيَن الجزئية](../../packages/core/tools/README.ar.md)، أو سقفٌ انكسر، أو فشلُ بدء في الـseam، أو إلغاء — ترمي `WorkflowError` بـ`fatal: true`. ويعيد مركّبا `parallel()` و`pipeline()` رميَ الأخطاء القاتلة بدل ربط البند بـ`null`: فخيارٌ مكتوب خطأً يجب أن يقتل السكربتَ بصوت عالٍ، لا أن يذوب في شيء يُقرأ فشلَ ابن عادي. و`null` لكل بند محجوزةٌ لإخفاقات تشغيل الأبناء (سببُ توقف غير `completed`) ولأخطاء السكربت المعتادة داخل مرحلة.

## الأحداث

أحداثُ `workflow/*` (`workflow/start` و`workflow/phase` و`workflow/log` و`workflow/agent-start` و`workflow/agent-end` و`workflow/end` — انظر [دليل الأحداث](#cordis-surface)) إطلاقاتٌ **للمراقبة فقط** تحمل لقطاتِ بيانات: فكلُّ حمولة تبدأ بـ`WorkflowRunInfo` (المعرّف وmeta)، لا بـ`WorkflowRun` الحي، فلا يستطيع مشترِكٌ نيلَ `cancel` أو `dispose`، ويُغفل `workflow/end` عمدًا قيمةَ النتيجة (فالمستمعُ الذي يراقب الحصائلَ يجب ألّا يتلقى اسمًا بديلًا قابلًا للتغيير لنتيجة المستدعي). وكلُّ إطلاق محتوًى لكل مستمع — فالمشترِكُ الرامي يُسجَّل ولا يُنشر، ولا يستطيع تجويعَ المستمعين المسجَّلين بعده — ويتلقى كلُّ مستمع نسخةً خاصة من الحمولة، فتغييرُها لا يفسد المحرّكَ ولا المستمعين الآخرين؛ ويحاكي الاحتواءُ ما في `subagent/start` و`subagent/end`.

## سجلات المحادثة الدائمة

يُسقط المستهلكُ الأعلى `dsh-tool-workflow` حقائقَ العرض في جلسة الأب المستدعية بلا تغيير ملكية التنفيذ. وهو يكتب `tool-workflow/run-start` بعد قبول التشغيل، ويقرن بدايةَ العضو بنهايته بـ`runId + seq`، ولا يكتب `tool-workflow/run-end` إلا بعد أن تُعرف النتيجةُ ويبلغ التخلصُ السكونَ. ولا تكتب النداءاتُ المتداخلة عبر النقل سجلًّا. وأولُ فشل إلحاق يعطّل الكتاباتِ اللاحقة لذلك التشغيل، فيبقى السجلُّ فارغًا أو بادئةً متصلة مشروعة وتبقى نتيجةُ الأداة كما هي.

ويتحقق `dsh-tool-workflow/invariant` من البروتوكول نفسِه قبل الإيداع الحي وعند تحميل جلسة: بدايةٌ واحدة لكل تشغيل، وتسلسلاتُ أعضاء موجبة فريدة، ونهاياتُ أعضاء مقترنة، ولا تشغيلَ ينتهي وأعضاؤه مفتوحون، ولا تحديثاتِ بعد نهاية التشغيل. ونهايةُ عضو أو نهايةُ تشغيل مفقودة عند ذيل السجل دليلُ انقطاع مشروع لا فساد.

وتطوي `dsh-client-ui-workflow-run` الأحداثَ الأربعةَ عبر محرّك عقد المحادثة في عقدة محادثة `workflow-run` واحدة مرساة عند تسلسل بدء التشغيل، بعد عقدة أداة مسار العمل الأصلية. ولا تأتي مجموعاتُ المراحل إلا من بدايات أعضاء فعلية، وتحفظ السلاسلَ بحروفها، بما فيه التمييزُ بين مرحلة مُغفَلة و`''`. وتحوّل المواضعُ المغلقة الحقائقَ النهائية المفقودة إلى عرض منقطع. ويملك [README حزمة الواجهة](../../packages/client/ui-workflow-run/README.ar.md) سلوكَ الكشف والحالة والتنقل المحلي داخل الأب نفسِه.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

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
