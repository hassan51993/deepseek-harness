---
description: "متصفح UI مصير: عادي Slot و يمكن إعادة استخدام Component Factory React ربط،ctx.uiRenderer و تجميع بعد dsh Web تطبيق أصل."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-renderer

[English](README.md) | العربية

## عام وصف

`dsh-client-ui-renderer` تركيب تجميع إتمام dsh Web عميل GUI: كامل عميل إضافة اسم سجل مستقر بعد، بدء داخل نواة استدعاء `ctx.uiRenderer.mount(container)`، هو سوف hydrate لا اعتماد إطار هيكل بدء صفحة، و في تحت مرة رسم صنع قبل تبديل إلى كامل React تطبيق. عمل خدمة إضافة ما زال هو استقبال نوع تحويل props عادي React مكون، عبر props نيل أخذ جلسة و Workspace بيانات، دائم بعيد لا حاجة ذاتي سطر وصل خط حجز قراءة——مصير في slot outlet موضع يأخذ وقت التشغيل عار observable source ربط لـ selector خطاف.Web خارج قشرة و بدء داخل نواة هو هو فقط لديه مباشر مستهلك، لذلك فقط يلزم تركيب حاجة React تصيير GUI، حينئذ حاجة هو.

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

هذه الحزمة يخص أساس أساس ضبط تطبيق:Web خارج قشرة و بدء داخل نواة هو هو فقط لديه مباشر مستهلك. فقط يلزم تركيب حاجة React تصيير GUI، حينئذ حاجة هو——`dsh-client-web` تحميل اسم سجل، انتظار كل entry تنشيط، لكن بعد استدعاء `ctx.uiRenderer.mount(container)`.

### تركيب فعل ماذا

`mount(container)` سوف تثبيت slot مصير، في وجود وقت hydrate قائم بدء DOM، في تحت مرة رسم صنع قبل يأخذ تجميع بعد تطبيق تصيير دخول حاوية، و إرجاع واحد إزالة React أصل disposer. مصير تنفيذ كل برنامج وحيد مرة سياق درجة `renderSlot('root')` استدعاء؛ تسجيل أصل احتلال استخدام جهة يملك منتج تخطيط و وثيقة بيانات وصفية.

### مقابل عمل خدمة إضافة

عمل خدمة إضافة تسجيل عادي Slot entry أو يمكن إعادة استخدام Component Factory؛ مصير في تصيير موضع يأخذ وقت التشغيل جلسة و Workspace observable source ربط لـ selector خطاف. إضافة عبر دفع توجيه خروج Component props استلام إلى معيار scope props——هو أبدا استيراد مصير، أيضا لا لمس اصطدام React داخلي آلية. كل من renderer إنشاء Component كل قدرة تصيير Factory occurrence،Factory أيضا قدرة كشف من استدعاء جهة اختيار نطاق جزء Component، بينما بلا حاجة في حزمة بين مشترك تنفيذ قيمة.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

هذه الحزمة تنفيذ واحد بند حد: كائن طبقة (وقت التشغيل، بلا React) يملك عمل خدمة حالة؛ هذا داخل هو ctx إلى React تجميع صار وحيد حدوث موضع——slot مصير،`SessionProvider` و `useSyncExternalStore` مهايئ.

### تنشيط و تركيب

إضافة في `slots`،`sessions` و `layout` حينئذ خيط بعد تنشيط؛ هو تثبيت `createSlotRenderer()` و reflect `uiRenderer` خدمة.`mountApp` سوف فحص بحث بدء داخل نواة `[data-dsh-boot]` عنصر عنصر: وجود وقت مرور `BootHandoff`(واحد إبقاء تحميل DOM مفرد لقطة نفاذ نقل)hydrate، لا فإن إنشاء كل جديد أصل عقدة و تزامن إيداع تصيير.

### Slot ربط

`createSlotRenderer` يأخذ slot سجل التسجيل اتصال إلى React: عادي entry list و Factory definition يصبح استجابة صيغة source، كل outlet أو occurrence مرور قد تثبيت مصير تصيير. عمل خدمة إضافة عبر حمل نوع `hooks` نقل تمرير عار observable source؛ مصير مرور uSES مهايئ في تصيير موضع إتمام ربط.Factory Store factory إبقاء lazy، مباشر إلى occurrence أول مرة شيء تحويل وقت عندئذ إنشاء handle؛ ذلك exclusive handle رفض حفظ دائم، تصيير مدة سجل إبقاء ضعيف مرجع، قوة انتظار effect فقط قوي مرجع mounted occurrences، معا في effect replay خلال إبقاء identity.Factory خطأ استخدام عادي مراقبة إشراف عبر طريق كما لن abdicate مشترك definition:definition و ذلك fallback نطاق جزء Component فشل ملكية definition، استدعاء جهة الذي اختيار نطاق جزء Component فشل ملكية استدعاء جهة registration، كل حد مع ذاته scope incarnation إعادة وضع.

### هوية

React،React DOM،Cordis،ui-slots و ui-primitives عبر Web خارج قشرة ساكن حالة وحدة جدول إبقاء نفس متصفح هوية؛ هذه الحزمة فإن بـ حركة حالة عميل bundle شكل صيغة تحميل.

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

التالي صفحة تغطية دورة حافة آلية و تركيب نموذج.

- [ui-slots](../ui-slots/README.zh.md)——هذا مصير ربط إلى React slot سجل التسجيل صاف نواة قلب.
- [web](../web/README.zh.md)——تحميل اسم سجل و استدعاء `mount` خارج قشرة.
- [ui-session](../ui-session/README.zh.md)——توفير هذا مصير الذي ربط معيار جلسة source و خطاف مهايئ.
- [Web عميل هيكل بنية](../../../.agents/notes/implemented/architecture/2026-07-19-gui-web-client-architecture.zh.md)——تحميل سلسلة، كائن طبقة و قسم طبقة أحمر خط.
- [slot نظام معيار](../../../.agents/notes/implemented/architecture/2026-07-22-slot-type-chain-implementation.zh.md)——مرجعي تركيب نموذج.
- [Component Factory](../../../.agents/notes/implemented/architecture/2026-09-10-component-factories-and-local-slots.zh.md)——يمكن إعادة استخدام definitions، نطاق جزء Component اختيار و occurrence دورة الحياة.

-----

<a id="model-experience"></a>
## تجربة النموذج

بلا. هذا حزمة هو متصفح طرف تصيير تجميع طبقة، لا تسجيل أي موجه إلى نموذج محتوى.

#### KV Cache أثر

بلا؛ هذا حزمة حيث لا تجميع أيضا لا إرسال مزود طلب.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>


هذه حد شرح تطبيق أول لقطة أي وقت ظهور، حسب منطقة مجال حينئذ خيط قدرة مشي كثير بعيد؛ هو جمع هو حالي حزمة قيد.

- **تطبيق أول لقطة سوف انتظار الكل عميل entry**: بدء داخل نواة فقط في loader اسم سجل مستقر بعد تسليم خروج تركيب نقطة؛ حسب منطقة مجال حينئذ خيط ما زال تابع مؤقت مؤقت أمر بند.
- **slot تصيير لا يوجد Suspense تجميع صار أو تدريجي entry كسول صفة تحميل**: كامل إضافة اسم سجل مستقر بعد، مصير عندئذ تركيب أصل عقدة.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
