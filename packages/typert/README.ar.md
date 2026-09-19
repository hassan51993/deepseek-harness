---
description: "Typert مجموعة أرض رسم: بناء وقت نوع رسم توليد جهاز، وقت التشغيل سجل التسجيل،Loader تجميع صار و مشترك Remote بروتوكول، هو جمع مشترك نفس دعم دعم نوع تحويل Host إلى Client استدعاء."
kind: "package-group"
---

# packages/typert

[English](README.md) | العربية

## عام وصف

استعارة مساعدة Typert مجموعة،Client بيئة قدرة بـ نوع تحويل طريقة استدعاء Host قدرة، و في بلا حاجة يد كتابة بروتوكول شفرة حال حال تحت مشترك توليد schema و عكس إطلاق معلومة. بناء وقت توليد جهاز يأخذ مصدر شفرة نوع إعلان تحويل لـ و تحرير ترجمة جهاز غير متصل نموذج و وقت التشغيل ناتج، وقت التشغيل سجل التسجيل حفظ هذه ناتج،Loader تجميع صار فإن في Loader تركيب في تلقائي تسجيل هو جمع. مشترك بروتوكول حزمة توفير Remote استدعاء إعلان——تركيب زينة جهاز،wire وصف رمز، تحرير حل رمز جهاز و مزود اتفاق——توفير عمل خدمة حزمة، توليد ناتج،Host Gateway و Client API مشترك نفس إزالة استهلاك. هذا صفحة هو أربعة عدد حزمة بحث جذب؛ كل حزمة README مسؤول كل منها إعداد، استخدام قاعدة و حد.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

| حزمة | مسؤولية | ctx مفتاح |
|---|---|---|
| [`generator/`](generator/README.ar.md) | في بناء وقت قسم تحليل مصدر شفرة نوع، و توليد وقت التشغيل تحميل الذي يحتاج عكس إطلاق،schema و Remote وصف رمز | — |
| [`loader/`](loader/README.ar.md) | يأخذ Loader تركيب في قد توليد Typert ناتج تلقائي تسجيل إلى وقت التشغيل سجل التسجيل | إزالة استهلاك `ctx.loader` و `ctx.typert` |
| [`protocol/`](protocol/README.ar.md) | إعلان Host و Client مشترك Remote تركيب زينة جهاز،wire وصف رمز، تحرير حل رمز جهاز و مزود اتفاق | — |
| [`registry/`](registry/README.ar.md) | في وقت التشغيل حفظ توليد حزمة عكس إطلاق و فوري Zod schema، و توفير lookup و Context مزود سجل التسجيل | `ctx.typert` |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

- [Typert فرعي نظام مشاركة اعتبار](../../docs/subsystems/typert.ar.md)——من بروتوكول و سجل التسجيل نوع في أصل مثال سجل عام مشترك اتفاق.
- [API Gateway مشاركة اعتبار](../../docs/api-gateway.ar.md)——توليد Remote وصف رمز مثل أي يصبح فعلي Host إلى Client استدعاء.
- [Remote استدعاء Agent Note](../../.agents/notes/implemented/architecture/2026-08-02-typert-remote-method-calls.ar.md)——Remote استدعاء خلف بعد هيكل بنية و نقل قرار.
- [حزمة مساحة العمل أرض رسم](../README.ar.md)——مساحة العمل في كل مجموعة و ذلك مسؤولية.

-----

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
