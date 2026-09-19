---
description: "test-support مجموعة أرض رسم: موجه إلى تحرير كتابة و تشغيل مستودع اختبار تطوير من، توفير بلا مفتاح اختبار harness،LLM(كبير لغة نموذج) mock و إعادة تشغيل خادم و Loader خطر دخان اختبار مساعد مساعدة."
kind: "package-group"
---

# packages/test-support

[English](README.md) | العربية

## عام وصف

test-support مجموعة لـ مستودع اختبار توفير تحديد كما بلا يجب مفتاح حقيقي منتج اختبار طريقة. هو يتضمن Loader تطبيق harness،session-log لقطة مهايئ، إعادة تشغيل LLM إضافة و يمكن عبر نص برمجي تحكم OpenAI توافق لذا عائق خادم. كل حزمة كل هو دعم حمل طبقة أساس أساس ضبط تطبيق؛ عند بعض عدد حزمة نيل نيل منتج اتفاق و منتج مستهلك وقت، هو حينئذ سوف نقل خروج هذا مجموعة.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

| حزمة | مسؤولية |
|---|---|
| [`session-snapshot`](session-snapshot/README.ar.md) | لـ profile قيادة اختبار توفير session-log لقطة دعم حمل و بروتوكول مهايئ |
| [`agent-loop-testkit`](agent-loop-testkit/README.ar.md) | لـ تشغيل أداة جسم AgentLoop اختبار توفير مشترك أولا قرار خدمة |
| [`client-runtime`](client-runtime/README.ar.md) | لـ متصفح وظيفة اختبار توفير jsdom slot اختبار منصة |
| [`remote-mock`](remote-mock/README.ar.md) | لـ كامل جسم عميل اختبار توفير طرف نقطة أداة اسم Typert Remote mock و هو جمع تثبيت Connection تحميل جسم وجه |
| [`loader-smoke`](loader-smoke/README.ar.md) | بدء من Loader تركيب تطبيق و قيادة fixture(اختبار قبل وضع بيانات) جولة بـ تنفيذ خطر دخان اختبار |
| [`llm-mock-server`](llm-mock-server/README.ar.md) | لـ استعادة اختبار توفير يمكن عبر نص برمجي تحكم OpenAI توافق لذا عائق خادم |
| [`llm-replay`](llm-replay/README.ar.md) | لـ بلا مفتاح اختبار و عرض عرض إعادة تشغيل قد سجل نموذج تدفق |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

- [اختبار سياسة](../../docs/testing.ar.md)——هذه harness الذي خدمة بلا مفتاح لقطة طبقة، و أي وقت يجب استخدام هذا طبقة.
- [وقت التشغيل ثابت صيغة فرعي نظام](../../docs/subsystems/invariants.ar.md)——حزمة ذاتي لديه وقت التشغيل فحص تسجيل و تنفيذ.
- [حزمة مجموعة](../README.ar.md)——دعم حمل مجموعة و منتج مجموعة علاقة.

-----

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
