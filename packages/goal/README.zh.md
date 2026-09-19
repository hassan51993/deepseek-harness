---
description: "goal مجموعة أرض رسم: كل جلسة واحد حمل دائم إتمام هدف، و نموذج أداة، مستخدم أمر و تلقائي متابعة سطر، توفير تصفح تصفح هذا مجموعة مستخدم و صيانة من قراءة قراءة."
kind: "package-group"
---

# packages/goal

[English](README.md) | العربية

## عام وصف

goal مجموعة يجعل واحد agent(ذكي جسم) جلسة في إعادة بدء، استعادة و fork بعد متابعة تتبع طلب واحد حمل دائم إتمام هدف.agent يمكن إنشاء و تحديث هذا هدف، مستخدم أيضا يمكن استخدام `/goal` مباشر فحص أو تحكم هو، بينما لا إزالة استهلاك نموذج جولة. اختياري متابعة سطر حزمة يمكن يجعل إجراء في عمل وصل متابعة تنفيذ كثير عدد Round. كل جلسة فقط لديه واحد حالي هدف، هذا هدف سجل إتمام حالة بينما لا ضبط درجة عمل؛ لذلك، تلقائي متابعة سطر يجب مفرد وحيد تفعيل.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

| حزمة | مسؤولية | ctx مفتاح |
|---|---|---|
| [`goal`](goal/README.zh.md) | كل جلسة واحد حمل دائم هدف: إنشاء، تحرير، مؤقت توقف، استعادة، إتمام، منع سد و صاف حذف | `ctx.goals` |
| [`tool-goal`](tool-goal/README.zh.md) | نموذج أداة `get_goal`،`create_goal`،`update_goal` | تسجيل إلى `ctx.tools` |
| [`command-goal`](command-goal/README.zh.md) | UI أمر مستو وجه في مستخدم `/goal` أمر | تسجيل إلى `ctx.commands` |
| [`goal-round-driver`](goal-round-driver/README.zh.md) | تلقائي متابعة سطر: يأخذ إجراء في هدف تغيير صار وصل متابعة Round | بلا خدمة مفتاح |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

- [هدف فرعي نظام](../../docs/subsystems/goal.zh.md)——هدف نوع، حمل دائم `goal/change` حدث و توليد خدمة API.
- [توليد أداة دليل](../../docs/tool-catalog.zh.md#deepseek-aidsh-tool-goal)——نموذج استقبال ثلاثة عدد هدف أداة schema.
- [توليد إعداد دليل](../../docs/config-catalog.zh.md#deepseek-aidsh-goal)——هدف خدمة كل تلقي دعم حمل إعداد حقل.
- [هدف مجال Agent Note](../../.agents/notes/implemented/feature/2026-07-19-persisted-same-session-goal-domain.zh.md)——مجال تصميم و ذلك قرار.

-----

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
