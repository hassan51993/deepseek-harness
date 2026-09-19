---
description: "تجميد ربط قد إصدار v0 جلسة علامة رأس، حدث و تحزيم سطر حل رمز جهاز، و إلى v1 ثابت انتظار تحويل."
kind: "package-library"
---

# @deepseek-ai/dsh-session-format-v0-to-v1

[English](README.md) | العربية

## عام وصف

هذه الحزمة تدريجي عدد شيء إدارة سطر حل رمز قد إصدار v0 جلسة JSONL، و توليد مشترك تخطيط v1 صيغة، بـ أيضا أصل تاريخ جلسة. حذف يأخذ إصدار من 0 تعديل لـ 1 خارج، هو سوف إبقاء مرور مرور تحقق علامة رأس و حدث، و فقط تطبيق v0 حفظ دائم قبول لديه حد قديم صيغة مواصفة تحويل. شاذ شكل أو لا دعم حمل تاريخ سجل سوف في حالي أيضا أصل جهاز تشغيل قبل جعل ترحيل فشل، معا إبقاء مصدر ملف بـ سهل استعادة. هذا ترحيل فقط قبول تجميد ربط رقم واحد جهة حدث بيان، كما لا إصدار أو اختيار لاحق صيغة ترحيل.

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

### أي وقت استخدام

حفظ دائم عبر `dsh-session-format-catalog` نيل أخذ هذا ترحيل حافة؛ وظيفة تركيب لن تركيب هو. فقط لديه في تركيب إعداد أو اختبار ساكن حالة قد إصدار صيغة دليل وقت، عندئذ مباشر استيراد هذه الحزمة. هو لا إصدار وقت التشغيل ثابت صيغة مرافق توليد مدخل، لأن هذه الحزمة لا يوجد حالة ممكن ذاك هذا قسم اختلاف، يمكن مستقل مراقبة قياس وقت التشغيل تسجيل بند؛decoder و migration stage حالة فقط يخص مرة أيضا أصل.

### مدخل

```text
const decoder = releasedV0SessionFormatCodec.createDecoder(physicalHeader, 'recoverable')
for (const row of physicalRows) decoder.decodeRow(row, migrationContext)
const inheritedEventCount = decoder.finish(migrationContext)
const stage = sessionFormatV0ToV1.createStage(stageInput)
stage.transformEvent(event, migrationContext)
const targetInheritedEventCount = stage.finish(migrationContext)
```

`releasedV0SessionFormatCodec` قراءة دقيق v0 header و شيء إدارة سطر، يشمل تحزيم Assistant زيادة كمية و نطاق تحرير رمز مصدر ترتيب رقم. هو decoder عبر `emitEvent()` و `emitRun()` إرسال خروج مفرد عدد حدث أو codec ذاتي لديه ضيق تجميع run.`sessionFormatV0ToV1` لـ كل مرة أيضا أصل إنشاء واحد لديه حالة Stage؛ ساكن حالة catalog اتصال هذا decoder و Stage، جعل ترحيل بلا حاجة إبقاء شيء إدارة سطر عدد مجموعة.`releasedV1SessionFormatCodec` لـ v1 شيء إدارة تخطيط كشف نفسه تدريجي سطر decoder، معا لا تجميد ربط عادي حدث كلمة جدول.

Alpha ترحيل حافة سوف رفض تجميد ربط بيان خارج كل حدث نوع، يشمل حمل لديه `ignorable: true` علامة لم معرفة حدث. هو أيضا سوف رفض معنى خارج payload عضو.`tool/result.meta` و تضمين طقم PTC `arguments` هو صريح لا نفاذ واضح JSON حقل؛ ترحيل سوف أصل مثال إبقاء هو جمع، لا يأخذ منها عدد حرف حل تفسير لـ جلسة ترتيب رقم. محتوى كتلة في لم معرفة `type` فرع، رسالة مصدر في لم معرفة `kind` فرع،assistant انتهاء سبب في لم معرفة `kind` فرع و `turn/end` سبب في لم معرفة `kind` فرع إبقاء owner-opaque JSON، معروف فرع فإن قبول بنية تحقق.

