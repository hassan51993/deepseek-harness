---
description: "تجميد ربط قد إصدار v1 Session قراءة جهاز، و يأخذ Assistant تدفق تضمين دخول قد إصدار v2 حدث أساس عدد تغير ترحيل."
kind: "package-reference"
---

# @deepseek-ai/dsh-session-format-v1-to-v2

[English](README.md) | العربية

## عام وصف

`dsh-session-format-v1-to-v2` عبر واحد لديه حالة حدث Stage، يأخذ قد إصدار v1 Session تحويل لـ قد إصدار v2 حدث نموذج. هو سوف إزالة استهلاك قمة طبقة `assistant/chunk` حدث، يأخذ دقيق حمل وقت تدفق تضمين دخول مطابقة `assistant/message`، و في فشل، إعادة محاولة، إلغاء أو stream error attempt قد وصول settlement، لكن لا يوجد إنتاج surface message وقت سجل `assistant/attempt`. هذا ترحيل حافة سوف سري تجميع إعادة خريطة تخزين نشط حدث و كل قد إعلان نفس Session ترتيب رقم مرجع؛v2 codec فإن يجعل كل سطر فقط تخزين واحد حدث، و من حمل علامة `session/end-seed` حدث دفع توجيه وراثة قطع نقطة.

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

حفظ دائم عبر `dsh-session-format-catalog` نيل أخذ هذا ترحيل حافة؛ وظيفة تركيب لن تركيب هو. فقط لديه في تركيب إعداد أو اختبار ساكن حالة قد إصدار صيغة دليل، أو فحص دقيق v1 إلى v2 تحويل وقت، عندئذ مباشر استيراد هذه الحزمة. هو لا إصدار وقت التشغيل ثابت صيغة مرافق توليد مدخل، لأن هذه الحزمة لا يوجد حالة ممكن ذاك هذا قسم اختلاف، يمكن مستقل مراقبة قياس وقت التشغيل تسجيل بند؛decoder و transformer حالة فقط يخص مرة أيضا أصل.

### مدخل

```text
const decoder = releasedV1SessionFormatCodec.createDecoder(physicalHeader, 'strict')
for (const row of physicalRows) decoder.decodeRow(row, migrationContext)
const stage = sessionFormatV1ToV2.createStage(stageInput)
stage.transformEvent(event, migrationContext)
const targetInheritedEventCount = stage.finish(migrationContext)
const headerRecord = releasedV2SessionFormatCodec.encodeHeader(currentHeader, targetInheritedEventCount)
const eventRecord = releasedV2SessionFormatCodec.encodeEvent(currentEvent)
```

`releasedV1SessionFormatCodec` تدريجي سطر قراءة تجميد ربط v1 شيء إدارة لغة.`sessionFormatV1ToV2` إنشاء تغيير حدث أساس عدد Stage، ساكن حالة catalog يأخذ هو اتصال إلى decoder، كما لا إبقاء v1 حدث عدد مجموعة.Catalog سوف إعادة خريطة قد إعلان مرجع، و تحقق released-v2 envelope،inherited cut، حدث دقيق دخول و علاقة. حفظ دائم في إصدار قبل عبر Worker تنفيذ كامل installed-current تحقق.`releasedV2SessionFormatCodec` إنشاء قد إصدار v2 صيغة تدريجي سطر decoder، و تدريجي بند تحرير رمز v2 header و حدث.

نجاح v1 `assistant/message` يجب مرجع ذلك كامل لديه ترتيب attempt. ترحيل سوف إزالة هذه قمة طبقة chunk و قد توقف استخدام message chunk reference، في لا دمج token حد قبل رفع تحت ضغط chunk، و يأخذ stream تخزين إلى هذا message فوق. لم يتم message إقرار قيادة attempt سوف في ذلك الأكثر بعد واحد chunk موضع تغيير صار واحد فقط سجل مرئي `assistant/attempt`. غير متصل تسليم خطأ حدث إبقاء متبادل مقابل ترتيب.

هذا edge أيضا سوف إغلاق دمج واحد نوع لديه حد قديم إصدار استعادة نمط: غير فارغ `next-turn` inbox إدراج دخول بعد مباشر ظهور تحت واحد `turn/start`، لكن نقص قليل قبل واحد جولة `turn/end`؛ ترحيل سوف قبل واحد جولة سجل لـ interrupted. قديم إصدار round-zero goal mutation سوف تغيير صار واحد `goal/change`، مع بعد إبقاء أصل هذا نموذج مرئي message و تعديل استخدام عادي plugin attribution، لذلك حمل دائم goal حالة و تاريخ نموذج إدخال كل سوف إبقاء.

