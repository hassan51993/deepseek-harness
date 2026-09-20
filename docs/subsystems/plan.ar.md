# وضع التخطيط

[English](plan.md) | العربية

وضعُ التخطيط حالةُ تعاون مسجَّلة لكل وكيل، تملكها [dsh-plan-mode](../../packages/plan/plan-mode) (`ctx.planMode` و`PlanModeController`): فما دام نشطًا، يُضمَّن قسمُ إرشاد يملكه النشرُ في كل طلب نموذج. ووضعُ التخطيط **إرشادٌ لين**. أما [وضع العزل](sandbox.ar.md) و[سياسة الموافقة](approval.ar.md) فيفرضان القيودَ مستقلين؛ ولا يقرأ أيٌّ منهما حالةَ التخطيط ولا يكتبها، فتضبطهما عملياتُ النشر على حدة. والحزمةُ اختيارية، ولا يعتمد عليها agent loop. وهي تسهم بقسم المطالبة `plan:policy` وتسجّل أداةَ `exit_plan_mode` وأمرَ `/plan`. وتملك [ملاحظةُ التصميم](../../.agents/notes/implemented/simplification/2026-07-22-plan-specific-collaboration-state.ar.md) المسوّغَ؛ ويملك [README الحزمة](../../packages/plan/plan-mode/README.ar.md) تفاصيلَ تجربة النموذج والحدود.

المصدر: [`packages/plan/plan-mode/src/index.ts`](../../packages/plan/plan-mode/src/index.ts)

## الحالة المسجَّلة والتعافي

`plan/mode` (`{ active: boolean }`) هو [حدث جلسة](session.ar.md) للسجل فقط يستبدل القيمةَ كلها: دائمٌ وقابلٌ لإعادة التشغيل، ولا يدخل نصَّ المحادثة الذي يراه النموذج. وتطوي وحدةُ `plan` المسجَّلة اختياريًا الوضعَ المودَع، واستقرارَ الأمر، والوضعَ المسجَّل عند آخر ترويسة طلب. ويقرأ `ctx.planMode` تلك الحالةَ عبر `stateOf()`؛ ويفشل أولُ وصول تابع إن غاب السجلُّ أو مفتاحُ `plan` أو مفتاحُ `turnBoundary`. ولا يتلقى العملاءُ سوى `{ active, pending }`؛ ويستعيد الاستئنافُ والتفريعُ والضغطُ كليهما من السجل. وتصريحُ الحدث كاملًا في [دليل أحداث سجل الحفظ الدائم](../persistence-catalog.ar.md).

## الاختيارات المعلَّقة والإلحاق قبل الخطوة

لأن كلَّ حدث جلسة محاطٌ بجولة، يبقى اختيارُ المستخدم معلَّقًا حتى تُلحقه أولُ خطوةٍ تمهيدية مقبولة داخل جولة قبل اشتقاق الطلب، في أي جولة وقع ذلك. والاختيارُ لا يفرض استمرارًا قط، فما يقع منه بعد آخر خطوة تمهيدية مقبولة في جولة يُلحق في جولة لاحقة. ويسجّل `set(agent, active)` الاختيارَ المعلَّق (ولا يفعل شيئًا حين يساوي الهدفُ الحالةَ المسجَّلة أو المعلَّقة سلفًا)، ويعيد `get(agent)` قيمةَ `{ active: boolean; pending?: boolean }`: الحالةُ المسجَّلة المستعملة في تجميع الخطوة الحالية، مع الحالة المختارة التي تنتظر الإلحاق.

