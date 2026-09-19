---
description: "context مجموعة عام تصفح: لا تعريف أداة، لـ كل مرة طلب إضافة حمل دائم كما نموذج مرئي سياق إضافة، توفير تصفح تصفح هذا مجموعة مستخدم و صيانة من قراءة قراءة."
kind: "package-group"
---

# context/ — طلب سياق إضافة

[English](README.md) | العربية

## عام وصف

context مجموعة توفير لا تعريف أي أداة، لـ كل مرة طلب إضافة نموذج مرئي سياق إضافة: مساحة العمل إشارة أمر ملف يصبح إشارة جذب،`@file` رفع و توفير مسار تكملة كل، أخرى جلسة يمكن بصفة محدود لقطة يتم مرجع، نموذج أيضا قدرة يرى حالي وقت و agent(ذكي جسم) tmux موضع. حذف `agent-instructions`(`dsh-base` افتراضي يتضمن هو،profile patch يمكن منع استخدام) خارج، ذلك بقية الكل يحتاج رئيسي حركة تفعيل. سياق هو حمل دائم: حقن إشارة أمر و مرجع بـ مستخدم زاوية لون رسالة شكل صيغة دخول جلسة تاريخ، لذلك و أخرى محادثة محتوى واحد مثال حمل دائم إبقاء، يمكن إعادة تشغيل، يمكن ضغط. هذا صفحة عام وصف هذا مجموعة؛ حزمة درجة اتفاق من كل حزمة README مسؤول.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

| حزمة | مسؤولية | ctx key |
|---|---|---|
| [`agent-instructions/`](agent-instructions/README.zh.md) | سوف `AGENTS.md`،`CLAUDE.md` مساحة العمل إشارة أمر تحميل إلى سياق، و في ملف تحرير بعد تحديث جديد | — |
| [`session-reference/`](session-reference/README.zh.md) | مرجع أخرى جلسة: رفع و واحد جلسة، ذلك محدود فقط قراءة لقطة أي يصبح سياق | `ctx.sessionReferenceResolver` |
| [`file-reference/`](file-reference/README.zh.md) | اكتشاف `@file` رفع و، و توفير من مضيف دعم حمل UI مشترك استخدام رفع و لغة قاعدة | `ctx.fileReferences` |
| [`file-reference-local/`](file-reference-local/README.zh.md) | `@file` رفع و محلي مساحة العمل تكملة كل مزود | — |
| [`time-context/`](time-context/README.zh.md) | كل خطوة حالي وقت، متصفح وقت منطقة و مرور مرور وقت طويل | — |
| [`tmux-context/`](tmux-context/README.zh.md) | agent الذي في tmux جلسة، نافذة و نافذة إطار موضع | — |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

- [جلسة مرجع فرعي نظام](../../docs/subsystems/session-reference.zh.md)——مواصفة رفع و URI، لقطة دلالة و مستقر خطأ تصنيف جسم نظام.
- [مساحة العمل سياق قرار سجل](../../.agents/notes/archived/feature/2026-06-24-workspace-context.md)——إشارة أمر سياق لـ أي حسب agent و جلسة اثنان عدد صيانة درجة عزل و حمل دائم سجل.
- [توليد إعداد دليل](../../docs/config-catalog.zh.md)——هذا مجموعة كل حزمة قبول الكل إعداد حقل.

-----

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
