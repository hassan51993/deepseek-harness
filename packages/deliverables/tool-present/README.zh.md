---
description: "عبر present إعلان تسليم يمكن وصول ملف؛ إعداد،Session ملكية و مصدر ملف فتح."
kind: "package-reference"
---

# @deepseek-ai/dsh-tool-present

[English](README.md) | العربية

## عام وصف

استخدام `present` إعلان تسليمSession نظام الملفات يمكن وصول نهائي ملف، يشمل عبر shell أمر إنشاء ملف. مستخدم استخدام افتراضي تطبيق فتح حالي مصدر ملف. أداة سجل مسار و اختياري شرح، لا نسخ ملف محتوى.

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

`standard`،`ptc` و `cordis` Agent preset تركيب هذا إضافة. إنشاء ملف بعد، بـ `files: [{ path, description? }]` استدعاء `present`. ملف يجب هو Session نظام الملفات يمكن وصول عادي ملف. متبادل مقابل مسار حسب Session عمل دليل تحليل؛ قطعا مقابل مسار يمكن إشارة نحو مساحة العمل خارج ملف، يشمل `/tmp` أو Downloads. ملف ناقص، لـ دليل، نهائي مسار لـ رمز رقم رابط أو مزود رفض وصول وقت، استدعاء فشل.Shell صندوق رملي خاص `/tmp` في ملف حاجة أولا كتابة Session نظام الملفات يمكن وصول موضع.

في Agent Cordis تركيب في تركيب، و توفير `tools`،`fs` و `turnBoundary` Session إسقاط:

```yaml
- name: '@deepseek-ai/dsh-tool-present'
  config:
    maxFiles: 8
```

| حقل | قيمة افتراضية | يحتوي معنى |
|---|---|---|
| `maxFiles` | `8` | كل مرة استدعاء الأكثر كبير ملف عدد، لـ صحيح كامل عدد |

تركيب وقت تحقق ملف عدد كمية حد أعلى. أداة اشتراط Agent Session أداة لديه مساحة العمل و بعد لم انتهاء جولة. تسليم عودة استدعاء جهة Session كل؛ أب Session مثل يحتاج إعلان تسليم فرعي Agent إنشاء ملف، يجب ذاتي سطر استدعاء `present`.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

أداة عبر إعداد نظام الملفات مزود تحليل مسار، فحص عادي ملف بيانات وصفية، لا قراءة محتوى. نجاح نهائي `tools/result` إشعار إلحاق `deliverables/presented`، تضمين طقم استدعاء أيضا ملائم استخدام. خارج طبقة برنامج مع بعد فشل لن سحب إلغاء قد إتمام إعلان. يتم منع توقف نتيجة لا إصدار إعلان. كل إضافة نسخة فقط سجل ذلك فعلي تنفيذ استدعاء؛ نفس اسم أثر مجال أداة لا يستطيع عبر أخرى نسخة إصدار تسليم.

صاف `./types` مدخل إعلان `PresentedFile` و Session حدث، لا استيراد Host وقت التشغيل شفرة.Web مستهلك في عرض أو فتح ملف قبل تحقق حمل دائم إعلان. حدث لا حفظ Session ID، لذلك fork تاريخ في متبادل مقابل مسار حسب حالي فحص نظر Session مساحة العمل تحليل.

**وقت التشغيل ثابت صيغة:** لا إصدار مرافق توليد مدخل. أداة و حدث تسجيل عودة effect كل،Session سجل يملك ملف إعلان؛ إضافة لا صيانة مستقل ملف محتوى تخزين.

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

- [نظام الملفات فرعي نظام](../../../docs/subsystems/filesystem.zh.md)——مزود مسار و خطأ.
- [Web تسليم](../../client/ui-deliverables/README.zh.md)——مصدر ملف فتح و بطاقة.
- [تسليم قرار](../../../.agents/notes/implemented/feature/2026-09-08-present-workspace-source-files.zh.md)——Session ملكية و قراءة طرف يجب تعرف آخر حدث.

<a id="model-experience"></a>
## تجربة النموذج

### present

#### نموذج يرى محتوى

[present schema](../../../docs/tool-catalog.zh.md#present) اشتراط قد لديه كما يمكن وصول ملف:“Declare existing files accessible through the Session filesystem as final deliverables. When a file you create or update is an output the user asked to receive, you must call present after writing it and before your final response, including files created through Bash or code execution. Mentioning its path in your reply does not replace this call. The files must already exist. The user opens the current source files; their contents are not copied or preserved.” كل ملف نتيجة لـ `Presented <path>`؛ برنامج نتيجة و حمل دائم حدث يتضمن مسار و اختياري شرح.

#### Token أثر

كل تركيب Agent زيادة واحد أداة schema، كل تسليم ملف زيادة واحد سطر نتيجة. ملف بايت لا دخول نموذج رسالة.

#### KV Cache أثر

أداة schema في تركيب خلال إبقاء ساكن حالة. تسليم نتيجة نص توسيع محادثة، لا إعادة كتابة نص التوجيه بادئة.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

- بيانات وصفية و Host مسار فحص لا يمكن أصل فرعي صفة أرض منع توقف طاولة وجه تطبيق فتح ملف قبل حدوث مسار استبدال.
- تحرير سوف تغيير فتح محتوى. مصدر ملف حذف أو نقل حركة بعد، لا يمكن عبر أصل إعلان فتح.
- Session ZIP توجيه خروج يتضمن إعلان، لا يتضمن ملف محتوى. تسليم إصدار حفظ دائم و كتابة وقت نسخ تخزين تأجيل تنفيذ.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
