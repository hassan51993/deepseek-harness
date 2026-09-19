---
description: "مشترك Typert Remote بروتوكول: عمل خدمة حزمة، توليد ناتج،Host Gateway و Client API استخدام تركيب زينة جهاز،wire وصف رمز، تحرير حل رمز جهاز و مزود اتفاق."
kind: "package-library"
---

# @deepseek-ai/dsh-typert-protocol

[English](README.md) | العربية

## عام وصف

استعارة مساعدة `dsh-typert-protocol`، عمل خدمة حزمة يمكن نحو Remote عميل كشف Host طريقة: استخدام `@Remote`(أثر مجال استقبال من استخدام `@RemoteScope`) علامة طريقة، يأخذ خدمة ربط إلى wire نطاق الأسماء، و عبر يمكن دمج توسيع بروتوكول خريطة يأخذ Host كائن و أثر مجال Context صلة ربط إلى wire identity. توليد ناتج،Host Gateway و Client API إزالة استهلاك نفس طقم استدعاء وصف رمز، تحرير حل رمز جهاز و مزود اتفاق. استدعاء يحتفظ قيمة يأخذ تنظيف مسؤولية مهمة تسليم إعطاء Gateway، لا آخر زيادة مرجع حساب عدد. هذه الحزمة لا تسجيل أي Cordis خدمة، أيضا لا تشغيل TypeScript قسم تحليل.

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

هذه الحزمة توفير نحو Remote عميل كشف Host قدرة عمل خدمة حزمة و تركيب إعداد صيانة من استخدام. هو هو واحد إعلان مكتبة: علامة طريقة، ربط خدمة، ذلك بقية تسليم إعطاء توليد خط الإنتاج و Gateway.

### كشف Host طريقة

عمل خدمة حزمة استخدام `@Remote`(عند استقبال من قدوم ذاتي أثر مجال Context وقت استخدام `@RemoteScope(key)`) علامة واحد عام نسخة طريقة، الذي تابع خدمة يلزم ما وراثة `TypertRemoteService`، يلزم ما عبر `bindTypertRemote()` إعلان `typertRemote` ربط:

```text
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'

export class GoalService extends TypertRemoteService {
  @Remote
  async create(agentId: string, objective: string): Promise<GoalResult> {
    ...
  }
}
```

توليد سوف يأخذ طريقة تغيير لـ خدمة نطاق الأسماء تحت wire طرف نقطة؛Client عبر `ctx.remote` بـ نوع تحويل طريقة استدعاء هو (رؤية [API Gateway مشاركة اعتبار](../../../docs/api-gateway.ar.md)). طريقة يأخذ `signal: AbortSignal` إعلان لـ الأكثر بعد واحد معامل يكفي اختيار تنسيق عمل صيغة إلغاء——هذا إشارة هو حقن، أبدا سوف يصبح JSON معامل أو فحص بحث حقل.

### يأخذ Host كائن و Context صلة ربط إلى wire identity

تكرار مختلط Host كائن لا يستطيع مباشر عبر wire نقل. عمل خدمة حزمة عبر يمكن دمج توسيع `TypertLookupMap` و `TypertContextMap` إعلان صلة ربط.Host Context مهايئ يملك مستقر wire إعلان، و يأخذ wire identity تحليل لـ نشط وثب Context.Client Context مهايئ حاجة مزدوج نحو خريطة، لأن أثر مجال استدعاء من Client Context إرسال بدء، بينما تحويل إرسال Host حدث يلزم في Client جانب تحليل ذلك صريح wire identity.Host تركيب يمكن تغطية ذلك تزامن أو مختلف خطوة محلل. بسبب سياسة سبب رفض تحليل محلل سوف رمي خروج حمل لديه ذاته رمز خطأ `RemoteError`، هذا رمز أصل مثال وصول استدعاء جهة.

Client Context تحليل إبقاء تزامن.`typertOwnedValue(value, release)` يأخذ لا رمي استثناء، قوة انتظار تنظيف تسليم إعطاء استدعاء owner؛Gateway في معالج و عودة تكرار متساو انتهاء بعد استدعاء هو. استعارة استخدام Context لا حاجة تنظيف حزمة تركيب طبقة. مشترك `TYPERT_OWNED_VALUE` symbol و `isTypertOwnedValue` تعرف آخر دالة يمكن عبر مستقل تحزيم مزود و Gateway استخدام؛ حزمة تركيب طبقة ذاته لن retain مورد.

