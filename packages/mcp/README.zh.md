---
description: "MCP حزمة مجموعة: اتصال خارجي Model Context Protocol خادم، استدعاء ذلك أداة و قراءة ذلك مورد."
kind: "package-group"
---

# MCP — نموذج سياق بروتوكول

[English](README.md) | العربية

## عام وصف

`mcp/` مجموعة يجعل نموذج استدعاء خارجي Model Context Protocol(MCP) أداة و قراءة خادم مورد. فقط يحتاج إعداد `mcp-client` بند؛ مع مرفق profile قد موحد واحد تركيب `mcp-resources` مرة. فقط لديه أثر مجال في وجود قد إعداد خادم استدعاء جهة عندئذ سوف يرى MCP أداة و نص التوجيه نص. اتصال أيضا سوف توفير خادم إشارة أمر. إعداد و حد من كل حزمة README شرح.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

عميل يملك كل قد إعداد اتصال؛ مشترك مورد حزمة لـ هذه اتصال توفير مورد أداة.

| حزمة | توفير قدرة |
|---|---|
| [`mcp-client/`](mcp-client/README.zh.md) | اتصال واحد منصة MCP خادم، كشف ذلك أداة و إشارة أمر، و توفير ذلك مورد عملية |
| [`mcp-resources/`](mcp-resources/README.zh.md) | عبر صريح اختيار خادم مشترك أداة اكتشاف و قراءة مورد |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

أولا استخدام يمكن تشغيل عرض مثال إعداد تجربة إضافة، مجددا قراءة قراءة Agent Note حل ذلك خلف بعد سلوك قرار.

- [MCP عميل إضافة Agent Note](../../.agents/notes/implemented/feature/2026-07-07-mcp-client-plugin.zh.md)——جسر وصل تصميم: خادم حد تحديد تسمية، اكتشاف، تنفيذ و بيئة صاف غسل.
- [مورد و إشارة أمر Agent Note](../../.agents/notes/implemented/feature/2026-09-12-mcp-resources-and-instructions.zh.md)——حسب يحتاج مورد وصول و أثر مجال خادم إشارة جذب.
- [رقم ثلاثة جهة تسجيل ذاكرة MCP إشارة جنوب](../../docs/user/guide/mcp-memory.zh.md)——يمكن تشغيل overlay إعداد سطر و ضبط شرح.
- [أداة فرعي نظام مشاركة اعتبار](../../docs/subsystems/tools.zh.md)——استقبال قد تسجيل أداة `ToolRuntime`.

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
