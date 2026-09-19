---
description: "subagent حزمة مجموعة: تفويض إرسال seam، ذلك عملية داخل و عملية خارج خلفية، و موجه إلى نموذج تفويض إرسال أداة."
kind: "package-group"
---

# subagent/:subagent قدرة بيت عائلة

[English](README.md) | العربية

## عام وصف

subagent حزمة بيت عائلة يجعل agent(ذكي جسم) سوف مهمة تفويض إرسال إعطاء فرعي agent، متابعة ذلك عمل، تزامن الآن ذاتي ذات إنشاء كل فرعي درجة. عزل عمل اختياري اختيار كل جديد عملية داخل فرعي درجة؛ حاجة قائم محادثة وقت اختياري اختيار حمل أب درجة تاريخ عملية داخل فرعي درجة؛ أيضا اختياري اختيار من ACP(Agent Client Protocol) ،Codex،Claude Code أو آخر Harness وقت التشغيل دعم حمل عملية خارج فرعي درجة. موجه إلى نموذج أداة أيضا يجعل agent قدرة كاف نحو متبادل مجاور agent إرسال رسالة، في قطع عمل و صف خروج فرعي درجة حالة. بلا نقاش فرعي درجة جارٍ تشغيل أيضا هو قد تخزين، أب درجة كل قدرة يرى هو؛ كل حزمة README شرح كل مزود خاص تحديد ضبط و حد.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

| حزمة | مسؤولية | ctx مفتاح |
|---|---|---|
| [`subagent/`](subagent/README.ar.md) | تعريف تفويض إرسال خدمة: مزود سجل التسجيل، مرة صفة تشغيل، يمكن متابعة فرعي درجة و اكتشاف | `ctx.subagents` |
| [`subagent-in-process-driver/`](subagent-in-process-driver/README.ar.md) | توفير مشترك عملية داخل تشغيل مشغل | بلا |
| [`subagent-spawn-in-process/`](subagent-spawn-in-process/README.ar.md) | تشغيل كل جديد عملية داخل فرعي agent | تسجيل إلى `ctx.subagents` |
| [`subagent-fork-in-process/`](subagent-fork-in-process/README.ar.md) | تشغيل من أب درجة اكتمل تاريخ إرسال توليد عملية داخل فرعي agent | تسجيل إلى `ctx.subagents` |
| [`subagent-acp/`](subagent-acp/README.ar.md) | مرور Agent Client Protocol تشغيل عملية خارج فرعي agent | تسجيل إلى `ctx.subagents` |
| [`subagent-codex/`](subagent-codex/README.ar.md) | مرور رسمي جهة app-server بروتوكول تشغيل حقيقي Codex فرعي agent | تسجيل إلى `ctx.subagents` |
| [`subagent-claude-code/`](subagent-claude-code/README.ar.md) | مرور رسمي جهة Agent SDK تشغيل حقيقي Claude Code فرعي agent | تسجيل إلى `ctx.subagents` |
| [`subagent-dsh-sdk/`](subagent-dsh-sdk/README.ar.md) | مرور TypeScript SDK تشغيل عملية خارج Harness فرعي agent | تسجيل إلى `ctx.subagents` |
| [`tool-subagent/`](tool-subagent/README.ar.md) | نحو نموذج عام تفويض إرسال | تسجيل إلى `ctx.tools` |
| [`tool-subagent-control/`](tool-subagent-control/README.ar.md) | نحو نموذج توفير نحو متبادل مجاور agent إرسال رسالة، في قطع عمل و صف خروج فرعي درجة حالة عملية | تسجيل إلى `ctx.tools` |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

- [Subagent فرعي نظام](../../docs/subsystems/subagent.ar.md)——خدمة اتفاق، مزود اتفاق و نهاية حالة نتيجة دلالة.
- [Subagent قدرة seam](../../.agents/notes/implemented/feature/2026-06-21-subagent-capability-seam.ar.md)——تفويض إرسال قدرة بيت عائلة تصميم سجل.
- [يمكن متابعة subagent](../../.agents/notes/implemented/feature/2026-07-28-continuable-subagent-conversations.ar.md)——قبول لاحق جولة حمل دائم فرعي درجة.
- [tool-subagent-control README](tool-subagent-control/README.ar.md)——لاحق رسالة، في قطع و صف رفع واجهة.

<a id="dev-note"></a>
## ملاحظة تطوير

بلا.
