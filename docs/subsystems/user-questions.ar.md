# مستخدم تفاعل

[English](user-questions.md) | العربية

[dsh-user-questions](../../packages/interaction/user-questions) مستخدم تفاعل seam. هو هو أداة أو إذن إضافة حاجة شخص صنف عودة جواب بعد agent(ذكي جسم) عندئذ قدرة متابعة وقت الذي استخدام، مزود غير متصل مفردات.Agent-scoped waterfall listener تركيب متاح UI واجهة، منها يشمل تحويل إرسال إلى قد اتصال client listener.

شفرة المصدر:[`packages/interaction/user-questions/src/index.ts`](../../packages/interaction/user-questions/src/index.ts)

## مشكلة خيار

`AskUserQuestionOption` يتضمن واحد يمكن توفير اختيار خيار.`label` هو موجه إلى مستخدم خيار نص حرف، معا أيضا هو موجه إلى نموذج اختيار في قيمة؛`description` هو اختياري UI مساعدة نص.

```ts type-equiv
/** One selectable answer offered to the user. */
interface AskUserQuestionOption {
  /** User-facing label. */
  label: string
  /** Optional extra context rendered by capable UIs. */
  description?: string
}
```

## عرض معنى رسم

`AskUserQuestionIntent` اختياري أرض إعلان واحد نوع معروف قرار نوع. هو حسب `kind` ضرب وسم، لذلك يمكن زيادة جديد معنى رسم؛ لا إقرار تعرف بعض عدد وسم UI تصيير عام خيار قائمة. معنى رسم فقط تغيير عرض طريقة——التزام دوران هو UI عودة جواب ما زال هو عام UI سوف إرسال ذلك بعض خيار وسم، لذلك استدعاء جهة اثنان نوع حال حال تحت قراءة إلى عودة جواب حقل نفسه.`approve` إشارة اسم قبول تحديد خيار، بينما لا اعتماد خيار ترتيب.`ask()` سوف رفض اثنان نوع لا يمكن من نوع نظام جدول بلوغ حال حال:`approve` لم إشارة نحو هذا مشكلة ذاته أي خيار، و لـ لا يوجد `detail` مشكلة إشارة تحديد معنى رسم.

```ts type-equiv
/**
 * A caller-declared presentation intent: the question IS this kind of
 * decision, so a UI that recognises the tag may present it as such instead of as a
 * generic option list. Tagged so further intents can be added; a UI that does
 * not know a tag renders the generic flow, and the answer encoding is identical
 * either way — an intent changes presentation only, never the protocol.
 */
type AskUserQuestionIntent = {
  /** A plan submitted for review: `detail` is the plan markdown `ask()` requires, and the decision approves or declines it. */
  kind: 'plan-review'
  /**
   * The option label that approves the plan; every other option declines it.
   * Named rather than positional so no UI infers the verdict from option order.
   * An `approve` naming no option of its own question is rejected at `ask()`.
   */
  approve: string
  /** Logged tool invocation whose arguments contain the reviewed plan. */
  callId?: ToolCallId
}
```

## مشكلة بند

`AskUserQuestionItem` هو طلب في واحد مشكلة. استدعاء جهة توفير مستقر `id`، هو سوف مع جواب سجل أصل مثال إرجاع، جعل دفعة كمية مشكلة ما زال يمكن توجيه. اختياري `detail` يحمل مساعد مساعدة نص؛ مزود سوف سوف ذلك مع مشكلة تصيير، لكن لن وضع دخول اختياري خيار وسم.

```ts type-equiv
/** One question in a user-questions request. */
interface AskUserQuestionItem {
  /** Stable caller-provided question id, echoed in the answer. */
  id: string
  /** The question to display. */
  question: string
  /** Optional supporting detail rendered with the question but kept out of option labels. */
  detail?: string
  /** Optional short heading/group label. */
  header?: string
  /** Optional choices the UI can render as a menu. */
  options?: AskUserQuestionOption[]
  /** Whether more than one option may be selected. Defaults to single-select. */
  multiSelect?: boolean
  /** Optional presentation intent for capable UIs; absent asks for the generic option list. */
  intent?: AskUserQuestionIntent
}
```

## رفع سؤال طلب

