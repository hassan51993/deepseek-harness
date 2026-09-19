---
description: "settings و اعتماد إعداد واجهة Host Remote owner، شمول غطاء انفصال حساس قراءة، كتابة، اعتماد مرجع و أصلي وثيقة فتح."
kind: "package-reference"
---
# Settings Controller

[English](README.md) | العربية

## عام وصف

`@deepseek-ai/dsh-api-settings-controller` لـ متصفح إعداد واجهة توفير توليد `ctx.remote.settings` و `ctx.remote.credentials` namespace. هو إرجاع انفصال حساس settings و اعتماد بيانات وصفية، دعم حمل settings و اعتماد كتابة بينما لا إرجاع آلة سري قيمة، و في Host طاولة وجه فتح من مزود يحتفظ settings أو Agent preset موضع. مزود ناقص وقت،namespace ما زال سوف تسجيل، و إرجاع يمكن عملية إعداد خطأ.

## دليل

- [استخدام هذه الحزمة](#use-this-package)
- [إعداد](#configuration)
- [تجربة النموذج](#model-experience)
- [حدود معروفة وعمل مؤجل](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="use-this-package"></a>
## استخدام هذه الحزمة

طلب يأخذ هذه الحزمة بصفة Loader entry تركيب إلى توفير متصفح إعداد profile في. هذا entry لا اعتماد مزود هل وجود بينما تسجيل اثنان عدد namespace، لذلك نقص قليل مزود سوف في استدعاء وقت إنتاج أداة اسم إعداد خطأ. هو توليد descriptor دخول صارم إطار Typert سجل التسجيل، بينما settings و اعتماد Definition ما زال هو عادي Cordis خدمة، ذاته لا تحمل تحمل أي wire معنى خدمة.

`describe(refs)` بـ طلب اسم حرف لـ مفتاح إرجاع واحد نسخة map، لذلك ضبط صفحة وصف ذلك كل سطر يحمل الكل مرجع وقت، هذه سطر سوف واحد بدء سقوط تحديد. مفرد مرة استدعاء الأكثر كثير قبول 64 عدد اسم حرف، بلا فاعلية اسم حرف أو فارغ كتابة قيمة تقرير إبلاغ لـ `bad-request`، و تدريجي حقل نسخ كل جواب سجل——مزود إرجاع تجاوز خروج `CredentialInfo` إعلان محتوى أيضا لا يمكن توسيع كبير عبر تجاوز wire حقل. صالح `set(ref, value)` و `unset(ref)` استدعاء يأخذ مزود رفض تقرير إبلاغ لـ `credential-rejected`، يحمل مزود رسالة،details في فقط لديه هذا مرجع. آلة سري قيمة فقط في هذا عدد جهة نحو عبر تجاوز wire: هذا داخل لا يوجد أي طريقة سوف إرجاع هو.

`settings.describe()` إرجاع نشر معلومة، و في `redactSecrets: true` تحت قراءة كل namespace.`settings.update`،`settings.replace` و `settings.mutate` كشف settings خدمة ثلاثة نوع كتابة عملية، و إرجاع هذا namespace جديد انفصال حساس عرض؛ قديم قديم كتابة استخدام `settings-conflict`، أخرى مزود رفض استخدام `settings-rejected`.

`settings.openSettingsDocument()` دقيق تجهيز مزود يحتفظ وثيقة، و استخدام أصلي نص تحرير جهاز معنى رسم سوف ذلك فتح.`settings.canOpenAgentPresetDirectory()` في preset صفحة عرض وقت تقرير إبلاغ أصلي فتح قدرة.`settings.openAgentPresetDirectory(id)` فقط تحليل مستخدم إنشاء عمل preset، و فتح ذلك دليل، أو في أصلي فتح غير ممكن استخدام وقت إرجاع دليل مسار؛ اثنان عدد فتح طريقة كل لا قبول متصفح توفير نظام الملفات هدف.

-----

<a id="configuration"></a>
## إعداد

| حقل | قيمة افتراضية | يحتوي معنى |
|---|---|---|
| `nativeOpen` | منصة استكشاف قياس | Agent preset دليل قدرة لا تسليم إعطاء أصلي طاولة وجه فتح جهاز |

توليد[إعداد دليل](../../../docs/config-catalog.ar.md#deepseek-aidsh-api-settings-controller) هو كل تلقي دعم حمل حقل و ذلك JSDoc كامل مصدر.

-----

<a id="model-experience"></a>
## تجربة النموذج

بلا، لأن settings و اعتماد إعداد يخص متصفح و Host حالة، و كما لا تسجيل نص التوجيه، أداة أو جلسة حدث.

#### KV Cache أثر

بلا مباشر أثر؛ قراءة أو كتابة هذه إعداد قيمة لن تغيير قد في طريق نموذج طلب.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

- دفعة كمية حد أعلى ثابت لـ 64 عدد مرجع، لا هو يمكن حسب نشر إعداد حقل.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

**وقت التشغيل ثابت صيغة:** لا إصدار مرافق توليد مدخل.settings و اعتماد seam مسؤول تخزين و تحديث حدث، هذه الحزمة فقط يأخذ هو جمع طريقة إسقاط إلى wire.