ونقطةُ الإلحاق الوحيدة ما دام الوكيلُ يعمل هي مستمعُ `agent/pre-step` المسبوق. وهو يراقب كلَّ خطوة طلب مقترحة، ومنها الخطوةُ الأولى في الجولة الأولى وإعاداتُ محاولة استرداد الطلب، وينادي المستمعين التاليين أولًا، ولا يُلحق إلا بعد قبولهم الخطوة. وقبولُ المطالبة يقع قبل الجولة ولا يستطيع إلحاقَ `plan/mode`، فالاختيارُ الواقع عند المطالبة تُلحقه أولُ خطوة تمهيدية مقبولة داخل الجولة التي يبدؤها. وفشلُ الإلحاق لا يستطيع تعطيلَ الجولة، ويبقى الاختيارُ معلَّقًا لخطوة تمهيدية مقبولة لاحقة. ويسجّل اختيارُ المستخدم الملحَق أيضًا إشعارَ `user/message` واحدًا من إضافة، لكن حين تصف آخرُ ترويسة طلب مسجَّلة الحالةَ الأخرى وحدها، فيُخبَر النموذجُ بالضبط متى تغيّر سياقُه ولا يُخبَر تكرارًا. والاختيارُ الواقع بعد آخر خطوة تمهيدية مقبولة في جولة يبقى محليًّا في العملية ويضيع إن خرجت العمليةُ قبل خطوة تمهيدية مقبولة أخرى داخل جولة ([حدود README](../../packages/plan/plan-mode/README.ar.md#known-limitations-and-deferred-work)).

## الضبط

```ts type-equiv
/** Deployment-owned plan guidance. */
interface PlanModeConfig {
  /** Guidance rendered as the `plan:policy` prompt section while plan mode is active. */
  section: string
}
```

و`section` الغائب أو الفارغ أو غيرُ النصي، وأيُّ مفتاح مجهول، يفشل عند تحميل الإضافة بدل أن يُتجاهل. وما دام وضعُ التخطيط نشطًا، يُعرض نصُّ `section` بعينه [قسمَ مطالبة نظام](system-prompt.ar.md) باسم `plan:policy` عند الترتيب 50؛ ووضعُ التخطيط الخامل لا يسهم بنص.

## أداة الخروج وأمر `/plan`

تبقى [`exit_plan_mode`](../tool-catalog.ar.md#deepseek-aidsh-plan-mode) مسجَّلةً ما دام وضعُ التخطيط خاملًا، فدخولُ الوضع والخروجُ منه لا يغيّران إلا قسمَ المطالبة، لا دليلَ أدوات الطلب؛ وينفّذ خارج وضع التخطيط فيفشل. وهي تشترط في وضع التخطيط خطةَ markdown كاملة تبدأ بعنوان `#`، وتعرضها للمراجعة عبر [seam أسئلة المستخدم](user-questions.ar.md). وتعيد الموافقةُ `{ approved: true }` وتسجّل خروجًا معلَّقًا صامتًا (بلا سرد) يُلحق عند أول خطوة تمهيدية مقبولة داخل جولة. ولذلك يبقى إرشادُ التخطيط نشطًا بقيةَ دفعة أدوات المساعد الحالية، وتبلّغ نتيجةُ الأداة نفسُها عن الانتقال. أما «واصِل التخطيط» فنداءٌ فاشل يحمل ملاحظاتِ المستخدم، فيراجع النموذجُ ويعرض ثانيةً؛ وغيابُ قناة التفاعل وإعادةُ تحميل الخدمة أثناء المراجعة يُفشلان النداءَ أيضًا بدل الخروج الصامت من وضع التخطيط.

وحين تُركَّب [`ctx.commands`](commands.ar.md)، تسجّل الإضافةُ `/plan [off|message]`: فـ`/plan` المجرد يختار وضعَ التخطيط، وأيُّ رسالة أخرى غير فارغة تختاره ثم تقدّم النصَّ عبر `agent.steer()` فيصير رسالةَ المستخدم المسجَّلة العادية للخطوة التالية تحت إرشاد التخطيط، والوسيطُ `off` بعينه يختار الخمول، وهو يلغي أيضًا دخولًا معلَّقًا قبل إلحاقه وقبل أن يراه طلب.

## الخدمة

يملك `ctx.planMode` حالةَ التخطيط المسجَّلة، ويطبّق الحالةَ المختارة ويسردها عند بدء الخطوة، ويملك قسمَ `plan:policy` وأمرَ `/plan` وأداةَ الخروج الثابتة؛ وتوقيعا `get` و`set` في [دليل الخدمات](#ctxplanmode--planmodecontroller) المولَّد.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxplanmode--planmodecontroller"></a>

### `ctx.planMode` — `PlanModeController`

`ctx.planMode`: owns logged plan state, applies and narrates selected state at step start, the `plan:policy` section, the `/plan` command, and the stable exit tool. Client carriers expose the projection's cropped `{ active, pending }` view.

```ts cordis-catalog
/**
 * Read the logged plan state and any selected state awaiting the next
 * accepted in-turn pre-step.
 *
 * @param agent The agent to read.
 * @returns Current logged state plus a pending selection, when present.
 */
get(agent: Agent): { active: boolean; pending?: boolean }

/**
 * Select whether plan mode should be active. Between turns the method
 * appends the change immediately because no in-turn pre-step will run until
 * another prompt starts a turn. The open-turn fold is the idle signal:
 * agent status stays `running` through post-turn checkpointing, when no
 * further in-turn pre-step runs. During an open turn the selection remains
 * pending until the next accepted in-turn pre-step. Repeated selection of
 * the current or already-pending state is a no-op.
 *
 * @param agent The agent to switch.
 * @param active Whether plan mode should be active.
 * @returns what happened: `committed` (logged now), `queued` (awaiting the
 * next accepted in-turn pre-step), `cancelled` (an opposite pending selection
 * was cleared; the logged state already matches), or `noop` (already in that
 * state).
 */
set(agent: Agent, active: boolean): 'committed' | 'queued' | 'cancelled' | 'noop'
```

Types: [Agent](core.ar.md)

Source: [`packages/plan/plan-mode/src/index.ts`](../../packages/plan/plan-mode/src/index.ts)
<!-- END GENERATED cordis-surface -->