### تقرير إبلاغ و قراءة Remote فشل

كل Remote فشل كل من واحد صنف تحمل تحميل:`RemoteError`، يحمل مستقر `<domain>/<reason>` رمز، و حسب هذا رمز تحديد نوع details. هذه الحزمة إعلان عام تحميل جسم رمز (`gateway/bad-request`،`gateway/cancelled`،`gateway/internal`) ، و يملك `RemoteErrorDetailsMap`——يمكن دمج توسيع رمز جدول، أخرى كل حزمة كل في ذاتي ذات رمي خروج نقطة جانب توسيع هو:

```text
declare module '@deepseek-ai/dsh-typert-protocol' {
  interface RemoteErrorDetailsMap {
    'goal/not-found': { readonly goalId: string }
  }
}
throw new RemoteError('goal/not-found', `goal "${id}" does not exist`, { goalId: id })
```

يملك جهة في فشل نقطة مباشر رمي خروج؛ لا يوجد أي حزمة مجددا كتابة خطأ صنف بيت عائلة أو خروج فتحة خريطة دالة. استدعاء جهة حسب `code` حكم آخر——أبدا استخدام `instanceof`——كما `code` فرع بلا حاجة cast أي استلام ضيق `details`، لأن `RemoteFailure` حينئذ هو `RemoteError` نسخة حسب رمز حكم آخر union. حاجة تعرف آخر عبر وحدة أو عبر realm صنف فرعي هذا نقل قدوم فشل وقت، أساس أساس ضبط تطبيق استدعاء `remoteErrorOf(value)`، هو قراءة بنية علامة بينما لا هو أصل نوع سلسلة.

### في Client جانب استقبال تحويل إرسال Host حدث

Host تركيب إعداد بـ تحويل إرسال إعطاء مستهلك Cordis حدث توسيع `TypertRemoteEventSelection`، من بينما استلام ضيق `ctx.remote.$on` مفتاح تجميع.`TypertForwardableEvent` قبول بلا أثر مجال كما إرجاع `void` إشعار، و الأكثر بعد واحد `next()` عودة ضبط إرجاع حدث نتيجة نوع مختلف خطوة أثر مجال waterfall(شلال نشر صيغة حدث).`TypertClientEventListener` من نفس بند `Events` عضو إرسال توليد Client listener، و إبقاء signal، اختياري و فقط قراءة حقل، عدد مجموعة، عودة ضبط و نتيجة نوع.`TypertClientRemote` فقط عام `$mount()` و `$on()`؛ حدث نقل ما زال من Gateway خاص يحتفظ.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

