# Agent Note: إصلاح pwsh طرفية overlay تكرار loader اندفاع مفاجئ

Status: implemented
Archived: 2026-09-04

[English](2026-08-12-fix-pwsh-terminal-overlay-dup.md) | العربية

## Problem

`apps/web/tests/pwsh-terminal.e2e.ts` في كل منصة فوق كل بـ `TypeError: duplicate loader entry id: tool-pwsh` فشل، من `vendor/loader/src/config/group.ts:64` في تطبيق web تركيب وقت رمي خروج. هذا فشل seed عبر طريق سوف بدء كامل إصدار bundle إضافة واحد اختبار overlay، لذلك E2E دائم بعيد إلى لا تصيير تأكيد، توجيه يؤدي `check:ci:snapshot` و `test:web` كل مرة تشغيل كل تقرير واحد أحمر web اختبار، أي سهل يتم قياس وظيفة و مراجعة في تعديل غير متصل.

web E2E scaffold في قد إصدار Web جدول وجه و base patches بعد تطبيق `extraOverlayPath`.`pwsh-terminal.overlay.yml` استخدام `insert` كتلة إضافة جديدة `tool-pwsh` سطر:

```yaml
- insert:
    - id: pwsh-local
      name: '@deepseek-ai/dsh-pwsh-local'
    - id: tool-pwsh
      name: '@deepseek-ai/dsh-tool-pwsh'
```

`insert` فقط في تركيب في لا وجود `tool-pwsh` وقت عندئذ صحيح تأكيد. هذا id وجود هو لأن `86b6979bdc`(refactor(bundle): fold the Windows shell platform layer into the base rows) يأخذ اثنان طقم shell مكدس بـ متبادل عكس منصة باب نقل دخول base bundle —— `packages/bundle/base/cordis.patch.yml` إعلان `tool-pwsh` كما `disabled: !!js process.platform !== 'win32'`، في هو هذا سطر في كل منصة كل وجود في تركيب في. مع بعد `42fc7c5ffb`(refactor(preset): gate tool-pwsh by platform alongside tool-bash) نحو web-app patch داخل إضافة واحد سطر مقابل استخدام preset جدول وجه منع استخدام `tool-pwsh` سطر؛patch لا يستطيع جذب دخول id، لذلك هو لا هو اندفاع مفاجئ مصدر.overlay `insert` في هو في نفس عدد loader مجموعة داخل مجددا إرسال واحد نفس id سطر،loader في بدء وقت رفض هذا مقابل تكرار.

## Decision

يأخذ overlay مقابل `tool-pwsh` `insert` استبدال صار قمة طبقة حسب id override:

```yaml
- id: tool-pwsh
  name: '@deepseek-ai/dsh-tool-pwsh'
  disabled: false
```

صالح `tool-pwsh` حالة هو ثلاثة طبقة مكدس:base سطر يأخذ `disabled` باب في `process.platform !== 'win32'` فوق،web-app overlay مقابل preset جدول وجه بلا شرط ضبط `disabled: true`، هذا عبر طريق override بلا نقاش منصة كل يأخذ `disabled: false` أيضا عودة ذهاب.`id` تحديد موضع قمة طبقة override استبدال تركيب بعد سطر؛ فقط لديه `insert` عندئذ سوف متبادل اصطدام.

هذا عبر طريق الآن أيضا حسب id منع استخدام `pwsh-sandbox`، و قائم `bash-sandbox` منع استخدام مقابل تسمية:base بـ `disabled: !!js process.platform !== 'win32'` باب إقامة `pwsh-sandbox`، لذلك في Windows فوق هو هذا سوف و إدراج دخول `pwsh-local` و تخزين، اثنان من سوف تسجيل نفس عدد executor خدمة. منع استخدام هو يجعل `pwsh-local` في كل منصة فوق كل هو وحيد executor.

