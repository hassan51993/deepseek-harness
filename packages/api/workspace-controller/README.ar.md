---
description: "Host و Client مساحة العمل تحكم: تعديل مساحة العمل تنقل و تتبع مع ذلك كامل إسقاط."
kind: "package-reference"
---
# Workspace Controller

[English](README.md) | العربية

## عام وصف

`@deepseek-ai/dsh-api-workspace-controller` يملك Host `ctx.workspaceController` خدمة و توليد Client `ctx.remote.workspace` namespace. هو Remote طريقة مسؤول إنشاء، إعادة تسمية، إزالة و إعادة ترتيب Workspace، في Workspace داخل إعادة ترتيب Session، عودة ملف و إلغاء عودة ملف Session، و تتبع مع كامل Workspace إسقاط. عند Client يجب تعديل أو تتبع مع Workspace تنقل وقت، طلب عبر API شبكة صلة استخدام هو. هذه الحزمة معا يملك `ctx.directoryPickerController` و توليد `ctx.remote.directoryPicker` namespace، لأن هو تحمل تحميل اختيار دليل seam هو سحب كائن، ذاته من لا بصفة Loader entry.

## دليل

- [استخدام هذه الحزمة](#use-this-package)
- [تجربة النموذج](#model-experience)
- [حدود معروفة وعمل مؤجل](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="use-this-package"></a>
## استخدام هذه الحزمة

Host تحكم جهاز سوف سلسلة سطر تنفيذ صحيح تأكيد صفة أخذ قرار في حالي سجل التسجيل حالة تغيير، و لـ مسبق مدة فشل رمي خروج حمل لديه مستقر `workspace/*` أو `directory-picker/*` رمز خطأ `RemoteError`. هو `follow()` تدفق سوف تزامن حجز قراءة حمل دائم Workspace تغيير، أولا إرسال خروج واحد نسخة كامل baseline، مجددا حسب ترتيب إرسال خروج `upsert`،`remove`،`order` و `archived` زيادة كمية. إعادة وصل سوف بـ استبدال baseline بدء جديد واحد بديل، لذلك مستهلك لا اعتماد استلام إلى قطع خط خلال كل زيادة كمية.

Client مدخل توفير `ClientWorkspaceModel` و `createWorkspaceStateStream()`. هذا نموذج يملك Workspace سطر،registry ترتيب، قد عودة ملف Session id، واحد عنصر تغيير عودة إظهار، و تدفق و واحد عنصر استدعاء تنافس حالة معالجة. مقارنة جديد Host سطر حسب `updatedAt` نيل فوز؛ قد إيداع تدفق ترتيب أولوية في مقارنة قديم واحد عنصر استجابة؛ قد إزالة Workspace id لن يتم تأخير متأخر بيانات تكرار نشط. هذا حزمة عام و إطار هيكل غير متصل لقطة و حجز قراءة، يأخذ تنقل سياسة و React خطاف إبقاء إعطاء UI owner.

-----

<a id="model-experience"></a>
## تجربة النموذج

بلا، لأن Workspace مجموعة نسج يخص متصفح و Host تحكم حالة، و كما لا تسجيل نص التوجيه، أداة أو جلسة حدث.

#### KV Cache أثر

بلا مباشر أثر؛Workspace تغيير لن تغيير نموذج طلب.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

- `follow()` في إعادة وصل بعد استبدال كامل إسقاط، لا توفير حمل دائم cursor أو زيادة كمية تتبع لحاق بروتوكول.
- عملية داخل حذف علامة فقط سوف في Client نموذج دورة الحياة داخل منع توقف تأخير متأخر بيانات تكرار نشط قد إزالة Workspace.


<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

**وقت التشغيل ثابت صيغة:** لا إصدار مرافق توليد مدخل.Workspace سجل التسجيل مسؤول حفظ دائم، كل مرة تدفق توليد كل هو كامل إسقاط.
