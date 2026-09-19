---
description: "workflow مجموعة أرض رسم: من نموذج تحرير كتابة، يمكن مروحة خروج subagent تحرير ترتيب نص برمجي، توفير تصفح هذا مجموعة مستخدم و صيانة من قراءة قراءة."
kind: "package-group"
---

# packages/workflow

[English](README.md) | العربية

## عام وصف

workflow مجموعة يجعل agent(ذكي جسم) يمكن تشغيل تحرير ترتيب نص برمجي، سوف عمل تفويض إرسال إعطاء subagent و إرجاع نهائي قيمة.`workflow` أداة دعم حمل نص برمجي تحويل مروحة خروج؛ يحتاج صريح تفعيل `ralph` أداة تشغيل ثابت كل جديد agent تسلسل. نص برمجي استخدام مشترك PTC Node عملية وقت التشغيل، التزام حراسة استدعاء Session ملف سياسة. سير العمل خطاف و فرعي agent دورة الحياة ما زال من سير العمل جذب محرك مسؤول.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

| حزمة | مسؤولية | ctx مفتاح |
|---|---|---|
| [`workflow`](workflow/README.ar.md) | تشغيل من نموذج تحرير كتابة، مروحة خروج subagent تحرير ترتيب نص برمجي | `ctx.workflowEngine` |
| [`workflow-ptc`](workflow-ptc/README.ar.md) | عبر مشترك صندوق رملي تحويل PTC Node عملية وقت التشغيل تنفيذ سير العمل نص برمجي | تسجيل إلى `ctx.workflowEngine` |
| [`tool-workflow`](tool-workflow/README.ar.md) | يأخذ `workflow` أداة تسليم إعطاء نموذج، لأجل نص برمجي تحويل كثير agent تحرير ترتيب | تسجيل إلى `ctx.tools` |
| [`tool-ralph`](tool-ralph/README.ar.md) | يأخذ `ralph` أداة تسليم إعطاء نموذج، لأجل كل جديد agent تكرار بديل حلقة | تسجيل إلى `ctx.tools` |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

- [سير العمل فرعي نظام](../../docs/subsystems/workflow.ar.md)——seam نوع، بدء طلب و `workflow/*` حدث.
- [توليد أداة دليل](../../docs/tool-catalog.ar.md#deepseek-aidsh-tool-workflow)——نموذج استقبال `workflow` أداة schema.
- [توليد أداة دليل](../../docs/tool-catalog.ar.md#deepseek-aidsh-tool-ralph)——نموذج استقبال `ralph` أداة schema.
- [توليد إعداد دليل](../../docs/config-catalog.ar.md#deepseek-aidsh-workflow-ptc)——كل تلقي دعم حمل جذب محرك إعداد حقل.
- [حركة حالة سير العمل Agent Note](../../.agents/notes/implemented/feature/2026-07-05-dynamic-workflows.ar.md)——seam تصميم و ذلك قرار.
- [Harness طبقة هدف صيغة تنفيذ Agent Note](../../.agents/notes/implemented/feature/2026-07-16-harness-level-loop.ar.md)——ثابت كل جديد agent حلقة تصميم و مؤقت مؤقت أمر بند.

-----

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
