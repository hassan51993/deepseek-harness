---
description: "core قسم مجموعة أرض رسم: بنية صار منتج API رئيسي جاف جلسة سجل، توجيه النظام تجميع، أداة سجل التسجيل،agent(ذكي جسم) مفردات و افتراضي حلقة."
kind: "package-group"
---

# packages/core

[English](README.md) | العربية

## عام وصف

استخدام core حزمة يمكن بناء أو توسيع قدرة كاف سجل حمل دائم جلسة تاريخ، تجميع توجيه النظام، توفير أداة، اختيار افتراضي نموذج و تشغيل نموذج جولة agent. هذه حزمة تعريف كل تركيب كل سوف استخدام مشترك API، بينما يمكن تنفيذ منتج تركيب يقع في [`packages/bundle`](../bundle/README.ar.md). تطوير agent سلوك أو استبدال منها واحد بند قدرة وقت طلب اختيار هذا قسم مجموعة؛ حاجة افتراضي يمكن تشغيل تركيب وقت، طلب من [`dsh-base`](../bundle/base/README.ar.md) بدء.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

| حزمة | مسؤولية | ctx key |
|---|---|---|
| [`scope/`](scope/README.ar.md) | عزل مفرد عدد agent مساهمة أثر مجال تسجيل و حدث توجيه | مكتبة، لا استخدام ctx key |
| [`session/`](session/README.ar.md) | كل agent تاريخ متساو إرسال توليد ذاتي هذا فقط إلحاق جلسة حدث سجل | `ctx.sessions` |
| [`system-prompt/`](system-prompt/README.ar.md) | من لديه ترتيب مقطع، أداة schema و متغير إجراء توجيه النظام تجميع | `ctx.systemPrompt` |
| [`tools/`](tools/README.ar.md) | توفير حلقة توزيع استخدام أداة سجل التسجيل و حمل منع حماية آلية تنفيذ خط الإنتاج | `ctx.tools` |
| [`agent-tool-presentation/`](agent-tool-presentation/README.ar.md) | لـ preset توفير حسب agent أداة عرض طريقة اختيار جهاز | بلا ctx key |
| [`agent/`](agent/README.ar.md) | توفير إضافة تحرير مسار استخدام `Agent` جملة مقبض، و ذلك فوري سجل التسجيل و حدث | `ctx.agents` |
| [`agent-default-model/`](agent-default-model/README.ar.md) | مدخل مقابل كل جديد agent تطبيق نشر افتراضي نموذج اختيار | `ctx.agentDefaultModel` |
| [`agent-loop/`](agent-loop/README.ar.md) | افتراضي agent مشغل: إنشاء agent و تشغيل جولة و خطوة دورة الحياة | `ctx.agentLoop` |

`scope` توفير مشترك أثر مجال أصل لغة؛`agent` مسؤول عام `Agent` اتفاق، بينما `agent-loop` هو ذلك افتراضي تنفيذ، لذلك توسيع إضافة اعتماد `agent`، مشغل إبقاء يمكن استبدال.`agent-default-model` مسؤول مدخل في جلسة ذاته لا يوجد اختيار وقت تطبيق نشر اختيار. يمكن تشغيل تركيب يقع في [`packages/bundle`](../bundle/README.ar.md) ؛ هذا قسم مجموعة فقط مسؤول يمكن استبدال رئيسي جاف مكون.

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

- [Core فرعي نظام](../../docs/subsystems/core.ar.md)——تدريجي حزمة حلقة رسم و `Agent` جملة مقبض اتفاق.
- [جلسة فرعي نظام](../../docs/subsystems/session.ar.md)——جلسة حدث مفردات و إرسال توليد تاريخ.
- [توجيه النظام فرعي نظام](../../docs/subsystems/system-prompt.ar.md)——نص التوجيه مقطع، حركة حالة سياق و أداة schema نوع.
- [أداة فرعي نظام](../../docs/subsystems/tools.ar.md)——أداة تنفيذ خط الإنتاج و عرض مفردات.
- [أثر مجال تسجيل فرعي نظام](../../docs/subsystems/scope.ar.md)——هذه سجل التسجيل الذي اعتماد أثر مجال طبقة أصل لغة.
- [هيكل بنية](../../docs/architecture.ar.md)——جولة تدفق و جديد سلوك ملكية.
- [أساس أساس تركيب حزمة](../bundle/base/README.ar.md)——افتراضي منتج تركيب.
- [SDK الأكثر صغير تركيب حزمة](../bundle/sdk-minimal/README.ar.md)——كامل، مستقل كما وظيفة تجميع مرور مرور لحظة معنى دقيق بسيط تركيب.

-----

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
