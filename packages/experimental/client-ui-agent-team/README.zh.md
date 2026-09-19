---
description: "استخدام و ترتيب فحص فعلي تحقق صفة Web Agent Teams roster، مشترك مهمة لوح و teammate تنقل وجه لوح."
kind: "package-reference"
---

# @deepseek-ai/dsh-experimental-client-ui-agent-team

[English](README.md) | العربية

## عام وصف

هذه الحزمة نحو Web جلسة صفحة رأس إضافة Agent Teams action، يجعل مستخدم فحص حالي roster، إدارة مشترك مهمة لوح و تنقل إلى teammate جلسة. هو عبر توليد `ctx.remote.agentTeams` contribution قراءة مرجعي Team حالة، و يجعل عادي child history تنقل متابعة استخدام مستقر addressed-subagent مسار. عبر عام إصدار فعلي تحقق صفة Agent Teams Web profile اختيار هذه الحزمة. هذا عدد متصفح projection لا توسيع مستقر API Proxy، لا تخزين Team حالة، أيضا لا تسجيل موجه إلى نموذج إدخال.

## دليل

- [استخدام هذه الحزمة](#use-this-package)
- [فهم التنفيذ](#understand-the-implementation)
- [بحث إضافي](#further-exploration)
- [تجربة النموذج](#model-experience)
- [حدود معروفة وعمل مؤجل](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="use-this-package"></a>
## استخدام هذه الحزمة

في مستقر Web bundle و Host-side Agent Teams profile بعد، عبر [`@deepseek-ai/dsh-experimental-agent-team-web-profile`](../agent-team-web-profile/README.zh.md) تثبيت هذه الحزمة.Web Client loader تركيب `/client` export؛root Host export لا تنفيذ سلوك، هذه الحزمة أيضا لا يوجد مستخدم إعداد حقل.

### فحص و تنقل roster

فتح panel سوف استدعاء `agentTeams/view`.Roster row عرض حمل دائم name، وقت التشغيل status،model و diagnostics. اختيار سليم سليم teammate وقت، نظام تحديث جديد قائم مباشر child catalog، و فتح عادي `{ parentSessionId, childSessionId, mode: 'continuable' }` address.History و لاحق شخص صنف نص التوجيه متابعة استخدام مستقر addressed-subagent جلسة مسار؛ هذه الحزمة لن إضافة Team مخصص استخدام address حقل.

### إدارة مهمة لوح

مهمة لوح عرض task identity،owner،blocker،readiness، تلميح صفة write scope و إعادة تراكم warning. مستخدم يمكن عبر `agentTeams/createTask` و `agentTeams/updateTask` إنشاء، تحرير، قسم إعداد أو إلغاء قسم إعداد، إتمام، إعادة فتح و حذف مهمة. كل مرة update كل إرسال حالي عرض revision،create أو update rejection كل إبقاء لـ صريح business result.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

Client export تركيب قدوم ذاتي [`@deepseek-ai/dsh-experimental-agent-team/remote`](../agent-team/README.zh.md) توليد `ctx.remote.agentTeams` contribution، لكن بعد عبر Cordis effect تسجيل locale dictionary و واحد conversation-header slot.Dispose plugin fiber سوف إزالة هذا اثنان بند registration.

بدء create أو update سوف يجعل أكثر مبكر refresh بطلان. نجاح بعد سوف إعادة قراءة كامل Team view، جعل كل task إرسال توليد حقل إبقاء الأكثر جديد.`team-task-conflict` نتيجة فقط في إعادة قراءة نجاح بعد عرض حالة قديم قديم تلميح؛ إذا إعادة قراءة فشل، فإن تعديل لـ عرض إعادة قراءة خطأ. من في Team خدمة يأخذ مهمة نص أو scope تحرير و dependency تعديل عام لـ مستقل action، اثنان من استخدام اثنان عدد وصل متابعة compare-and-set mutation.

| ملف | مسؤولية |
|---|---|
| [`src/client/mount.ts`](src/client/mount.ts) | توليد Remote،locale، تنقل و slot registration |
| [`src/client/TeamAction.tsx`](src/client/TeamAction.tsx) | Roster و مهمة لوح تفاعل حالة |
| [`src/client/locales.ts`](src/client/locales.ts) | في إنجليزي نص panel نص سجل |
| [`src/index.ts`](src/index.ts) | لا تنفيذ سلوك Host entry |

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

- [Agent Teams Web profile](../agent-team-web-profile/README.zh.md)——تركيب هذا Client plugin عام opt-in bundle.
- [Agent Teams service](../agent-team/README.zh.md)——مرجعي roster،task و Remote سلوك.
- [جلسة UI](../../client/ui-conversation/README.zh.md)——مستقر header slot و addressed-subagent تنقل جدول طبقة.
- [فعلي تحقق صفة حزمة](../README.zh.md)——تفريخ تحويل حالة و إصدار قاعدة.

-----

<a id="model-experience"></a>
## تجربة النموذج

بلا مباشر أثر، لأن هذا متصفح projection و مهمة تحكم واجهة لا تسجيل موجه إلى نموذج إدخال.

#### KV Cache أثر

بلا مباشر أثر؛Team أداة و عادي جلسة إيداع مسؤول لاحق أي نموذج مرئي استخدام طريق.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

- **Snapshot refresh**——panel سوف في فتح، صريح refresh و mutation بعد تحديث جديد؛ هو لا يوجد فوري حدث حجز قراءة أو mailbox timeline.
- **عادي child continuation**——تنقل بعد إرسال شخص صنف رسالة استخدام مستقر addressed-subagent نص التوجيه مسار، بينما لا هو Team peer mailbox.
- **لا يوجد lifecycle أو workspace control**——panel لا يستطيع spawn،rename،delete أو interrupt teammate،write scope ما زال فقط هو تلميح صفة metadata.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

**وقت التشغيل ثابت صيغة:** لا إصدار مرافق توليد مدخل.RPC هو مرجعي مصدر، هذه الحزمة فقط يحتفظ واحد يمكن تحرير slot تسجيل.
