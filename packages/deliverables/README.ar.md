---
description: "deliverables مجموعة توجيه تصفح: سجل جولة تسليم إعطاء مستخدم محتوى Host إضافة، أي صريح ملف تسليم و مراقبة إلى مساحة العمل تعديل، توفير تصفح هذا مجموعة مستخدم و صيانة من قراءة قراءة."
kind: "package-group"
---

# packages/deliverables

[English](README.md) | العربية

## عام وصف

deliverables نظام صف يأخذ واحد جولة تسليم إعطاء مستخدم محتوى سجل لـ فقط لديه عميل قراءة حمل دائم Session حدث:`present` أداة إعلان نموذج تسليم نهائي ملف،workspace-changes سجل جهاز استخدام git لقطة و كامل ملف التقاط سجل واحد جولة تعديل ملف و ذلك سطر عدد، و توفير كل ملف مقابل مقارنة.Web [تسليم إضافة](../client/ui-deliverables/README.ar.md) في جولة نهاية ذيل تصيير اثنان من. حاجة عرض تسليم ملف و كل جولة تعديل منتج اختيار هذا نظام صف؛`present` حاجة `ctx.tools` و `ctx.fs`، سجل جهاز حاجة `ctx.subprocess` و git يمكن تنفيذ ملف.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

| حزمة | زاوية لون | ctx key |
|---|---|---|
| [`tool-present`](tool-present/README.ar.md) | عبر `present` أداة يأخذ قد لديه ملف إعلان لـ نهائي تسليم شيء | تسجيل إلى `ctx.tools` |
| [`workspace-changes`](workspace-changes/README.ar.md) | استخدام git عمل شجرة لقطة و كامل ملف التقاط تجميع مجموع كل قمة طبقة جولة تعديل ملف، و توفير ذلك مقابل مقارنة | توفير `ctx.workspaceChanges`؛ استماع `session/event`، إلحاق `workspace/changes` |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

- [إنتاج خروج شيء فرعي نظام](../../docs/subsystems/deliverables.ar.md)——`PresentedFile` و `WorkspaceChangesSummary` مفردات، اثنان عدد حمل دائم حدث و ملخص خدمة.
- [Web إنتاج خروج شيء](../client/ui-deliverables/README.ar.md)——تصيير هذه حدث جولة ذيل بطاقة و ملف رفع و.
- [present إعلان مساحة العمل مصدر ملف](../../.agents/notes/implemented/feature/2026-09-08-present-workspace-source-files.ar.md)——تسليم قرار.
- [هذا جولة تعديل ملف بطاقة](../../.agents/notes/implemented/feature/2026-09-11-turn-changed-files-card.ar.md)——لقطة تصميم و تغطية قاعدة.

-----

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
