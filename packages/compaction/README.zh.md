---
description: "جلسة ضغط (compaction) وظيفة بيت عائلة حزمة خريطة: تلقائي ضغط، حسب يحتاج /compact أمر و أداة إخراج إصلاح قص."
kind: "package-group"
---

# compaction/ — ضغط قدرة بيت عائلة

[English](README.md) | العربية

## عام وصف

`compaction/` مجموعة يجعل طويل وقت agent(ذكي جسم) جلسة في وصل قريب نموذج سياق حد أعلى وقت ما زال قدرة صحيح معتاد عمل:token ضغط قوة فوق رفع وقت تلقائي يأخذ مقارنة مبكر تاريخ ضغط لـ ملخص، متاح `/compact` حسب يحتاج ضغط، تجاوز كبير أداة إخراج أيضا يمكن أولا يتم إصلاح قص، من بينما نقص قليل حاجة ضغط محتوى، دعم حمل صورة توجيه إرسال لا خروج صورة فإن يتم استبدال لـ احتلال موضع نص. مع مرفق `dsh` أساس أساس إعداد افتراضي تفعيل هذا وظيفة. صريح تركيب كل حزمة يكفي ضبط كامل ضغط حدوث وقت آلة و طريقة. قرار أي وقت ضغط token قياس كمية يخص مستقل LLM(كبير لغة نموذج) بيت عائلة خدمة.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

التالي كل حزمة توفير هذا وظيفة واحد حلقة عقدة؛ فتح مقابل حزمة صفحة حل مثل أي استخدام.

| حزمة | مسؤولية | ctx key |
|---|---|---|
| [`compaction/`](compaction/README.zh.md) | مشترك ضغط اتفاق: كل خلفية و إطلاق جهاز استخدام عملية و ملخص صيغة | `ctx.compaction` |
| [`compaction-basic/`](compaction-basic/README.zh.md) | مع token ضغط قوة فوق رفع تلقائي يأخذ مقارنة مبكر تاريخ ضغط لـ ملخص | تسجيل `ctx.compaction` |
| [`compaction-tool-result-pruner/`](compaction-tool-result-pruner/README.zh.md) | إصلاح قص تجاوز كبير أداة إخراج، نقص قليل حاجة ضغط تاريخ | `ctx.toolResultPruner` |
| [`compaction-image-offload/`](compaction-image-offload/README.zh.md) | دعم حمل صورة توجيه رفض طلب وقت، يأخذ تجاوز خروج ميزانية طلب صورة استبدال لـ احتلال موضع نص | استماع `agent/request-error` |
| [`command-compact/`](command-compact/README.zh.md) | حسب يحتاج ضغط تاريخ `/compact` أمر | تسجيل إلى `ctx.commands` |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

أولا من فرعي نظام مشاركة اعتبار حل مشترك مفردات، مجددا قراءة قراءة اثنان نسخة Agent Note حل تصميم اعتماد حسب.

- [ضغط فرعي نظام مشاركة اعتبار](../../docs/subsystems/compaction.zh.md)——ضغط مفردات، نتيجة و خدمة سلوك.
- [ضغط قدرة seam Agent Note](../../.agents/notes/implemented/feature/2026-06-18-compaction-capability-seam.zh.md)——بيت عائلة مثل أي تفكيك قسم، و لـ أي اعتماد جلسة و LLM مفردات.
- [ترتيب طابور يد حركة ضغط Agent Note](../../.agents/notes/implemented/feature/2026-07-30-queued-manual-compaction.zh.md)——حسب يحتاج `/compact` مثل أي و تشغيل في جولة سلسلة سطر تحويل.
- [قدرة seam](../../.agents/notes/implemented/architecture/2026-06-13-capability-seams.zh.md)——هذا بيت عائلة التزام دوران Service Definition / Service Provider / Consumer تفكيك قسم.

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
