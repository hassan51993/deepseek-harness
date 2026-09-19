---
description: "موجه إلى اختيار، تركيب أو ترتيب فحص get_goal،create_goal و update_goal مستخدم و صيانة من نموذج جانب goal أداة شرح."
kind: "package-reference"
---

# @deepseek-ai/dsh-tool-goal

[English](README.md) | العربية

## عام وصف

`dsh-tool-goal` يجعل نموذج قراءة حمل دائم goal، و أصل حسب شخص صنف مباشر طلب دفع قطع و إنشاء طويل مدة goal. إنشاء، تحرير، مؤقت توقف أو استعادة اشتراط هذا مباشر طلب ظهور في قمة طبقة agent(ذكي جسم) جولة في؛ إتمام أو منع سد أيضا يمكن في ذاتي رئيسي Goal Round في تنفيذ. تحديث يجب استخدام أولا قبل قراءة إلى دقيق goal id و revision.`resume` سوف إعادة تفعيل active-but-disarmed أو blocked goal، بينما حمل دائم paused goal من مستخدم عبر Web أو `/goal resume` استعادة. ذاتي رئيسي منع سد اشتراط نفس شرط حمل متابعة بلوغ إلى يمكن إعداد عتبة قيمة، افتراضي هو وصل متابعة ثلاثة عدد Round.

## دليل

