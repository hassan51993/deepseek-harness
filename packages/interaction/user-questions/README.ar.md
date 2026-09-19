---
description: "أساس في waterfall سؤال جواب خدمة، لأجل أداة، إذن إضافة، محلي answerer و Agent-scoped Web تفاعل."
kind: "package-reference"
---

# @deepseek-ai/dsh-user-questions

[English](README.md) | العربية

## عام وصف

مستخدم تفاعل Service Definition. هو تعريف `ctx.userQuestions`، توفير موجه إلى نموذج أداة أو إذن إضافة في حاجة مؤقت توقف عمل و استفسار سؤال شخص صنف قرار وقت استخدام. عند مستهلك يجب مؤقت توقف عملية و انتظار مستخدم عودة جواب وقت، طلب استخدام هو.

## دليل

- [خدمة:`UserQuestionService`(ctx مفتاح:`userQuestions`)](#service-userquestionservice-ctx-key-userquestions)
- [مسؤولية](#role)
- [تجربة النموذج](#model-experience)
- [معروف حد و مؤقت مؤقت أمر بند](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="service-userquestionservice-ctx-key-userquestions"></a>
## خدمة:`UserQuestionService`(ctx مفتاح:`userQuestions`)

### عام API

- `ctx.userQuestions.ask(request): Promise<AskUserQuestionAnswer>` إرسال إرسال عودة جواب من waterfall، و انتظار أول عدد يتم قبول عودة جواب.

### صلة مفتاح نوع

- `AskUserQuestionRequest`:`{ questions: [{ id, question, detail?, header?, options?, multiSelect?, intent? }], agent?, signal? }`؛`detail` توفير مساعد مساعدة نص، مزود سوف سوف ذلك مع مشكلة واحد بدء تصيير، بينما لن سوف ذلك تغيير صار خيار وسم. مثل توفير `agent`، هو يجب و سجل التسجيل في تخزين نشط وقت التشغيل أصل agent(ذكي جسم) هو نفس كائن.
- `AskUserQuestionOption`:`{ label, description? }`.
- `AskUserQuestionIntent`:`{ kind: 'plan-review', approve }`؛ أي تحت نص حمل وسم عرض معنى رسم.
- `AskUserQuestionAnswer`:`{ answers: [{ id, selected, custom? }] }`.
- `UserQuestionError`:`HarnessError` فرعي صنف، يتضمن `EMPTY_QUESTIONS`،`BAD_INTENT`،`NO_PROVIDER`،`ASK_ABORTED`،`CALLER_NOT_LIVE` و `DELEGATED_CALLER` انتظار شفرة.

مقابل في مفرد اختيار عنوان،`custom` سوف تغطية اختيار في خيار، كما `selected` لـ فارغ. مقابل في كثير اختيار عنوان،`custom` يمكن تكملة ملء `selected` في وسم.UI يمكن يأخذ قفز مرور بند إبقاء لـ `{ id, selected: [] }`، حيث صيانة حمل قائم عودة جواب شكل، أيضا إبقاء هذا دفعة مرة في أخرى عودة جواب.

طلب يتضمن agent وقت،`ask()` سوف عبر حالي `AgentRegistry` تحقق هذا agent و سجل التسجيل في تخزين نشط نسخة هو نفس كائن، و كما فقط سماح وقت التشغيل أصل استدعاء. حمل دائم جدول نظام لا بنية صار إذن اعتماد حسب: حمل لديه تاريخ تفويض حمل عميق درجة جلسة استعادة لـ جديد وقت التشغيل أصل بعد يمكن رفع سؤال؛ ملكية في آخر عدد agent تخزين نشط فرعي درجة أي جعل حفظ دائم سجل تفويض حمل عميق درجة لـ صفر أيضا سوف يتم رفض.Web عودة جواب من فقط استقبال حمل Agent scope طلب؛ لا يحتوي agent برنامج تحويل طلب ما زال سوف تسليم إعطاء محلي لم حد تحديد scope waterfall listener، إذا بلا شخص قبول فإن بـ `NO_PROVIDER` فشل.

### عرض معنى رسم

`intent` إعلان بعض عدد مشكلة ذاته حينئذ هو واحد نوع معروف قرار، لذلك إقرار تعرف هذا وسم UI يمكن وفق هذا عرض——`plan-review` يمثل `detail` هو واحد نسخة انتظار مراجعة قراءة خطة،`dsh-plan-mode` سوف في `exit_plan_mode` مشكلة فوق ضبط هو. معنى رسم فقط تغيير عرض: التزام دوران هو UI عودة جواب ما زال هو عام UI سوف إرسال ذلك بعض خيار وسم، لا إقرار تعرف هذا وسم UI تصيير عام خيار قائمة، لذلك استدعاء جهة اثنان نوع حال حال تحت قراءة إلى عودة جواب حقل نفسه.`approve` إشارة اسم يمثل دفعة دقيق وسم، بينما لا اعتماد خيار ترتيب. لديه اثنان بند تأكيد لا يمكن عبر نوع جدول بلوغ،`ask()` سوف بـ `BAD_INTENT` رفض هو جمع:`approve` لم أمر في هذا مشكلة ذاته مهمة واحد خيار، و معنى رسم سقوط في لا يوجد `detail` مشكلة فوق——بينما `detail` صحيح هو هو ذاتي تسمية في مراجعة قراءة شرق غرب.

<a id="role"></a>
## مسؤولية

هذا هو Service Definition حزمة.`@deepseek-ai/dsh-tool-ask-user` انتظار Consumer اعتماد هذا خدمة؛Web Client عبر Remote Events مساهمة حمل Agent scope عودة جواب من. حلقة إبقاء ثابت: استدعاء الأداة انتظار waterfall نتيجة، هذا نتيجة مع بعد استعادة صحيح معتاد agent loop(ذكي جسم حلقة).

<a id="model-experience"></a>
## تجربة النموذج

بين وصل أرض، عبر `dsh-tool-ask-user`: هو سوف سوف نجاح عودة جواب إبقاء لـ ضيق تجميع JSON، أو إرجاع التالي فشل لـ واحد:`Error: ask_user_question was aborted before the user answered`،`Error: ask_user_question requires at least one question`،`Error: human interaction requires the exact live calling agent when an agent is supplied`،`Error: human interaction is unavailable while the calling agent is owned by another live agent; include the unresolved question or decision in the child agent's final result`،`Error: no user-questions answerer accepted the request` أو `Error: <message>`. انتظار شخص صنف عودة جواب لن زيادة token.

#### KV Cache أثر

لن مباشر جعل KV Cache بطلان؛ طلب بادئة أي تغيير متساو من فوق وصف مستهلك مسؤول.

## معروف حد و مؤقت مؤقت أمر بند

<a id="known-limitations-and-deferred-work"></a>

- **حمل Agent scope Web عودة جواب**:Remote Events فقط في طلب حمل لديه تخزين نشط Agent scope وقت توجيه مع منتج تسليم Web عودة جواب من؛agentless استدعاء جهة حاجة محلي لم حد تحديد scope waterfall listener.
- **مفردات فقط يتضمن مشكلة جدول مفرد شكل**: يمكن توفير اختيار خيار إضافة اختياري ذاتي تعريف نص؛ أكثر وفير غني تفاعل شكل (ملف اختيار جهاز،diff معاينة تأكيد) بعد بلا seam مفردات.


<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

خطة مراجعة دفعة في اختياري `callId` معرف قد سجل استدعاء الأداة، توفير وثيقة تنقل استخدام، لا تغيير عودة جواب و ذلك تحقق.

</details>

**وقت التشغيل ثابت صيغة:** لا إصدار مرافق توليد مدخل.answerer waterfall حسب طلب تحليل و يأخذ نتيجة مباشر إرجاع استدعاء جهة؛ هذا seam لا إصدار مستقل طلب/عودة جواب مراجعة حساب تدفق.
