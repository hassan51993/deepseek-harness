# حساب تخطيط نمط

[English](plan.md) | العربية

حساب تخطيط نمط هو [dsh-plan-mode](../../packages/plan/plan-mode) يملك، سجل إلى سجل تدريجي agent(ذكي جسم) تنسيق عمل حالة (`ctx.planMode`،`PlanModeController`): تنشيط خلال، كل نموذج طلب كل سوف يتضمن واحد مقطع نشر يحتفظ إشارة جذب. حساب تخطيط نمط هو**لين صفة إشارة جذب**.[صندوق رملي نمط](sandbox.zh.md) و[مراجعة دفعة سياسة](approval.zh.md) قسم آخر قوي صنع حد؛ اثنان من كل لا قراءة كتابة حساب تخطيط حالة، لذلك نشر حاجة قسم آخر إعداد هو جمع. هذا حزمة هو اختياري بند،agent loop(ذكي جسم حلقة) لا اعتماد هو. هو مساهمة `plan:policy` نص التوجيه مقطع سقوط، و تسجيل `exit_plan_mode` أداة و `/plan` أمر.[تصميم شرح](../../.agents/notes/implemented/simplification/2026-07-22-plan-specific-collaboration-state.zh.md) مسؤول قرار اعتماد حسب؛[حزمة README](../../packages/plan/plan-mode/README.zh.md) مسؤول تجربة النموذج و حد دقيق عقدة.

شفرة المصدر:[`packages/plan/plan-mode/src/index.ts`](../../packages/plan/plan-mode/src/index.ts)

## قد سجل حالة و استعادة

`plan/mode`(`{ active: boolean }`) هو فقط تسجيل سجل، كامل قيمة استبدال[جلسة حدث](session.zh.md): حمل دائم كما يمكن إعادة تشغيل، أبدا دخول نموذج transcript(نص سجل). اختياري تسجيل `plan` وحدة طي قد إيداع نمط، أمر تسوية نتيجة و الأكثر قريب مرة طلب رأس سجل نمط.`ctx.planMode` عبر `stateOf()` قراءة هذا حالة؛ سجل التسجيل،`plan` key أو `turnBoundary` key ناقص وقت، رقم مرة اعتماد هو جمع وصول سوف فشل. عميل فقط استقبال `{ active, pending }`؛ استعادة،fork و ضغط (compaction) كل قدرة من سجل استعادة اثنان من. كامل حدث إعلان رؤية[حفظ دائم سجل حدث دليل](../persistence-catalog.zh.md).

## انتظار توليد فاعلية اختيار و pre-step إلحاق

من في كل جلسة حدث كل يقع في جولة لـ داخل، مستخدم اختيار سوف إبقاء انتظار توليد فاعلية حالة، مباشر إلى تحت واحد يتم قبول جولة داخل pre-step في إرسال توليد طلب قبل إلحاق هذا اختيار، بلا نقاش هذا pre-step يقع في أي عدد جولة. اختيار لن قوي صنع متابعة سطر، لذلك في بعض جولة الأكثر بعد واحد يتم قبول pre-step بعد عمل خروج اختيار سوف في بعد جولة إلحاق.`set(agent, active)` سجل انتظار توليد فاعلية اختيار (هدف قيمة و قد سجل أو قد في انتظار حالة نفسه وقت لا فعل أي أمر) ،`get(agent)` إرجاع `{ active: boolean; pending?: boolean }`: لأجل تجميع حالي خطوة قد سجل حالة، و انتظار إلحاق قد اختيار حالة.