لديه حد تاريخ مواصفة تحويل سوف يأخذ `steering/message` تحويل لـ `user/message`، يأخذ `compact/*` حدث إعادة تسمية لـ `compaction/*`، إزالة `turn/start.trigger`، تحويل قد توقف استخدام `turn/end` reason، إضافة حالي رسالة حزمة تركيب طبقة، و لـ قديم رسالة،retry chain و ضغط (compaction) مجموعة تكملة ملء تحديد صفة id، معا إزالة قد توقف استخدام كما تكرار `request/header.header.messagePrefix`. قد توقف استخدام `request/header-delta`،`mode/set` و `request/header` fallback reason سوف جعل ترحيل فشل. حذف هذا خارج، أي حدث، مرجع، مصدر أو payload واقع كل لا نيل تغيير.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

شيء إدارة codec سوف بـ سلوك أصل فرعي مفرد موضع تحقق كل تحزيم سطر، بـ ضيق تجميع run إرسال خروج هو، كما أبدا تعديل قد تحليل إدخال. يمكن استعادة حل رمز سوف إسقاط كامل لذا عائق سطر و إبقاء هذا قبل بادئة، حذف غير لاحق نجاح حل رمز `turn/end` إثبات لذا عائق منطقة مجال قد إيداع. زيادة كمية normalizer فقط إبقاء message،retry و لم انتهاء ضغط identity؛catalog سوف في نهائي حالي ناتج فوق تنفيذ كامل علاقة تحقق.

| ملف | مسؤولية |
|---|---|
| [`src/codec.ts`](src/codec.ts) | تجميد ربط v0/v1 شيء إدارة علامة رأس، تحزيم سطر و مصدر ترتيب رقم نطاق |
| [`src/dispositions.ts`](src/dispositions.ts) | قد إصدار v0 حدث و payload عضو بيان |
| [`src/payload-validation.ts`](src/payload-validation.ts) | كل نوع قد إصدار v0/v1 حدث نوع تجميد ربط تضمين طقم payload دلالة |
| [`src/relationships.ts`](src/relationships.ts) | تجميد ربط عبر حدث إعداد مقابل: جولة، خطوة، أداة بدء و نتيجة، إعادة محاولة، ضغط، عنوان |
| [`src/migration.ts`](src/migration.ts) | ثابت انتظار ترحيل حافة و قديم صيغة مواصفة تحويل |
| [`src/validation.ts`](src/validation.ts) | دقيق مصدر و هدف تحقق |

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

- [ترحيل آلية](../session-format/README.zh.md)——صاف ترحيل سلسلة و تحرير حل رمز اتفاق.
- [ساكن حالة دليل](../session-format-catalog/README.zh.md)——من بناء مسؤول تركيب إعداد.
- [جلسة فرعي نظام](../../../docs/subsystems/session.zh.md)——حالي منطق جلسة دلالة.

-----

<a id="model-experience"></a>
## تجربة النموذج

### تاريخ أيضا أصل

#### نموذج يرى ماذا

لا يوجد مباشر محتوى. أيضا أصل بعد،`deriveMessages()` سوف يرى في v1 تحت إبقاء ثابت مواصفة قد إصدار v0 حدث؛ لديه حد تاريخ بنية سوف عبر قاعدة تحديد حالي حزمة تركيب طبقة إنتاج نفسه نموذج مرئي محتوى.

#### Token أثر

لا مباشر إنتاج token.

#### KV Cache أثر

مقابل مواصفة v0 تاريخ لا يوجد مباشر أثر. لديه حد normalizer سوف في توليد حالي حزمة تركيب طبقة و تحديد صفة معرف وقت إبقاء نموذج مرئي محتوى.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

- **غلاف إغلاق رقم واحد جهة بيان**——حسب وفق حالي Alpha سياسة، لم معرفة خارجي إضافة حدث سوف جعل ترحيل فشل.
- **مفرد عدد متبادل مجاور ترحيل حافة**——هذه الحزمة لا تنفيذ إصدار، أيضا لا اختيار لاحق ترحيل.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