overlay رأس جزء ملاحظة تفسير قد تحديث لـ كامل وصف اختيار،`tool-pwsh` سطر داخل ملاحظة تفسير الآن يأخذ base سطر علامة لـ هذا id مصدر.

## Alternatives considered

**إبقاء `insert`، تعديل web تركيب.** رفض. قد إصدار web تركيب ينبغي في كل استخدام preset جدول وجه فوق إبقاء host `tool-pwsh` سطر منع استخدام؛overlay عندئذ هو ذلك بند لحظة معنى حاجة هذا سطر عبر طريق، لذلك حسب id تفعيل ينبغي وضع في ذلك داخل.base سطر ذاته أيضا لا يستطيع إزالة: هو هو كل bundle مشترك منصة باب shell مكدس إعلان.

**في `insert` كتلة داخل تفعيل `tool-pwsh`.** غير ممكن سطر. مقابل قد وجود id فعل `insert` صحيح هو هذا داخل يلزم إصلاح تكرار. هذا سطر يجب حسب id تحديد موضع، أي قمة طبقة override شكل صيغة، بينما غير `insert`.

**فقط حسب id تعديل `tool-pwsh` بينما لا ضبط `disabled: false`.** لا ملء قسم.web-app بلا شرط ضبط `disabled: true`،base سطر منصة باب فقط في web-app override ناقص موضع توليد فاعلية، لذلك فقط إعادة تقديم `name` override سوف يجعل سطر إبقاء منع استخدام، عبر طريق تصيير لا خروج طرفية بطاقة.`disabled: false` هو مطلوب.

**فقط منع استخدام `bash-sandbox`، اعتماد منصة باب يجعل `pwsh-sandbox` إبقاء إغلاق.** رفض. في POSIX فوق صار قيام، لكن في Windows فوق سوف فشل:base سطر يجعل `pwsh-sandbox` تفعيل، هو سوف و إدراج دخول `pwsh-local` في مشترك executor خدمة فوق متبادل اصطدام. هذا عبر طريق منع استخدام `pwsh-sandbox` يجعل كل منصة فقط لديه وحيد executor.

## Verification

يأخذ إصلاح أيضا أصل (استعادة مقابل `tool-pwsh` `insert`) أي تكرار الآن نفس مثال `duplicate loader entry id: tool-pwsh` بدء فشل، إثبات فعلي override هو صالح. إصلاح بعد نفس head فوق `pwsh-terminal.e2e.ts` 2/2 عبر —— هذا أثر في POSIX seam، بث نوع pwsh استدعاء مرور تفعيل `tool-pwsh` و إدراج دخول `pwsh-local` تصيير خروج قدوم. هذا seed عبر طريق حاجة متاح `pwsh`، بلا هذا اثنان دخول صنع رئيسي آلة سوف قفز مرور؛ هذا آلة لديه `pwsh`، اختبار فعلي ركض مرور.Windows مسار (base `pwsh-sandbox` و إدراج دخول `pwsh-local` و تخزين) لا يوجد أي CI lane تغطية، ذلك `test:web` فقط في Linux فوق ركض؛overlay منع استخدام `pwsh-sandbox` يجعل هذا مسار في حق إلى Windows تطوير آلة وقت التشغيل يمكن تركيب.

## Consequences

لأجل تنفيذ PowerShell بدء web E2E seed عبر طريق الآن قدرة تركيب بينما غير متبادل اصطدام، لذلك `check:ci:snapshot` و `test:web` لم يعد و يتم قياس تعديل غير متصل أرض في هذا duplicate فوق فشل. هذا نمط أداة لديه عام صفة:`--patch`/`extraOverlayPath` overlay في قرار استخدام `insert` أيضا هو حسب id override قبل، يجب استكشاف قياس هدف bundle هل قد وجود هذا سطر؛ مقابل قد من base أو قد إصدار Web جدول وجه إعلان id فعل `insert`، هو بدء مدة تكرار.
