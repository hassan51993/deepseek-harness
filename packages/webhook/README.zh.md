---
description: "مرور تحقق خارجي حدث، برنامج تحويل قاعدة و أي إرسال أي ترك DSH جلسة إنشاء حزمة خريطة."
kind: "package-group"
---

# webhook/ — من قد تحقق خارجي حدث إلى DSH جلسة

[English](README.md) | العربية

## عام وصف

Webhook نظام صف استقبال عبر هوية تحقق مزود حدث، و تشغيل تلقي معلومة مهمة برنامج تحويل قاعدة. قاعدة يمكن في Web Workspace في إنشاء عادي أصل جلسة. توزيع فقط وجود في عملية داخل و اعتماد fire-and-forget، لا يملك تسليم قاعدة بيانات، طابور صف، إعادة محاولة، ذهاب إعادة أو agent(ذكي جسم) إتمام حالة.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

| حزمة | زاوية لون | ctx key |
|---|---|---|
| [`webhook/`](webhook/README.zh.md) | قاعدة سجل التسجيل، عودة ضبط دورة الحياة و أساس في Workspace جلسة إنشاء | `ctx.webhookRuntime` |
| [`webhook-github/`](webhook-github/README.zh.md) | GitHub HTTP توقيع تحقق مهايئ | إزالة استهلاك `ctx.webhookRuntime` و `ctx.webServer` |

<a id="related-documentation"></a>
## متبادل صلة وثيقة

مزود مهايئ مسؤول تحقق هوية و مواصفة تحويل تسليم. قاعدة يملك مهمة معنى شرط و خارجي استدعاء، مع بعد إرجاع `null` أو واحد جلسة طلب.[Webhook فرعي نظام مشاركة اعتبار](../../docs/subsystems/webhook.zh.md) يملك مشترك نوع و وقت ترتيب حفظ إثبات.

<a id="dev-note"></a>
## ملاحظة تطوير

بلا.
