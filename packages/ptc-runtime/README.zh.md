---
description: "PTC تنفيذ قدرة عائلة حزمة خريطة: برنامج تنفيذ قدرة لـ أنت فعل ماذا، و كل جزء من أي عدد حزمة مسؤول."
kind: "package-group"
---

# ptc-runtime/——PTC تنفيذ قدرة عائلة

[English](README.md) | العربية

## عام وصف

`ptc-runtime/` مجموعة يجعل نموذج تحرير كتابة واحد برنامج، بـ عادي مختلف خطوة استدعاء طريقة استدعاء مضيف توفير دالة، لكن بعد فقط إرجاع برنامج ضرب طبع إخراج و قيمة راجعة. مثل يحتاج في كل جديد Node عملية في حسب الذي إعداد صندوق رملي سياسة تنفيذ، طلب اختيار TypeScript خلفية؛ مثل يحتاج CPython عملية، طلب اختيار فعلي تحقق صفة Python خلفية. كل مرة تشغيل كل لن إبقاء قبل برنامج حالة. فشل سوف بصفة نتيجة إرجاع، توفير استدعاء جهة تشخيص أو توفير إعطاء نموذج.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

هذا ثلاثة عدد حزمة مشترك نفس توفير برنامج تنفيذ قدرة؛ كل README وصف ذلك كل منها جزء فعل ماذا.

| حزمة | زاوية لون | ctx مفتاح |
|---|---|---|
| [`ptc-runtime/`](ptc-runtime/README.zh.md) | تعريف PTC وقت التشغيل فعل ماذا: إبرة مقابل مضيف توفير ربط تشغيل واحد برنامج، و تقرير إبلاغ ذلك ضرب طبع و إرجاع محتوى | `ctx.ptcRuntime` |
| [`ptc-runtime-node/`](ptc-runtime-node/README.zh.md) | في كل جديد تلقي إدارة Node عملية في حسب قد تحليل صندوق رملي سياسة تنفيذ TypeScript | تسجيل `ctx.ptcRuntime` |
| [`experimental/ptc-runtime-python/`](../experimental/ptc-runtime-python/README.zh.md) | فعلي تحقق صفة Python خلفية: مسؤول Node مضيف و CPython عملية فرعية بين fd-3 بروتوكول، و CPython وقت التشغيل تنفيذ | — |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

أولا من فرعي نظام مشاركة اعتبار حل خدمة اتفاق، مجددا نظر إزالة استهلاك هذا قدرة PTC mode تصميم، و هو الذي التزام دوران قدرة seam نموذج.

- [PTC وقت التشغيل فرعي نظام مشاركة اعتبار](../../docs/subsystems/ptc-runtime.zh.md)——طلب/نتيجة مفردات، ربط و `ctx.ptcRuntime` Cordis واجهة وجه.
- [PTC mode Agent Note](../../.agents/notes/implemented/feature/2026-06-15-ptc.zh.md)——أداة سجل التسجيل مثل أي يأخذ `run_code` عرض إعطاء نموذج.
- [قدرة seam](../../docs/capability-seams.zh.md)——هذا بيت عائلة التزام دوران Service Definition / Service Provider / Consumer تفكيك قسم.

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
