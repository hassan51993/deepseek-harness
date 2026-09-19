# Agent Note: Agent أثر مجال حدث dispatch مفرد عدد payload كائن

Status: implemented
Archived: 2026-09-04

[English](2026-08-06-agent-event-payload-objects.md) | العربية

## مشكلة

Agent أثر مجال حدث تاريخ قدوم اعتماد موضع معامل: فتح رأس `agent` رئيسي جسم، حدث مخصص تابع حقل، و نهاية ذيل لأجل waterfall(شلال نشر صيغة حدث)/serial حدث `next`. إضافة جديدة حقل أو تراجع دور سياق نوع (مثل `PreStepContext` و `RequestFailureContext`) كل سوف إجبار جعل عبر حزمة إعادة كتابة كل مستمع و emitter، اتفاق أيضا واحد مباشر قسم تفرق في معامل قائمة في، بينما لا هو تجميع في في واحد أداة اسم payload في.

## قرار

كل agent أثر مجال حدث كل سوف تماما جيد واحد payload كائن بصفة ذلك رقم واحد معامل.payload بداية نهاية يحمل رئيسي جسم (`agent`) ، حدث حقل، و حدث لديه إلغاء إشارة وقت إلغاء `signal`؛`next` ما زال هو waterfall/serial حدث الأكثر بعد واحد معامل. تلقي أثر حدث هو عشرة اثنان عدد `agent/*` حدث،`agent-loop/config-start-failed`(وحيد لا يوجد رئيسي جسم حدث) و `goal/changed`.

`PreStepContext` و `RequestFailureContext` قد تراجع دور؛ هو جمع حقل مباشر وجود في `agent/pre-step` و `agent/request-error` payload في.

dispatch هو دمج دمج:`agentEvents(ctx, agent)`(و مرة صفة `emitAgentEvent`) حقن رئيسي جسم، جعل أثر مجال تحميل جسم مفتاح و payload `agent` غير ممكن قدرة قسم تقاطع؛ أي جعل بعض عدد بنية فوق يمكن قبول payload تماما جيد يحمل `agent` حقل، حقن رئيسي جسم ما زال أولوية.`ReactLoopAgent` في بنية صنع دالة في بناء مرة dispatcher، و سوف كل emit،serial و waterfall كل مرور من هو توجيه، لذلك حار مسار فوق dispatch لا إنتاج أي قسم إعداد.

## اعتبار مرور بديل خطة

**إبقاء موضع توقيع.** إضافة جديدة حقل أو تراجع دور سياق نوع اعتماد قديم سوف إعادة كتابة كل مستمع و emitter، اتفاق أيضا سوف متابعة قسم تفرق في معامل قائمة في، بينما لا هو تجميع في في واحد أداة اسم payload في.

**في كل dispatch موضع يد عمل بنية صنع رئيسي جسم.** loop في بين تصميم استدعاء `ctx.waterfall(this.carrier, …)`، نقل دخول يد عمل بنية صنع `{ agent: this, … }` payload؛ هو تجنب تجنب كل مرة dispatch قسم إعداد، لكن تكرار رئيسي جسم حقن، و يجعل أثر مجال مفتاح و payload رئيسي جسم قسم تقاطع. دمج دمج dispatcher هو كل نوع dispatch نمط وحيد حقن نقطة.

## عاقبة

مستمع توقيع مرة صفة تسمية كامل payload، لذلك توسيع payload أو تراجع دور سياق نوع، مقابل كل مستمع و emitter كل هو مرة شكل حالة تغيير. رئيسي جسم/أثر مجال اقتران دمج من dispatcher في كل نوع dispatch نمط تحت قوي صنع تنفيذ، كما loop حار مسار إبقاء صفر قسم إعداد.
