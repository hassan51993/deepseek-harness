---
description: "موجه إلى بدء JSON-RPC harness وقت التشغيل مستخدم و صيانة من، شرح SDK stdio تطبيق profile."
kind: "package-bundle"
---

# `@deepseek-ai/dsh-sdk-app`

[English](README.md) | العربية

## عام وصف

بـ [`dsh-base`](../base/README.ar.md) لـ أساس أساس SDK stdio تطبيق `dsh` profile تركيب حزمة. هو وراثة base افتراضي منع استخدام وحدة HMR(حار وحدة استبدال) سياسة؛ ذلك patch ضبط coding agent(تحرير مسار ذكي جسم)persona، تركيب تطبيق ذاتي لديه صفر خيار أمر مزود، و كما فقط في هذا مزود قبول استدعاء بعد بدء [`dsh-sdk-jsonrpc-server`](../../sdk/server/README.ar.md). لذلك،`dsh --profile sdk --help` سوف كتابة خروج help و خروج، لن احتلال استخدام stdin أو stdout. مستقل [`sdk-minimal`](../sdk-minimal/README.ar.md) bundle إعادة استخدام نفس عدد بدء مزود، و توفير ذاتي ذات profile اسم.

## دليل

- [استخدام هذه الحزمة](#use-this-package)
- [تجربة النموذج](#model-experience)
- [حدود معروفة وعمل مؤجل](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="use-this-package"></a>
## استخدام هذه الحزمة

بدء مزود يأخذ stdin EOF وصل إلى بدء جهاز محدود نجاح إغلاق مسار.SDK بروتوكول `shutdown`،SIGINT و SIGTERM متابعة استخدام كل منها الذي تابع server أو بدء جهاز مسار؛dispose(مورد تحرير) سوف ترتيب فارغ أصل profile إعداد شجرة و حفظ دائم.stdout مخصص لأجل حسب تبديل سطر قسم فصل JSON-RPC لقطة.SDK لا توفير title جدول طبقة، لذلك هذا تركيب حزمة منع استخدام نموذج توليد جلسة عنوان؛ تحديد صفة fallback title ما زال سوف حفظ دائم، لكن لا إرسال بدء مساعد مساعدة نموذج طلب. وراثة إسقاط ذاكرة مؤقتة سوف لـ SDK إنشاء جلسة كتابة فحص نقطة، توفير لاحق مستهلك استخدام؛ ذلك حمل دائم صفة شاشة عائق سوف في إصدار ذاكرة مؤقتة سطر قبل flush الذي تغطية سجل بادئة، لذلك ممكن تفكيك قسم أصل هذا سوف دمج JSONL سطر. نشر عبر profile تركيب حزمة و patch ملف اختيار آخر طقم كامل تركيب، بينما لا هو استخدام آخر عدد تطبيق bin.

| إعداد | قيمة افتراضية | سلوك |
|---|---|---|
| `profile` | `sdk` | أمر مساعدة مساعدة في عرض profile اسم؛ تركيب هذا مزود bundle سوف ضبط ذاتي ذات مع مرفق profile اسم. |

`DSH_MAX_TOKENS_AS_SUCCESS` إبقاء SDK نشر خريطة: لم ضبط أو JSON `true` يأخذ token بلوغ حد subagent إتمام تقرير إبلاغ لـ قد قبول،JSON `false` فإن تقرير إبلاغ لـ خطأ. نموذج مزود/نموذج و مساحة العمل cwd عبر SDK ابتدائي تحويل طلب نقل دخول؛base profile يملك مهايئ، أداة، حفظ دائم، سياسة،settings و credentials.

SDK استخدام base افتراضي توفير `read`،`write` و `edit`. يلزم إضافة `str_replace_editor`، طلب استخدام [base إعداد إشارة جنوب](../base/README.ar.md#use-this-package) في صريح إدراج دخول patch. مستقل `sdk-minimal` profile ذاتي سطر قرار ذلك أداة اختيار.

-----

<a id="model-experience"></a>
## تجربة النموذج

### SDK coding agent persona

#### نموذج يرى ماذا

profile في رقم واحد جهة إشارة توجيه قبل توفير `You are a coding agent powered by the {{model}} model.`، و في مستقل persona بعد لاحقة في توفير `Your working directory is {{cwd}}.`. تأكيد قطع SDK ابتدائي تحويل توجيه و جلسة cwd سوف تحليل منها احتلال موضع رمز. افتراضي ملف أداة schema يتضمن `read`،`write` و `edit`، لا يتضمن `str_replace_editor`.

#### Token أثر

واحد مقطع بسيط قصير مستقر persona، إضافة فوق مع بيانات تغير base نص التوجيه مقطع سقوط و الذي اختيار أداة schema.

#### KV Cache أثر

مقابل ثابت profile، مزود، نموذج و أداة بيان إبقاء مستقر. من في مع مرفق SDK profile استخدام فقط بدء وقت patch،profile تغير سوف في تحت واحد عملية توليد فاعلية.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

- **profile ممكن حذف SDK server**:TypeScript client اختيار ذاتي تعريف profile يجب إبقاء هذا تركيب حزمة أو آخر عدد `dsh-sdk-jsonrpc-server` بند إعداد؛ لا يوجد peer استجابة وقت،client ابتدائي تحويل سوف فشل.
- **مستخدم إضافة يمكن كسر تالف stdout صاف صاف صفة**:profile و تدريجي مرة بدء patch يخص تلقي معلومة مهمة تطبيق تركيب. مع مرفق تركيب حزمة لن نحو stdout كتابة غير بروتوكول محتوى، لكن لا يمكن قيد مهمة معنى إدراج دخول إضافة.
- **إعداد تغير حاجة إعادة بدء**:`sdk-app` تركيب حزمة في YAML في منع استخدام HMR، لذلك واحد stdio اتصال لن مراقبة إلى server أو agent اعتماد يتم استبدال.


<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

**وقت التشغيل ثابت صيغة:** لا إصدار مرافق توليد مدخل. هذا bundle زيادة عملية نقل و بدء latch؛ لقطة صاف درجة،help ترتيب حذف و إغلاق سلوك من شفرة المصدر و بناء ناتج stdio اختبار مسؤول.
