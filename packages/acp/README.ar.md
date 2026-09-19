---
description: "ACP(Agent Client Protocol) حزمة مجموعة: عبر JSON-RPC stdio سوف كل جديد harness agent(ذكي جسم) كشف إعطاء برنامج تحويل عميل فقط موجه إلى تلقائي تحويل خادم."
kind: "package-group"
---

# acp/:Agent Client Protocol تلقائي تحويل

[English](README.md) | العربية

## عام وصف

acp مجموعة توفير واحد حزمة: واحد خادم، يجعل برنامج و تلقائي تحويل مسار يمكن عبر معيار Agent Client Protocol تشغيل حمل دائم DeepSeek Harness agent. عميل يمكن إنشاء، صف خروج، استعادة و إغلاق جلسة، تركيب معيار MCP خادم، اختيار نموذج خيار، إرسال نص و صورة نص التوجيه، استقبال دلالة تحديث، استجابة إذن تلميح و إلغاء عمل——بلا حاجة شخص صنف مشاركة و. من آخر عدد harness بدء هذا نوع خادم إعداد طقم عميل يقع في `subagent/subagent-acp`. هذا صفحة عام وصف هذا حزمة مجموعة؛ كل حزمة أداة جسم اتفاق من ذلك README قاعدة تحديد.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

| حزمة | مسؤولية |
|---|---|
| [`acp/`](acp/README.ar.md) | يجعل برنامج عبر ACP إدارة حمل دائم agent، تركيب MCP خادم، اختيار نموذج خيار، إرسال نص التوجيه، إلغاء عمل و استقبال دلالة تحديث |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

- [dsh-subagent-acp](../subagent/subagent-acp/README.ar.md)——spawn و قيادة هذا خادم عملية خارج ACP عميل.
- [ACP بصفة فقط موجه إلى تلقائي تحويل بروتوكول](../../.agents/notes/implemented/simplification/2026-07-23-acp-automation-only-protocol.ar.md)——تلقائي تحويل اتفاق و ذلك بروتوكول حد قرار سجل.
- [في مفرد عدد اتصال فوق كثير مسار إعادة استخدام تزامن ACP جلسة](../../.agents/notes/archived/feature/2026-06-14-acp-multi-session.md)——حسب جلسة عزل، ملكية و تنظيف قرار.

<a id="dev-note"></a>
## ملاحظة تطوير

بلا.