إذا مرجع إشارة نحو يتم إزالة استهلاك chunk، ترحيل سوف فشل، بينما لن يأخذ هو إعادة تحديد نحو إلى دلالة مختلف حدث. هو سوف إعادة خريطة قد إعلان source-event reference،surface replacement،command source event،compaction range و list، و title message list. قد مقابل نموذج مرئي `session/title-llm-request.messages` نص سوف في مصدر تحقق بعد إبقاء تدريجي بايت ثابت، لذلك هدف تحقق لن إعادة حل تفسير هذا prompt في تضمين دخول قديم ترتيب رقم. حمل seed مصدر إذا يجعل وراثة قطع نقطة قطع فتح واحد Assistant attempt، أيضا سوف ترحيل فشل؛ هدف سوف استخدام `session/end-seed { inherited: true }` علامة خروج دقيق قطع نقطة.

v2 شيء إدارة header اشتراط `isSeeded`، كما لا تخزين عدد قيمة قطع نقطة. تحرير حل رمز جهاز من الأكثر بعد واحد inherited end-seed marker دفع توجيه قطع نقطة، كل سطر كتابة واحد حدث، فقط مقابل `sourceEventSeqs` فعل نطاق تحرير رمز، و مقابل عادي حدث مفردات و payload توسيع إبقاء في قيام.Released-current restoration دقيق دخول installed Session package معروف حدث type، و يحمل `ignorable: true` لم معرفة حدث، و تحقق حدث member و علاقة. عادي Session restore فقط فحص runtime مباشر اعتماد settlement حقل، لا إعادة وضع تضمين دخول stream؛persistence publication و تجميد ربط writer-image fixture validator إبقاء كامل stream verification.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

زيادة كمية ترحيل حافة سوف إبقاء واحد بعد لم تسوية Assistant attempt، إخراج موضع أخذ قرار في هذا attempt حدث، و سري تجميع قديم ترتيب رقم إلى جديد ترتيب رقم خريطة. هو حسب مصدر ترتيب إرسال خروج قد تسوية تخزين نشط حدث، و كما فقط إعادة كتابة تجميد ربط حدث بيان إعلان مرجع حقل.Released-current تحقق سوف رفض تحويل لا يمكن إبقاء أي علاقة.

| ملف | مسؤولية |
|---|---|
| [`src/migration.ts`](src/migration.ts) | Attempt قسم مجموعة،settlement استبدال، سري تجميع ترتيب رقم خريطة و مرجع إعادة كتابة |
| [`src/codec.ts`](src/codec.ts) | قد إصدار v2 header، كل سطر واحد حدث تحرير رمز،source-event نطاق و يمكن استعادة بادئة حل رمز |
| [`src/validation.ts`](src/validation.ts) | v2 شيء إدارة envelope/cut تحقق، و released-current حدث دقيق دخول و علاقة تحقق |
| [`src/dispositions.ts`](src/dispositions.ts) | تجميد ربط قد إصدار v2 حدث و payload عضو بيان |

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

- [قد إصدار v0 إلى v1 ترحيل حافة](../session-format-v0-to-v1/README.ar.md)——هذه الحزمة إعادة استخدام مصدر تحرير حل رمز جهاز و تجميد ربط تاريخ كلمة جدول.
- [ساكن حالة دليل](../session-format-catalog/README.ar.md)——بناء يملك تحرير حل رمز جهاز و ترحيل ترتيب.
- [Session حفظ دائم فرعي نظام](../../../docs/subsystems/persistence.ar.md)——غير ممكن تغيير generation اختيار و إصدار.
- [تضمين دخول صيغة Assistant stream قرار](../../../.agents/notes/implemented/architecture/2026-09-01-v2-embedded-assistant-streams.ar.md)——إدارة من، بديل خطة و عاقبة.

-----

<a id="model-experience"></a>
## تجربة النموذج

### تاريخ أيضا أصل

#### نموذج يرى ماذا

نجاح Assistant message سوف إبقاء من نفس v1 stream تجميع خروج content،provider،model،usage و replay state. فشل أو وضع ترك attempt سوف عبر `assistant/attempt` إبقاء لـ حمل دائم تشخيص واقع، لكن لن دخول `deriveMessages()`.

#### Token أثر

ترحيل لن إضافة نموذج مرئي محتوى. هو سوف إبقاء إرسال توليد message history، فقط من حالي منطق حدث تسلسل في إزالة قمة طبقة chunk معلومة غلاف.

#### KV Cache أثر

أيضا أصل بعد نموذج message تسلسل إبقاء ثابت، لذلك ترحيل ذاته لن تغيير طلب بادئة ذاكرة مؤقتة هوية.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

- **غلاف إغلاق رقم واحد جهة مصدر بيان**——لم معرفة v1 حدث سوف جعل ترحيل فشل، يشمل حمل لديه `ignorable: true` حدث.
- **خط صفة إعادة خريطة حالة**——تدفق صيغة معالجة لا إبقاء كامل v1 حدث عدد مجموعة، لكن نهائي v2 حدث عدد مجموعة و قديم إلى جديد ترتيب رقم خريطة ما زال لـ O(حدث عدد).
- **لا مسؤول إصدار أو توافق رجوع**——حفظ دائم يملك ترتيب هو successor إصدار، إبقاء v1 generation لا هو تلقائي downgrade أو restore إدخال.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
