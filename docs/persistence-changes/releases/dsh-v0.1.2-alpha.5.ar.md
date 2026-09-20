---
description: "أنواع حفظ الجلسة الدائم الاسترجاعية وتغييرات الإصدارات المتجاورة للوسم dsh-v0.1.2-alpha.5."
kind: persistence-release
---

# إصدار الحفظ الدائم: dsh-v0.1.2-alpha.5

[English](dsh-v0.1.2-alpha.5.md) | العربية

## الملخص

تطابق كلُّ بصمات جذور الحفظ الدائم المعاد بناؤها وسمَ alpha أو rc السابق. ويبقى إصدار الكاتب 0.

## المحتويات

- [دليل الإصدار](#evidence)
- [التصريح](#declaration)
- [التغييرات البنيوية](#changes)
- [التحقق](#verification)
- [ملاحظة التطوير](#dev-note)

-----

<a id="evidence"></a>
## دليل الإصدار

هذا ملءٌ استرجاعي تقريبي يدعم القراءة والتحقق من الصيغ؛ وهو ليس تأكيدَ توافق معاصرًا. وانظر [مرجع الأرشيف](README.ar.md) لحدود الاستخراج والتغطية.

| البند | القيمة المسجَّلة |
|---|---|
| وسم المصدر | `dsh-v0.1.2-alpha.5` |
| تاريخ المصدر | 2026-09-02T07:57:43.000Z |
| سجل الإصدار | كائن الإصدار موجود. |
| الإصدار السابق | [dsh-v0.1.2-alpha.4](dsh-v0.1.2-alpha.4.ar.md) |
| إصدار كاتب Session | 0 |
| الجرد المعاد بناؤه | <!-- persistence-release-inventory:start -->54 جذرًا / 415 نوعًا<!-- persistence-release-inventory:end --> |
| هذه اللقطة | [dsh-v0.1.2-alpha.5.schema.json](dsh-v0.1.2-alpha.5.schema.json) |

دليلُ المصدر لثابت إصدار الكاتب عند هذا الوسم:

- `packages/core/session/src/types.ts`: `export const SESSION_FORMAT_VERSION = 0`

<a id="declaration"></a>
## التصريح

```yaml persistence-release
schemaVersion: 1
tag: dsh-v0.1.2-alpha.5
previous: dsh-v0.1.2-alpha.4
sessionFormatVersion: 0
changes: []
```

<a id="changes"></a>
## التغييرات البنيوية

<!-- persistence-release-changes:start -->

أنواعُ الجذور الموحَّدة وبصماتُها المتعدية لم تتغيّر عن الوسم السابق.

<!-- persistence-release-changes:end -->

<a id="verification"></a>
## التحقق

اجتاز الاستخراجُ تحقّقَ الرسم المعياري وبصمة الجذر وبصمة الأنواع القابلة للوصول، وسمح بالحقل الاختياري الأصلي `surfaceOp` في أحداث السطوح التاريخية وحدها. ويعيد الفحصُ داخل الشجرة بناءَ كل وسم من سلفه ويتحقق من قيم «قبل» و«بعد»، ومن تغطية اللقطات، ومن التصريحات الآلية الثنائية اللغة.

```sh
pnpm run verify-persistence-releases
```

<a id="dev-note"></a>
## ملاحظة التطوير

لا شيء.
