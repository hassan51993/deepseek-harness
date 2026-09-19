---
description: "todo مجموعة أرض رسم: أساس في جلسة سجل نموذج جانب todo_write أداة، توفير تصفح هذا مجموعة مستخدم و صيانة من قراءة قراءة."
kind: "package-group"
---

# packages/todo

[English](README.md) | العربية

## عام وصف

todo مجموعة لـ agent(ذكي جسم) توفير متاح في قاعدة تخطيط جلسة درجة مهمة قائمة: إضافة مهمة، علامة إجراء في، تدريجي بند إتمام، نفس نسخة قائمة عبر جولة، عبر إعادة فتح جلسة حمل متابعة وجود. هو فقط يتضمن واحد منتج حزمة، توفير `todo_write` أداة؛ قائمة يخص إنشاء هو agent جلسة، كل مرة تحديث كل سوف كامل جسم استبدال. تفاعل صيغة مضيف سوف من قائمة عرض حالي خطة، مجموعة ذاته لا مرفق حمل أي UI.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

| حزمة | مسؤولية | ctx مفتاح |
|---|---|---|
| [`tool-todo`](tool-todo/README.ar.md) | يجعل agent صيانة جلسة مهمة قائمة: قاعدة تخطيط مهمة، تحديث حالة، تتبع أثر دخول درجة | تسجيل إلى `ctx.tools` |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

- [Todo فرعي نظام](../../docs/subsystems/todo.ar.md)——`todo/write` حدث تحميل حمل، ملكية قاعدة و `TodoItem`.
- [توليد أداة دليل](../../docs/tool-catalog.ar.md#deepseek-aidsh-tool-todo)——نموذج استقبال `todo_write` schema.
- [توليد إعداد دليل](../../docs/config-catalog.ar.md#deepseek-aidsh-tool-todo)——كل تلقي دعم حمل إعداد حقل.
- [todo_write أداة Agent Note](../../.agents/notes/archived/feature/2026-06-29-todo-write-tool.md)——أصلي تصميم و ذلك تجهيز اختيار خطة.

-----

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