هذا عقدة حل تفسير إعلان مثل أي إبقاء و تحرير ترجمة جهاز غير متصل، و كل اتفاق في أي داخل تنفيذ؛ تحرير مسار نموذج قد في[استخدام هذه الحزمة](#use-this-package) في شرح.

### تصميم إدارة فكرة

هذه الحزمة يأخذ صارم إطار عكس إطلاق إبقاء في تحرير ترجمة جهاز في: تركيب زينة جهاز ابتدائي تحويل جهاز يأخذ الأكثر صغير علامة حفظ في Service أصل نوع فوق حمل إصدار وصف رمز في. وصف رمز استخدام مستقر نص خاصية اسم، لذلك بروتوكول حزمة آخر عدد قد تثبيت فرعي هذا أيضا قدرة قراءة نفس مجموعة علامة. كامل معامل، نتيجة، فحص بحث و schema عكس إطلاق هو Typert بناء خط الإنتاج مسؤولية، عبر `InvocationDescriptor` تسليم.

### Remote علامة

`@Remote` و `@RemoteScope` ضبط درجة واحد ابتدائي تحويل جهاز، يأخذ طريقة اسم، اختياري تصدير اسم و استدعاء نمط إلحاق إلى أصل نوع وصف رمز؛`remoteMethods(service)` تحقق ذلك إصدار، و إرجاع و قد تخزين وصف رمز قسم مغادرة، حسب إعلان ترتيب صف لقطة، توفير Gateway شفرة المصدر نمط رجوع قراءة. علامة اشتراط اسم لـ نص عام، غير ساكن حالة نسخة طريقة، نفس طريقة فوق اندفاع مفاجئ علامة سوف يتم رفض.

### بروتوكول خريطة و وصف رمز

يمكن دمج توسيع بروتوكول خريطة في نوع نظام في إبقاء ساكن حالة صلة ربط، وقت التشغيل مزود فإن نحو `ctx.typert` تسجيل تحليل؛ خريطة اسم و شكل حالة رؤية [`src/types.ts`](src/types.ts).`InvocationDescriptor` هو سجل التسجيل،Gateway و Client Remote مشترك نفس إزالة استهلاك مشترك وقت التشغيل شكل صيغة، شمول غطاء مباشر و Context استقبال من،JSON و فحص بحث معامل، أثر مجال إسقاط، إلغاء و نتيجة تحرير حل رمز جهاز.

### Wire معرف نص قاعدة

كل نطاق الأسماء، طريقة، فحص بحث و Context مقطع كل يجب ممتلئ كاف `isTypertRemoteSegment()`، توليد اسم حرف عندئذ قدرة أصل مثال عبر مشترك RPC تحميل جسم نقل. صارم إطار تحرير حل رمز جهاز يحمل توليد schema factory؛`src-json` تحرير حل رمز جهاز معرف قيد أكثر ضعيف شفرة المصدر بدء مسار.

### شفرة المصدر أرض رسم

| ملف | مسؤولية |
|---|---|
| [`src/index.ts`](src/index.ts) | تركيب زينة جهاز،Gateway ربط،`remoteMethods`، مقطع تحقق |
| [`src/remote-error.ts`](src/remote-error.ts) | `RemoteError` و بنية صيغة تعرف آخر دالة `remoteErrorOf` |
| [`src/types.ts`](src/types.ts) | بروتوكول خريطة،`RemoteErrorDetailsMap`،`RemoteResult`،`InvocationDescriptor`، تحرير حل رمز جهاز، مزود اتفاق، سجل التسجيل واجهة،`TypertClientRemote` |
| — | لا إصدار وقت التشغيل ثابت كمية مرافق توليد مدخل؛decorator فقط إبقاء خاص غير ممكن تغيير إعلان،binding أيضا هو تجميد ربط قيمة، لا يوجد يمكن توفير تسليم تقاطع نواة مقابل مستقل حدث تدفق. |

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

عند حزمة درجة اتفاق لا كاف استخدام وقت قراءة قراءة التالي صفحة؛ هو جمع من إعلان تدريجي خطوة دخول وقت التشغيل و استدعاء مسار.

- [API Gateway مشاركة اعتبار](../../../docs/api-gateway.ar.md)——إعلان مثل أي يصبح فعلي Host إلى Client استدعاء.
- [Typert فرعي نظام مشاركة اعتبار](../../../docs/subsystems/typert.ar.md)——من بروتوكول و Gateway نوع سجل حرف وجه عام مشترك اتفاق.
- [Typert سجل التسجيل](../registry/README.ar.md)——وصف رمز و مزود في وقت التشغيل تخزين وضع موضع.
- [Typert توليد جهاز](../generator/README.ar.md)——توليد مستهلك إعلان و وصف رمز حزمة.
- [Remote استدعاء Agent Note](../../../.agents/notes/implemented/architecture/2026-08-02-typert-remote-method-calls.ar.md)——Remote استدعاء خلف بعد هيكل بنية و نقل قرار.

-----

<a id="model-experience"></a>
## تجربة النموذج

بلا، لأن و تحرير ترجمة جهاز غير متصل Remote بروتوكول إعلان لا تسجيل أي موجه إلى نموذج محتوى.

#### KV Cache أثر

بلا مباشر أثر؛ إعلان اتفاق فقط لديه في تركيب إعداد سوف ذلك وضع دخول طلب وقت عندئذ سوف لمس و طلب.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>


هذه حد شرح إعلان قدرة يمثل ماذا؛ هو جمع هو حالي حزمة قيد، لا هو مهمة تراكم ضغط.

- **تركيب زينة جهاز علامة هو الأكثر صغير تحويل**——علامة فقط يتضمن طريقة اسم و مباشر استدعاء أو Context استدعاء نمط؛ معامل، نتيجة، فحص بحث و schema عكس إطلاق حاجة Typert بناء خط الإنتاج.
- **Remote توقيع تلقي حد**——تركيب زينة جهاز فقط قبول أداة لديه نص اسم عام، غير ساكن حالة نسخة طريقة، شفرة المصدر نمط تنفيذ لا يمكن يمثل إعادة تحميل، حل بنية، افتراضي معامل أو باق بقية معامل توقيع.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