- [استخدام هذه الحزمة](#use-this-package)
- [فهم التنفيذ](#understand-the-implementation)
- [بحث إضافي](#further-exploration)
- [تجربة النموذج](#model-experience)
- [حدود معروفة وعمل مؤجل](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="use-this-package"></a>
## استخدام هذه الحزمة

عند نموذج حاجة ذاتي سطر إنشاء و تحديث حمل دائم goal وقت، يأخذ `dsh-tool-goal` تعليق في goal خدمة جانب حافة. هذه أداة هو goal جدول وجه موجه إلى نموذج واحد نصف؛`/goal` أمر هو موجه إلى شخص صنف واحد نصف، متابعة سطر مشغل في ذاتي رئيسي Round انتهاء وقت استخدام نفس طقم أداة إتمام أو منع سد goal.

### أداة

ثلاثة عدد أداة كل إرجاع نفسه ضيق تجميع JSON——لا يوجد حالي goal وقت لـ `{ goal: null }`، لا فإن إرجاع goal id،revision، هدف،phase، قد بدء Round،Round حد أعلى، اختياري blocker reason و متابعة سطر هل قد تفعيل——و Native استدعاء جهة قد تصيير محتوى متسق.

| أداة | أثر |
|---|---|
| `get_goal()` | قراءة حالي goal؛ لا يوجد حالي goal وقت إرجاع `null` |
| `create_goal(objective, max_goal_rounds?)` | أصل حسب شخص صنف مباشر إرسال بدء قمة طبقة جولة إنشاء واحد goal |
| `update_goal(goal_id, revision, action, objective?, max_goal_rounds?, blocked_reason?)` | مقابل دقيق goal revision تنفيذ `edit`،`pause`،`resume`،`complete` أو `blocked` |

في `update_goal` قبل استدعاء `get_goal`، و نسخ دقيق `goal_id` و `revision`؛ كل استدعاء كل متبادل رفض، لذلك نموذج ترتيب ترتيب دفعة مرة قدرة مراقبة إلى أكثر مبكر تغيير و ذلك جديد revision. استبدال قيمة فقط يخص `edit`؛`blocked_reason` فقط لديه في `blocked` وقت عندئذ لا بد ملء، و بـ مستقر شفرة `model-reported` حفظ دائم. صارم إطار schema تحت فارغ نص و صفر ملء ملء قيمة نظر لـ حذف، بينما متعمد معنى قيمة ما زال حد تحديد إلى كل منها action.

### إعداد

```yaml
- id: tool-goal
  name: '@deepseek-ai/dsh-tool-goal'
  config:
    blockedAfterConsecutiveRounds: 3
```

هذا قيمة يجب هو صحيح أمان كامل عدد. هو حيث توفير نموذج ذاتي سطر تقرير إبلاغ منع سد صلب تحت حد، أيضا قرار نموذج إشارة جذب في إشارة واضح عدد قيمة. توليد[إعداد دليل](../../../docs/config-catalog.zh.md#deepseek-aidsh-tool-goal) هو كل تلقي دعم حمل حقل نفاد كل صيغة حق مصدر.

### إذن قاعدة

أداة فقط لـ نشط وثب مشغل داخل، موضع في فتح وضع جولة في دقيق نشط وثب استدعاء agent تنفيذ.`create`،`edit`،`pause` و `resume` أيضا اشتراط وقت التشغيل أصل agent حالي جولة في وجود شخص صنف مباشر رسالة——subagent أو غير شخص صنف إنتاج جهة لا يستطيع إنشاء أو تحرير goal.`resume` سوف في goal خدمة تنفيذ قبل رفض حمل دائم paused goal؛ هذا حالة فقط يخص موجه إلى مستخدم استعادة مسار.`complete` و `blocked` أيضا قبول تماما متسق حالي Goal Round: مصدر لـ goal Round يمكن قيام أي إتمام goal، لكن `blocked` استدعاء في بلوغ إلى إعداد وصل متابعة Round عدد كمية قبل سوف يتم آلة آلة رفض——نموذج حكم قطع نفس شرط هل تأكيد فعلي حمل متابعة، و يجب في `blocked_reason` في شرح. شخص صنف مباشر طلب يمكن قيام أي إيقاف goal.

نجاح تقرير إبلاغ `complete` أو `blocked` ذاتي رئيسي Round أيضا سوف في هذا خطوة بعد انتهاء شيء إدارة جولة، نموذج سوف استلام إلى واحد بند انتهاء إشارة أمر، اشتراط نحو مستخدم كتابة خروج نهائي رسالة. شخص صنف مباشر تغيير أبدا سوف إطلاق هذا نوع إيقاف:assistant يمكن تأكيد تغيير، حلقة ما زال يمكن استقبال تزامن شخص صنف steering(في طريق جذب توجيه).

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

هذا عقدة حل تفسير أداة مثل أي قوي صنع تنفيذ إذن و تصيير إخراج؛ يمكن مراقبة اتفاق قد في[استخدام هذه الحزمة](#use-this-package) في شرح.

### تصميم

- **تنفيذ وقت إذن.** كل مرة استدعاء كل تحليل دقيق نشط وثب agent، ذلك وراثة `AgentRegistry` initiator،running حالة و فتح وضع جولة؛`create`،`edit`،`pause` و `resume` أيضا اشتراط وقت التشغيل أصل agent حالي جولة في وجود قد قبول `{ kind: 'user' }` رسالة أو steering حدث. حمل دائم paused goal سوف يجعل `resume` بـ `GOAL_TOOL_RESUME_PAUSED` فشل؛ موجه إلى مستخدم أمر أو Web تحكم عنصر يملك هذا تحويل. حمل دائم fork جدول نظام لن خفض منخفض قد استعادة أصل agent انتظار درجة؛ نشط وثب subagent كل حق سوف خفض منخفض.
- **شخص صنف إدخال مضيف إثبات.** `Agent.followup()` و `steer()` سوف في استدعاء جهة حذف source وقت قسم إعداد `{ kind: 'user' }`، لذلك إضافة، مجدول و أخرى غير شخص صنف إنتاج جهة يجب نقل دخول ذاتي ذات source، لا يستطيع وراثة شخص صنف إذن.
- **حمل إعداد عتبة قيمة توجيه النظام إشارة جذب.** هذه الحزمة تسجيل واحد `tool:goal` توجيه النظام فصل عقدة، ذلك ثابت نص إدراج دخول `blockedAfterConsecutiveRounds`؛ نفس عدد قيمة حينئذ هو تنفيذ وقت قوي صنع تنفيذ صلب تحت حد.
- **نهاية نطاق Round انتهاء سياق.** نجاح ذاتي رئيسي `complete` أو `blocked` سوف تأخير بعد واحد بند `<goal_complete>` أو `<goal_blocked>` انتهاء إشارة أمر، يجعل نموذج في جولة انتهاء قبل نحو مستخدم فعل مرة تسليم بديل؛ شخص صنف مباشر تغيير أبدا سوف تأخير بعد هذا سياق.

### شفرة المصدر أرض رسم

| ملف | مسؤولية |
|---|---|
| [`src/index.ts`](src/index.ts) | إضافة مدخل: أداة تسجيل، إعداد، توجيه النظام فصل عقدة، نتيجة تصيير |
| [`src/authority.ts`](src/authority.ts) | تنفيذ وقت إذن فحص و Goal Round قبول |
| [`src/wrapup.ts`](src/wrapup.ts) | نهاية نطاق ذاتي رئيسي تحديث انتهاء رسالة إشارة أمر |
| — | لا إصدار وقت التشغيل ثابت صيغة مرافق توليد مدخل؛ هذا موجه إلى نموذج مهايئ لا يملك مستقل حالة أو حدث بروتوكول؛ قد قبول تغيير من goal مجال فحص، إذن سلوك فإن من هذه الحزمة اختبار تحقق. |

### أداة إخراج

ثلاثة عدد أداة مشترك استخدام واحد نوع مواصفة إخراج: ضيق تجميع JSON `{ goal: null }`، أو `{ goal: { id, revision, objective, phase, roundsStarted, maxGoalRounds, blockedReason? }, activation }`. نتيجة في `activation` هو فوري مراقبة قيمة، أبدا سوف يصبح إعادة تشغيل إذن اعتماد حسب.UI عميل استلام إلى صاف عام بطاقة——`get_goal` لـ read، تغيير استخدام other.

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

هذه أداة هو goal جدول وجه موجه إلى نموذج واحد نصف؛ مثل يحتاج حل هو جمع تغيير حالة و ذلك الذي التزام دوران سياسة، طلب قراءة قراءة التالي صفحة.

- [goal خدمة](../goal/README.zh.md)——أداة تغيير goal حالة و دورة الحياة.
- [goal مجموعة أرض رسم](../README.zh.md)——goal كل حزمة و ذلك تركيب طريقة.
- [توليد أداة دليل](../../../docs/tool-catalog.zh.md#deepseek-aidsh-tool-goal)——نموذج استقبال دقيق schema.
- [goal أداة Agent Note](../../../.agents/notes/implemented/feature/2026-07-19-model-facing-goal-tools.zh.md)——إذن تفكيك قسم و UX قرار.

-----

<a id="model-experience"></a>
## تجربة النموذج

### توجيه النظام

#### نموذج يرى محتوى

ثابت goal سياسة شرح أي نوع مستخدم دلالة معنى رسم قيمة نيل إنشاء goal، اشتراط تحديث قبل أولا دقيق قراءة ref، حل تفسير جلسة resume/fork بعد مثل أي إعادة تفعيل متابعة سطر، و حد إتمام/منع سد إعلان. حمل دائم paused resume سوف في تنفيذ وقت بـ `GOAL_TOOL_RESUME_PAUSED` رفض؛ موجه إلى مستخدم goal تحكم عنصر يملك هذا تحويل. إعداد عتبة قيمة سوف إدراج دخول هذا إشارة جذب.

##### Goal سياسة

```markdown
Use goal tools for one long-running completion objective in the current session. create_goal may infer goal intent from a direct human request in any language; do not create a goal for routine single-turn work. Call get_goal before update_goal and copy its exact goal_id and revision. After session resume or fork, an active goal is disarmed: when a human asks to continue or resume in any wording or language, use update_goal action resume to rearm it. Mark complete only when the objective is actually achieved. Mark blocked only after the same blocking condition persists for at least 3 consecutive goal rounds, and report that concrete condition in blocked_reason; difficulty, uncertainty, or useful remaining work is not blocked.
```

#### Token أثر

هذا إضافة نص التوجيه تسجيل يقع في طلب نطاق داخل وقت، كل مرة طلب كل سوف إنتاج قليل كمية ثابت إدخال صار هذا.

#### KV Cache أثر

إضافة نطاق، إعداد عتبة قيمة و إشارة جذب نص ثابت وقت، بادئة إبقاء مستقر. تفعيل،dispose(مورد تحرير) أو إعداد تغيير ممكن جعل هذا نص التوجيه فصل عقدة إعادة استخدام بطلان.

### أداة schema و نتيجة

#### نموذج يرى محتوى

توليد [`get_goal`،`create_goal` و `update_goal` schema](../../../docs/tool-catalog.zh.md#deepseek-aidsh-tool-goal). نجاح نتيجة هو ضيق تجميع JSON. تغيير سوف إلحاق goal مجال حمل دائم `goal/change` حدث، بينما لن سوف نموذج سياق إضافة دخول طابور صف. نتيجة في `activation` هو فوري مراقبة قيمة، أبدا سوف يصبح إعادة تشغيل إذن اعتماد حسب.

#### Token أثر

ثابت schema صار هذا، إضافة فوق كل مرة استدعاء واحد بند ضيق تجميع نتيجة. حمل دائم تغيير لن زيادة مفرد وحيد نموذج مرئي سياق.

#### KV Cache أثر

schema تعريف و مرئي صفة ثابت وقت، بادئة إبقاء مستقر. استدعاء و نتيجة سوف إلحاق إلى يمكن إعادة استخدام طلب بادئة بعد، لن جعل أكثر مبكر بند بطلان.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>


هذه حد شرح goal أداة أي وقت لا دمج ملائم أو حاجة خاص آخر ملاحظة معنى. هو جمع هو حالي حزمة قيد، لا هو مهمة تراكم ضغط.

- **دلالة معنى رسم ما زال من نموذج حكم قطع**——تنفيذ فقط قدرة إثبات حالي جولة يتضمن واحد بند شخص صنف مباشر إرسال رسالة، لا يمكن إثبات طلب هل كاف كاف إعادة كبير بينما قيمة نيل إنشاء goal.
- **منع سد شرط هل نفسه ما زال من نموذج حكم قطع**——وقت التشغيل قوي صنع موحد حساب متبادل لا تكرار قد دقيق دخول Goal Round، بينما لا حكم قطع عائق عائق في دلالة فوق هل انتظار قيمة؛ مستقل تقييم تقدير جهاز تنفيذ مؤقت مؤقت.
- **لا مسؤول ضبط درجة أو مباشر موجه إلى شخص صنف عرض**——هذه أداة فقط تغيير حالة؛ نفس جلسة مشغل و `dsh-command-goal` هو نفس مجال مستقل مستهلك.
- **Goal Round إذن حاجة مشغل**——حذف غير متابعة سطر مشغل دقيق دخول goal مصدر مستخدم جولة، لا فإن ذاتي رئيسي `complete`/`blocked` مسار لن تفعيل؛ فقط تركيب هذا عدد حزمة لن إنشاء هذه جولة.
- **نص التوجيه تسجيل و مرور ترشيح متبادل متبادل مستقل**——بعض عدد نطاق ممكن إخفاء أداة، لكن إبقاء إشارة جذب، حذف غير نشر سوف اثنان بند تسجيل حد تحديد في نفس نطاق.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

هذا ملاحظة تطوير هو صيانة من عمل سياق، واضح لا أداة مرجعي صفة. فتح وضع مشكلة:goal سياسة فصل عقدة هل ينبغي و أداة تسجيل مستقل حد تحديد نطاق، تجنب تجنب بعض عدد نطاق إخفاء أداة لكن إبقاء إشارة جذب.

</details>
