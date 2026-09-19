---
description: "dsh Web عميل slot سجل التسجيل صاف نواة قلب: عادي توسيع slots، يمكن إعادة استخدام Component Factory، دفع توجيه props نوع،store مقعد موضع و مصير تثبيت اتفاق."
kind: "package-library"
---

# @deepseek-ai/dsh-client-ui-slots

[English](README.md) | العربية

## عام وصف

`dsh-client-ui-slots` يجعل Web عميل إضافة تعريف و تركيب حمل نوع فحص UI منطقة مجال. عادي Slots توفير parent-owned توسيع موضع؛Component Factory توفير حمل استدعاء جهة الذي اختيار نطاق جزء Component يمكن إعادة استخدام تركيب إعداد. اثنان طقم API كل من إعلان دمج نوع دفع توجيه scoped state،injection،locale و child-render props، و في إضافة تحميل خلال تقرير إبلاغ اندفاع مفاجئ definition. عميل حاجة تصيير وقت، سوف هذا عدد لا اعتماد React حزمة و `ui-renderer` إعداد دمج استخدام.

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

تحرير كتابة عميل إضافة وقت كل عبر هذه الحزمة تركيب UI: يأخذ مكون تسجيل دخول أب درجة قد إعلان slot، أو إعلان مكون سوف يلزم تصيير فرعي slot. أربعة نوع kind تغطية تركيب شكل——`single`(مفرد عدد احتلال موضع من) ،`list`(لديه ترتيب بند) ،`keyed`(حسب مفتاح قسم إرسال) و `chain`(بند ذاتي سطر رفع اسم).

### يمكن إعادة استخدام Component Factory

عند واحد حزمة تعريف تركيب إعداد، بينما متبادل لا متبادل صلة parents حاجة مستقل تصيير هو وقت، استخدام Component Factory. في `SlotFactoryMap` في إعلان كامل نوع، عبر `ctx.slots.registerFactory()` تثبيت definition، عبر حقن `renderFactorySlot()` تصيير occurrences، و عبر استدعاء `slots` خيار اختيار كل قد إعلان نطاق جزء Component.definition عبر `useFactorySlot(name, fallback)` قراءة هذا اختيار.

Factory `children` ما زال هو عادي عام Slots كما يجب و `SlotMap` مطابقة، بينما نطاق جزء `slots` لـ كل occurrence اختيار واحد Component.occurrence وراثة ذلك تصيير موضع scope؛`renderFactorySlot()` لا قبول Session identity. مشترك Store handle استخدام عادي scope تحليل.Store factory إبقاء lazy، مباشر إلى occurrence أول مرة شيء تحويل وقت عندئذ لـ هذا تصيير موضع إنشاء واحد handle؛ إذا حفظ دائم Store spec سوف يجعل persistence key في occurrences بين اندفاع مفاجئ،renderer سوف رفض هو.

### خمسة عدد إطار هيكل props share

كل قد تسجيل مكون كل سوف استلام إلى من خمسة عدد إطار هيكل share تركيب بينما صار props: وقت التشغيل share(أب درجة render استدعاء نقطة `owner`، إضافة فوق جلسة معيار أداة حزمة و عام مقعد موضع) ،child render share(ساكن حالة تقليص ضيق إلى قد إعلان children `renderSlot`) ،Factory render share(`renderFactorySlot`) ،store share(قد إعلان handle selector خطاف و إزالة draft actions) ، و عمل خدمة share(من `inject` دفع توجيه). مكون مرجع دفع توجيه خروج props آخر اسم؛ هو جمع أبدا في محلي إعادة تعريف أي share نوع.

### Store مقعد موضع

register استدعاء يمكن استخدام `store: defineStore(...)` إعلان store مقعد موضع:`init` دفع قطع حالة schema،`actions` هو كامل draft-transform كتابة تجميع دمج. مكون مرور selector خطاف قراءة، مرور تجفيف خبز عودة ضبط كتابة؛`defineStore` جذب محرك تنفيذ يقع في وقت التشغيل حزمة، و ممتلئ كاف هذا داخل توجيه خروج `DefineStore` اتفاق.

### إعلان سجل قاعدة

إعلان أي إقرار قيادة: تسجيل بند يصبح وحيد يتم سماح تصيير هذا مفتاح بند؛ تسجيل لم إعلان slot، إعلان قد إعلان مرور فرعي بند، في اثنان عدد scope تحت تركيب نفس عدد مشترك جملة مقبض، أو تسجيل نقص قليل `select` chain، كل سوف في تحميل وقت رمي خروج. بند disposer سوف تمرير عودة إزالة ذلك إعلان فرعي slot——حساب هذا سطر، مساهمة و store تركيب كل مع نفس دورة الحياة انتهاء بينما إزالة.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

