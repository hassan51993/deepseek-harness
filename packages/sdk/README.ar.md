---
description: "SDK بيت عائلة حزمة خريطة:JSON-RPC بروتوكول، و توفير عملية خارج SDK استخدام TypeScript عميل و خادم."
kind: "package-group"
---

# sdk/: من آخر عملية قيادة Harness وقت التشغيل

[English](README.md) | العربية

## عام وصف

SDK بيت عائلة يجعل آخر عملية عبر حسب تبديل سطر قسم لقطة JSON-RPC قيادة كامل DeepSeek Harness وقت التشغيل. بروتوكول حزمة تعريف عام رسالة،TypeScript عميل استخدام أداة اسم profile و لديه ترتيب patch بدء `dsh`، خادم فإن عبر stdio قبول SDK طلب. عميل يمكن فتح جلسة، إرسال نص التوجيه، و مراقبة جلسة حدث،agent(ذكي جسم) حالة تغير و subagent إتمام حدث.TypeScript عميل و [Python SDK](../../python/README.ar.md) استخدام نفس نوع بروتوكول، بينما هذه حزمة لن إنشاء تطوير من مشروع، أيضا لا تعريف أخرى تطبيق.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

كل حزمة README كل وسيط تعريف ذلك الذي مقابل مكدس مكون استخدام طريق.

| حزمة | مسؤولية |
|---|---|
| [`protocol/`](protocol/README.ar.md) | بروتوكول صيغة (wire format): حسب تبديل سطر قسم لقطة JSON-RPC نقل، و أداة اسم طلب، نتيجة و إشعار نوع |
| [`client/`](client/README.ar.md) | TypeScript عميل: بدء وقت التشغيل عملية فرعية، عبر عال طبقة و بروتوكول طبقة API قيادة agent جولة |
| [`server/`](server/README.ar.md) | `jsonrpc` إضافة: عبر stdio لـ عملية خارج SDK عميل توفير خدمة |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

أولا من Python SDK(عميل اتفاق أخت شقيقة تنفيذ) بدء، مجددا نظر يمكن تشغيل تطبيق و مجموعة حد خلف بعد قرار سجل.

- [Python SDK](../../python/README.ar.md)——اعتماد نفس نوع بروتوكول و مرفق حمل تحزيم وقت التشغيل Python مقابل تنفيذ.
- [SDK تطبيق تركيب حزمة](../bundle/sdk-app/README.ar.md)——بدء JSON-RPC خادم `dsh --profile sdk` تطبيق.
- [هيكل بنية](../../docs/architecture.ar.md) — تحزيم بعد Python عميل لـ أي بدء نفسه أداة اسم profile.
- [SDK مشروع أداة سلسلة إزالة](../../.agents/notes/archived/simplification/2026-08-11-remove-sdk-project-toolchain.md) — هذا مجموعة لـ أي من لا إنشاء، إعداد أو بناء تطوير من مشروع.
- [SDK subagent مزود](../subagent/subagent-dsh-sdk/README.ar.md) — harness داخلي استخدام TypeScript عميل مزود.

<a id="dev-note"></a>
## ملاحظة تطوير

بلا.
