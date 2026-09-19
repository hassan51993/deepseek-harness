---
description: "موجه إلى يأخذ قد إقرار إثبات JSON حدث توجيه إلى webhook وقت التشغيل نشر، شرح حمل توقيع GitHub webhook مهايئ."
kind: "package-reference"
---

# @deepseek-ai/dsh-webhook-github

[English](README.md) | العربية

## عام وصف

`dsh-webhook-github` سوف في حقن `ctx.webServer` فوق تسجيل واحد بند دقيق HTTP توجيه. هو حد و تحقق GitHub أصلي JSON body، إسقاط مزود غير متصل تسليم، استدعاء `ctx.webhookRuntime.dispatch()`، و في لا انتظار قاعدة أو جلسة حال حال تحت إرجاع `202`. نشر حاجة لـ عام webhook وقت التشغيل توفير مرور مرور هوية تحقق GitHub مدخل وقت، طلب استخدام هو.

## دليل

- [إعداد](#configuration)
- [HTTP اتفاق](#http-contract)
- [مخصص استخدام مستمع تركيب](#dedicated-listener-composition)
- [تجربة النموذج](#model-experience)
- [حدود معروفة وعمل مؤجل](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="configuration"></a>
## إعداد

| Key | يحتوي معنى |
|---|---|
| `source` | يحمل إعطاء قاعدة غير فارغ مهايئ نسخة، مثال مثل `primary-github`. |
| `path` | لا حمل ذيل مع مائل عمود، استعلام أو قطعة مقطع دقيق غير أصل مسار. |
| `secretEnv` | يتضمن GitHub webhook مفتاح اعتماد مرجع. |
| `maxBodyBytes` | لم تعديل طلب body صحيح أمان كامل عدد حد أعلى. |

كل حقل متساو لـ لا بد ملء. كل مرة طلب كل سوف إعادة تحليل مفتاح مرجع، لذلك جولة تبديل سوف في تحت مرة تسليم توليد فاعلية، بينما بلا حاجة إعادة تحميل إضافة.

<a id="http-contract"></a>
## HTTP اتفاق

فقط قبول `POST application/json`. مهايئ قراءة محدود UTF-8 body، اشتراط `X-Hub-Signature-256`،`X-GitHub-Delivery` و `X-GitHub-Event`، تحليل مفتاح، في JSON تحليل قبل تحقق HMAC، و اشتراط قمة طبقة هو بلا ضرر JSON كائن. هو أبدا سجل مفتاح، توقيع أو payload.

| حالة | يحتوي معنى |
|---|---|
| `202` | قد تحقق JSON قد في داخل تخزين في توزيع. |
| `400` | مطلوب header،UTF-8،JSON أو قمة طبقة كائن بلا فاعلية. |
| `401` | توقيع بلا فاعلية. |
| `405` | طريقة لا هو `POST`. |
| `413` | إعلان أو تدفق صيغة body تجاوز مرور `maxBodyBytes`. |
| `415` | media type لا هو `application/json`. |
| `503` | اعتماد أو webhook وقت التشغيل غير ممكن استخدام. |

`202` لا يمثل أي قاعدة قد مطابقة، أيضا لا يمثل قد إنشاء جلسة.GitHub حدث خاص تحديد حقل تحقق يخص كل قاعدة؛ مهايئ فقط حفظ إثبات عبر هوية تحقق عام JSON.

<a id="dedicated-listener-composition"></a>
## مخصص استخدام مستمع تركيب

عادي Web profile قد يملك `ctx.webServer`. يأخذ آخر عدد `dsh-host-webserver` و هذا مهايئ تركيب إلى فقط عزل `webServer` group داخل؛ مهايئ ما زال سوف وراثة اعتماد و `webhookRuntime`.[GitHub مراجعة إشارة جنوب](../../../docs/user/guide/github-review.ar.md) في TLS عكس نحو بديل إدارة بعد استخدام `127.0.0.1:3081/github`، بينما UI متابعة يقع في طرف فتحة 3080.

<a id="model-experience"></a>
## تجربة النموذج

عبر `dsh-webhook` بين وصل إنتاج أثر: هذا مهايئ لا مساهمة نص التوجيه أو أداة schema؛ مطابقة قاعدة يملك جلسة طلب و نموذج مرئي نص.

#### KV Cache أثر

متبادل متبادل مستقل. هوية تحقق و HTTP توزيع لا لمس اصطدام نموذج طلب؛ أي جديد جلسة بادئة كل يخص إزالة استهلاك هو قاعدة و وقت التشغيل.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

- **بلا TLS**: حقن تطوير WebServer عبر معتاد فقط استماع loopback، و يقع في TLS عكس نحو بديل إدارة أو tunnel بعد.
- **فقط عام payload تحقق**: قاعدة مسؤول تحقق ذاتي ذات إزالة استهلاك GitHub حدث حقل.
- **لا نحو مزود تأكيد تحت تنقل عمل**:`202` أولا في مهمة معنى قاعدة استدعاء و جلسة إنشاء.
- **لا دعم حمل جدول مفرد تحرير رمز**:GitHub يجب إرسال `application/json`؛`application/x-www-form-urlencoded` سوف يتم رفض.


<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

**وقت التشغيل ثابت صيغة:** لا إصدار مرافق توليد مدخل.authentication و input validation في مقابل HTTP عملية في إتمام؛route/disposer مقابل تسمية صفة من `dsh-host-webserver` مسؤول.