عادي Slot تصميم حينئذ هو واحد ورقة جدول: إعلان = تصيير تخويل = وقت التشغيل مواصفة.`SlotMap` في هذا داخل إعلان لـ فارغ، من مستهلك عبر `declare module` زيادة تكملة دمج؛`SlotFactoryMap` و معيار أداة حزمة واجهة (`SessionStandardProps`،`GlobalStandardProps`) أيضا اعتماد نفس طريقة.Factory definition استخدام مستقل مفرد definition ledger، لأن ذلك occurrences لا يوجد parent إعلان.

### تسجيل و توجيه

`SlotCore` في بنية صنع وقت مسبق وضع `'root'` slot، و قوي صنع تنفيذ تحميل وقت تحقق.`ChainSelect` selector حسب رفع ترتيب `priority` تشغيل (نفسه قيمة حسب تسجيل ترتيب) ؛ رقم واحد غير null قيمة راجعة اختيار في ذلك بند، و يصبح مكون `matched` prop؛ الكل إرجاع null وقت استخدام owner `renderSlotChain` fallback(`ChainRenderOpts`). كل key كل يحمل واحد declaration epoch، هو فقط في إعلان و إزالة وقت تمرير زيادة؛`ui-renderer` سوف ذلك لأجل `ctx.slots.inject`، كما و عادي بند إصدار متبادل متبادل مستقل. فوري فحص استخدام صارم إطار `type: 'slot' | 'factory'` عقدة، و يأخذ Factory-owned child Slots تضمين طقم في ذلك definition تحت.

### مصير اتفاق

`renderer.ts` يحمل تثبيت اتفاق (`SlotRenderer`،`SlotRendererHost`) و `StaleAuthorizationError`/`SlotOwnershipError`؛ui-renderer مسؤول تنفيذ، و في ذلك إضافة دورة الحياة في إتمام تثبيت. جذب محرك ناتج و مصير مضيف اتفاق يحمل عار لقطة source(`getSnapshot`/`subscribe`) ، أبدا يحمل React خطاف——خطاف ربط يخص تصيير آلية.Factory انهيار انهيار استخدام عادي مراقبة إشراف عبر طريق، قوة انتظار effect فقط في commit بعد إبقاء تدريجي تصيير موضع Store handle.

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

التالي صفحة تغطية جذب محرك، مصير و تركيب نموذج.

- [ui-renderer](../ui-renderer/README.ar.md)——تنفيذ هذه الحزمة تثبيت اتفاق React slot مصير.
- [slot نظام معيار](../../../.agents/notes/implemented/architecture/2026-07-22-slot-type-chain-implementation.ar.md)——مرجعي تركيب نموذج.
- [Component Factory](../../../.agents/notes/implemented/architecture/2026-09-10-component-factories-and-local-slots.ar.md)——يمكن إعادة استخدام definitions، نطاق جزء Component اختيار و occurrence دورة الحياة.
- [Web عميل هيكل بنية](../../../.agents/notes/implemented/architecture/2026-07-19-gui-web-client-architecture.ar.md)——هذا سجل التسجيل وصل دخول تحميل سلسلة و كائن طبقة.

-----

<a id="model-experience"></a>
## تجربة النموذج

بلا. هذا حزمة هو متصفح طرف UI وصل خط طبقة، لا تسجيل أي موجه إلى نموذج محتوى.

#### KV Cache أثر

بلا؛ هذا حزمة حيث لا تجميع أيضا لا إرسال مزود طلب.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>


هذه حد تعريف سجل التسجيل قاعدة نموذج توسيع خاص صفة و قد قبول نوع ضجيج صوت؛ هو جمع هو حالي حزمة قيد.

- **`isLive` سوف خط صفة مسح كل سجل**: في UI إضافة تسجيل قاعدة نموذج (عدد عشرة بند) تحت لا يوجد مشكلة؛ إذا حساب هذا تغيير نيل تردد كثيف وصول، مجددا استخدام بند→سجل عكس نحو مرجع تعديل دخول.
- **`__renders` وهم كائن مرساة نقطة في `PropsRenderSlots` فوق مرئي**: هذا هو و نوع سلسلة تصميم `__accepts` نفسه كما قد قبول ضجيج صوت؛ عام نوع طريقة توقيع في key ربط دمج بين مقارنة مقارنة عرض رخو، لذلك يجب اعتماد اعتماد عكس تغيير علامة قوي صنع تنفيذ «مكون key تجميع دمج ⊆ children إعلان».

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

**وقت التشغيل ثابت صيغة:** لا إصدار مرافق توليد مدخل. هذا هو صفر اعتماد صاف سجل التسجيل نواة قلب، ذاته لا إرسال خروج Cordis حدث؛`ui-renderer` SlotRegistry مسؤول حدث جسر و ذلك ثابت صيغة. هذه الحزمة سلوك مواصفة مباشر تأكيد define/register/dispose تنفيذ ترتيب.
