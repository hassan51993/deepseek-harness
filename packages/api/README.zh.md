---
description: "تطبيق Remote طبقة حزمة خريطة: نوع تحويل Client إلى Host قدرة استدعاء، نتيجة و تحويل إرسال حدث، توفير مستخدم و صيانة من تصفح تصفح هذا مجموعة."
kind: "package-group"
---

# api/ — Remote API طبقة

[English](README.md) | العربية

## عام وصف

`api/` مجموعة توفير تطبيق Remote طبقة:Client بيئة يمكن استدعاء تشغيل في Host فوق عمل خدمة قدرة——إدارة هدف، تشغيل أمر، فحص نظر إضافة بيان، اكتشاف ملف و جلسة مرجع——استدعاء طريقة هو نوع تحويل طريقة، و استقبال نتيجة أو تحويل إرسال Host حدث.`remotes` قرار كشف أي بعض قدرة، و كل مرة استدعاء مثل أي وصول صحيح تأكيد جلسة agent؛`gateway` في Client و Host بين تحمل تحميل استدعاء و ذلك نتيجة. تقنية فن مكدس تشغيل في تطبيق مشترك Connection لـ فوق؛ تدفق صيغة جلسة بيانات لحظة معنى لا في منها.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

تحت وجه هذه حزمة مشترك نفس توفير Remote طبقة؛ كامل اتفاق بـ كل حزمة README لـ دقيق.

| حزمة | مسؤولية | ctx key |
|---|---|---|
| [`remotes/`](remotes/README.zh.md) | قرار Client يمكن إزالة استهلاك أي بعض Host قدرة و حدث. | — |
| [`gateway/`](gateway/README.zh.md) | تحمل تحميل نوع تحويل واحد عنصر استدعاء، كثير مسار إعادة استخدام تدفق و تحويل إرسال Host حدث. | `ctx.typertGateway` / `ctx.remote` |
| [`session-controller/`](session-controller/README.zh.md) | يملك جلسة أمر، تاريخ سجل تدفق، فوري تحكم حالة و Agent/Session هوية سياسة. | `ctx.sessionController` / `ctx.remote.session` |
| [`settings-controller/`](settings-controller/README.zh.md) | يملك settings مجال كل seam لـ فوق إعداد واجهة قراءة كتابة. | `ctx.settingsController`،`ctx.credentialsController` / `ctx.remote.settings`،`ctx.remote.credentials` |
| [`workspace-controller/`](workspace-controller/README.zh.md) | يملك Workspace تغيير و كامل Client Workspace إسقاط. | `ctx.workspaceController` / `ctx.remote.workspace` |
| [`terminal-controller/`](terminal-controller/README.zh.md) | Session يملك تفاعل صيغة shell، شاشة ستار استعادة و متصفح طرفية تحكم. | `ctx.terminalController` / `ctx.remote.terminal` |
| [`workspace-files/`](workspace-files/README.zh.md) | يملك محدود مساحة العمل ملف وصول——`stat`، قسم صفحة `read`،`list` و قد دفن نقطة عملية `changes` تدفق——و ذلك فوق Client `file` مورد مزود. | `ctx.workspaceFiles` / `ctx.remote.workspaceFiles` |

Remote استدعاء امتداد Client → Host جهة نحو تشغيل في تطبيق مشترك Connection لـ فوق.API Gateway يملك Remote نقل، كل تحكم جهاز حزمة قسم آخر يملك Session، إعداد واجهة و Workspace سلوك. تدفق صيغة تحت تحميل انتظار لا ملائم دمج Remote استدعاء استجابة من وظيفة حزمة تسجيل دقيق Connection Fetch توجيه.

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

أولا قراءة API Gateway مشاركة اعتبار بـ طرف إلى طرف حل Remote نموذج، مجددا قراءة Typert فرعي نظام صفحة حل مشترك تعريف، و عبر Connection حل شيء إدارة تحميل جسم.

- [API Gateway مشاركة اعتبار](../../docs/api-gateway.zh.md)——Typert API Gateway الآن حالة مشاركة اعتبار: تحرير مسار نموذج، توليد خط الإنتاج و وقت التشغيل استدعاء.
- [Typert فرعي نظام مشاركة اعتبار](../../docs/subsystems/typert.zh.md)——protocol،Gateway و مستهلك تركيب إعداد مشترك عام مشترك اتفاق.
- [Connection](../client/connection/README.zh.md)——كل مرة Remote استدعاء خلف بعد RPC تحميل جسم،`/api` معلومة مهمة محيط شريط و استجابة غلاف تركيب.

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
