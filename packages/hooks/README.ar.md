---
description: "hooks مجموعة أرض رسم: في agent(ذكي جسم) تشغيل خلال استخدام قائم Claude Code و Codex shell خطاف إعداد، توفير تصفح هذا مجموعة مستخدم و صيانة من قراءة قراءة."
kind: "package-group"
---

# packages/hooks

[English](README.md) | العربية

## عام وصف

hooks مجموعة يجعل agent تشغيل يمكن إعادة استخدام لـ Claude Code أو Codex تحرير كتابة shell خطاف. يأخذ مقابل تجميع صار إشارة نحو قائم `hooks.json`، يكفي في جلسة بدء، نص التوجيه وصول، أداة تشغيل أو تشغيل إيقاف وقت تنفيذ تلقي دعم حمل command hook. هذه خطاف يمكن استخدام نموذج مرئي رسالة منع توقف نص التوجيه أو استدعاء الأداة، نحو محادثة إضافة سياق، أو اشتراط تشغيل متابعة. عند أنت حاجة إبقاء قائم خطاف إعداد وقت، اختيار هذا مجموعة؛ كل بند تجميع صار فقط دعم حمل ذلك مصدر أداة الذي سجل command hook فرعي تجميع.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

| حزمة | مسؤولية | شكل |
|---|---|---|
| [`hook-protocol`](hook-protocol/README.ar.md) | اثنان عدد جسر وصل مشترك خطاف جذب محرك؛ لا نيل مباشر إعداد | مكتبة |
| [`hooks-claude-code`](hooks-claude-code/README.ar.md) | في agent تشغيل خلال تشغيل أنت قائم Claude Code `hooks.json` خطاف | إضافة |
| [`hooks-codex`](hooks-codex/README.ar.md) | في agent تشغيل خلال تشغيل أنت قائم Codex `hooks.json` خطاف | إضافة |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

- [اعتراض قطع نقطة توسيع Agent Note](../../.agents/notes/implemented/feature/2026-06-30-interception-extension-points.ar.md)——جسر وصل الذي موجه إلى نوع تحويل Decision واجهة وجه.
- [خطاف جسر وصل Agent Note](../../.agents/notes/archived/feature/2026-06-30-hook-bridges.md)——جسر وصل تصميم و ذلك قرار خريطة.
- [خطاف بروتوكول مكتبة Agent Note](../../.agents/notes/archived/feature/2026-06-30-hook-protocol-lib.md)——مشترك مكتبة مسؤول محتوى و ذلك سبب.

-----

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
