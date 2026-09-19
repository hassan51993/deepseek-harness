---
description: "موجه إلى Session Controller قائمة، تفاعل حالة و تدريجي جلسة سياق React و Slot مهايئ."
kind: "package-reference"
---
# @deepseek-ai/dsh-client-ui-session

[English](README.md) | العربية

## عام وصف

استخدام هذه الحزمة يمكن عبر معيار Slot خطاف عام Session catalog،retain معلومة و موحد واحد UI حالة. هو حسب `SessionBinding` شيء تحويل خطاف و prop، بينما `SessionProvider` يمكن وراثة خارج محيط binding أو ربط صريح `SessionReference`. هو يملك عملية محلي pending-interaction و إتمام رفع تنبيه سياسة، لكن لا يملك Controller transport، تاريخ أو reference.

## دليل

- [تجربة النموذج](#model-experience)
- [معروف حد و مؤقت مؤقت أمر بند](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="model-experience"></a>
## تجربة النموذج

بلا، لأن هذه الحزمة ملائم إعداد متصفح جانب Session حالة، لا تسجيل أي موجه إلى نموذج محتوى.

#### KV Cache أثر

بلا؛Session selector و Slot scope لن تجميع نموذج طلب.

## معروف حد و مؤقت مؤقت أمر بند

<a id="known-limitations-and-deferred-work"></a>

- **Pending interaction هو عملية محلي إسقاط**——متصفح إعادة وصل بعد، الذي تابع Remote waterfall(شلال نشر صيغة حدث) يجب إعادة وضع ما زال لم إتمام طلب.


<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

**وقت التشغيل ثابت صيغة:** لا إصدار مرافق توليد مدخل. مهايئ materialization مسار قد قوي صنع Session ربط متسق.