`AskUserQuestionRequest` هو عبر حزمة طلب.`questions` هو عدد مجموعة، هذا مثال UI يمكن في واحد مسار في عرض متبادل صلة تلميح، معا إبقاء كل عودة جواب لديه مستقر id. مثل توفير `agent`، هو يجب و تخزين نشط استدعاء جهة هو نفس نسخة؛ فقط لديه عند حالي سجل التسجيل سوف هذا نسخة تعرف آخر لـ وقت التشغيل أصل وقت، تفاعل seam عندئذ سوف وصل قبول هذا agent.

```ts type-equiv
/** Request for a human answer. */
interface AskUserQuestionRequest extends AskUserQuestionRequestEvent {}
```

## عودة جواب

مزود لـ كل مشكلة id إرجاع واحد عودة جواب بند.`selected` يتضمن اختيار في خيار وسم،`custom` في مستخدم إدخال ذاتي من نص وقت يحمل «أخرى» عودة جواب. مقابل في مفرد اختيار عنوان،`custom` سوف تغطية اختيار في خيار، كما `selected` لـ فارغ. مقابل في كثير اختيار عنوان،`custom` يمكن تكملة ملء `selected` في وسم.UI أيضا يمكن استخدام `selected` لـ فارغ كما لا يحتوي `custom` عودة جواب بند، في ذلك بقية مشكلة متساو اكتمل دفعة مرة في إبقاء يتم قفز مرور مشكلة.

```ts type-equiv
/** Answer to one question. */
interface AskUserQuestionAnswerItem {
  /** The answered question id. */
  id: string
  /** Selected option labels. May accompany custom text for a multi-select question. */
  selected: string[]
  /** Optional free-text "Other" answer. */
  custom?: string
}
```

```ts type-equiv
/** The human's answer. */
interface AskUserQuestionAnswer {
  /** Structured answers keyed by question id. */
  answers: AskUserQuestionAnswerItem[]
}
```

## خطأ

`UserQuestionError` وراثة `HarnessError`، لذلك `ctx.tools.execute()` سوف إبقاء `{ name, code }`، لأجل موجه إلى نموذج أداة فشل، مثل `EMPTY_QUESTIONS`،`NO_PROVIDER`،`ASK_ABORTED` أو UI جانب إلغاء.

```ts type-equiv
/** Stable error taxonomy for user-questions failures. */
class UserQuestionError extends HarnessError {
  constructor(message: string, code: string, options?: ErrorOptions) {
    super(message, code, options)
    this.name = 'UserQuestionError'
  }
}
```

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxuserquestions--userquestionservice"></a>

### `ctx.userQuestions` — `UserQuestionService`

`ctx.userQuestions`: validation plus the scoped answerer waterfall.

```ts cordis-catalog
/**
 * Ask the scoped answerer waterfall and wait for the user's answer.
 *
 * When a caller supplies an agent, human interaction is valid only for the
 * exact live runtime root. Runtime ownership, not durable session lineage,
 * decides this boundary: an owned child has no human answerer and would
 * block forever, while a lineage-bearing session resumed as a new runtime
 * root may ask normally.
 *
 * @param request Questions, owner agent, and abort signal.
 * @returns The answer chosen or typed by the human.
 * @throws {UserQuestionError} code `ASK_ABORTED` when the supplied signal
 *   is already or becomes aborted, `CALLER_NOT_LIVE` when a supplied agent
 *   is not the registry's exact live instance, or `DELEGATED_CALLER` when
 *   that live agent is owned by another agent.
 */
async ask(request: AskUserQuestionRequest): Promise<AskUserQuestionAnswer>
```

Source: [`packages/interaction/user-questions/src/index.ts`](../../packages/interaction/user-questions/src/index.ts)

<a id="user-questions-events"></a>

### `user-questions/*` events

<a id="user-questionsrequest--waterfall"></a>

#### `user-questions/request` — waterfall

Ask composed answerers for structured user input. Return an answer to claim the request or call `next()` to delegate. Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent.

```ts cordis-catalog
/**
 * Ask composed answerers for structured user input. Return an answer to
 * claim the request or call `next()` to delegate. Scope-filtered dispatch
 * (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent.
 * @param request - pending user-question request.
 * @mode waterfall
 */
'user-questions/request'( this: Scoped<Agent>, request: AskUserQuestionRequestEvent, next: () => Promise<AskUserQuestionAnswer>, ): Promise<AskUserQuestionAnswer>
```

Types: [Agent](core.ar.md) · [Scoped](scope.ar.md)

Source: [`packages/interaction/user-questions/src/types.ts`](../../packages/interaction/user-questions/src/types.ts)
<!-- END GENERATED cordis-surface -->