agent وقت التشغيل، وحيد إلحاق نقطة هو قبل وضع (prepend) تسجيل `agent/pre-step` مستمع. هو سوف مراقبة كل مرشح طلب خطوة، يشمل رقم 1 جولة رقم 1 خطوة و طلب استعادة إعادة محاولة؛ هو أولا استدعاء تحت تنقل مستمع، فقط في تحت تنقل قبول هذا خطوة بعد إلحاق. نص التوجيه دقيق دخول حدوث في جولة فتح بدء قبل، لا يمكن إلحاق `plan/mode`، لذلك في نص التوجيه موضع عمل خروج اختيار من هو فتح بدء جولة داخل رقم واحد يتم قبول pre-step إلحاق. إلحاق فشل لا يستطيع منع سد جولة، كما هذا اختيار سوف متابعة انتظار بعد يتم قبول جولة داخل pre-step. إلحاق مستخدم اختيار وقت أيضا سوف سجل واحد بند إضافة مصدر `user/message` إشعار، لكن فقط عند الأكثر بعد سجل طلب رأس وصف هو آخر نوع حالة وقت عندئذ سجل، لذلك نموذج تماما جيد في سياق تغير وقت استلام إلى إشعار، كما أبدا تكرار. في بعض جولة الأكثر بعد واحد يتم قبول pre-step بعد عمل خروج اختيار فقط وجود في عملية داخل؛ إذا عملية في آخر عدد يتم قبول جولة داخل pre-step قبل خروج، هذا اختيار سوف فقد فقد ([README حد](../../packages/plan/plan-mode/README.zh.md#known-limitations-and-deferred-work)).

## إعداد

```ts type-equiv
/** Deployment-owned plan guidance. */
interface PlanModeConfig {
  /** Guidance rendered as the `plan:policy` prompt section while plan mode is active. */
  section: string
}
```

`section` ناقص، لـ فارغ أبيض أو لا هو نص، و أي لم معرفة مفتاح، كل سوف في إضافة تحميل وقت فشل، بينما لا هو يتم تجاهل اختصار. حساب تخطيط نمط تنشيط خلال، تأكيد قطع `section` نص بـ order 50 تصيير لـ `plan:policy` [توجيه النظام مقطع سقوط](system-prompt.zh.md) ؛ لم تنشيط حساب تخطيط نمط لا مساهمة أي نص.

## خروج أداة و `/plan` أمر

[`exit_plan_mode`](../tool-catalog.zh.md#deepseek-aidsh-plan-mode) في حساب تخطيط نمط لم تنشيط وقت ما زال إبقاء تسجيل، لذلك دخول أو مغادرة فتح حساب تخطيط نمط فقط تغيير نص التوجيه مقطع سقوط، أبدا تغيير طلب أداة دليل؛ في حساب تخطيط نمط خارج تنفيذ سوف فشل. في حساب تخطيط نمط في، هو اشتراط واحد نسخة بـ `#` عنوان فتح رأس كامل markdown حساب تخطيط، و عبر[مستخدم تفاعل seam](user-questions.zh.md) عرض تسليم مراجعة. دفعة دقيق إرجاع `{ approved: true }`، و سجل واحد ساكن صامت (لا سرد وصف) انتظار توليد فاعلية خروج، من تحت واحد يتم قبول جولة داخل pre-step إلحاق. لذلك، حساب تخطيط إشارة جذب في assistant حالي هذا دفعة أداة استدعاء باق بقية جزء متابعة توليد فاعلية، بينما أداة نتيجة ذاته سوف تقرير إبلاغ هذا مرة تحويل.«متابعة قاعدة تخطيط» فإن هو مرة يحمل مستخدم عكس تغذية فشل استدعاء، نموذج حسب هذا إصلاح حجز و مجددا مرة عرض تسليم؛ مراجعة خلال تفاعل عبر طريق ناقص أو خدمة إعادة تحميل نفس مثال جعل استدعاء فشل، بينما لا هو ساكن صامت مغادرة فتح حساب تخطيط نمط.

عند [`ctx.commands`](commands.zh.md) يتم تركيب وقت، إضافة تسجيل `/plan [off|message]`: مفرد وحيد `/plan` اختيار حساب تخطيط نمط؛ أي أخرى غير فارغ رسالة أولا اختيار حساب تخطيط نمط، مجددا عبر `agent.steer()` إيداع هذا نص، جعل ذلك في حساب تخطيط إشارة جذب تحت يصبح تحت واحد خطوة عادي قد سجل مستخدم رسالة؛ تأكيد قطع معامل `off` اختيار لم تنشيط، هذا أيضا سوف في انتظار توليد فاعلية بند يتم إلحاق و مقابل طلب مرئي قبل سوف ذلك إلغاء.

## خدمة

`ctx.planMode` يملك قد سجل حساب تخطيط حالة، في خطوة بدء وقت تطبيق و سرد وصف اختيار في حالة، أيضا يملك `plan:policy` مقطع سقوط،`/plan` أمر و مستقر تسجيل خروج أداة؛`get`/`set` توقيع رؤية توليد[خدمة دليل](#ctxplanmode--planmodecontroller).

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.zh.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

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

Types: [Agent](core.zh.md)

Source: [`packages/plan/plan-mode/src/index.ts`](../../packages/plan/plan-mode/src/index.ts)
<!-- END GENERATED cordis-surface -->
