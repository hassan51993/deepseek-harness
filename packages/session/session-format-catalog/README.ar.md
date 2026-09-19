---
description: "توفير حفظ دائم قراءة جهة استخدام بناء مدة ساكن حالة رقم واحد جهة Session صيغة تحرير حل رمز جهاز و متبادل مجاور ترحيل تركيب إعداد."
kind: "package-library"
---

# @deepseek-ai/dsh-session-format-catalog

[English](README.md) | العربية

## عام وصف

`dsh-session-format-catalog` لـ حفظ دائم توفير واحد تحديد صفة Session صيغة قراءة جهاز، كما بلا حاجة استعلام قد تركيب إضافة. هو تركيب إعداد من الأكثر مبكر تلقي دعم حمل صيغة إلى[حالي كتابة صيغة](../../../docs/session-format-status.ar.md) تحرير حل رمز جهاز و متبادل مجاور ترحيل حافة، في وحدة ابتدائي تحويل وقت تحقق كامل كما بلا نقص فتحة ترحيل سلسلة، و عبر `sessionFormatCatalog` كشف شيء إدارة قسم إرسال، فقط header تصنيف، مفرد مرة سطر أيضا أصل و حالي صيغة تدريجي سجل تحرير رمز.

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

عند حفظ دائم و اختبار دعم حمل قراءة جهة حاجة في أي وظيفة إضافة تركيب قبل أخذ نيل كامل رقم واحد جهة قد إصدار صيغة بيان وقت، استيراد هذا مكتبة. وظيفة تركيب لن تسجيل أو إعادة ترتيب ذلك بند. هو لا إصدار وقت التشغيل ثابت صيغة مرافق توليد مدخل، لأن بنية صنع مرور مسار سوف رفض بلا فاعلية ساكن حالة بيان، كل مرة إتمام أيضا أصل أيضا سوف تحقق نتيجة؛ متغير سطر decoder حالة فقط يخص مرة من استدعاء جهة يحتفظ تدفق صيغة أيضا أصل.

### مدخل

```text
const descriptor = sessionFormatCatalog.readHeader(physicalHeader)
const restore = sessionFormatCatalog.createRestore(physicalHeader, { recovery: 'recoverable', validation: 'transformed' })
for (const row of physicalRows) restore.decodeRow(row)
const current = restore.finish()
const headerRecord = sessionFormatCatalog.encodeCurrentHeader(current.header, current.inheritedEventCount)
const eventRecords = current.events.map(sessionFormatCatalog.encodeCurrentEvent)
```

من حزمة أصل استيراد `sessionFormatCatalog`.JSONL و fixture(اختبار قبل وضع بيانات) قراءة جهة إنشاء مرة restore، يأخذ كل قد تحليل شيء إدارة سطر نقل إعطاء `decodeRow()`، مجددا استدعاء مرة `finish()`.Writer عبر `encodeCurrentHeader()` و `encodeCurrentEvent()` تسلسل تحويل إرجاع حالي ناتج. قائمة قراءة استدعاء `readHeader()`، أبدا فتح حدث متن.

Production تاريخ قراءة استخدام `{ recovery: 'recoverable', validation: 'transformed' }`.Worker و fixture تحقق استخدام `{ recovery: 'strict', validation: 'current' }`.Transformed validation سوف في ترحيل بعد تنفيذ قد إصدار current قاعدة، لكن مقابل قد هو current إدخال متعمد قفز مرور قد تثبيت دلالة تحقق.

هذا دليل مباشر يتضمن كل تلقي دعم حمل تاريخ قراءة جهاز.Profile لا يمكن عبر تركيب وظيفة إضافة قدوم إضافة، إزالة أو إعادة ترتيب صف ترحيل حافة. هو عبر مقابل `dsh-session` مقابل انتظار اعتماد (peer dependency) نيل نيل قد تثبيت حالي حدث كلمة جدول و حالي أيضا أصل قاعدة، بينما تاريخ ترحيل حافة تحقق جهاز إبقاء تجميد ربط. متصفح أمان `./message-projections` توجيه خروج لـ مستقل بنية صنع دالة و surface طي تركيب إعداد حالي إضافة يملك معالج، لا تركيب استعادة مستمع.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

[`src/generated.ts`](src/generated.ts) هو تحرير حل رمز جهاز و ترحيل حافة ترتيب ساكن حالة كل من.[`src/current.ts`](src/current.ts) يأخذ نهائي علامة رأس، حدث معلومة غلاف، رسالة، جدول وجه، نوع فرعي و حالي طلب علامة رأس تحقق تفويض حمل إعطاء قد تثبيت Session دلالة. قاع طبقة بنية صنع دالة سوف في بدء قراءة أي Session قبل رفض تكرار تحرير حل رمز جهاز، تكرار ترحيل حافة، نقص فتحة، و تجاوز مرور حالي إصدار بند.

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

- [ترحيل آلية](../session-format/README.ar.md)——دليل بنية صنع و قسم إرسال سلوك.
- [قد إصدار v0 إلى v1 ترحيل حافة](../session-format-v0-to-v1/README.ar.md)——تحرير حل رمز جهاز و تحقق جهاز كل حق.
- [قد إصدار v1 إلى v2 ترحيل حافة](../session-format-v1-to-v2/README.ar.md)——Assistant تدفق تضمين دخول و أساس عدد تغير مرجع إعادة خريطة.
- [قد إصدار V2 إلى V3 مواصفة](../session-format-v2-to-v3/README.ar.md#v2-to-v3-specification)——تحويل، إبقاء و رفض.
- [JSONL حفظ دائم](../session-persistence-jsonl/README.ar.md)——غير ممكن تغيير generation تسمية و ترتيب هو إصدار.

-----

<a id="model-experience"></a>
## تجربة النموذج

### دليل قسم إرسال

#### نموذج يرى ماذا

لا يوجد مباشر محتوى. هذا دليل فقط أيضا أصل من طلب إعادة بناء منطق إزالة استهلاك `SessionEvent` تاريخ.

#### Token أثر

لا مباشر إنتاج token.

#### KV Cache أثر

لا يوجد مباشر أثر؛ أيضا أصل بعد تاريخ في ذلك مستهلك في قرار ذاكرة مؤقتة هوية.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

- **فقط يتضمن رقم واحد جهة بناء بيان**——بعد لا دعم حمل خارجي ترحيل كل حق و توزيع.
- **توليد ترتيب غلاف إغلاق**——وقت التشغيل إضافة تسجيل لا يمكن تكملة ملء ناقص تاريخ ترحيل حافة.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
