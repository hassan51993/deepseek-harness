---
description: "skill(تقنية قدرة) مجموعة أرض رسم: من مزود اكتشاف و مرور جلسة دليل و skill أداة تحميل يمكن إعادة استخدام agent(ذكي جسم) إشارة أمر، توفير تصفح هذا مجموعة مستخدم و صيانة من قراءة قراءة."
kind: "package-group"
---

# skill/ — skill قدرة بيت عائلة

[English](README.md) | العربية

## عام وصف

skill بيت عائلة يجعل agent و مستخدم فقط في حاجة وقت اكتشاف و تحميل يمكن إعادة استخدام مهمة إشارة أمر. استخدام `skill/` دمج دليل و لـ كل اسم توفير واحد مجموعة إشارة أمر؛ حاجة من مشروع، ذاتي تعريف أو مستخدم دليل اكتشاف skill وقت اختيار `skill-filesystem`، حاجة اختياري رسمي جهة شعار فصل وقت اختيار `skill-badge`، حاجة Word،PowerPoint و Excel سير العمل وقت اختيار `skill-office`. حاجة يجعل نموذج نيل نيل ترتيب كما حمل دائم جلسة دليل، عبر `skill` أداة تحميل كامل إشارة أمر، أو قبول `/name` مباشر استدعاء وقت، طلب إضافة `tool-skill`. مختلف مصدر توليد نفسه نموذج مرئي صيغة، تفعيل نموذج وصول قبل يجب إعداد حتى قليل واحد مصدر.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

| حزمة | مسؤولية | ctx مفتاح |
|---|---|---|
| [`skill/`](skill/README.ar.md) | دمج مهمة معنى مزود skill دليل، و حسب اسم تحليل خروج فوز خروج skill سجل التسجيل | `ctx.skills` |
| [`skill-filesystem/`](skill-filesystem/README.ar.md) | من مشروع، ذاتي تعريف و مستخدم دليل اكتشاف skill، و مراقبة نظر ذلك تغيير | تسجيل إلى `ctx.skills` |
| [`skill-badge/`](skill-badge/README.ar.md) | مع حزمة مرفق حمل رسمي جهة «powered by dsh» شعار فصل skill، افتراضي منع استخدام | تسجيل إلى `ctx.skills` |
| [`skill-office/`](skill-office/README.ar.md) | مع حزمة توفير Word،PowerPoint و Excel سير العمل و ملف بنية فحص | تسجيل إلى `ctx.skills` |
| [`tool-skill/`](tool-skill/README.ar.md) | إصدار جلسة skill دليل و موجه إلى نموذج `skill` تحميل أداة | تسجيل إلى `ctx.tools` |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

أولا من فرعي نظام مشاركة اعتبار حل مشترك مفردات، مجددا قراءة قراءة Agent Note حل تصميم اعتماد حسب.

- [skill فرعي نظام مشاركة اعتبار](../../docs/subsystems/skills.ar.md)——سجل التسجيل، مزود اتفاق، محلي اكتشاف أولوية درجة، و دليل و أداة.
- [skill استدعاء سياسة Agent Note](../../.agents/notes/implemented/feature/2026-07-28-skill-invocation-policy.ar.md)——نموذج و مستخدم استدعاء تحكم.

-----

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
