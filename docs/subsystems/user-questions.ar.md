# التفاعل مع المستخدم

[English](user-questions.md) | العربية

seam أسئلة المستخدم في [dsh-user-questions](../../packages/interaction/user-questions). وهو المفرداتُ المحايدة تجاه المزوّدين التي تستعملها أداةٌ أو إضافةُ أذونات حين تحتاج إلى جواب إنسان قبل أن يواصل الوكيل. وتركّب مستمعاتُ الشلال المحدودة بنطاق الوكيل واجهاتِ المستخدم المتاحة، ومنها مستمعاتٌ تُنقل إلى عميل متصل.

المصدر: [`packages/interaction/user-questions/src/index.ts`](../../packages/interaction/user-questions/src/index.ts)

## خيارات السؤال

يحتوي `AskUserQuestionOption` على اختيار واحد قابل للانتقاء. و`label` هو نصُّ الخيار الذي يراه المستخدم وهو أيضًا القيمةُ المختارة التي يراها النموذج؛ و`description` نصُّ مساعدة اختياري في الواجهة.

```ts type-equiv
/** One selectable answer offered to the user. */
interface AskUserQuestionOption {
  /** User-facing label. */
  label: string
  /** Optional extra context rendered by capable UIs. */
  description?: string
}
```

## قصد العرض

يعلن `AskUserQuestionIntent` اختياريًا صنفَ قرار معروفًا. وهو موسوم على `kind` فتُضاف أقصادٌ أخرى؛ والواجهةُ التي لا تعرف وسمًا تعرض قائمةَ الخيارات العامة. والقصدُ يغيّر العرضَ وحده — فالواجهةُ التي تحترمه تجيب بتسميات الخيارات نفسِها التي ترسلها واجهةٌ عامة، فيقرأ المستدعي حقولَ الجواب نفسَها في الحالتين. ويسمّي `approve` الخيارَ الموجِب بدل الاعتماد على ترتيب الخيارات. ويرفض `ask()` التأكيدين اللذين لا يستطيع نوعٌ حملَهما: `approve` لا يسمّي أيَّ خيار من خيارات سؤاله، وقصدٌ على سؤال بلا `detail`.

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

## بند السؤال

`AskUserQuestionItem` سؤالٌ واحد في طلب. ويقدّم المستدعي `id` ثابتًا يُردّ مع الجواب فتبقى الأسئلةُ المجمَّعة قابلةً للتوجيه. ويحمل `detail` الاختياري نصًّا مساندًا يعرضه المزوّدون مع السؤال لكنهم يُبقونه خارج تسميات الخيارات القابلة للانتقاء.

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

## طلب السؤال

`AskUserQuestionRequest` هو الطلبُ المشترك بين الحزم. و`questions` مصفوفةٌ فتستطيع الواجهةُ عرضَ مطالبات مترابطة في مسار واحد مع حفظ معرّف ثابت لكل جواب. و`agent`، حين يوجد، هو المستدعي الحي بعينه؛ ولا يقبله seam التفاعل إلا ما دام السجلُّ الحي يعرّف تلك النسخةَ جذرًا في وقت التشغيل.

```ts type-equiv
/** Request for a human answer. */
interface AskUserQuestionRequest extends AskUserQuestionRequestEvent {}
```

## الجواب

يعيد المزوّدون بندَ جواب واحدًا لكل معرّف سؤال. ويحتوي `selected` على تسميات الخيارات المنتقاة، ويحمل `custom` جوابَ «غير ذلك» الحرَّ حين يكتبه المستخدم. وفي السؤال أحادي الانتقاء، يغلب `custom` الاختيارَ المنتقى ويكون `selected` فارغًا. وفي السؤال متعدد الانتقاء، قد يكمّل `custom` التسمياتِ في `selected`. وقد تستعمل الواجهةُ أيضًا بندًا بـ`selected` فارغ وبلا `custom` لحفظ سؤال متخطًّى في دفعة اكتملت فيما عدا ذلك.

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

## الأخطاء

يوسّع `UserQuestionError` الصنفَ `HarnessError`، فيحفظ `ctx.tools.execute()` قيمتَي `{ name, code }` لإخفاقات الأدوات التي يراها النموذج، مثل `EMPTY_QUESTIONS` و`NO_PROVIDER` و`ASK_ABORTED` أو الإلغاء من جهة الواجهة.

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
