---
description: "صاف دالة صيغة متبادل مجاور جلسة صيغة قاعدة تخطيط، بلا ضرر JSON قيمة فحص، فقط علامة رأس ترحيل و شيء إدارة تحرير حل رمز قسم إرسال."
kind: "package-library"
---

# @deepseek-ai/dsh-session-format

[English](README.md) | العربية

## عام وصف

`dsh-session-format` يجعل حفظ دائم شفرة يمكن مباشر أيضا أصل حالي جلسة، أو في فقط إزالة استهلاك مرة شيء إدارة سطر معا تركيب وحيد متبادل مجاور ترحيل تسلسل. مرة أيضا أصل سوف يجعل استدعاء جهة يملك قد تحليل قيمة تدفق مرور لديه حالة Stage، لا نسخ أو تجميد ربط في بين ناتج. شيء إدارة قسم لقطة، ضغط، غير ممكن تغيير generation تسمية، ترتيب هو إصدار و Cordis دورة الحياة سلوك لا يخص هذا مكتبة.

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

عند حفظ دائم أو صيغة دليل شفرة حاجة تصنيف شيء إدارة جلسة header، أيضا أصل حالي منطق قيمة أو تركيب قد إصدار متبادل مجاور ترحيل وقت، استخدام هذا مكتبة. هو لا هو Cordis إضافة، أيضا لا يوجد profile تركيب سطر. هو لا إصدار وقت التشغيل ثابت صيغة مرافق توليد مدخل، لأن كل قد إتمام عملية كل سوف تحقق نتيجة؛decoder و transformer حالة فقط يخص مرة بعد لم إتمام تدفق صيغة أيضا أصل، أبدا في كثير مرة أيضا أصل بين مشترك.

### مدخل

```text
const catalog = createSessionFormatCatalog({ currentVersion, codecs, currentEncoder, migrations, restoreCurrent, restoreTransformedCurrent, restoreCurrentHeader })
const descriptor = catalog.readHeader(physicalHeader)
const restore = catalog.createRestore(physicalHeader, { recovery: 'recoverable', validation: 'transformed' })
for (const row of physicalRows) restore.decodeRow(row)
const current = restore.finish()
const headerRecord = catalog.encodeCurrentHeader(current.header, current.inheritedEventCount)
const eventRecords = current.events.map(catalog.encodeCurrentEvent)
```

`createSessionFormatCatalog()` استقبال كل تلقي دعم حمل إصدار واحد تجميد ربط codec، حالي صيغة تدريجي سجل encoder، كل مجموعة متبادل مجاور إصدار واحد ترحيل، و حالي ناتج و header أيضا أصل جهاز.`readHeader()` في لا قراءة حدث حال حال تحت إرجاع `current`،`migration-required`،`unsupported` أو `malformed` وصف رمز. متن قراءة جهة إنشاء مرة restore، يأخذ كل قد تحليل شيء إدارة سطر نقل إعطاء `decodeRow()`، مجددا استدعاء مرة `finish()` نيل نيل حالي ناتج. كتابة جهة تدريجي بند تحرير رمز ذلك header و حدث.

`recovery` خيار قرار صارم إطار رفض لذا عائق سطر، أيضا هو تنفيذ يمكن استعادة بعد لاحقة معالجة.`validation: 'current'` سوف تنفيذ كل قد تثبيت current صيغة تحقق.`validation: 'transformed'` سوف في تاريخ ترحيل بعد تنفيذ قد إصدار current صيغة تحقق؛ قد هو current إدخال فإن فقط قبول ذلك codec شيء إدارة تحقق.

يمكن استعادة حل رمز جهاز إرجاع قد قبول منطق بادئة. تحرير حل رمز جهاز يمكن إسقاط واحد صيغة خطأ أو ترتيب رقم لا وصل متابعة سطر و ذلك لم إيداع بعد لاحقة، لكن لاحق نجاح حل رمز `turn/end` سوف جعل أصلي مشكلة يصبح يؤدي أمر خطأ.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

ترحيل سلسلة في بنية صنع وقت تحقق وحيد كما بلا نقص فتحة ترتيب. مصدر قطع نقطة يمكن في EOF قبل إبقاء لم معرفة؛ اعتماد رأس جزء قطع نقطة Stage رفض ناقص قيمة، بينما أساس في علامة Stage من قد إرسال خروج حدث دفع توجيه قطع نقطة. كل Stage في إتمام وقت إرجاع دقيق هدف قطع نقطة، كما يجب و مسبق إعلان قطع نقطة متسق.Catalog يأخذ واحد سطر decoder و لديه حالة متبادل مجاور حدث transformer تركيب بدء قدوم، فقط إبقاء ذلك محدود حالة و نهائي حالي حدث، و في `finish()` وقت تنفيذ هدف تحقق؛ فقط لديه استدعاء جهة قرار هل إصدار هذا نتيجة و مثل أي إصدار.

| ملف | مسؤولية |
|---|---|
| [`src/chain.ts`](src/chain.ts) | متبادل مجاور حساب تخطيط بنية صنع و حالي صيغة التفاف مرور |
| [`src/catalog.ts`](src/catalog.ts) | شيء إدارة إصدار قسم إرسال و علامة رأس تصنيف |
| [`src/json.ts`](src/json.ts) | قسم مغادرة بلا ضرر JSON لقطة و عام جلوس علامة تحقق |
| [`src/filename.ts`](src/filename.ts) | حفظ دائم، توجيه خروج و fixture(اختبار قبل وضع بيانات) مشترك استخدام مواصفة `session[.vN].jsonl` ملف اسم |

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

- [قد إصدار v0 إلى v1 ترحيل حافة](../session-format-v0-to-v1/README.ar.md)——تجميد ربط تاريخ حل رمز و ثابت انتظار تحويل.
- [ساكن حالة دليل](../session-format-catalog/README.ar.md)——رقم واحد جهة تحرير حل رمز جهاز و ترحيل تركيب إعداد.
- [JSONL حفظ دائم](../session-persistence-jsonl/README.ar.md)——حفظ دائم قسم لقطة و بديل حد إصدار.

-----

<a id="model-experience"></a>
## تجربة النموذج

### جلسة أيضا أصل

#### نموذج يرى ماذا

لا يوجد مباشر محتوى. مستهلك عبر `deriveMessages()` من مرور مرور تحقق حالي ناتج إعادة بناء نموذج تاريخ.

#### Token أثر

لا مباشر إنتاج token.

#### KV Cache أثر

لا يوجد مباشر أثر. ترحيل إذا تغيير حالي تاريخ، ممكن تغيير من طلب إعادة بناء منطق يملك ذاكرة مؤقتة هوية.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

- **نهائي حالي تاريخ ما زال معتاد إقامة داخل تخزين**——تدفق صيغة معالجة فقط إبقاء محدود في بين حالة، لكن إرجاع حالي حدث عدد مجموعة و مطلوب ترتيب رقم إعادة خريطة جدول ما زال لـ O(حدث عدد).
- **فقط دعم حمل متبادل مجاور كامل عدد إصدار**——هذا مكتبة لا كشف span، مستقر حدث هوية أو عام مرجع إعادة كتابة بديل عدد.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
